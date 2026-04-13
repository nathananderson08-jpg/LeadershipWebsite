'use client';

import { useState } from 'react';
import { Building2, Users, Zap, TrendingUp, Plus, X, ChevronDown, ChevronUp, ExternalLink, AlertTriangle } from 'lucide-react';
import {
  useAccounts, useProspects, useTriggerEvents,
  type LeadForgeAccount, type CreateAccountInput,
} from '@/hooks/portal/useLeadForge';

const PIPELINE_STAGES = [
  { id: 'identified', label: 'Identified', color: '#94a3b8' },
  { id: 'researched', label: 'Researched', color: '#6366f1' },
  { id: 'warming',    label: 'Warming',    color: '#f59e0b' },
  { id: 'outreach',   label: 'Outreach',   color: '#f97316' },
  { id: 'engaged',    label: 'Engaged',    color: '#8b5cf6' },
  { id: 'qualified',  label: 'Qualified',  color: '#22c55e' },
  { id: 'proposal',   label: 'Proposal',   color: '#4ade80' },
  { id: 'client',     label: 'Client',     color: '#5dab79' },
];

const PRIORITY_CONFIG: Record<string, { color: string; bg: string }> = {
  critical: { color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
  high:     { color: '#f97316', bg: 'rgba(249,115,22,0.1)' },
  medium:   { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
};

const EVENT_TYPE_LABELS: Record<string, string> = {
  executive_move:  'Executive Move',
  organizational:  'Org Change',
  ma:              'M&A',
  culture_signal:  'Culture Signal',
  growth_signal:   'Growth Signal',
};

// ── Add Account Modal ───────────────────────────────────────────
function AddAccountModal({ onClose, onSave }: {
  onClose: () => void;
  onSave: (input: CreateAccountInput) => Promise<void>;
}) {
  const [form, setForm] = useState<CreateAccountInput>({ company_name: '' });
  const [saving, setSaving] = useState(false);
  const [enriching, setEnriching] = useState(false);
  const [enriched, setEnriched] = useState(false);
  const [error, setError] = useState('');

  const handle = async () => {
    if (!form.company_name.trim()) { setError('Company name is required.'); return; }
    setSaving(true);
    try {
      await onSave(form);
      onClose();
    } catch (e: any) {
      setError(e.message ?? 'Failed to save.');
      setSaving(false);
    }
  };

  const handleDomainBlur = async (domain: string) => {
    if (!domain.trim() || enriched) return;
    setEnriching(true);
    try {
      const res = await fetch('/portal/api/leadforge/enrich-company', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain: domain.trim() }),
      });
      if (!res.ok) return;
      const data = await res.json();
      if (data.found) {
        setForm(f => ({
          ...f,
          industry: f.industry || data.industry || f.industry,
          headcount: f.headcount || data.headcount || f.headcount,
        }));
        setEnriched(true);
      }
    } catch {
      // silent — enrichment is best-effort
    } finally {
      setEnriching(false);
    }
  };

  const inputStyle = { width: '100%', padding: '10px 14px', border: '1px solid var(--portal-border-default)', borderRadius: 10, fontSize: 13, color: 'var(--portal-text-primary)', background: 'var(--portal-bg-hover)', outline: 'none', boxSizing: 'border-box' as const };
  const labelStyle: React.CSSProperties = { fontSize: '12px', fontWeight: 600, color: 'var(--portal-text-secondary)', display: 'block', marginBottom: 6 };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ background: 'var(--portal-bg-secondary)', borderRadius: 20, padding: 32, width: '100%', maxWidth: 480, boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--portal-text-primary)', margin: 0 }}>Add Account</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--portal-text-tertiary)', padding: 4 }}><X size={18} /></button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={labelStyle}>Company Name *</label>
            <input style={inputStyle} value={form.company_name} onChange={e => setForm(f => ({ ...f, company_name: e.target.value }))} placeholder="e.g. Microsoft" autoFocus />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={labelStyle}>Industry {enriched && !enriching && <span style={{ color: 'var(--portal-accent)', fontWeight: 600 }}>· auto-filled</span>}</label>
              <input style={inputStyle} value={form.industry ?? ''} onChange={e => setForm(f => ({ ...f, industry: e.target.value || undefined }))} placeholder="Technology" />
            </div>
            <div>
              <label style={labelStyle}>HQ Location</label>
              <input style={inputStyle} value={form.hq_location ?? ''} onChange={e => setForm(f => ({ ...f, hq_location: e.target.value || undefined }))} placeholder="San Francisco, CA" />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={labelStyle}>
                Domain
                {enriching && <span style={{ color: 'var(--portal-text-tertiary)', fontWeight: 400 }}> · enriching…</span>}
              </label>
              <input
                style={inputStyle}
                value={form.domain ?? ''}
                onChange={e => { setEnriched(false); setForm(f => ({ ...f, domain: e.target.value || undefined })); }}
                onBlur={e => handleDomainBlur(e.target.value)}
                placeholder="microsoft.com"
              />
            </div>
            <div>
              <label style={labelStyle}>Headcount {enriched && !enriching && <span style={{ color: 'var(--portal-accent)', fontWeight: 600 }}>· auto-filled</span>}</label>
              <input style={inputStyle} type="number" value={form.headcount ?? ''} onChange={e => setForm(f => ({ ...f, headcount: e.target.value ? parseInt(e.target.value) : undefined }))} placeholder="50000" />
            </div>
          </div>
          {error && <p style={{ fontSize: 12, color: '#ef4444', margin: 0 }}>{error}</p>}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
            <button onClick={onClose} style={{ padding: '10px 20px', border: '1px solid var(--portal-border-default)', borderRadius: 10, background: 'none', fontSize: 13, fontWeight: 600, color: 'var(--portal-text-secondary)', cursor: 'pointer' }}>Cancel</button>
            <button onClick={handle} disabled={saving || enriching} style={{ padding: '10px 20px', border: 'none', borderRadius: 10, background: 'var(--portal-accent)', color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer', opacity: (saving || enriching) ? 0.6 : 1 }}>
              {saving ? 'Adding…' : 'Add Account'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Account Card ────────────────────────────────────────────────
function AccountCard({ account, prospectsForAccount, eventsForAccount }: {
  account: LeadForgeAccount;
  prospectsForAccount: any[];
  eventsForAccount: any[];
}) {
  const [expanded, setExpanded] = useState(false);

  // Stage breakdown
  const stageCounts: Record<string, number> = {};
  for (const p of prospectsForAccount) {
    const s = (p as any).pipeline_stage ?? 'identified';
    stageCounts[s] = (stageCounts[s] ?? 0) + 1;
  }
  const advancedCount = prospectsForAccount.filter(p => {
    const s = (p as any).pipeline_stage ?? 'identified';
    return ['outreach', 'engaged', 'qualified', 'proposal', 'client'].includes(s);
  }).length;

  const hotCount = prospectsForAccount.filter(p => (p as any).warmth_score === 'hot').length;
  const pendingEvents = eventsForAccount.filter(e => e.response_status === 'pending').length;

  const avgIcp = prospectsForAccount.length
    ? Math.round(prospectsForAccount.reduce((s, p) => s + (p.icp_score ?? 0), 0) / prospectsForAccount.length)
    : null;

  const icpColor = avgIcp != null ? (avgIcp >= 80 ? '#4ade80' : avgIcp >= 60 ? '#f59e0b' : '#ef4444') : '#94a3b8';
  const icpBg   = avgIcp != null ? (avgIcp >= 80 ? 'rgba(74,222,128,0.1)' : avgIcp >= 60 ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)') : 'rgba(148,163,184,0.1)';

  return (
    <div style={{ background: 'var(--portal-bg-secondary)', border: '1px solid var(--portal-border-default)', borderRadius: 16, overflow: 'hidden' }}>
      {/* Main row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '18px 20px' }}>
        {/* Icon */}
        <div style={{ width: 42, height: 42, borderRadius: 11, background: 'var(--portal-accent-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Building2 size={18} color="var(--portal-accent)" strokeWidth={1.8} />
        </div>

        {/* Company info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--portal-text-primary)', margin: 0 }}>{account.company_name}</p>
            {avgIcp != null && (
              <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 999, background: icpBg, color: icpColor }}>
                ICP {avgIcp}
              </span>
            )}
            {pendingEvents > 0 && (
              <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 11, fontWeight: 700, color: '#f59e0b' }}>
                <AlertTriangle size={10} /> {pendingEvents} trigger{pendingEvents > 1 ? 's' : ''}
              </span>
            )}
          </div>
          <p style={{ fontSize: 12, color: 'var(--portal-text-tertiary)', margin: '3px 0 0' }}>
            {[account.industry, account.hq_location, account.headcount ? `${account.headcount.toLocaleString()} employees` : null, account.domain].filter(Boolean).join(' · ')}
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 20, flexShrink: 0, alignItems: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 20, fontWeight: 800, color: 'var(--portal-text-primary)', margin: 0, lineHeight: 1 }}>{prospectsForAccount.length}</p>
            <p style={{ fontSize: 10, color: 'var(--portal-text-tertiary)', margin: '2px 0 0' }}>Prospects</p>
          </div>
          {hotCount > 0 && (
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 20, fontWeight: 800, color: '#ef4444', margin: 0, lineHeight: 1 }}>{hotCount}</p>
              <p style={{ fontSize: 10, color: 'var(--portal-text-tertiary)', margin: '2px 0 0' }}>Hot 🔥</p>
            </div>
          )}
          {prospectsForAccount.length > 0 && (
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 20, fontWeight: 800, color: '#22c55e', margin: 0, lineHeight: 1 }}>{advancedCount}</p>
              <p style={{ fontSize: 10, color: 'var(--portal-text-tertiary)', margin: '2px 0 0' }}>Active</p>
            </div>
          )}
          {account.domain && (
            <a href={`https://${account.domain}`} target="_blank" rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 12px', border: '1px solid var(--portal-border-default)', borderRadius: 8, fontSize: 12, color: 'var(--portal-text-tertiary)', textDecoration: 'none' }}>
              <ExternalLink size={12} /> Website
            </a>
          )}
          <button onClick={() => setExpanded(e => !e)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--portal-text-tertiary)', padding: 4 }}>
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {/* Stage pipeline bar */}
      {prospectsForAccount.length > 0 && (
        <div style={{ padding: '0 20px 14px', display: 'flex', gap: 4, alignItems: 'center' }}>
          {PIPELINE_STAGES.map(stage => {
            const count = stageCounts[stage.id] ?? 0;
            if (count === 0) return null;
            return (
              <div key={stage.id} title={`${stage.label}: ${count}`} style={{ flex: count, height: 5, borderRadius: 3, background: stage.color, minWidth: 4 }} />
            );
          })}
          <p style={{ fontSize: 10, color: 'var(--portal-text-tertiary)', margin: '0 0 0 8px', flexShrink: 0 }}>
            Pipeline
          </p>
        </div>
      )}

      {/* Expanded content */}
      {expanded && (
        <div style={{ borderTop: '1px solid var(--portal-border-default)' }}>
          {/* Prospects list */}
          {prospectsForAccount.length > 0 && (
            <div style={{ padding: '16px 20px' }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--portal-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 10px' }}>Prospects</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {prospectsForAccount.map((p: any) => {
                  const stage = PIPELINE_STAGES.find(s => s.id === (p.pipeline_stage ?? 'identified'));
                  const warmthColor = p.warmth_score === 'hot' ? '#ef4444' : p.warmth_score === 'warm' ? '#f59e0b' : '#94a3b8';
                  return (
                    <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: 'var(--portal-bg-hover)', borderRadius: 8 }}>
                      <span style={{ width: 7, height: 7, borderRadius: '50%', background: warmthColor, flexShrink: 0, display: 'inline-block' }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--portal-text-primary)', margin: 0 }}>{p.full_name}</p>
                        <p style={{ fontSize: 11, color: 'var(--portal-text-tertiary)', margin: '1px 0 0' }}>{p.title ?? '—'}</p>
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 600, color: stage?.color ?? '#94a3b8', flexShrink: 0 }}>{stage?.label}</span>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 7px', borderRadius: 999, background: p.icp_score >= 80 ? 'rgba(74,222,128,0.1)' : p.icp_score >= 60 ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)', color: p.icp_score >= 80 ? '#4ade80' : p.icp_score >= 60 ? '#f59e0b' : '#ef4444' }}>
                        {p.icp_score}
                      </span>
                      {p.email && (
                        <a href={`mailto:${p.email}`} style={{ fontSize: 11, color: 'var(--portal-accent)', textDecoration: 'none' }}>{p.email}</a>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Trigger events */}
          {eventsForAccount.length > 0 && (
            <div style={{ padding: '0 20px 16px', borderTop: prospectsForAccount.length > 0 ? '1px solid var(--portal-border-default)' : 'none' }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--portal-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.07em', margin: '12px 0 10px' }}>Trigger Events</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {eventsForAccount.map((ev: any) => {
                  const pConf = PRIORITY_CONFIG[ev.priority ?? ''] ?? { color: '#94a3b8', bg: 'rgba(148,163,184,0.1)' };
                  return (
                    <div key={ev.id} style={{ display: 'flex', gap: 10, padding: '8px 12px', background: 'var(--portal-bg-hover)', borderRadius: 8, alignItems: 'flex-start' }}>
                      <Zap size={12} color={pConf.color} style={{ flexShrink: 0, marginTop: 2 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: 2 }}>
                          <span style={{ fontSize: 11, fontWeight: 700, padding: '1px 7px', borderRadius: 999, background: pConf.bg, color: pConf.color, textTransform: 'capitalize' }}>{ev.priority}</span>
                          <span style={{ fontSize: 11, color: 'var(--portal-text-tertiary)' }}>{EVENT_TYPE_LABELS[ev.event_type] ?? ev.event_type}</span>
                          <span style={{ fontSize: 10, color: 'var(--portal-text-tertiary)' }}>{new Date(ev.detected_at).toLocaleDateString()}</span>
                        </div>
                        <p style={{ fontSize: 12, color: 'var(--portal-text-secondary)', margin: 0, lineHeight: 1.4 }}>{ev.description}</p>
                      </div>
                      {ev.response_status === 'actioned' && (
                        <span style={{ fontSize: 10, fontWeight: 600, color: '#4ade80', flexShrink: 0 }}>✓ Actioned</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {prospectsForAccount.length === 0 && eventsForAccount.length === 0 && (
            <div style={{ padding: '20px', textAlign: 'center' }}>
              <p style={{ fontSize: 13, color: 'var(--portal-text-tertiary)', margin: 0 }}>No prospects or trigger events linked to this account yet.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Main page ───────────────────────────────────────────────────
export default function AccountsPage() {
  const { accounts, loading: accountsLoading, createAccount } = useAccounts();
  const { prospects, loading: prospectsLoading } = useProspects();
  const { events, loading: eventsLoading } = useTriggerEvents();
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);

  const loading = accountsLoading || prospectsLoading || eventsLoading;

  const filtered = accounts.filter(a =>
    !search || a.company_name.toLowerCase().includes(search.toLowerCase()) ||
    (a.industry ?? '').toLowerCase().includes(search.toLowerCase())
  );

  // Sort: most prospects first
  const sorted = [...filtered].sort((a, b) => {
    const aCount = prospects.filter(p => p.account?.company_name === a.company_name || (p as any).account_id === a.id).length;
    const bCount = prospects.filter(p => p.account?.company_name === b.company_name || (p as any).account_id === b.id).length;
    return bCount - aCount;
  });

  const totalProspectsTracked = prospects.length;
  const accountsWithProspects = accounts.filter(a =>
    prospects.some(p => (p as any).account_id === a.id)
  ).length;
  const pendingTriggers = events.filter(e => e.response_status === 'pending').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--portal-text-primary)', margin: 0 }}>Target Accounts</h1>
          <p style={{ fontSize: 13, color: 'var(--portal-text-tertiary)', margin: '4px 0 0' }}>Company-level view of your pipeline and intelligence</p>
        </div>
        <button onClick={() => setShowModal(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px', border: 'none', borderRadius: 10, background: 'var(--portal-accent)', color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
          <Plus size={15} strokeWidth={2} /> Add Account
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 12 }}>
        {[
          { label: 'Total Accounts',     value: accounts.length,          icon: Building2  },
          { label: 'With Prospects',     value: accountsWithProspects,    icon: Users      },
          { label: 'Total Prospects',    value: totalProspectsTracked,    icon: TrendingUp },
          { label: 'Pending Triggers',   value: pendingTriggers,          icon: Zap        },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} style={{ flex: 1, padding: '14px 18px', background: 'var(--portal-bg-secondary)', border: '1px solid var(--portal-border-default)', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: 'var(--portal-accent-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon size={15} color="var(--portal-accent)" strokeWidth={1.8} />
            </div>
            <div>
              <p style={{ fontSize: 22, fontWeight: 800, color: 'var(--portal-text-primary)', margin: 0, lineHeight: 1 }}>{loading ? '—' : value}</p>
              <p style={{ fontSize: 11, color: 'var(--portal-text-tertiary)', margin: '3px 0 0' }}>{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search accounts by name or industry…"
        style={{ padding: '10px 16px', border: '1px solid var(--portal-border-default)', borderRadius: 10, fontSize: 13, color: 'var(--portal-text-primary)', background: 'var(--portal-bg-secondary)', outline: 'none', width: '100%', boxSizing: 'border-box' }}
      />

      {/* Account list */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', border: '2px solid var(--portal-accent)', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
        </div>
      ) : sorted.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 0', background: 'var(--portal-bg-secondary)', border: '1px solid var(--portal-border-default)', borderRadius: 16 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: 'var(--portal-accent-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <Building2 size={22} strokeWidth={1.8} color="var(--portal-accent)" />
          </div>
          <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--portal-text-primary)', margin: '0 0 6px' }}>No accounts yet</p>
          <p style={{ fontSize: 13, color: 'var(--portal-text-tertiary)', margin: '0 0 20px' }}>Accounts are created automatically when you add prospects, or add one manually.</p>
          <button onClick={() => setShowModal(true)} style={{ padding: '10px 20px', border: 'none', borderRadius: 10, background: 'var(--portal-accent)', color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            Add First Account
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {sorted.map(account => {
            const prospectsForAccount = prospects.filter(p => (p as any).account_id === account.id);
            const eventsForAccount = events.filter(e => (e as any).account_id === account.id);
            return (
              <AccountCard
                key={account.id}
                account={account}
                prospectsForAccount={prospectsForAccount}
                eventsForAccount={eventsForAccount}
              />
            );
          })}
        </div>
      )}

      {showModal && <AddAccountModal onClose={() => setShowModal(false)} onSave={createAccount} />}
    </div>
  );
}
