'use client';

import { useState, useRef } from 'react';
import { FileText, Plus, X, Loader2, CheckCircle, Clock, Copy, ChevronDown, ChevronUp, Sparkles, Pencil, Mail, Variable } from 'lucide-react';
import { useLeadForgeContent, useProspects, type CreateContentInput, type LeadForgeProspect } from '@/hooks/portal/useLeadForge';

const CONTENT_TYPES = [
  { id: 'micro_research',    label: 'Micro-Research Brief',  desc: 'Account intel for pre-call prep' },
  { id: 'email_sequence',    label: 'Email Sequence',        desc: '3-touch outreach cadence' },
  { id: 'linkedin_post',     label: 'LinkedIn Post',         desc: 'Thought leadership for warm signal' },
  { id: 'executive_summary', label: 'Executive Summary',     desc: 'Board-ready program overview' },
  { id: 'comment_draft',     label: 'Comment Draft',         desc: 'LinkedIn engagement comment' },
  { id: 'email_template',    label: 'Email Template',        desc: 'Reusable template with {{variables}}' },
];

// Variables available for substitution
const TEMPLATE_VARS = [
  { key: '{{first_name}}',    label: 'First Name'    },
  { key: '{{last_name}}',     label: 'Last Name'     },
  { key: '{{full_name}}',     label: 'Full Name'     },
  { key: '{{title}}',         label: 'Title'         },
  { key: '{{company}}',       label: 'Company'       },
  { key: '{{industry}}',      label: 'Industry'      },
  { key: '{{trigger}}',       label: 'Why Target'    },
  { key: '{{next_action}}',   label: 'Next Action'   },
];

