'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, Building2, ExternalLink, Users, Zap, TrendingUp,
  Edit2, Check, X, Sparkles, AlertTriangle, Search, Newspaper,
} from 'lucide-react';
import { createPortalClient } from '@/lib/portal/supabase';
import {
  useAccounts, useProspects, useTriggerEvents,
  type LeadForgeAccount, type LeadForgeProspect, type LeadForgeTriggerEvent,
} from '@/hooks/portal/useLeadForge';

const PIPELINE_STAGES: Record<string, { label: string; color: string }> = {
  identified:  { label: 'Identified',  color: '#94a3b8' },
  researched:  { label: 'Researched',  color: '#6366f1' },
  warming:     { label: 'Warming',     color: '#f59e0b' },
  outreach:    { label: 'Outreach',    color: '#f97316' },
  engaged:     { label: 'Engaged',     color: '#8b5cf6' },
  qualified:   { label: 'Qualified',   color: '#22c55e' },
  proposal:    { label: 'Proposal',    color: '#4ade80' },
  client:      { label: 'Client',      color: '#5dab79' },
};

const PRIORITY_CONFIG: Record<string, { color: string; bg: string }> = {
  critical: { color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
  high:     { color: '#f97316', bg: 'rgba(249,115,22,0.1)' },
  medium:   { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
};

const EVENT_TYPE_LABELS: Record<string, string> = {
  executive_move: 'Executive Move',
  organizational: 'Org Change',
  ma:             'M&A',
  culture_signal: 'Culture Signal',
  growth_signal:  'Growth Signal',
  ai_signal:      'AI Signal',
  news_signal:    'News Signal',
  inbound_lead:   'Inbound Lead',
};

const inputStyle = {
  width: '100%', padding: '9px 12px',
  border: '1px solid var(--portal-border-default)', borderRadius: 8,
  fontSize: 13, color: 'var(--portal-text-primary)',
  background: 'var(--portal-bg-hover)', outline: 'none',
  boxSizing: 'border-box' as const,
};

// ── Editable field ──────────────────────────────────────────────
function EditableField({ label, value, onSave, type = 'text', placeholder }: {
  label: string; value: string | null; onSave: (v: string) => Promise<void>;
  type?: string; placeholder?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value ?? '');
  const [saving, setSaving] = useState(false);

  const commit = async () => {
    setSaving(true);
    try { await onSave(draft); setEditing(false); } finally { setSaving(false); }
  };

  return (
    <div>
      <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--portal-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 4px' }}>{label}</p>
      {editing ? (
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <input style={{ ...inputStyle, flex: 1 }} type={type} value={draft} onChange={e => setDraft(e.target.value)} autoFocus onKeyDown={e => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') setEditing(false); }} />
          <button onClick={commit} disabled={saving} style={{ padding: '7px 10px', border: 'none', borderRadius: 7, background: 'var(--portal-accent)', color: 'white', cursor: 'pointer', display: 'flex' }}><Check size={13} /></button>
          <button onClick={() => setEditing(false)} style={{ padding: '7px 10px', border: '1px solid var(--portal-border-default)', borderRadius: 7, background: 'none', color: 'var(--portal-text-tertiary)', cursor: 'pointer', display: 'flex' }}><X size={13} /></button>
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <p style={{ fontSize: 14, color: value ? 'var(--portal-text-primary)' : 'var(--portal-text-tertiary)', margin: 0 }}>{value || placeholder || '—'}</p>
          <button onClick={() => { setDraft(value ?? ''); setEditing(true); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--portal-text-tertiary)', padding: 2, opacity: 0.5, display: 'flex' }}><Edit2 size={12} /></button>
        </div>
      )}
    </div>
  );
}

// ── Main page ───────────────────────────────────────────────────
export default function AccountDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const supabase = createPortalClient();

  const { accounts, updateAccount } = useAccounts();
  const { prospects } = useProspects();
  const { events } = useTriggerEvents();

  const account = accounts.find(a => a.id === id) ?? null;
  const accountProspects = prospects.filter(p => (p as any).account_id === id);
  const accountEvents = events.filter(e => (e as any).account_id === id);

  const [enriching, setEnriching] = useState(false);
  const [enrichError, setEnrichError] = useState<string | null>(null);
  const [enrichDone, setEnrichDone] = useState(false);

  const [scanningNews, setScanningNews] = useState(false);
  const [newsScanError, setNewsScanError] = useState<string | null>(null);
  const [newsScanCount, setNewsScanCount] = useState<number | null>(null);

  const runEnrichment = useCallback(async () => {
    if (!account) return;
    setEnriching(true);
    setEnrichError(null);
    try {
      const res = await fetch('/portal/api/leadforge/enrich-company', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain: account.domain, company_name: account.company_name }),
      });
      const data = await res.json();
      if (data.found) {
        const updates: Record<string, any> = {};
        if (!account.industry && data.industry) updates.industry = data.industry;
        if (!account.headcount && data.headcount) updates.headcount = data.headcount;
        if (!account.domain && data.domain) updates.domain = data.domain;
        if (!(account as any).hq_location && data.hq_location) updates.hq_location = data.hq_location;
        if (!(account as any).key_challenges && data.key_challenges) updates.key_challenges = data.key_challenges;
        if (Object.keys(updates).length > 0) {
          await updateAccount(id, updates);
        }
        setEnrichDone(true);
      } else {
        setEnrichError('Could not find data for this company.');
      }
    } catch (err: any) {
      setEnrichError(err.message ?? 'Enrichment failed.');
    } finally {
      setEnriching(false);
    }
  }, [account, id, updateAccount]);

  const runNewsScan = useCallback(async () => {
    if (!account) return;
    setScanningNews(true);
    setNewsScanError(null);
    setNewsScanCount(null);
    try {
      const res = await fetch('/portal/api/leadforge/news-enrich', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ account_id: id, company_name: account.company_name }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'News scan failed.');
      setNewsScanCount(data.count ?? 0);
    } catch (err: any) {
      setNewsScanError(err.message ?? 'News scan failed.');
    } finally {
      setScanningNews(false);
    }
  }, [account, id]);

  // Auto-enrich on first load if missing industry or headcount
  useEffect(() => {
    if (account && !enrichDone && !account.industry && !account.headcount) {
      runEnrichment();
    }
  }, [account?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!account) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
        <div style={{ width: 28, height: 28, borderRadius: '50%', border: '2px solid var(--portal-accent)', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
      </div>
    );
  }

  const save = (field: string) => async (value: string) => {
    await updateAccount(id, { [field]: value || undefined } as any);
  };

  const pendingEvents = accountEvents.filter(e => e.response_status === 'pending').length;
  const hotCount = accountProspects.filter(p => (p as any).warmth_score === 'hot').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Back nav */}
      <div>
        <Link href="/portal/dashboard/leadforge/accounts" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--portal-text-tertiary)', textDecoration: 'none' }}>
          <ArrowLeft size={14} /> All Accounts
        </Link>
      </div>

      {/* Header */}
      <div style={{ background: 'var(--portal-bg-secondary)', border: '1px solid var(--portal-border-default)', borderRadius: 16, padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: 'var(--portal-accent-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Building2 size={22} color="var(--portal-accent)" strokeWidth={1.8} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 4 }}>
              <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--portal-text-primary)', margin: 0 }}>{account.company_name}</h1>
              {pendingEvents > 0 && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 700, color: '#f59e0b', background: 'rgba(245,158,11,0.1)', padding: '3px 10px', borderRadius: 999 }}>
                  <AlertTriangle size={11} /> {pendingEvents} trigger{pendingEvents > 1 ? 's' : ''}
                </span>
              )}
            </div>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
              {account.domain && (
                <a href={`https://${account.domain}`} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: 'var(--portal-accent)', textDecoration: 'none' }}>
                  <ExternalLink size={12} /> {account.domain}
                </a>
              )}
              {enriching && <span style={{ fontSize: 12, color: 'var(--portal-text-tertiary)' }}>Enriching…</span>}
              {enrichError && <span style={{ fontSize: 12, color: '#f59e0b' }}>{enrichError}</span>}
              {enrichDone && !enriching && <span style={{ fontSize: 12, color: '#4ade80', display: 'flex', alignItems: 'center', gap: 4 }}><Check size={11} /> Enriched</span>}
              {!enriching && !enrichDone && (
                <button onClick={runEnrichment} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 12px', border: '1px solid var(--portal-border-default)', borderRadius: 7, background: 'none', fontSize: 12, color: 'var(--portal-text-secondary)', cursor: 'pointer' }}>
                  <Sparkles size={11} /> Enrich
                </button>
              )}
              {/* News scan */}
              {scanningNews && <span style={{ fontSize: 12, color: 'var(--portal-text-tertiary)' }}>Scanning news…</span>}
              {newsScanError && <span style={{ fontSize: 12, color: '#f59e0b' }}>{newsScanError}</span>}
              {newsScanCount !== null && !scanningNews && (
                <span style={{ fontSize: 12, color: '#4ade80', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Check size={11} /> {newsScanCount} signal{newsScanCount !== 1 ? 's' : ''} found
                </span>
              )}
              {!scanningNews && newsScanCount === null && (
                <button onClick={runNewsScan} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 12px', border: '1px solid var(--portal-border-default)', borderRadius: 7, background: 'none', fontSize: 12, color: 'var(--portal-text-secondary)', cursor: 'pointer' }}>
                  <Newspaper size={11} /> Scan News
                </button>
              )}
            </div>
          </div>

          {/* Quick stats */}
          <div style={{ display: 'flex', gap: 20, flexShrink: 0 }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 24, fontWeight: 800, color: 'var(--portal-text-primary)', margin: 0, lineHeight: 1 }}>{accountProspects.length}</p>
              <p style={{ fontSize: 10, color: 'var(--portal-text-tertiary)', margin: '3px 0 0' }}>Prospects</p>
            </div>
            {hotCount > 0 && (
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: 24, fontWeight: 800, color: '#ef4444', margin: 0, lineHeight: 1 }}>{hotCount}</p>
                <p style={{ fontSize: 10, color: 'var(--portal-text-tertiary)', margin: '3px 0 0' }}>Hot 🔥</p>
              </div>
            )}
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 24, fontWeight: 800, color: '#f59e0b', margin: 0, lineHeight: 1 }}>{pendingEvents}</p>
              <p style={{ fontSize: 10, color: 'var(--portal-text-tertiary)', margin: '3px 0 0' }}>Triggers</p>
            </div>
          </div>
        </div>

        {/* Editable fields */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 20, marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--portal-border-default)' }}>
          <EditableField label="Industry" value={account.industry} onSave={save('industry')} placeholder="e.g. Technology" />
          <EditableField label="Domain" value={account.domain} onSave={save('domain')} placeholder="e.g. 3m.com" />
          <EditableField label="Headcount" value={account.headcount ? account.headcount.toLocaleString() : null} onSave={async (v) => updateAccount(id, { headcount: parseInt(v) || undefined })} type="number" placeholder="e.g. 50000" />
          <EditableField label="HQ Location" value={account.hq_location} onSave={save('hq_location')} placeholder="e.g. Minneapolis, MN" />
          <EditableField label="ICP Fit" value={account.icp_fit} onSave={save('icp_fit')} placeholder="e.g. High" />
          <EditableField label="Key Challenges" value={account.key_challenges} onSave={save('key_challenges')} placeholder="e.g. Post-merger integration" />
        </div>
      </div>

      {/* Prospects */}
      <div style={{ background: 'var(--portal-bg-secondary)', border: '1px solid var(--portal-border-default)', borderRadius: 16, overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 20px', borderBottom: accountProspects.length > 0 ? '1px solid var(--portal-border-default)' : 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Users size={16} color="var(--portal-accent)" />
            <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--portal-text-primary)', margin: 0 }}>Prospects</h2>
            <span style={{ fontSize: 12, color: 'var(--portal-text-tertiary)' }}>{accountProspects.length}</span>
          </div>
          <Link
            href={`/portal/dashboard/leadforge/prospects/lookup?q=${encodeURIComponent(account.company_name)}`}
            style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 14px', border: 'none', borderRadius: 8, background: 'var(--portal-accent)', color: 'white', fontSize: 12, fontWeight: 600, textDecoration: 'none' }}>
            <Search size={12} /> Find Prospects
          </Link>
        </div>

        {accountProspects.length === 0 ? (
          <div style={{ padding: '32px 20px', textAlign: 'center' }}>
            <p style={{ fontSize: 13, color: 'var(--portal-text-tertiary)', margin: '0 0 12px' }}>No prospects linked to this account yet.</p>
            <Link
              href={`/portal/dashboard/leadforge/prospects/lookup?q=${encodeURIComponent(account.company_name)}`}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '8px 16px', border: 'none', borderRadius: 8, background: 'var(--portal-accent)', color: 'white', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
              <Search size={13} /> Run People Lookup
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {accountProspects.map((p, i) => {
              const stage = PIPELINE_STAGES[p.pipeline_stage ?? 'identified'];
              const warmthColor = (p as any).warmth_score === 'hot' ? '#ef4444' : (p as any).warmth_score === 'warm' ? '#f59e0b' : '#94a3b8';
              return (
                <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', borderTop: i > 0 ? '1px solid var(--portal-border-default)' : 'none' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: warmthColor, flexShrink: 0, display: 'inline-block' }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--portal-text-primary)', margin: 0 }}>{p.full_name}</p>
                    <p style={{ fontSize: 12, color: 'var(--portal-text-tertiary)', margin: '2px 0 0' }}>{p.title ?? '—'}</p>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: stage?.color ?? '#94a3b8' }}>{stage?.label ?? 'Identified'}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, padding: '2px 8px', borderRadius: 999,
                    background: p.icp_score >= 80 ? 'rgba(74,222,128,0.1)' : p.icp_score >= 60 ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)',
                    color: p.icp_score >= 80 ? '#4ade80' : p.icp_score >= 60 ? '#f59e0b' : '#ef4444' }}>
                    ICP {p.icp_score}
                  </span>
                  {p.email && (
                    <a href={`mailto:${p.email}`} style={{ fontSize: 12, color: 'var(--portal-accent)', textDecoration: 'none', flexShrink: 0 }}>{p.email}</a>
                  )}
                  {p.linkedin_url && (
                    <a href={p.linkedin_url} target="_blank" rel="noopener noreferrer"
                      style={{ fontSize: 12, color: 'var(--portal-text-tertiary)', textDecoration: 'none', flexShrink: 0, padding: '4px 10px', border: '1px solid var(--portal-border-default)', borderRadius: 6 }}>
                      LinkedIn
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Trigger Events */}
      <div style={{ background: 'var(--portal-bg-secondary)', border: '1px solid var(--portal-border-default)', borderRadius: 16, overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '18px 20px', borderBottom: accountEvents.length > 0 ? '1px solid var(--portal-border-default)' : 'none' }}>
          <Zap size={16} color="var(--portal-accent)" />
          <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--portal-text-primary)', margin: 0 }}>Trigger Events</h2>
          <span style={{ fontSize: 12, color: 'var(--portal-text-tertiary)' }}>{accountEvents.length}</span>
        </div>

        {accountEvents.length === 0 ? (
          <div style={{ padding: '24px 20px', textAlign: 'center' }}>
            <p style={{ fontSize: 13, color: 'var(--portal-text-tertiary)', margin: 0 }}>No trigger events yet.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {accountEvents.map((ev, i) => {
              const pConf = PRIORITY_CONFIG[ev.priority ?? ''] ?? { color: '#94a3b8', bg: 'rgba(148,163,184,0.1)' };
              return (
                <div key={ev.id} style={{ display: 'flex', gap: 12, padding: '14px 20px', borderTop: i > 0 ? '1px solid var(--portal-border-default)' : 'none', alignItems: 'flex-start' }}>
                  <Zap size={13} color={pConf.color} style={{ flexShrink: 0, marginTop: 2 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: 4 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 999, background: pConf.bg, color: pConf.color, textTransform: 'capitalize' }}>{ev.priority}</span>
                      <span style={{ fontSize: 12, color: 'var(--portal-text-secondary)' }}>{EVENT_TYPE_LABELS[ev.event_type ?? ''] ?? ev.event_type}</span>
                      <span style={{ fontSize: 11, color: 'var(--portal-text-tertiary)' }}>{new Date(ev.detected_at).toLocaleDateString()}</span>
                    </div>
                    <p style={{ fontSize: 13, color: 'var(--portal-text-secondary)', margin: 0, lineHeight: 1.5 }}>{ev.description}</p>
                    {ev.source_url && (
                      <a href={ev.source_url} target="_blank" rel="noopener noreferrer"
                        style={{ fontSize: 11, color: 'var(--portal-accent)', textDecoration: 'none', marginTop: 4, display: 'inline-block' }}>
                        View source →
                      </a>
                    )}
                  </div>
                  {ev.response_status === 'actioned' && (
                    <span style={{ fontSize: 11, fontWeight: 600, color: '#4ade80', flexShrink: 0 }}>✓ Actioned</span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
