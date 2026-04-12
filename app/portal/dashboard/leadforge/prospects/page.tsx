'use client';

import { useState } from 'react';
import { Search, Plus, X, ChevronUp, ChevronDown, Mail, ExternalLink, MoreHorizontal, Clock, Zap } from 'lucide-react';
import { useProspects, useAccounts, type CreateProspectInput, type CreateAccountInput, type LeadForgeProspect } from '@/hooks/portal/useLeadForge';

const PIPELINE_STAGES = [
  { id: 'identified', label: 'Identified', color: '#94a3b8', bg: 'rgba(148,163,184,0.1)' },
  { id: 'researched', label: 'Researched', color: '#6366f1', bg: 'rgba(99,102,241,0.1)' },
  { id: 'warming', label: 'Warming', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  { id: 'outreach', label: 'Outreach', color: '#f97316', bg: 'rgba(249,115,22,0.1)' },
  { id: 'engaged', label: 'Engaged', color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
  { id: 'qualified', label: 'Qualified', color: '#22c55e', bg: 'rgba(34,197,94,0.1)' },
  { id: 'proposal', label: 'Proposal', color: '#4ade80', bg: 'rgba(74,222,128,0.1)' },
  { id: 'client', label: 'Client', color: '#5dab79', bg: 'rgba(93,171,121,0.15)' },
];

const WARMTH = [
  { id: 'cold', label: 'Cold', color: '#94a3b8' },
  { id: 'warm', label: 'Warm', color: '#f59e0b' },
  { id: 'hot', label: 'Hot', color: '#ef4444' },
];

function IcpBadge({ score }: { score: number }) {
  const color = score >= 80 ? '#4ade80' : score >= 60 ? '#f59e0b' : '#ef4444';
  const bg = score >= 80 ? 'rgba(74,222,128,0.1)' : score >= 60 ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)';
  return <span style={{ background: bg, color, fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 999 }}>ICP {score}</span>;
}

function StagePill({ stage }: { stage: string }) {
  const s = PIPELINE_STAGES.find(p => p.id === stage) ?? PIPELINE_STAGES[0];
  return <span style={{ background: s.bg, color: s.color, fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 999 }}>{s.label}</span>;
}

function WarmthDot({ warmth }: { warmth?: string }) {
  const w = WARMTH.find(x => x.id === warmth) ?? WARMTH[0];
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: w.color }}>
      <span style={{ width: 7, height: 7, borderRadius: '50%', background: w.color, display: 'inline-block' }} />
      {w.label}
    </span>
  );
}

function EmailConfidenceBadge({ confidence }: { confidence?: string }) {
  if (!confidence || confidence === 'unknown') return <span style={{ fontSize: 11, color: 'var(--portal-text-tertiary)' }}>—</span>;
  const color = confidence === 'verified' ? '#4ade80' : '#f59e0b';
  return <span style={{ fontSize: 10, color, fontWeight: 600, textTransform: 'capitalize' as const }}>{confidence}</span>;
}

type SortField = 'icp_score' | 'full_name' | 'last_activity_at' | 'pipeline_stage' | 'warmth_score';
type SortDir = 'asc' | 'desc';

function SortIcon({ field, current, dir }: { field: SortField; current: SortField; dir: SortDir }) {
  if (field !== current) return <ChevronDown size={12} style={{ opacity: 0.3 }} />;
  return dir === 'asc' ? <ChevronUp size={12} color="var(--portal-accent)" /> : <ChevronDown size={12} color="var(--portal-accent)" />;
}