function fillTemplate(body: string, prospect: LeadForgeProspect): string {
  const pa = prospect as any;
  const nameParts = prospect.full_name.trim().split(' ');
  const firstName = nameParts[0] ?? '';
  const lastName  = nameParts.slice(1).join(' ') ?? '';
  return body
    .replace(/\{\{first_name\}\}/g, firstName)
    .replace(/\{\{last_name\}\}/g,  lastName)
    .replace(/\{\{full_name\}\}/g,  prospect.full_name)
    .replace(/\{\{title\}\}/g,      prospect.title ?? '')
    .replace(/\{\{company\}\}/g,    prospect.account?.company_name ?? '')
    .replace(/\{\{industry\}\}/g,   prospect.account?.industry ?? '')
    .replace(/\{\{trigger\}\}/g,    pa.trigger_context ?? '')
    .replace(/\{\{next_action\}\}/g, pa.next_action ?? '');
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: React.ComponentType<any> }> = {
  draft:          { label: 'Draft',          color: '#6b9a7d', bg: 'rgba(93,171,121,0.1)',   icon: FileText    },
  pending_review: { label: 'Pending Review', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',   icon: Clock       },
  approved:       { label: 'Approved',       color: '#22c55e', bg: 'rgba(34,197,94,0.1)',    icon: CheckCircle },
};

// ── Full content viewer ─────────────────────────────────────────
function ContentViewer({ item, onClose, onStatusChange }: {
  item: any;
  onClose: () => void;
  onStatusChange: (id: string, status: string) => Promise<void>;
}) {
  const [copied, setCopied] = useState(false);
  const [updating, setUpdating] = useState(false);
  const typeLabel = CONTENT_TYPES.find(t => t.id === item.content_type)?.label ?? item.content_type;
  const statusConf = STATUS_CONFIG[item.status] ?? STATUS_CONFIG.draft;
  const StatusIcon = statusConf.icon;

  const handleCopy = () => {
    navigator.clipboard.writeText(item.body ?? '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStatus = async (status: string) => {
    setUpdating(true);
    try { await onStatusChange(item.id, status); }
    finally { setUpdating(false); }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ background: 'var(--portal-bg-secondary)', borderRadius: 20, width: '100%', maxWidth: 680, maxHeight: '88vh', display: 'flex', flexDirection: 'column', boxShadow: '0 24px 80px rgba(0,0,0,0.2)' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '24px 28px 20px', borderBottom: '1px solid var(--portal-border-default)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <h2 style={{ fontSize: 17, fontWeight: 700, color: 'var(--portal-text-primary)', margin: 0 }}>{item.title ?? 'Untitled'}</h2>
              <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 999, background: 'var(--portal-accent-subtle)', color: 'var(--portal-accent)' }}>{typeLabel}</span>
            </div>
            {item.prospect && (
              <p style={{ fontSize: 12, color: 'var(--portal-text-tertiary)', margin: 0 }}>
                For {(item.prospect as any).full_name}{(item.prospect as any).title ? ` · ${(item.prospect as any).title}` : ''}
              </p>
            )}
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--portal-text-tertiary)', padding: 4, flexShrink: 0 }}>
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 28px' }}>
          <pre style={{ fontSize: 13, color: 'var(--portal-text-secondary)', lineHeight: 1.7, whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: 0, fontFamily: 'inherit' }}>
            {item.body ?? '(No content)'}
          </pre>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 28px', borderTop: '1px solid var(--portal-border-default)', gap: 10 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 600, padding: '5px 12px', borderRadius: 999, background: statusConf.bg, color: statusConf.color, flexShrink: 0 }}>
            <StatusIcon size={11} /> {statusConf.label}
          </span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={handleCopy} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '8px 16px', border: '1px solid var(--portal-border-default)', borderRadius: 8, background: copied ? 'rgba(74,222,128,0.1)' : 'none', color: copied ? '#4ade80' : 'var(--portal-text-secondary)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
              {copied ? <CheckCircle size={13} /> : <Copy size={13} />} {copied ? 'Copied!' : 'Copy'}
            </button>
            {item.status === 'draft' && (
              <button onClick={() => handleStatus('pending_review')} disabled={updating} style={{ padding: '8px 16px', border: '1px solid var(--portal-border-accent)', borderRadius: 8, background: 'none', color: 'var(--portal-accent)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                Submit for Review
              </button>
            )}
            {item.status === 'pending_review' && (
              <button onClick={() => handleStatus('approved')} disabled={updating} style={{ padding: '8px 16px', border: 'none', borderRadius: 8, background: 'var(--portal-accent)', color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                {updating ? 'Approving…' : 'Approve'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Template Editor Modal ───────────────────────────────────────
function TemplateEditorModal({ onClose, onSave, existing }: {
  onClose: () => void;
  onSave: (input: CreateContentInput) => Promise<void>;
  existing?: any; // for edit mode — not wired yet, reserved for future
}) {
  const [title, setTitle] = useState(existing?.title ?? '');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState(existing?.body ?? '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [previewMode, setPreviewMode] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertVar = (v: string) => {
    const ta = textareaRef.current;
    if (!ta) { setBody((b: string) => b + v); return; }
    const start = ta.selectionStart;
    const end   = ta.selectionEnd;
    const next  = body.slice(0, start) + v + body.slice(end);
    setBody(next);
    // restore cursor after variable
    setTimeout(() => { ta.focus(); ta.setSelectionRange(start + v.length, start + v.length); }, 0);
  };

  const handleSave = async () => {
    if (!title.trim()) { setError('Title is required.'); return; }
    if (!body.trim())  { setError('Template body is required.'); return; }
    setSaving(true);
    try {
      const fullBody = subject.trim() ? `Subject: ${subject.trim()}\n\n${body}` : body;
      await onSave({ content_type: 'email_template', title, body: fullBody });
      setSaved(true);
      setTimeout(onClose, 700);
    } catch (e: any) {
      setError(e.message ?? 'Failed to save.');
      setSaving(false);
    }
  };

  const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 14px', border: '1px solid var(--portal-border-default)', borderRadius: 10, fontSize: 13, color: 'var(--portal-text-primary)', background: 'var(--portal-bg-hover)', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' };
  const labelStyle: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: 'var(--portal-text-secondary)', display: 'block', marginBottom: 6 };

  // Highlight {{vars}} in preview
  const renderHighlighted = (text: string) => {
    const parts = text.split(/(\{\{[^}]+\}\})/g);
    return parts.map((part, i) =>
      /^\{\{[^}]+\}\}$/.test(part)
        ? <mark key={i} style={{ background: 'rgba(99,102,241,0.2)', color: '#6366f1', borderRadius: 3, padding: '0 2px', fontWeight: 600 }}>{part}</mark>
        : <span key={i}>{part}</span>
    );
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ background: 'var(--portal-bg-secondary)', borderRadius: 20, width: '100%', maxWidth: 680, maxHeight: '92vh', display: 'flex', flexDirection: 'column', boxShadow: '0 24px 80px rgba(0,0,0,0.2)' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 28px 16px', borderBottom: '1px solid var(--portal-border-default)', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Mail size={17} color="#6366f1" />
            </div>
            <div>
              <h2 style={{ fontSize: 17, fontWeight: 700, color: 'var(--portal-text-primary)', margin: 0 }}>Email Template</h2>
              <p style={{ fontSize: 12, color: 'var(--portal-text-tertiary)', margin: 0 }}>Use {`{{variables}}`} to personalize per prospect</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--portal-text-tertiary)', padding: 4 }}><X size={18} /></button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '22px 28px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Template name */}
          <div>
            <label style={labelStyle}>Template Name</label>
            <input style={inputStyle} value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. New CHRO First-Touch" />
          </div>

          {/* Email subject */}
          <div>
            <label style={labelStyle}>Email Subject <span style={{ fontWeight: 400, color: 'var(--portal-text-tertiary)' }}>(optional)</span></label>
            <input style={inputStyle} value={subject} onChange={e => setSubject(e.target.value)} placeholder="Re: Leadership priorities at {{company}}" />
          </div>

          {/* Variable helper */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <label style={{ ...labelStyle, marginBottom: 0 }}>Body</label>
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                {TEMPLATE_VARS.map(v => (
                  <button key={v.key} onClick={() => insertVar(v.key)}
                    style={{ padding: '3px 8px', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 6, background: 'rgba(99,102,241,0.07)', color: '#6366f1', fontSize: 10, fontWeight: 600, cursor: 'pointer' }}>
                    {`{${v.label}}`}
                  </button>
                ))}
              </div>
            </div>
            {/* Tab row: Edit / Preview */}
            <div style={{ display: 'flex', marginBottom: 6, gap: 4 }}>
              {[{ key: false, label: 'Edit' }, { key: true, label: 'Preview Variables' }].map(t => (
                <button key={String(t.key)} onClick={() => setPreviewMode(t.key)}
                  style={{ padding: '5px 12px', border: 'none', borderRadius: 7, fontSize: 12, fontWeight: previewMode === t.key ? 700 : 500, cursor: 'pointer', background: previewMode === t.key ? 'var(--portal-accent-subtle)' : 'transparent', color: previewMode === t.key ? 'var(--portal-accent)' : 'var(--portal-text-tertiary)' }}>
                  {t.label}
                </button>
              ))}
            </div>
            {previewMode ? (
              <div style={{ padding: '12px 14px', border: '1px solid var(--portal-border-default)', borderRadius: 10, background: 'var(--portal-bg-hover)', minHeight: 180, fontSize: 13, color: 'var(--portal-text-secondary)', lineHeight: 1.7, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                {body ? renderHighlighted(body) : <span style={{ color: 'var(--portal-text-tertiary)', fontStyle: 'italic' }}>Nothing to preview yet</span>}
              </div>
            ) : (
              <textarea
                ref={textareaRef}
                style={{ ...inputStyle, resize: 'vertical', minHeight: 180, lineHeight: 1.7 }}
                value={body}
                onChange={e => setBody(e.target.value)}
                placeholder={`Hi {{first_name}},\n\nI noticed {{company}} recently...\n\nWould you be open to a brief conversation?\n\nBest,\n[Your name]`}
              />
            )}
          </div>

          {error && <p style={{ fontSize: 12, color: '#ef4444', margin: 0 }}>{error}</p>}

          {/* Variable reference */}
          <div style={{ padding: '12px 14px', background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: 10 }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: '#6366f1', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Available Variables</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {TEMPLATE_VARS.map(v => (
                <div key={v.key} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <code style={{ fontSize: 11, color: '#6366f1', background: 'rgba(99,102,241,0.12)', padding: '1px 6px', borderRadius: 4 }}>{v.key}</code>
                  <span style={{ fontSize: 11, color: 'var(--portal-text-tertiary)' }}>→ {v.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, padding: '16px 28px', borderTop: '1px solid var(--portal-border-default)', flexShrink: 0 }}>
          <button onClick={onClose} style={{ padding: '10px 20px', border: '1px solid var(--portal-border-default)', borderRadius: 10, background: 'none', fontSize: 13, fontWeight: 600, color: 'var(--portal-text-secondary)', cursor: 'pointer' }}>Cancel</button>
          <button onClick={handleSave} disabled={saving || saved}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 20px', border: 'none', borderRadius: 10, background: saved ? 'rgba(74,222,128,0.15)' : '#6366f1', color: saved ? '#4ade80' : 'white', fontSize: 13, fontWeight: 600, cursor: (saving || saved) ? 'default' : 'pointer', opacity: saving ? 0.7 : 1 }}>
            {saved ? <><CheckCircle size={13} /> Saved!</> : saving ? 'Saving…' : <><Mail size={13} /> Save Template</>}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Use Template Modal ──────────────────────────────────────────
function UseTemplateModal({ template, onClose }: { template: any; onClose: () => void }) {
  const { prospects } = useProspects();
  const [prospectId, setProspectId] = useState('');
  const [copied, setCopied] = useState(false);

  const selectedProspect = prospects.find(p => p.id === prospectId);
  const rawBody = template.body ?? '';

  // Strip "Subject: ...\n\n" prefix if present, show separately
  const subjectMatch = rawBody.match(/^Subject: (.+)\n\n([\s\S]*)$/);
  const emailSubject = subjectMatch ? subjectMatch[1] : null;
  const emailBody    = subjectMatch ? subjectMatch[2] : rawBody;

  const filled     = selectedProspect ? fillTemplate(emailBody, selectedProspect) : emailBody;
  const filledSubj = selectedProspect && emailSubject ? fillTemplate(emailSubject, selectedProspect) : emailSubject;

  const copyText = filledSubj ? `Subject: ${filledSubj}\n\n${filled}` : filled;

  const handleCopy = () => {
    navigator.clipboard.writeText(copyText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 14px', border: '1px solid var(--portal-border-default)', borderRadius: 10, fontSize: 13, color: 'var(--portal-text-primary)', background: 'var(--portal-bg-hover)', outline: 'none', boxSizing: 'border-box', cursor: 'pointer' };

  // Highlight unfilled vars in red
  const renderFilled = (text: string) => {
    const parts = text.split(/(\{\{[^}]+\}\})/g);
    return parts.map((part, i) =>
      /^\{\{[^}]+\}\}$/.test(part)
        ? <mark key={i} style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444', borderRadius: 3, padding: '0 2px', fontWeight: 600 }}>{part}</mark>
        : <span key={i}>{part}</span>
    );
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 70, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ background: 'var(--portal-bg-secondary)', borderRadius: 20, width: '100%', maxWidth: 640, maxHeight: '90vh', display: 'flex', flexDirection: 'column', boxShadow: '0 24px 80px rgba(0,0,0,0.2)' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '22px 26px 16px', borderBottom: '1px solid var(--portal-border-default)', flexShrink: 0 }}>
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--portal-text-primary)', margin: '0 0 3px' }}>{template.title}</h2>
            <p style={{ fontSize: 12, color: 'var(--portal-text-tertiary)', margin: 0 }}>Select a prospect to personalize</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--portal-text-tertiary)', padding: 4 }}><X size={18} /></button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 26px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Prospect picker */}
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--portal-text-secondary)', display: 'block', marginBottom: 6 }}>Prospect</label>
            <select style={inputStyle} value={prospectId} onChange={e => setProspectId(e.target.value)}>
              <option value="">— Select prospect to personalize —</option>
              {prospects.map(p => <option key={p.id} value={p.id}>{p.full_name}{p.account ? ` · ${p.account.company_name}` : ''}</option>)}
            </select>
          </div>

          {/* Subject line */}
          {filledSubj && (
            <div style={{ padding: '10px 14px', background: 'var(--portal-bg-hover)', borderRadius: 10, border: '1px solid var(--portal-border-default)' }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--portal-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 4px' }}>Subject</p>
              <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--portal-text-primary)', margin: 0 }}>
                {selectedProspect ? filledSubj : renderFilled(emailSubject ?? '')}
              </p>
            </div>
          )}

          {/* Body preview */}
          <div style={{ padding: '14px', background: 'var(--portal-bg-hover)', border: '1px solid var(--portal-border-default)', borderRadius: 12 }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--portal-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 10px' }}>
              {selectedProspect ? 'Personalized Email' : 'Template Preview — select prospect to fill'}
            </p>
            <pre style={{ fontSize: 13, color: 'var(--portal-text-secondary)', lineHeight: 1.75, whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: 0, fontFamily: 'inherit', maxHeight: 320, overflowY: 'auto' }}>
              {selectedProspect ? filled : renderFilled(emailBody)}
            </pre>
          </div>

          {!selectedProspect && (
            <p style={{ fontSize: 12, color: 'var(--portal-text-tertiary)', margin: 0, fontStyle: 'italic' }}>
              Unfilled <mark style={{ background: 'rgba(239,68,68,0.12)', color: '#ef4444', borderRadius: 3, padding: '0 3px' }}>{'{{variables}}'}</mark> will be highlighted in red
            </p>
          )}
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, padding: '16px 26px', borderTop: '1px solid var(--portal-border-default)', flexShrink: 0 }}>
          <button onClick={onClose} style={{ padding: '9px 18px', border: '1px solid var(--portal-border-default)', borderRadius: 10, background: 'none', fontSize: 13, fontWeight: 600, color: 'var(--portal-text-secondary)', cursor: 'pointer' }}>Close</button>
          <button onClick={handleCopy}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 18px', border: 'none', borderRadius: 10, background: copied ? 'rgba(74,222,128,0.15)' : 'var(--portal-accent)', color: copied ? '#4ade80' : 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            {copied ? <><CheckCircle size={13} /> Copied!</> : <><Copy size={13} /> Copy Email</>}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── AI Generate Modal ───────────────────────────────────────────
function GenerateModal({ onClose, onSave }: {
  onClose: () => void;
  onSave: (input: CreateContentInput) => Promise<void>;
}) {
  const { prospects } = useProspects();
  const [mode, setMode] = useState<'ai' | 'manual'>('ai');
  const [prospectId, setProspectId] = useState('');
  const [contentType, setContentType] = useState('micro_research');
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState<{ title: string; body: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  // Manual form state
  const [manualTitle, setManualTitle] = useState('');
  const [manualBody, setManualBody] = useState('');

  const selectedProspect = prospects.find(p => p.id === prospectId);

  const handleGenerate = async () => {
    if (!prospectId) { setError('Select a prospect first.'); return; }
    setGenerating(true);
    setError('');
    setGenerated(null);
    try {
      const res = await fetch('/portal/api/leadforge/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prospect: selectedProspect, content_type: contentType }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Generation failed.');
      setGenerated(data);
    } catch (e: any) {
      setError(e.message ?? 'Generation failed.');
    } finally {
      setGenerating(false);
    }
  };

  const handleSaveAi = async () => {
    if (!generated) return;
    setSaving(true);
    try {
      await onSave({ prospect_id: prospectId || undefined, content_type: contentType, title: generated.title, body: generated.body });
      setSaved(true);
      setTimeout(onClose, 800);
    } catch (e: any) {
      setError(e.message ?? 'Failed to save.');
      setSaving(false);
    }
  };

  const handleSaveManual = async () => {
    if (!manualTitle.trim()) { setError('Title is required.'); return; }
    setSaving(true);
    try {
      await onSave({ prospect_id: prospectId || undefined, content_type: contentType, title: manualTitle, body: manualBody });
      setSaved(true);
      setTimeout(onClose, 800);
    } catch (e: any) {
      setError(e.message ?? 'Failed to save.');
      setSaving(false);
    }
  };

  const inputStyle = { width: '100%', padding: '10px 14px', border: '1px solid var(--portal-border-default)', borderRadius: 10, fontSize: 13, color: 'var(--portal-text-primary)', background: 'var(--portal-bg-hover)', outline: 'none', boxSizing: 'border-box' as const };
  const labelStyle: React.CSSProperties = { fontSize: '12px', fontWeight: 600, color: 'var(--portal-text-secondary)', display: 'block', marginBottom: 6 };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ background: 'var(--portal-bg-secondary)', borderRadius: 20, padding: 32, width: '100%', maxWidth: 560, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.18)' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--portal-text-primary)', margin: 0 }}>Create Content</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--portal-text-tertiary)', padding: 4 }}><X size={18} /></button>
        </div>

        {/* Mode toggle */}
        <div style={{ display: 'flex', gap: 4, padding: 4, background: 'var(--portal-bg-hover)', borderRadius: 10, marginBottom: 22 }}>
          {[
            { key: 'ai', label: 'AI Generate', icon: Sparkles },
            { key: 'manual', label: 'Manual', icon: Pencil },
          ].map(({ key, label, icon: Icon }) => (
            <button key={key} onClick={() => { setMode(key as any); setError(''); setGenerated(null); }}
              style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '8px 0', borderRadius: 7, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: mode === key ? 600 : 500, background: mode === key ? 'var(--portal-bg-secondary)' : 'transparent', color: mode === key ? 'var(--portal-text-primary)' : 'var(--portal-text-tertiary)', boxShadow: mode === key ? '0 1px 4px rgba(0,0,0,0.08)' : 'none' }}>
              <Icon size={13} /> {label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Prospect picker (both modes) */}
          <div>
            <label style={labelStyle}>Prospect {mode === 'ai' ? '(required)' : '(optional)'}</label>
            <select style={{ ...inputStyle, cursor: 'pointer' }} value={prospectId} onChange={e => { setProspectId(e.target.value); setGenerated(null); setError(''); }}>
              <option value="">Select a prospect…</option>
              {prospects.map(p => <option key={p.id} value={p.id}>{p.full_name}{p.account ? ` · ${p.account.company_name}` : ''}</option>)}
            </select>
          </div>

          {/* Content type picker */}
          <div>
            <label style={labelStyle}>Content Type</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {CONTENT_TYPES.map(t => (
                <button key={t.id} onClick={() => { setContentType(t.id); setGenerated(null); }}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', border: `1px solid ${contentType === t.id ? 'var(--portal-border-accent)' : 'var(--portal-border-default)'}`, borderRadius: 9, background: contentType === t.id ? 'var(--portal-accent-subtle)' : 'none', cursor: 'pointer', textAlign: 'left' }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: contentType === t.id ? 'var(--portal-accent)' : 'var(--portal-text-primary)' }}>{t.label}</span>
                  <span style={{ fontSize: 11, color: 'var(--portal-text-tertiary)' }}>{t.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* AI mode */}
          {mode === 'ai' && (
            <>
              {!generated ? (
                <button onClick={handleGenerate} disabled={generating || !prospectId}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px', border: 'none', borderRadius: 10, background: 'var(--portal-accent)', color: 'white', fontSize: 14, fontWeight: 700, cursor: (!prospectId || generating) ? 'default' : 'pointer', opacity: (!prospectId || generating) ? 0.6 : 1 }}>
                  {generating ? <><Loader2 size={15} style={{ animation: 'spin 0.8s linear infinite' }} /> Generating with AI…</> : <><Sparkles size={15} /> Generate with Claude</>}
                </button>
              ) : (
                <div style={{ background: 'var(--portal-bg-hover)', border: '1px solid var(--portal-border-default)', borderRadius: 12, overflow: 'hidden' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid var(--portal-border-default)' }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--portal-text-primary)', margin: 0 }}>{generated.title}</p>
                    <button onClick={() => setGenerated(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 11, color: 'var(--portal-accent)', fontWeight: 600 }}>Regenerate</button>
                  </div>
                  <pre style={{ fontSize: 12, color: 'var(--portal-text-secondary)', lineHeight: 1.65, whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: 0, padding: '14px 16px', maxHeight: 240, overflowY: 'auto', fontFamily: 'inherit' }}>
                    {generated.body}
                  </pre>
                </div>
              )}
              {generated && (
                <button onClick={handleSaveAi} disabled={saving || saved}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '10px', border: 'none', borderRadius: 10, background: saved ? 'rgba(74,222,128,0.15)' : 'var(--portal-accent)', color: saved ? '#4ade80' : 'white', fontSize: 13, fontWeight: 600, cursor: (saving || saved) ? 'default' : 'pointer' }}>
                  {saved ? <><CheckCircle size={13} /> Saved!</> : saving ? 'Saving…' : <><FileText size={13} /> Save to Library</>}
                </button>
              )}
            </>
          )}

          {/* Manual mode */}
          {mode === 'manual' && (
            <>
              <div>
                <label style={labelStyle}>Title</label>
                <input style={inputStyle} value={manualTitle} onChange={e => setManualTitle(e.target.value)} placeholder="e.g. 90-Day Priorities Brief for Jane Smith" />
              </div>
              <div>
                <label style={labelStyle}>Content</label>
                <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: 140 }} value={manualBody} onChange={e => setManualBody(e.target.value)} placeholder="Paste or write the content here…" />
              </div>
              <button onClick={handleSaveManual} disabled={saving || saved}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '10px', border: 'none', borderRadius: 10, background: saved ? 'rgba(74,222,128,0.15)' : 'var(--portal-accent)', color: saved ? '#4ade80' : 'white', fontSize: 13, fontWeight: 600, cursor: (saving || saved) ? 'default' : 'pointer' }}>
                {saved ? <><CheckCircle size={13} /> Saved!</> : saving ? 'Saving…' : 'Save Content'}
              </button>
            </>
          )}

          {error && <p style={{ fontSize: 12, color: '#ef4444', margin: 0 }}>{error}</p>}
        </div>
      </div>
    </div>
  );
}

