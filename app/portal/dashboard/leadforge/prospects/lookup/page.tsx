'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Loader2, Building2, CheckCircle, Plus, AlertCircle, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { useProspects, useAccounts } from '@/hooks/portal/useLeadForge';
import type { LookupResult, LookupPerson } from '@/app/portal/api/leadforge/lookup/route';

interface OrgSuggestion {
  id: string;
  name: string;
  domain: string | null;
  headcount: number | null;
  industry: string | null;
}

// ── Company autocomplete input ───────────────────────────────────
function CompanyAutocomplete({ value, onChange, onSelect, onSearch, loading }: {
  value: string;
  onChange: (v: string) => void;
  onSelect: (org: OrgSuggestion) => void;
  onSearch: () => void;
  loading: boolean;
}) {
  const [suggestions, setSuggestions] = useState<OrgSuggestion[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [fetching, setFetching] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!value.trim() || value.length < 2) { setSuggestions([]); setShowDropdown(false); return; }
    debounceRef.current = setTimeout(async () => {
      setFetching(true);
      try {
        const res = await fetch(`/portal/api/leadforge/org-search?q=${encodeURIComponent(value)}`);
        const data = await res.json();
        setSuggestions(data.orgs ?? []);
        setShowDropdown((data.orgs ?? []).length > 0);
      } catch { setSuggestions([]); }
      finally { setFetching(false); }
    }, 300);
  }, [value]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={containerRef} style={{ position: 'relative', flex: 1 }}>
      <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--portal-text-tertiary)', zIndex: 1 }} />
      {fetching && <Loader2 size={14} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--portal-text-tertiary)', animation: 'spin 0.8s linear infinite' }} />}
      <input
        style={{ width: '100%', paddingLeft: 42, paddingRight: 14, padding: '12px 16px 12px 42px', border: '1px solid var(--portal-border-default)', borderRadius: 12, fontSize: 14, color: 'var(--portal-text-primary)', background: 'var(--portal-bg-secondary)', outline: 'none', boxSizing: 'border-box' }}
        value={value}
        onChange={e => { onChange(e.target.value); }}
        onKeyDown={e => { if (e.key === 'Enter' && !loading) { setShowDropdown(false); onSearch(); } if (e.key === 'Escape') setShowDropdown(false); }}
        onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
        placeholder="e.g. Johnson Controls, Microsoft, 3M…"
      />
      {showDropdown && (
        <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 4, background: 'var(--portal-bg-secondary)', border: '1px solid var(--portal-border-default)', borderRadius: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.12)', zIndex: 50, overflow: 'hidden' }}>
          {suggestions.map((org, i) => (
            <button
              key={org.id}
              onMouseDown={() => { onChange(org.name); onSelect(org); setShowDropdown(false); }}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', background: 'none', border: 'none', borderTop: i > 0 ? '1px solid var(--portal-border-default)' : 'none', cursor: 'pointer', textAlign: 'left' }}
            >
              <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--portal-accent-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Building2 size={14} color="var(--portal-accent)" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--portal-text-primary)', margin: 0 }}>{org.name}</p>
                <p style={{ fontSize: 11, color: 'var(--portal-text-tertiary)', margin: '1px 0 0' }}>
                  {[org.domain, org.industry, org.headcount ? org.headcount.toLocaleString() + ' employees' : null].filter(Boolean).join(' · ')}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const SENIORITY_CONFIG: Record<string, { color: string; bg: string }> = {
  'C-Suite': { color: '#4ade80', bg: 'rgba(74,222,128,0.1)' },
  VP: { color: '#6366f1', bg: 'rgba(99,102,241,0.1)' },
  Director: { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  'Senior Manager': { color: '#94a3b8', bg: 'rgba(148,163,184,0.1)' },
};

function SeniorityBadge({ level }: { level: string }) {
  const s = SENIORITY_CONFIG[level] ?? SENIORITY_CONFIG['Senior Manager'];
  return (
    <span style={{ ...s, fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 999 }}>{level}</span>
  );
}

export default function ProspectLookupPage() {
  const { createProspect } = useProspects();
  const { accounts, createAccount, updateAccount } = useAccounts();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<LookupResult | null>(null);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const [adding, setAdding] = useState(false);
  const [addedNames, setAddedNames] = useState<Set<string>>(new Set());
  const [addError, setAddError] = useState('');

  const handleSearch = useCallback(async (searchQuery?: string) => {
    const q = (searchQuery ?? query).trim();
    if (!q) return;
    setLoading(true);
    setResult(null);
    setError('');
    setSelected(new Set());
    setExpanded(new Set());
    setAddedNames(new Set());

    try {
      const res = await fetch('/portal/api/leadforge/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Lookup failed.');
      if (!data.company_name) {
        setError('Could not identify this company. Try the full company name.');
        setLoading(false);
        return;
      }
      setResult(data);
    } catch (e: any) {
      setError(e.message ?? 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }, [query]);

  // Auto-run search if ?q= param is present (e.g. from account detail page)
  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setQuery(q);
      handleSearch(q);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleSelect = (i: number) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  const toggleExpand = (i: number) => {
    setExpanded(prev => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  const selectAll = () => {
    if (!result) return;
    setSelected(new Set(result.people.map((_, i) => i)));
  };

  const handleAddSelected = async () => {
    if (!result || selected.size === 0) return;
    setAdding(true);
    setAddError('');

    try {
      // Find or create account
      let account_id: string | undefined;
      // Parse headcount from string like "50,000" or "10,000-50,000"
      const parseHeadcount = (s: string | null): number | undefined => {
        if (!s) return undefined;
        const digits = s.replace(/[^0-9]/g, '');
        const n = parseInt(digits);
        return isNaN(n) ? undefined : n;
      };

      const existing = accounts.find(a =>
        a.company_name.toLowerCase() === result.company_name.toLowerCase()
      );
      if (existing) {
        account_id = existing.id;
        // Backfill domain/headcount if the existing account is missing them
        const updates: Record<string, any> = {};
        if (!existing.domain && result.domain) updates.domain = result.domain;
        if (!existing.headcount && result.headcount_estimate) updates.headcount = parseHeadcount(result.headcount_estimate);
        if (Object.keys(updates).length > 0) {
          updateAccount(existing.id, updates).catch(() => {});
        }
      } else {
        const acct = await createAccount({
          company_name: result.company_name,
          domain: result.domain ?? undefined,
          headcount: parseHeadcount(result.headcount_estimate),
        }) as any;
        account_id = acct?.id;
      }

      const toAdd = [...selected].map(i => result.people[i]);
      const added = new Set(addedNames);

      for (const person of toAdd) {
        const newProspect = await createProspect({
          full_name: person.full_name,
          title: person.title,
          email: person.email_guess ?? undefined,
          linkedin_url: person.linkedin_url ?? undefined,
          icp_score: person.seniority === 'C-Suite' ? 85 : person.seniority === 'VP' ? 70 : 55,
          stage: 'awareness',
          notes: person.relevance,
          account_id,
          enrichment_source: 'ai_lookup',
          email_confidence: person.email_confidence,
          trigger_context: person.relevance,
          pipeline_stage: 'identified',
        } as any);
        if (newProspect) {
          // Fire-and-forget email enrichment — reveals email via Apollo credits only after save
          fetch('/portal/api/leadforge/enrich', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              prospect: { ...(newProspect as any), account: { company_name: result.company_name, domain: result.domain } },
            }),
          }).catch(() => {});
          // Fire-and-forget HubSpot sync
          fetch('/portal/api/leadforge/hubspot', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'sync_prospect',
              prospect: { ...(newProspect as any), account: { company_name: result.company_name, domain: result.domain } },
            }),
          }).catch(() => {});
        }
        added.add(person.full_name);
      }

      setAddedNames(added);
      setSelected(new Set());
    } catch (e: any) {
      setAddError(e.message ?? 'Failed to add some prospects.');
    } finally {
      setAdding(false);
    }
  };


  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--portal-text-primary)', margin: 0 }}>
          Prospect Lookup
        </h2>
        <p style={{ fontSize: 13, color: 'var(--portal-text-tertiary)', margin: '4px 0 0' }}>
          Enter a company name or stock ticker — Claude will identify senior HR &amp; People leaders and enrich their contact info.
        </p>
      </div>

      {/* Search bar */}
      <div style={{ display: 'flex', gap: 10 }}>
        <CompanyAutocomplete
          value={query}
          onChange={setQuery}
          onSelect={(org) => { setQuery(org.name); handleSearch(org.name); }}
          onSearch={() => handleSearch()}
          loading={loading}
        />
        <button
          onClick={() => handleSearch()}
          disabled={loading || !query.trim()}
          style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '12px 20px',
            border: 'none', borderRadius: 12, background: 'var(--portal-accent)', color: 'white',
            fontSize: 13, fontWeight: 600, cursor: loading ? 'default' : 'pointer',
            opacity: loading || !query.trim() ? 0.6 : 1,
          }}
        >
          {loading ? <Loader2 size={15} style={{ animation: 'spin 0.8s linear infinite' }} /> : <Search size={15} />}
          {loading ? 'Searching…' : 'Find People'}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10 }}>
          <AlertCircle size={15} color="#ef4444" />
          <p style={{ fontSize: 13, color: '#ef4444', margin: 0 }}>{error}</p>
        </div>
      )}

      {/* Results */}
      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Company header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', background: 'var(--portal-bg-secondary)', border: '1px solid var(--portal-border-default)', borderRadius: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--portal-accent-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Building2 size={18} color="var(--portal-accent)" />
              </div>
              <div>
                <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--portal-text-primary)', margin: 0 }}>{result.company_name}</p>
                <p style={{ fontSize: 12, color: 'var(--portal-text-tertiary)', margin: '2px 0 0' }}>
                  {[result.domain, result.headcount_estimate ? `~${result.headcount_estimate} employees` : null, result.email_pattern ? `Email: ${result.email_pattern}` : null].filter(Boolean).join(' · ')}
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span style={{ fontSize: 13, color: 'var(--portal-text-tertiary)' }}>{result.people.length} people found</span>
              <button
                onClick={selectAll}
                style={{ padding: '6px 14px', border: '1px solid var(--portal-border-accent)', borderRadius: 8, background: 'none', color: 'var(--portal-accent)', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
              >
                Select All
              </button>
            </div>
          </div>

          {/* People list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {result.people.map((person, i) => {
              const isSelected = selected.has(i);
              const isExpanded = expanded.has(i);
              const wasAdded = addedNames.has(person.full_name);

              return (
                <div
                  key={i}
                  style={{
                    background: 'var(--portal-bg-secondary)',
                    border: `1px solid ${isSelected ? 'var(--portal-border-accent)' : 'var(--portal-border-default)'}`,
                    borderRadius: 12,
                    overflow: 'hidden',
                    opacity: wasAdded ? 0.5 : 1,
                    transition: 'border-color 0.15s',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px' }}>
                    {/* Checkbox */}
                    <button
                      onClick={() => !wasAdded && toggleSelect(i)}
                      disabled={wasAdded}
                      style={{
                        width: 20, height: 20, borderRadius: 6, border: `2px solid ${isSelected ? 'var(--portal-accent)' : 'var(--portal-border-default)'}`,
                        background: isSelected ? 'var(--portal-accent)' : 'transparent',
                        cursor: wasAdded ? 'default' : 'pointer', flexShrink: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}
                    >
                      {isSelected && <span style={{ color: 'white', fontSize: 11, fontWeight: 800 }}>✓</span>}
                    </button>

                    {/* Name + title */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--portal-text-primary)', margin: 0 }}>
                          {person.full_name}
                        </p>
                        <SeniorityBadge level={person.seniority} />
                        {wasAdded && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 600, color: '#4ade80' }}>
                            <CheckCircle size={11} /> Added
                          </span>
                        )}
                      </div>
                      <p style={{ fontSize: 12, color: 'var(--portal-text-tertiary)', margin: '2px 0 0' }}>{person.title}</p>
                    </div>

                    {/* Contact hints */}
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
                      {person.email_guess ? (
                        <span style={{
                          fontSize: 11, fontFamily: 'monospace', padding: '3px 8px', borderRadius: 6,
                          color: person.email_confidence === 'verified' ? '#4ade80' : person.email_confidence === 'inferred' ? '#f59e0b' : 'var(--portal-text-tertiary)',
                          background: person.email_confidence === 'verified' ? 'rgba(74,222,128,0.08)' : person.email_confidence === 'inferred' ? 'rgba(245,158,11,0.08)' : 'var(--portal-bg-hover)',
                          border: `1px solid ${person.email_confidence === 'verified' ? 'rgba(74,222,128,0.2)' : person.email_confidence === 'inferred' ? 'rgba(245,158,11,0.2)' : 'var(--portal-border-default)'}`,
                        }}>
                          {person.email_guess}
                          <span style={{ marginLeft: 5, fontSize: 10, opacity: 0.8 }}>
                            {person.email_confidence === 'verified' ? '✓ verified' : person.email_confidence === 'inferred' ? '~ unverified' : '? unknown'}
                          </span>
                        </span>
                      ) : (
                        <span style={{ fontSize: 11, color: 'var(--portal-text-tertiary)', padding: '3px 8px', borderRadius: 6, border: '1px solid var(--portal-border-default)', opacity: 0.6 }}>
                          Email via enrich
                        </span>
                      )}
                      {person.linkedin_url ? (
                        <a href={person.linkedin_url} target="_blank" rel="noopener noreferrer"
                          style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#0a66c2', textDecoration: 'none', fontWeight: 700, background: 'rgba(10,102,194,0.08)', padding: '4px 10px', borderRadius: 6, border: '1px solid rgba(10,102,194,0.2)' }}>
                          <ExternalLink size={11} /> LinkedIn
                        </a>
                      ) : (
                        <span style={{ fontSize: 11, color: 'var(--portal-text-tertiary)', padding: '4px 10px', borderRadius: 6, border: '1px solid var(--portal-border-default)', opacity: 0.4 }}>
                          No LinkedIn
                        </span>
                      )}
                      <button
                        onClick={() => toggleExpand(i)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--portal-text-tertiary)', padding: 4 }}
                      >
                        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded relevance */}
                  {isExpanded && (
                    <div style={{ padding: '12px 16px 14px', borderTop: '1px solid var(--portal-border-default)' }}>
                      {person.relevance && (
                        <p style={{ fontSize: 12, color: 'var(--portal-text-secondary)', margin: '0 0 8px', lineHeight: 1.6 }}>
                          <strong style={{ color: 'var(--portal-text-primary)' }}>Why target: </strong>{person.relevance}
                        </p>
                      )}
                      {person.linkedin_url && (
                        <p style={{ fontSize: 11, color: 'var(--portal-text-tertiary)', margin: '0 0 6px', display: 'flex', alignItems: 'center', gap: 6 }}>
                          <strong style={{ color: 'var(--portal-text-secondary)' }}>LinkedIn:</strong>
                          <a href={person.linkedin_url} target="_blank" rel="noopener noreferrer"
                            style={{ color: '#0a66c2', textDecoration: 'none', fontFamily: 'monospace', fontSize: 11, wordBreak: 'break-all' }}>
                            {person.linkedin_url}
                          </a>
                        </p>
                      )}
                      {person.email_pattern && (
                        <p style={{ fontSize: 11, color: 'var(--portal-text-tertiary)', margin: '6px 0 0' }}>
                          Email pattern at {result.company_name}: <code style={{ background: 'var(--portal-bg-hover)', padding: '1px 6px', borderRadius: 4 }}>{person.email_pattern}</code>
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Add selected bar */}
          {(selected.size > 0 || addError) && (
            <div style={{
              position: 'sticky', bottom: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '14px 20px', background: 'var(--portal-bg-secondary)',
              border: '1px solid var(--portal-border-accent)', borderRadius: 14,
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            }}>
              <p style={{ fontSize: 13, color: 'var(--portal-text-primary)', margin: 0, fontWeight: 600 }}>
                {selected.size} prospect{selected.size !== 1 ? 's' : ''} selected
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {addError && <p style={{ fontSize: 12, color: '#ef4444', margin: 0 }}>{addError}</p>}
                <button
                  onClick={() => setSelected(new Set())}
                  style={{ padding: '8px 16px', border: '1px solid var(--portal-border-default)', borderRadius: 8, background: 'none', fontSize: 13, fontWeight: 600, color: 'var(--portal-text-secondary)', cursor: 'pointer' }}
                >
                  Clear
                </button>
                <button
                  onClick={handleAddSelected}
                  disabled={adding}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '8px 20px', border: 'none', borderRadius: 8,
                    background: 'var(--portal-accent)', color: 'white',
                    fontSize: 13, fontWeight: 600, cursor: adding ? 'default' : 'pointer',
                    opacity: adding ? 0.7 : 1,
                  }}
                >
                  {adding ? <Loader2 size={13} style={{ animation: 'spin 0.8s linear infinite' }} /> : <Plus size={13} />}
                  {adding ? 'Adding…' : `Add to Prospects`}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Empty / initial state */}
      {!result && !loading && !error && (
        <div style={{ textAlign: 'center', padding: '80px 0', background: 'var(--portal-bg-secondary)', border: '1px solid var(--portal-border-default)', borderRadius: 16 }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: 'var(--portal-accent-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <Search size={24} strokeWidth={1.5} color="var(--portal-accent)" />
          </div>
          <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--portal-text-primary)', margin: '0 0 6px' }}>Search any company</p>
          <p style={{ fontSize: 13, color: 'var(--portal-text-tertiary)', margin: 0, maxWidth: 340, marginInline: 'auto' }}>
            Claude will find CHROs, CPOs, and senior People &amp; HR leaders along with their contact info and why they&apos;re relevant to target.
          </p>
        </div>
      )}
    </div>
  );
}
