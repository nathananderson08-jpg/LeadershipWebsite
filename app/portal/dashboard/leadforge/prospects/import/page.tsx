'use client';

import { useState, useCallback, useRef, DragEvent, ChangeEvent } from 'react';
import { useProspects, useAccounts } from '@/hooks/portal/useLeadForge';
import {
  Upload,
  FileText,
  CheckCircle,
  X,
  AlertCircle,
  Loader2,
  ChevronRight,
} from 'lucide-react';
import Link from 'next/link';

// ── CSV Parsing ────────────────────────────────────────────────────────────────

/** Parse a single CSV line, respecting quoted fields (handles embedded commas and newlines). */
function parseCSVLine(line: string): string[] {
  const fields: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    const next = line[i + 1];

    if (inQuotes) {
      if (ch === '"' && next === '"') {
        // Escaped double-quote inside quoted field
        current += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        current += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ',') {
        fields.push(current.trim());
        current = '';
      } else {
        current += ch;
      }
    }
  }

  fields.push(current.trim());
  return fields;
}

/**
 * Parse a full CSV string (handles \r\n, \n, quoted fields containing newlines).
 * Returns { headers, rows } where rows is an array of string arrays.
 */
function parseCSV(raw: string): { headers: string[]; rows: string[][] } {
  // Normalise line endings
  const text = raw.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  // Re-assemble lines, respecting quoted multi-line fields
  const lines: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const next = text[i + 1];

    if (inQuotes) {
      if (ch === '"' && next === '"') {
        current += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
        current += ch;
      } else if (ch === '\n') {
        // Newline inside a quoted field — keep it but stay on same "line"
        current += '\n';
      } else {
        current += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
        current += ch;
      } else if (ch === '\n') {
        lines.push(current);
        current = '';
      } else {
        current += ch;
      }
    }
  }
  if (current.length > 0) lines.push(current);

  const nonEmpty = lines.filter(l => l.trim().length > 0);
  if (nonEmpty.length === 0) return { headers: [], rows: [] };

  const headers = parseCSVLine(nonEmpty[0]);
  const rows = nonEmpty
    .slice(1)
    .map(l => parseCSVLine(l))
    .filter(r => r.some(cell => cell.trim().length > 0)); // skip blank rows

  return { headers, rows };
}

// ── Column Mapping ─────────────────────────────────────────────────────────────

type TargetField =
  | 'full_name'
  | 'title'
  | 'company'
  | 'email'
  | 'linkedin_url'
  | 'icp_score'
  | '__ignore__';

interface TargetFieldDef {
  key: TargetField;
  label: string;
  aliases: string[];
}

const TARGET_FIELDS: TargetFieldDef[] = [
  {
    key: 'full_name',
    label: 'Full Name',
    aliases: ['full name', 'name', 'fullname', 'full_name', 'contact name', 'contact'],
  },
  {
    key: 'title',
    label: 'Title',
    aliases: ['title', 'job title', 'jobtitle', 'position', 'role', 'job_title'],
  },
  {
    key: 'company',
    label: 'Company',
    aliases: ['company', 'company name', 'organization', 'organisation', 'account', 'employer', 'company_name'],
  },
  {
    key: 'email',
    label: 'Email',
    aliases: ['email', 'email address', 'e-mail', 'email_address', 'work email'],
  },
  {
    key: 'linkedin_url',
    label: 'LinkedIn URL',
    aliases: ['linkedin', 'linkedin url', 'linkedin_url', 'linkedin profile', 'profile url', 'li url'],
  },
  {
    key: 'icp_score',
    label: 'ICP Score',
    aliases: ['icp score', 'icp_score', 'score', 'fit score', 'icp'],
  },
];