function AddProspectModal({ onClose, onSave }: { onClose: () => void; onSave: (p: CreateProspectInput, a?: CreateAccountInput) => Promise<void> }) {
  const [form, setForm] = useState<CreateProspectInput & { warmth_score?: string; pipeline_stage?: string; next_action?: string; trigger_context?: string }>({
    full_name: '', title: '', email: '', linkedin_url: '', icp_score: 50, stage: 'awareness',
    notes: '', warmth_score: 'cold', pipeline_stage: 'identified',
  });
  const [companyName, setCompanyName] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handle = async () => {
    if (!form.full_name.trim()) { setError('Full name is required.'); return; }
    setSaving(true);
    try {
      await onSave(form as any, companyName.trim() ? { company_name: companyName.trim() } : undefined);
      onClose();
    } catch (e: any) {
      setError(e.message ?? 'Failed to save.');
      setSaving(false);
    }
  };

  const inputStyle = { width: '100%', padding: '10px 14px', border: '1px solid var(--portal-border-default)', borderRadius: 10, fontSize: 13, color: 'var(--portal-text-primary)', background: 'var(--portal-bg-hover)', outline: 'none', boxSizing: 'border-box' as const };
  const labelStyle: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: 'var(--portal-text-secondary)', display: 'block', marginBottom: 6 };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ background: 'var(--portal-bg-secondary)', borderRadius: 20, padding: 32, width: '100%', maxWidth: 560, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--portal-text-primary)', margin: 0 }}>Add Prospect</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--portal-text-tertiary)', padding: 4 }}><X size={18} /></button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Identity */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Full Name *</label>
              <input style={inputStyle} value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} placeholder="Jane Smith" />
            </div>
            <div>
              <label style={labelStyle}>Title</label>
              <input style={inputStyle} value={form.title ?? ''} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="CHRO" />
            </div>
            <div>
              <label style={labelStyle}>Company</label>
              <input style={inputStyle} value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder="Acme Corp" />
            </div>
          </div>

          {/* Contact */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={labelStyle}>Email</label>
              <input style={inputStyle} type="email" value={form.email ?? ''} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="jane@acme.com" />
            </div>
            <div>
              <label style={labelStyle}>LinkedIn URL</label>
              <input style={inputStyle} value={form.linkedin_url ?? ''} onChange={e => setForm(f => ({ ...f, linkedin_url: e.target.value }))} placeholder="linkedin.com/in/..." />
            </div>
          </div>

          {/* Scoring */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <div>
              <label style={labelStyle}>ICP Score (0–100)</label>
              <input style={inputStyle} type="number" min={0} max={100} value={form.icp_score ?? 50} onChange={e => setForm(f => ({ ...f, icp_score: parseInt(e.target.value) || 0 }))} />
            </div>
            <div>
              <label style={labelStyle}>Pipeline Stage</label>
              <select style={{ ...inputStyle, cursor: 'pointer' }} value={(form as any).pipeline_stage ?? 'identified'} onChange={e => setForm(f => ({ ...f, pipeline_stage: e.target.value } as any))}>
                {PIPELINE_STAGES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Warmth</label>
              <select style={{ ...inputStyle, cursor: 'pointer' }} value={(form as any).warmth_score ?? 'cold'} onChange={e => setForm(f => ({ ...f, warmth_score: e.target.value } as any))}>
                {WARMTH.map(w => <option key={w.id} value={w.id}>{w.label}</option>)}
              </select>
            </div>
          </div>

          {/* Intel */}
          <div>
            <label style={labelStyle}>Why Target (trigger context)</label>
            <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: 60 }} value={(form as any).trigger_context ?? ''} onChange={e => setForm(f => ({ ...f, trigger_context: e.target.value } as any))} placeholder="New CHRO since March 2024, building her leadership team…" />
          </div>
          <div>
            <label style={labelStyle}>Next Action</label>
            <input style={inputStyle} value={(form as any).next_action ?? ''} onChange={e => setForm(f => ({ ...f, next_action: e.target.value } as any))} placeholder="Send micro-research brief on Day 90" />
          </div>
          <div>
            <label style={labelStyle}>Notes</label>
            <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: 60 }} value={form.notes ?? ''} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Context, connections, background…" />
          </div>

          {error && <p style={{ fontSize: 12, color: '#ef4444', margin: 0 }}>{error}</p>}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
            <button onClick={onClose} style={{ padding: '10px 20px', border: '1px solid var(--portal-border-default)', borderRadius: 10, background: 'none', fontSize: 13, fontWeight: 600, color: 'var(--portal-text-secondary)', cursor: 'pointer' }}>Cancel</button>
            <button onClick={handle} disabled={saving} style={{ padding: '10px 20px', border: 'none', borderRadius: 10, background: 'var(--portal-accent)', color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer', opacity: saving ? 0.6 : 1 }}>
              {saving ? 'Saving…' : 'Add Prospect'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Prospect Detail Drawer ─────────────────────────────────────────────────

function ProspectDrawer({ prospect, onClose, onUpdate }: { prospect: LeadForgeProspect; onClose: () => void; onUpdate: (id: string, updates: Partial<LeadForgeProspect>) => Promise<void> }) {
  const [editNote, setEditNote] = useState('');
  const [saving, setSaving] = useState(false);

  const p = prospect as any;

  const handleStageChange = async (pipeline_stage: string) => {
    setSaving(true);
    try { await onUpdate(prospect.id, { pipeline_stage } as any); } finally { setSaving(false); }
  };

  const handleWarmthChange = async (warmth_score: string) => {
    setSaving(true);
    try { await onUpdate(prospect.id, { warmth_score } as any); } finally { setSaving(false); }
  };

  const handleNextAction = async () => {
    if (!editNote.trim()) return;
    setSaving(true);
    try {
      await onUpdate(prospect.id, { next_action: editNote, notes: ((prospect.notes ?? '') + (prospect.notes ? '\n' : '') + editNote) } as any);
      setEditNote('');
    } finally { setSaving(false); }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex' }} onClick={onClose}>
      <div style={{ flex: 1, background: 'rgba(0,0,0,0.3)' }} />
      <div style={{ width: 420, background: 'var(--portal-bg-secondary)', height: '100%', overflowY: 'auto', padding: 28, boxShadow: '-20px 0 60px rgba(0,0,0,0.15)', display: 'flex', flexDirection: 'column', gap: 20 }} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: 'var(--portal-text-primary)', margin: '0 0 4px' }}>{prospect.full_name}</h2>
            <p style={{ fontSize: 13, color: 'var(--portal-text-tertiary)', margin: 0 }}>
              {prospect.title ?? '—'}{prospect.account ? ` · ${prospect.account.company_name}` : ''}
            </p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--portal-text-tertiary)', padding: 4 }}><X size={18} /></button>
        </div>

        {/* Scores */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <IcpBadge score={prospect.icp_score} />
          <WarmthDot warmth={p.warmth_score} />
          {p.enrichment_source === 'ai_lookup' && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#6366f1', fontWeight: 600 }}>
              <Zap size={10} /> AI Enriched
            </span>
          )}
        </div>

        {/* Stage selector */}
        <div>
          <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--portal-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 8px' }}>Pipeline Stage</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {PIPELINE_STAGES.map(s => {
              const active = (p.pipeline_stage ?? 'identified') === s.id;
              return (
                <button key={s.id} onClick={() => handleStageChange(s.id)} disabled={saving}
                  style={{ padding: '5px 12px', borderRadius: 8, border: `1px solid ${active ? s.color : 'var(--portal-border-default)'}`, background: active ? s.bg : 'transparent', color: active ? s.color : 'var(--portal-text-tertiary)', fontSize: 12, fontWeight: active ? 700 : 500, cursor: 'pointer' }}>
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Warmth */}
        <div>
          <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--portal-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 8px' }}>Relationship Warmth</p>
          <div style={{ display: 'flex', gap: 6 }}>
            {WARMTH.map(w => {
              const active = (p.warmth_score ?? 'cold') === w.id;
              return (
                <button key={w.id} onClick={() => handleWarmthChange(w.id)} disabled={saving}
                  style={{ padding: '5px 14px', borderRadius: 8, border: `1px solid ${active ? w.color : 'var(--portal-border-default)'}`, background: active ? `${w.color}18` : 'transparent', color: active ? w.color : 'var(--portal-text-tertiary)', fontSize: 12, fontWeight: active ? 700 : 500, cursor: 'pointer' }}>
                  {w.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Contact */}
        <div style={{ padding: '14px 16px', background: 'var(--portal-bg-hover)', borderRadius: 12 }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--portal-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 10px' }}>Contact</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {prospect.email && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Mail size={12} color="var(--portal-text-tertiary)" />
                  <span style={{ fontSize: 12, color: 'var(--portal-text-primary)', fontFamily: 'monospace' }}>{prospect.email}</span>
                </div>
                <EmailConfidenceBadge confidence={p.email_confidence} />
              </div>
            )}
            {prospect.linkedin_url && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <ExternalLink size={12} color="var(--portal-text-tertiary)" />
                <a href={prospect.linkedin_url} target="_blank" rel="noopener noreferrer"
                  style={{ fontSize: 12, color: 'var(--portal-accent)', textDecoration: 'none' }}>
                  View LinkedIn
                </a>
              </div>
            )}
            {!prospect.email && !prospect.linkedin_url && (
              <p style={{ fontSize: 12, color: 'var(--portal-text-tertiary)', margin: 0 }}>No contact info yet</p>
            )}
          </div>
        </div>

        {/* Trigger context */}
        {p.trigger_context && (
          <div style={{ padding: '12px 14px', background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 10 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 4px' }}>Why Target</p>
            <p style={{ fontSize: 12, color: 'var(--portal-text-secondary)', margin: 0, lineHeight: 1.5 }}>{p.trigger_context}</p>
          </div>
        )}

        {/* Next action */}
        {p.next_action && (
          <div style={{ padding: '12px 14px', background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 10 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 4px' }}>Next Action</p>
            <p style={{ fontSize: 12, color: 'var(--portal-text-secondary)', margin: 0 }}>{p.next_action}</p>
          </div>
        )}

        {/* Notes */}
        {prospect.notes && (
          <div>
            <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--portal-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 6px' }}>Notes</p>
            <p style={{ fontSize: 12, color: 'var(--portal-text-secondary)', margin: 0, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{prospect.notes}</p>
          </div>
        )}

        {/* Add note / next action */}
        <div>
          <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--portal-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 6px' }}>Log Activity / Update Next Action</p>
          <textarea
            value={editNote}
            onChange={e => setEditNote(e.target.value)}
            placeholder="What happened? What's the next step?"
            style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--portal-border-default)', borderRadius: 10, fontSize: 12, color: 'var(--portal-text-primary)', background: 'var(--portal-bg-hover)', outline: 'none', resize: 'vertical', minHeight: 80, boxSizing: 'border-box' }}
          />
          <button onClick={handleNextAction} disabled={saving || !editNote.trim()}
            style={{ marginTop: 8, padding: '8px 16px', border: 'none', borderRadius: 8, background: 'var(--portal-accent)', color: 'white', fontSize: 12, fontWeight: 600, cursor: 'pointer', opacity: !editNote.trim() ? 0.5 : 1 }}>
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────

export default function ProspectsPage() {
  const { prospects, loading, createProspect, updateProspect } = useProspects();
  const { createAccount } = useAccounts();
  const [search, setSearch] = useState('');
  const [filterScore, setFilterScore] = useState('all');
  const [filterStage, setFilterStage] = useState('all');
  const [filterWarmth, setFilterWarmth] = useState('all');
  const [sortField, setSortField] = useState<SortField>('icp_score');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [showModal, setShowModal] = useState(false);
  const [drawerProspect, setDrawerProspect] = useState<LeadForgeProspect | null>(null);

  const handleSave = async (input: CreateProspectInput, accountInput?: CreateAccountInput) => {
    let account_id: string | undefined;
    if (accountInput) {
      const acct = await createAccount(accountInput);
      account_id = (acct as any).id;
    }
    await createProspect({ ...input, account_id });
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  const filtered = prospects
    .filter(p => {
      const q = search.toLowerCase();
      const matchSearch = !q || p.full_name.toLowerCase().includes(q) || (p.title ?? '').toLowerCase().includes(q) || (p.account?.company_name ?? '').toLowerCase().includes(q);
      const matchScore = filterScore === 'all' ? true : filterScore === '80+' ? p.icp_score >= 80 : filterScore === '60-79' ? p.icp_score >= 60 && p.icp_score < 80 : p.icp_score < 60;
      const matchStage = filterStage === 'all' || (p as any).pipeline_stage === filterStage || p.stage === filterStage;
      const matchWarmth = filterWarmth === 'all' || (p as any).warmth_score === filterWarmth;
      return matchSearch && matchScore && matchStage && matchWarmth;
    })
    .sort((a, b) => {
      let av: any, bv: any;
      if (sortField === 'icp_score') { av = a.icp_score; bv = b.icp_score; }
      else if (sortField === 'full_name') { av = a.full_name; bv = b.full_name; }
      else if (sortField === 'last_activity_at') { av = (a as any).last_activity_at ?? a.created_at; bv = (b as any).last_activity_at ?? b.created_at; }
      else if (sortField === 'pipeline_stage') { av = PIPELINE_STAGES.findIndex(s => s.id === (a as any).pipeline_stage); bv = PIPELINE_STAGES.findIndex(s => s.id === (b as any).pipeline_stage); }
      else if (sortField === 'warmth_score') { av = WARMTH.findIndex(w => w.id === (a as any).warmth_score); bv = WARMTH.findIndex(w => w.id === (b as any).warmth_score); }
      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

  const selectStyle: React.CSSProperties = { padding: '8px 12px', border: '1px solid var(--portal-border-default)', borderRadius: 10, fontSize: 13, color: 'var(--portal-text-secondary)', background: 'var(--portal-bg-secondary)', cursor: 'pointer', outline: 'none' };

  const thStyle: React.CSSProperties = { padding: '10px 14px', fontSize: 11, fontWeight: 600, color: 'var(--portal-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.07em', textAlign: 'left', userSelect: 'none' as const, whiteSpace: 'nowrap' };
  const thClickable: React.CSSProperties = { ...thStyle, cursor: 'pointer' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: 'var(--portal-text-primary)', margin: 0 }}>All Prospects</h1>
          <p style={{ fontSize: 13, color: 'var(--portal-text-tertiary)', margin: '3px 0 0' }}>
            {prospects.length} prospect{prospects.length !== 1 ? 's' : ''} · {filtered.length} shown
          </p>
        </div>
        <button onClick={() => setShowModal(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px', border: 'none', borderRadius: 10, background: 'var(--portal-accent)', color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
          <Plus size={15} strokeWidth={2} /> Add Manually
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Search size={14} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--portal-text-tertiary)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name, title, company…"
            style={{ width: '100%', padding: '8px 12px 8px 32px', border: '1px solid var(--portal-border-default)', borderRadius: 10, fontSize: 13, color: 'var(--portal-text-primary)', background: 'var(--portal-bg-secondary)', outline: 'none', boxSizing: 'border-box' }} />
        </div>
        <select value={filterStage} onChange={e => setFilterStage(e.target.value)} style={selectStyle}>
          <option value="all">All Stages</option>
          {PIPELINE_STAGES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
        </select>
        <select value={filterWarmth} onChange={e => setFilterWarmth(e.target.value)} style={selectStyle}>
          <option value="all">All Warmth</option>
          {WARMTH.map(w => <option key={w.id} value={w.id}>{w.label}</option>)}
        </select>
        <select value={filterScore} onChange={e => setFilterScore(e.target.value)} style={selectStyle}>
          <option value="all">All ICP Scores</option>
          <option value="80+">80+ High</option>
          <option value="60-79">60–79 Medium</option>
          <option value="<60">Below 60</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', border: '2px solid var(--portal-accent)', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 0', background: 'var(--portal-bg-secondary)', border: '1px solid var(--portal-border-default)', borderRadius: 16 }}>
          <Search size={24} strokeWidth={1.5} color="var(--portal-accent)" style={{ margin: '0 auto 12px', display: 'block' }} />
          <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--portal-text-primary)', margin: '0 0 4px' }}>
            {prospects.length === 0 ? 'No prospects yet' : 'No matches'}
          </p>
          <p style={{ fontSize: 13, color: 'var(--portal-text-tertiary)', margin: 0 }}>
            {prospects.length === 0 ? 'Use AI Lookup to find prospects or add manually.' : 'Try adjusting your filters.'}
          </p>
        </div>
      ) : (
        <div style={{ background: 'var(--portal-bg-secondary)', border: '1px solid var(--portal-border-default)', borderRadius: 14, overflow: 'hidden' }}>
          {/* Table header */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 1fr 1fr 1fr 100px', borderBottom: '1px solid var(--portal-border-default)', background: 'var(--portal-bg-hover)' }}>
            <div style={thStyle}>Prospect</div>
            <div style={thClickable} onClick={() => handleSort('pipeline_stage')}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>Stage <SortIcon field="pipeline_stage" current={sortField} dir={sortDir} /></span>
            </div>
            <div style={thClickable} onClick={() => handleSort('icp_score')}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>ICP <SortIcon field="icp_score" current={sortField} dir={sortDir} /></span>
            </div>
            <div style={thClickable} onClick={() => handleSort('warmth_score')}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>Warmth <SortIcon field="warmth_score" current={sortField} dir={sortDir} /></span>
            </div>
            <div style={thClickable} onClick={() => handleSort('last_activity_at')}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>Last Activity <SortIcon field="last_activity_at" current={sortField} dir={sortDir} /></span>
            </div>
            <div style={thStyle}>Actions</div>
          </div>

          {/* Rows */}
          {filtered.map(p => {
            const pa = p as any;
            const lastActivity = pa.last_activity_at ?? p.created_at;
            const daysSince = Math.floor((Date.now() - new Date(lastActivity).getTime()) / (1000 * 60 * 60 * 24));
            const isStale = daysSince > 14;

            return (
              <div key={p.id}
                onClick={() => setDrawerProspect(p)}
                style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 1fr 1fr 1fr 100px', padding: '0', borderBottom: '1px solid var(--portal-border-default)', cursor: 'pointer', transition: 'background 0.1s' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--portal-bg-hover)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                {/* Name */}
                <div style={{ padding: '13px 14px' }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--portal-text-primary)', margin: 0 }}>{p.full_name}</p>
                  <p style={{ fontSize: 11, color: 'var(--portal-text-tertiary)', margin: '2px 0 0' }}>
                    {p.title ?? '—'}{p.account ? ` · ${p.account.company_name}` : ''}
                  </p>
                  {pa.enrichment_source === 'ai_lookup' && (
                    <span style={{ fontSize: 10, color: '#6366f1', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 3, marginTop: 3 }}>
                      <Zap size={9} /> AI Enriched
                    </span>
                  )}
                </div>

                {/* Stage */}
                <div style={{ padding: '13px 14px', display: 'flex', alignItems: 'center' }}>
                  <StagePill stage={pa.pipeline_stage ?? p.stage ?? 'identified'} />
                </div>

                {/* ICP */}
                <div style={{ padding: '13px 14px', display: 'flex', alignItems: 'center' }}>
                  <IcpBadge score={p.icp_score} />
                </div>

                {/* Warmth */}
                <div style={{ padding: '13px 14px', display: 'flex', alignItems: 'center' }}>
                  <WarmthDot warmth={pa.warmth_score} />
                </div>

                {/* Last activity */}
                <div style={{ padding: '13px 14px', display: 'flex', alignItems: 'center' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: isStale ? '#ef4444' : 'var(--portal-text-tertiary)' }}>
                    <Clock size={11} />
                    {daysSince === 0 ? 'Today' : `${daysSince}d ago`}
                    {isStale && <span style={{ color: '#ef4444', fontWeight: 700 }}>!</span>}
                  </span>
                </div>

                {/* Actions */}
                <div style={{ padding: '13px 14px', display: 'flex', alignItems: 'center', gap: 8 }} onClick={e => e.stopPropagation()}>
                  {p.email && (
                    <a href={`mailto:${p.email}`} title="Email" style={{ color: 'var(--portal-text-tertiary)', display: 'flex' }}>
                      <Mail size={14} />
                    </a>
                  )}
                  {p.linkedin_url && (
                    <a href={p.linkedin_url} target="_blank" rel="noopener noreferrer" title="LinkedIn" style={{ color: 'var(--portal-text-tertiary)', display: 'flex' }}>
                      <ExternalLink size={14} />
                    </a>
                  )}
                  <button onClick={() => setDrawerProspect(p)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--portal-text-tertiary)', display: 'flex', padding: 0 }}>
                    <MoreHorizontal size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showModal && <AddProspectModal onClose={() => setShowModal(false)} onSave={handleSave} />}
      {drawerProspect && (
        <ProspectDrawer
          prospect={drawerProspect}
          onClose={() => setDrawerProspect(null)}
          onUpdate={updateProspect}
        />
      )}
    </div>
  );
}