// ── Main page ───────────────────────────────────────────────────
export default function ContentPage() {
  const { content, loading, createContent, updateStatus } = useLeadForgeContent();
  const [filter, setFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [showTemplateEditor, setShowTemplateEditor] = useState(false);
  const [viewItem, setViewItem] = useState<any | null>(null);
  const [useTemplateItem, setUseTemplateItem] = useState<any | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const filtered = filter === 'all' ? content : content.filter(c => c.content_type === filter);

  const stats = {
    total:     content.length,
    pending:   content.filter(c => c.status === 'pending_review').length,
    approved:  content.filter(c => c.status === 'approved').length,
    templates: content.filter(c => c.content_type === 'email_template').length,
  };

  const tabStyle = (active: boolean): React.CSSProperties => ({
    padding: '7px 14px', fontSize: 13, fontWeight: active ? 600 : 500, borderRadius: 8, border: 'none', cursor: 'pointer',
    background: active ? 'var(--portal-accent-subtle)' : 'transparent',
    color: active ? 'var(--portal-accent)' : 'var(--portal-text-tertiary)',
  });

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--portal-text-primary)', margin: 0 }}>Content Library</h1>
          <p style={{ fontSize: 13, color: 'var(--portal-text-tertiary)', margin: '4px 0 0' }}>Personalized thought leadership for every target account</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => setShowTemplateEditor(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px', border: '1px solid rgba(99,102,241,0.35)', borderRadius: 10, background: 'rgba(99,102,241,0.07)', color: '#6366f1', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            <Mail size={14} /> New Template
          </button>
          <button onClick={() => setShowModal(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px', border: 'none', borderRadius: 10, background: 'var(--portal-accent)', color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            <Plus size={15} strokeWidth={2} /> Create Content
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 12 }}>
        {[
          { label: 'Total Pieces',    value: stats.total     },
          { label: 'Email Templates', value: stats.templates },
          { label: 'Pending Review',  value: stats.pending   },
          { label: 'Approved',        value: stats.approved  },
        ].map(s => (
          <div key={s.label} style={{ padding: '14px 20px', background: 'var(--portal-bg-secondary)', border: '1px solid var(--portal-border-default)', borderRadius: 12, minWidth: 120 }}>
            <p style={{ fontSize: 22, fontWeight: 800, color: 'var(--portal-text-primary)', margin: 0, lineHeight: 1 }}>{loading ? '—' : s.value}</p>
            <p style={{ fontSize: 11, color: 'var(--portal-text-tertiary)', margin: '4px 0 0' }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 4, padding: '4px', background: 'var(--portal-bg-hover)', borderRadius: 12, width: 'fit-content', flexWrap: 'wrap' }}>
        <button style={tabStyle(filter === 'all')} onClick={() => setFilter('all')}>All</button>
        {CONTENT_TYPES.map(t => <button key={t.id} style={tabStyle(filter === t.id)} onClick={() => setFilter(t.id)}>{t.label}</button>)}
      </div>

      {/* Content list */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', border: '2px solid var(--portal-accent)', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 0', background: 'var(--portal-bg-secondary)', border: '1px solid var(--portal-border-default)', borderRadius: 16 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: 'var(--portal-accent-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <FileText size={22} strokeWidth={1.8} color="var(--portal-accent)" />
          </div>
          <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--portal-text-primary)', margin: '0 0 6px' }}>No content yet</p>
          <p style={{ fontSize: 13, color: 'var(--portal-text-tertiary)', margin: '0 0 20px' }}>Generate AI-powered content for your top prospects.</p>
          <button onClick={() => setShowModal(true)} style={{ padding: '10px 20px', border: 'none', borderRadius: 10, background: 'var(--portal-accent)', color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            Create First Piece
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map(c => {
            const statusConf = STATUS_CONFIG[c.status] ?? STATUS_CONFIG.draft;
            const typeLabel = CONTENT_TYPES.find(t => t.id === c.content_type)?.label ?? c.content_type;
            const StatusIcon = statusConf.icon;
            const isExpanded = expandedIds.has(c.id);

            return (
              <div key={c.id} style={{ background: 'var(--portal-bg-secondary)', border: '1px solid var(--portal-border-default)', borderRadius: 14, overflow: 'hidden' }}>
                {/* Card header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '16px 18px' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4, flexWrap: 'wrap' }}>
                      <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--portal-text-primary)', margin: 0 }}>{c.title ?? 'Untitled'}</p>
                      <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 999, background: 'var(--portal-accent-subtle)', color: 'var(--portal-accent)' }}>{typeLabel}</span>
                    </div>
                    {c.prospect && (
                      <p style={{ fontSize: 12, color: 'var(--portal-text-tertiary)', margin: '2px 0 6px' }}>
                        For {(c.prospect as any).full_name}{(c.prospect as any).title ? ` · ${(c.prospect as any).title}` : ''}
                      </p>
                    )}
                    {c.body && !isExpanded && (
                      <p style={{ fontSize: 12, color: 'var(--portal-text-secondary)', margin: 0, lineHeight: 1.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as any }}>
                        {c.body}
                      </p>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: 8, flexShrink: 0, alignItems: 'flex-start', marginLeft: 12 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 999, background: statusConf.bg, color: statusConf.color, whiteSpace: 'nowrap' }}>
                      <StatusIcon size={11} /> {statusConf.label}
                    </span>
                    {c.status === 'draft' && (
                      <button onClick={() => updateStatus(c.id, 'pending_review')}
                        style={{ padding: '4px 12px', border: '1px solid var(--portal-border-accent)', borderRadius: 8, background: 'none', color: 'var(--portal-accent)', fontSize: 12, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                        Submit
                      </button>
                    )}
                    {c.status === 'pending_review' && (
                      <button onClick={() => updateStatus(c.id, 'approved')}
                        style={{ padding: '4px 12px', border: 'none', borderRadius: 8, background: 'var(--portal-accent)', color: 'white', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                        Approve
                      </button>
                    )}
                    {c.content_type === 'email_template' && (
                      <button onClick={() => setUseTemplateItem(c)}
                        style={{ padding: '4px 12px', border: '1px solid rgba(99,102,241,0.35)', borderRadius: 8, background: 'rgba(99,102,241,0.07)', color: '#6366f1', fontSize: 12, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                        Use Template
                      </button>
                    )}
                    <button onClick={() => setViewItem(c)}
                      style={{ padding: '4px 12px', border: '1px solid var(--portal-border-default)', borderRadius: 8, background: 'none', color: 'var(--portal-text-tertiary)', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                      Open
                    </button>
                    <button onClick={() => toggleExpand(c.id)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--portal-text-tertiary)', padding: 4 }}>
                      {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                  </div>
                </div>

                {/* Expanded inline preview */}
                {isExpanded && c.body && (
                  <div style={{ borderTop: '1px solid var(--portal-border-default)', padding: '14px 18px', background: 'var(--portal-bg-hover)' }}>
                    <pre style={{ fontSize: 12, color: 'var(--portal-text-secondary)', lineHeight: 1.65, whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: 0, fontFamily: 'inherit', maxHeight: 300, overflowY: 'auto' }}>
                      {c.body}
                    </pre>
                    <button
                      onClick={() => { navigator.clipboard.writeText(c.body ?? ''); }}
                      style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 12, padding: '6px 14px', border: '1px solid var(--portal-border-default)', borderRadius: 8, background: 'none', color: 'var(--portal-text-secondary)', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                      <Copy size={12} /> Copy to clipboard
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {showModal && <GenerateModal onClose={() => setShowModal(false)} onSave={createContent} />}
      {showTemplateEditor && <TemplateEditorModal onClose={() => setShowTemplateEditor(false)} onSave={createContent} />}
      {viewItem && <ContentViewer item={viewItem} onClose={() => setViewItem(null)} onStatusChange={updateStatus} />}
      {useTemplateItem && <UseTemplateModal template={useTemplateItem} onClose={() => setUseTemplateItem(null)} />}
    </div>
  );
}