function autoDetectMapping(headers: string[]): Record<string, TargetField> {
  const mapping: Record<string, TargetField> = {};
  const usedTargets = new Set<TargetField>();

  for (const header of headers) {
    const normalised = header.toLowerCase().trim();
    let matched: TargetField = '__ignore__';

    for (const field of TARGET_FIELDS) {
      if (usedTargets.has(field.key)) continue;
      if (field.aliases.includes(normalised)) {
        matched = field.key;
        usedTargets.add(field.key);
        break;
      }
    }

    mapping[header] = matched;
  }

  return mapping;
}

// ── Import Step Enum ───────────────────────────────────────────────────────────

type Step = 'upload' | 'mapping' | 'importing' | 'done';

// ── Result tracking ────────────────────────────────────────────────────────────

interface ImportResult {
  index: number;
  name: string;
  status: 'success' | 'error';
  message?: string;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function ProspectImportPage() {
  const { createProspect } = useProspects();
  const { accounts, createAccount } = useAccounts();

  // Upload state
  const [step, setStep] = useState<Step>('upload');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Parsed CSV
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [csvRows, setCsvRows] = useState<string[][]>([]);
  const [fileName, setFileName] = useState('');

  // Mapping state: csvColumn → TargetField
  const [columnMapping, setColumnMapping] = useState<Record<string, TargetField>>({});

  // Import progress
  const [importProgress, setImportProgress] = useState(0);
  const [importResults, setImportResults] = useState<ImportResult[]>([]);

  // ── File handling ────────────────────────────────────────────────────────────

  const handleFile = useCallback((file: File) => {
    if (!file.name.endsWith('.csv') && file.type !== 'text/csv') {
      alert('Please upload a .csv file.');
      return;
    }
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const { headers, rows } = parseCSV(text);
      if (headers.length === 0) {
        alert('The CSV file appears to be empty or invalid.');
        return;
      }
      setCsvHeaders(headers);
      setCsvRows(rows);
      setColumnMapping(autoDetectMapping(headers));
      setStep('mapping');
    };
    reader.readAsText(file);
  }, []);

  const onDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(true);
  };

  const onDragLeave = () => setDragOver(false);

  const onFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = ''; // reset so same file can be re-uploaded
  };

  // ── Mapping helpers ──────────────────────────────────────────────────────────

  const setMapping = (csvCol: string, target: TargetField) => {
    setColumnMapping(prev => ({ ...prev, [csvCol]: target }));
  };

  /** Given a row array and the current mapping, return a record of target fields → value. */
  const mapRow = (row: string[]): Record<string, string> => {
    const result: Record<string, string> = {};
    csvHeaders.forEach((header, idx) => {
      const target = columnMapping[header];
      if (target && target !== '__ignore__') {
        result[target] = row[idx] ?? '';
      }
    });
    return result;
  };

  // ── Preview rows ─────────────────────────────────────────────────────────────

  const previewRows = csvRows.slice(0, 5).map(mapRow);

  // ── Import ───────────────────────────────────────────────────────────────────

  const handleImport = async () => {
    setStep('importing');
    setImportProgress(0);
    setImportResults([]);

    // Build an initial company→accountId map from already-loaded accounts
    const companyMap = new Map<string, string>(
      accounts.map(a => [a.company_name.toLowerCase().trim(), a.id])
    );

    const results: ImportResult[] = [];

    for (let i = 0; i < csvRows.length; i++) {
      const raw = csvRows[i];
      const mapped = mapRow(raw);

      const fullName = mapped['full_name']?.trim();
      if (!fullName) {
        results.push({
          index: i,
          name: `Row ${i + 2}`,
          status: 'error',
          message: 'Missing Full Name — skipped.',
        });
        setImportProgress(i + 1);
        setImportResults([...results]);
        continue;
      }

      try {
        let accountId: string | undefined;
        const companyRaw = mapped['company']?.trim();

        if (companyRaw) {
          const key = companyRaw.toLowerCase().trim();
          if (companyMap.has(key)) {
            accountId = companyMap.get(key);
          } else {
            // Create new account
            const newAccount = await createAccount({ company_name: companyRaw });
            accountId = newAccount.id;
            companyMap.set(key, newAccount.id);
          }
        }

        const rawScore = parseInt(mapped['icp_score'] ?? '', 10);
        const icpScore = isNaN(rawScore) || rawScore < 0 || rawScore > 100 ? 50 : rawScore;

        await createProspect({
          full_name: fullName,
          title: mapped['title']?.trim() || undefined,
          email: mapped['email']?.trim() || undefined,
          linkedin_url: mapped['linkedin_url']?.trim() || undefined,
          icp_score: icpScore,
          account_id: accountId,
          pipeline_stage: 'identified',
          warmth_score: 'cold',
          stage: 'awareness',
        });

        results.push({ index: i, name: fullName, status: 'success' });
      } catch (err: unknown) {
        const message =
          err instanceof Error
            ? err.message
            : typeof err === 'object' && err !== null && 'message' in err
            ? String((err as { message: unknown }).message)
            : 'Unknown error';
        results.push({ index: i, name: fullName, status: 'error', message });
      }

      setImportProgress(i + 1);
      setImportResults([...results]);
    }

    setStep('done');
  };

  // ── Computed counts ───────────────────────────────────────────────────────────

  const totalRows = csvRows.length;
  const successCount = importResults.filter(r => r.status === 'success').length;
  const errorCount = importResults.filter(r => r.status === 'error').length;

  const hasMappedName = Object.values(columnMapping).includes('full_name');

  // ── Styles ────────────────────────────────────────────────────────────────────

  const s = {
    page: {
      padding: '2rem',
      maxWidth: 860,
      margin: '0 auto',
      color: 'var(--portal-text-primary)',
    } as React.CSSProperties,

    heading: {
      fontSize: '1.5rem',
      fontWeight: 700,
      marginBottom: '0.25rem',
      color: 'var(--portal-text-primary)',
    } as React.CSSProperties,

    subheading: {
      fontSize: '0.9rem',
      color: 'var(--portal-text-secondary)',
      marginBottom: '2rem',
    } as React.CSSProperties,

    card: {
      background: 'var(--portal-bg-secondary)',
      border: '1px solid var(--portal-border-default)',
      borderRadius: 12,
      padding: '1.5rem',
      marginBottom: '1.5rem',
    } as React.CSSProperties,

    dropZone: (active: boolean): React.CSSProperties => ({
      border: `2px dashed ${active ? 'var(--portal-border-accent)' : 'var(--portal-border-default)'}`,
      borderRadius: 12,
      padding: '3rem 2rem',
      textAlign: 'center',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      background: active ? 'var(--portal-accent-subtle)' : 'transparent',
    }),

    dropIcon: {
      width: 48,
      height: 48,
      margin: '0 auto 1rem',
      color: 'var(--portal-accent)',
      display: 'block',
    } as React.CSSProperties,

    dropTitle: {
      fontSize: '1rem',
      fontWeight: 600,
      color: 'var(--portal-text-primary)',
      marginBottom: '0.4rem',
    } as React.CSSProperties,

    dropSub: {
      fontSize: '0.85rem',
      color: 'var(--portal-text-secondary)',
    } as React.CSSProperties,

    browseBtn: {
      marginTop: '1rem',
      display: 'inline-block',
      padding: '0.5rem 1.25rem',
      background: 'var(--portal-accent)',
      color: '#fff',
      borderRadius: 8,
      fontSize: '0.875rem',
      fontWeight: 600,
      cursor: 'pointer',
      border: 'none',
    } as React.CSSProperties,

    sectionLabel: {
      fontSize: '0.8rem',
      fontWeight: 700,
      letterSpacing: '0.06em',
      textTransform: 'uppercase' as const,
      color: 'var(--portal-text-tertiary)',
      marginBottom: '0.75rem',
    } as React.CSSProperties,

    table: {
      width: '100%',
      borderCollapse: 'collapse' as const,
      fontSize: '0.82rem',
    } as React.CSSProperties,

    th: {
      textAlign: 'left' as const,
      padding: '0.5rem 0.75rem',
      color: 'var(--portal-text-tertiary)',
      fontWeight: 600,
      fontSize: '0.75rem',
      letterSpacing: '0.04em',
      textTransform: 'uppercase' as const,
      borderBottom: '1px solid var(--portal-border-default)',
    } as React.CSSProperties,

    td: {
      padding: '0.55rem 0.75rem',
      color: 'var(--portal-text-primary)',
      borderBottom: '1px solid var(--portal-border-default)',
      maxWidth: 160,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap' as const,
    } as React.CSSProperties,

    select: {
      padding: '0.35rem 0.5rem',
      background: 'var(--portal-bg-secondary)',
      border: '1px solid var(--portal-border-default)',
      borderRadius: 6,
      color: 'var(--portal-text-primary)',
      fontSize: '0.8rem',
      width: '100%',
      cursor: 'pointer',
    } as React.CSSProperties,

    primaryBtn: {
      padding: '0.65rem 1.5rem',
      background: 'var(--portal-accent)',
      color: '#fff',
      border: 'none',
      borderRadius: 8,
      fontWeight: 700,
      fontSize: '0.9rem',
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
    } as React.CSSProperties,

    primaryBtnDisabled: {
      opacity: 0.45,
      cursor: 'not-allowed',
    } as React.CSSProperties,

    ghostBtn: {
      padding: '0.6rem 1.25rem',
      background: 'transparent',
      color: 'var(--portal-text-secondary)',
      border: '1px solid var(--portal-border-default)',
      borderRadius: 8,
      fontWeight: 600,
      fontSize: '0.85rem',
      cursor: 'pointer',
    } as React.CSSProperties,

    progressBar: (pct: number): React.CSSProperties => ({
      height: 8,
      borderRadius: 99,
      background: 'var(--portal-border-default)',
      overflow: 'hidden',
      position: 'relative',
    }),

    progressFill: (pct: number): React.CSSProperties => ({
      height: '100%',
      width: `${pct}%`,
      background: 'var(--portal-accent)',
      borderRadius: 99,
      transition: 'width 0.2s ease',
    }),

    resultRow: (status: 'success' | 'error'): React.CSSProperties => ({
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.4rem 0',
      borderBottom: '1px solid var(--portal-border-default)',
      fontSize: '0.82rem',
      color: status === 'error' ? 'var(--portal-text-secondary)' : 'var(--portal-text-primary)',
    }),

    pill: (variant: 'success' | 'error'): React.CSSProperties => ({
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.3rem',
      padding: '0.2rem 0.6rem',
      borderRadius: 99,
      fontSize: '0.75rem',
      fontWeight: 600,
      background: variant === 'success' ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)',
      color: variant === 'success' ? '#22c55e' : '#ef4444',
    }),

    viewLink: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.4rem',
      padding: '0.65rem 1.5rem',
      background: 'var(--portal-accent)',
      color: '#fff',
      borderRadius: 8,
      fontWeight: 700,
      fontSize: '0.9rem',
      textDecoration: 'none',
    } as React.CSSProperties,

    fileChip: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.35rem 0.75rem',
      background: 'var(--portal-accent-subtle)',
      border: '1px solid var(--portal-border-accent)',
      borderRadius: 8,
      fontSize: '0.82rem',
      color: 'var(--portal-text-primary)',
      marginBottom: '1.25rem',
    } as React.CSSProperties,
  };

  // ── Render steps ──────────────────────────────────────────────────────────────

  return (
    <div style={s.page}>
      <h1 style={s.heading}>Import Prospects</h1>
      <p style={s.subheading}>
        Upload a CSV to bulk-add prospects to LeadForge. Map columns, preview, then import.
      </p>

      {/* ── STEP 1: Upload ── */}
      {step === 'upload' && (
        <div
          style={s.dropZone(dragOver)}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onClick={() => fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
          aria-label="Upload CSV file"
          onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
        >
          <Upload style={s.dropIcon} />
          <p style={s.dropTitle}>Drag & drop your CSV here</p>
          <p style={s.dropSub}>or click to browse your files</p>
          <button
            style={s.browseBtn}
            onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
          >
            Browse Files
          </button>
          <p style={{ ...s.dropSub, marginTop: '1rem' }}>
            Supported: .csv &nbsp;·&nbsp; Max recommended: 5,000 rows
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,text/csv"
            style={{ display: 'none' }}
            onChange={onFileInput}
          />
        </div>
      )}

      {/* ── STEP 2: Mapping ── */}
      {step === 'mapping' && (
        <>
          {/* File chip */}
          <div style={s.fileChip}>
            <FileText size={14} />
            <span>{fileName}</span>
            <span style={{ color: 'var(--portal-text-tertiary)' }}>
              · {totalRows} row{totalRows !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Column mapping */}
          <div style={s.card}>
            <p style={s.sectionLabel}>Map Columns</p>
            <p style={{ fontSize: '0.82rem', color: 'var(--portal-text-secondary)', marginBottom: '1rem' }}>
              We&apos;ve auto-detected common column names. Adjust any mappings before importing.
            </p>

            <table style={s.table}>
              <thead>
                <tr>
                  <th style={s.th}>CSV Column</th>
                  <th style={s.th}>Sample Value</th>
                  <th style={s.th}>Maps To</th>
                </tr>
              </thead>
              <tbody>
                {csvHeaders.map((header) => {
                  const sample = csvRows[0]?.[csvHeaders.indexOf(header)] ?? '';
                  return (
                    <tr key={header} style={{ background: 'transparent' }}>
                      <td style={{ ...s.td, fontWeight: 600 }}>{header}</td>
                      <td style={{ ...s.td, color: 'var(--portal-text-secondary)', fontStyle: sample ? 'normal' : 'italic' }}>
                        {sample || '—'}
                      </td>
                      <td style={{ ...s.td, maxWidth: 200 }}>
                        <select
                          style={s.select}
                          value={columnMapping[header] ?? '__ignore__'}
                          onChange={(e) => setMapping(header, e.target.value as TargetField)}
                        >
                          <option value="__ignore__">— Ignore —</option>
                          {TARGET_FIELDS.map((f) => (
                            <option key={f.key} value={f.key}>
                              {f.label}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Preview table */}
          <div style={s.card}>
            <p style={s.sectionLabel}>Preview (first {Math.min(5, totalRows)} rows)</p>
            <div style={{ overflowX: 'auto' }}>
              <table style={s.table}>
                <thead>
                  <tr>
                    {TARGET_FIELDS.filter(f =>
                      Object.values(columnMapping).includes(f.key)
                    ).map(f => (
                      <th key={f.key} style={s.th}>{f.label}</th>
                    ))}
                    {!Object.values(columnMapping).some(v => v !== '__ignore__') && (
                      <th style={s.th}>No columns mapped yet</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {previewRows.map((row, i) => (
                    <tr key={i}>
                      {TARGET_FIELDS.filter(f =>
                        Object.values(columnMapping).includes(f.key)
                      ).map(f => (
                        <td key={f.key} style={s.td}>
                          {row[f.key] || <span style={{ color: 'var(--portal-text-tertiary)', fontStyle: 'italic' }}>—</span>}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Validation warning */}
          {!hasMappedName && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1rem',
              background: 'rgba(234,179,8,0.1)',
              border: '1px solid rgba(234,179,8,0.3)',
              borderRadius: 8,
              marginBottom: '1.25rem',
              fontSize: '0.85rem',
              color: '#ca8a04',
            }}>
              <AlertCircle size={16} />
              <span>Please map at least the <strong>Full Name</strong> column before importing.</span>
            </div>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <button
              style={{
                ...s.primaryBtn,
                ...(!hasMappedName ? s.primaryBtnDisabled : {}),
              }}
              disabled={!hasMappedName}
              onClick={handleImport}
            >
              Import {totalRows} Prospect{totalRows !== 1 ? 's' : ''}
              <ChevronRight size={16} />
            </button>
            <button
              style={s.ghostBtn}
              onClick={() => {
                setStep('upload');
                setCsvHeaders([]);
                setCsvRows([]);
                setFileName('');
                setColumnMapping({});
              }}
            >
              <X size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />
              Cancel
            </button>
          </div>
        </>
      )}

      {/* ── STEP 3: Importing ── */}
      {step === 'importing' && (
        <div style={s.card}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <Loader2 size={20} style={{ color: 'var(--portal-accent)', animation: 'spin 1s linear infinite' }} />
            <span style={{ fontWeight: 600 }}>
              Importing {importProgress} of {totalRows}…
            </span>
          </div>

          {/* Progress bar */}
          <div style={s.progressBar(0)}>
            <div style={s.progressFill(totalRows > 0 ? (importProgress / totalRows) * 100 : 0)} />
          </div>

          {/* Live results feed */}
          {importResults.length > 0 && (
            <div style={{ marginTop: '1.25rem', maxHeight: 320, overflowY: 'auto' }}>
              {importResults.map((r) => (
                <div key={r.index} style={s.resultRow(r.status)}>
                  {r.status === 'success' ? (
                    <CheckCircle size={14} style={{ color: '#22c55e', flexShrink: 0 }} />
                  ) : (
                    <AlertCircle size={14} style={{ color: '#ef4444', flexShrink: 0 }} />
                  )}
                  <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {r.name}
                  </span>
                  {r.message && (
                    <span style={{ fontSize: '0.75rem', color: 'var(--portal-text-tertiary)', flexShrink: 0 }}>
                      {r.message}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── STEP 4: Done ── */}
      {step === 'done' && (
        <div style={s.card}>
          {/* Summary header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <CheckCircle size={24} style={{ color: successCount > 0 ? '#22c55e' : '#ef4444', flexShrink: 0 }} />
            <div>
              <p style={{ fontWeight: 700, fontSize: '1rem', margin: 0 }}>
                Import complete
              </p>
              <p style={{ fontSize: '0.85rem', color: 'var(--portal-text-secondary)', margin: 0, marginTop: 2 }}>
                {successCount} imported successfully
                {errorCount > 0 && `, ${errorCount} failed`}
              </p>
            </div>
          </div>

          {/* Summary pills */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <span style={s.pill('success')}>
              <CheckCircle size={12} />
              {successCount} succeeded
            </span>
            {errorCount > 0 && (
              <span style={s.pill('error')}>
                <X size={12} />
                {errorCount} failed
              </span>
            )}
          </div>

          {/* Full result list */}
          <div style={{ maxHeight: 320, overflowY: 'auto', marginBottom: '1.5rem' }}>
            {importResults.map((r) => (
              <div key={r.index} style={s.resultRow(r.status)}>
                {r.status === 'success' ? (
                  <CheckCircle size={14} style={{ color: '#22c55e', flexShrink: 0 }} />
                ) : (
                  <AlertCircle size={14} style={{ color: '#ef4444', flexShrink: 0 }} />
                )}
                <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {r.name}
                </span>
                {r.message && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--portal-text-tertiary)', flexShrink: 0, maxWidth: 260, textAlign: 'right' }}>
                    {r.message}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link href="/portal/dashboard/leadforge/prospects" style={s.viewLink}>
              View Prospects
              <ChevronRight size={16} />
            </Link>
            <button
              style={s.ghostBtn}
              onClick={() => {
                setStep('upload');
                setCsvHeaders([]);
                setCsvRows([]);
                setFileName('');
                setColumnMapping({});
                setImportProgress(0);
                setImportResults([]);
              }}
            >
              Import Another File
            </button>
          </div>
        </div>
      )}

      {/* Keyframe for spinner */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
