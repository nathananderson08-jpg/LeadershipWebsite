'use client';

import { useState } from 'react';
import { Search, Upload, Plus, X } from 'lucide-react';
import { useProspects, useAccounts, type CreateProspectInput, type CreateAccountInput } from '@/hooks/portal/useLeadForge';

const STAGES = ['awareness', 'value_delivery', 'outreach', 'conversion'] as const;
const STAGE_LABELS: Record<string, string> = {
  awareness: 'Awareness',
  value_delivery: 'Value Delivery',
  outreach: 'Outreach',
  conversion: 'Conversion',
};

function IcpBadge({ score }: { score: number }) {
  const color = score >= 80 ? '#4ade80' : score >= 60 ? '#f59e0b' : '#ef4444';
  const bg = score >= 80 ? 'rgba(74,222,128,0.1)' : score >= 60 ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)';
  return <span style={{ background: bg, color, fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: 999 }}>ICP {score}</span>;
}

function StagePill({ stage }: { stage: string }) {
  const colors: Record<string, { bg: string; color: string }> = {
    awareness: { bg: 'rgba(93,171,121,0.1)', color: '#5dab79' },
    value_delivery: { bg: 'rgba(99,102,241,0.1)', color: '#6366f1' },
    outreach: { bg: 'rgba(245,158,11,0.1)', color: '#f59e0b' },
    conversion: { bg: 'rgba(74,222,128,0.1)', color: '#22c55e' },
  };
  const s = colors[stage] ?? colors.awareness;
  return <span style={{ ...s, fontSize: '11px', fontWeight: 600, padding: '3px 10px', borderRadius: 999 }}>{STAGE_LABELS[stage] ?? stage}</span>;
}

function AddProspectModal({ onClose, onSave }: { onClose: () => void; onSave: (p: CreateProspectInput, a?: CreateAccountInput) => Promise<void> }) {
  const [form, setForm] = useState<CreateProspectInput>({ full_name: '', title: '', email: '', linkedin_url: '', icp_score: 50, stage: 'awareness', notes: '' });
  const [companyName, setCompanyName] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handle = async () => {
    if (!form.full_name.trim()) { setError('Full name is required.'); return; }
    setSaving(true);
    try {
      await onSave(form, companyName.trim() ? { company_name: companyName.trim() } : undefined);
      onClose();
    } catch (e: any) {
      setError(e.message ?? 'Failed to save.');
      setSaving(false);
    }
  };

  const inputStyle = { width: '100%', padding: '10px 14px', border: '1px solid var(--portal-border-default)', borderRadius: 10, fontSize: 13, color: 'var(--portal-text-primary)', background: 'var(--portal-bg-hover)', outline: 'none', boxSizing: 'border-box' as const };
  const labelStyle: React.CSSProperties = { fontSize: '12px', fontWeight: 600, color: 'var(--portal-text-secondary)', display: 'block', marginBottom: 6 };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ background: 'var(--portal-bg-secondary)', borderRadius: 20, padding: 32, width: '100%', maxWidth: 520, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--portal-text-primary)', margin: 0 }}>Add Prospect</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--portal-text-tertiary)', padding: 4 }}><X size={18} /></button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={labelStyle}>Full Name *</label>
            <input style={inputStyle} value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} placeholder="Jane Smith" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={labelStyle}>Title</label>
              <input style={inputStyle} value={form.title ?? ''} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="CHRO" />
            </div>
            <div>
              <label style={labelStyle}>Company</label>
              <input style={inputStyle} value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder="Acme Corp" />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Email</label>
            <input style={inputStyle} type="email" value={form.email ?? ''} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="jane@acme.com" />
          </div>
          <div>
            <label style={labelStyle}>LinkedIn URL</label>
            <input style={inputStyle} value={form.linkedin_url ?? ''} onChange={e => setForm(f => ({ ...f, linkedin_url: e.target.value }))} placeholder="https://linkedin.com/in/..." />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={labelStyle}>ICP Score (0–100)</label>
              <input style={inputStyle} type="number" min={0} max={100} value={form.icp_score ?? 50} onChange={e => setForm(f => ({ ...f, icp_score: parseInt(e.target.value) || 0 }))} />
            </div>
            <div>
              <label style={labelStyle}>Stage</label>
              <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.stage ?? 'awareness'} onChange={e => setForm(f => ({ ...f, stage: e.target.value }))}>
                {STAGES.map(s => <option key={s} value={s}>{STAGE_LABELS[s]}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label style={labelStyle}>Notes</label>
            <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: 72 }} value={form.notes ?? ''} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Context, trigger events, next steps…" />
          </div>
          {error && <p style={{ fontSize: 12, color: '#ef4444', margin: 0 }}>{error}</p>}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
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

export default function ProspectsPage() {
  const { prospects, loading, createProspect } = useProspects();
  const { createAccount } = useAccounts();
  const [search, setSearch] = useState('');
  const [filterScore, setFilterScore] = useState('all');
  const [filterStage, setFilterStage] = useState('all');
  const [showModal, setShowModal] = useState(false);

  const handleSave = async (input: CreateProspectInput, accountInput?: CreateAccountInput) => {
    let account_id: string | undefined;
    if (accountInput) {
      const acct = await createAccount(accountInput);
      account_id = (acct as any).id;
    }
    await createProspect({ ...input, account_id });
  };

  const filtered = prospects.filter(p => {
    const q = search.toLowerCase();
    const matchSearch = !q || p.full_name.toLowerCase().includes(q) || (p.title ?? '').toLowerCase().includes(q) || (p.account?.company_name ?? '').toLowerCase().includes(q);
    const matchScore = filterScore === 'all' ? true : filterScore === '80+' ? p.icp_score >= 80 : filterScore === '60-79' ? p.icp_score >= 60 && p.icp_score < 80 : p.icp_score < 60;
    const matchStage = filterStage === 'all' || p.stage === filterStage;
    return matchSearch && matchScore && matchStage;
  });

  const selectStyle: React.CSSProperties = { padding: '9px 12px', border: '1px solid var(--portal-border-default)', borderRadius: 10, fontSize: 13, color: 'var(--portal-text-secondary)', background: 'var(--portal-bg-secondary)', cursor: 'pointer', outline: 'none' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--portal-text-primary)', margin: 0 }}>Prospect Intelligence</h1>
          <p style={{ fontSize: 13, color: 'var(--portal-text-tertiary)', margin: '4px 0 0' }}>{prospects.length} prospect{prospects.length !== 1 ? 's' : ''} in pipeline</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px', border: '1px solid var(--portal-border-accent)', borderRadius: 10, background: 'none', color: 'var(--portal-accent)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            <Upload size={15} strokeWidth={2} /> Import CSV
          </button>
          <button onClick={() => setShowModal(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px', border: 'none', borderRadius: 10, background: 'var(--portal-accent)', color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            <Plus size={15} strokeWidth={2} /> Add Manually
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--portal-text-tertiary)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name, title, company…"
            style={{ width: '100%', padding: '9px 12px 9px 34px', border: '1px solid var(--portal-border-default)', borderRadius: 10, fontSize: 13, color: 'var(--portal-text-primary)', background: 'var(--portal-bg-secondary)', outline: 'none', boxSizing: 'border-box' }} />
        </div>
        <select value={filterScore} onChange={e => setFilterScore(e.target.value)} style={selectStyle}>
          <option value="all">All ICP Scores</option>
          <option value="80+">80+ (High)</option>
          <option value="60-79">60–79 (Medium)</option>
          <option value="<60">Below 60 (Low)</option>
        </select>
        <select value={filterStage} onChange={e => setFilterStage(e.target.value)} style={selectStyle}>
          <option value="all">All Stages</option>
          {STAGES.map(s => <option key={s} value={s}>{STAGE_LABELS[s]}</option>)}
        </select>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', border: '2px solid var(--portal-accent)', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 0', background: 'var(--portal-bg-secondary)', border: '1px solid var(--portal-border-default)', borderRadius: 16 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: 'var(--portal-accent-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <Search size={22} strokeWidth={1.8} color="var(--portal-accent)" />
          </div>
          <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--portal-text-primary)', margin: '0 0 6px' }}>{prospects.length === 0 ? 'No prospects yet' : 'No matches found'}</p>
          <p style={{ fontSize: 13, color: 'var(--portal-text-tertiary)', margin: '0 0 20px' }}>{prospects.length === 0 ? 'Add your first prospect to build the pipeline.' : 'Try adjusting your filters.'}</p>
          {prospects.length === 0 && (
            <button onClick={() => setShowModal(true)} style={{ padding: '10px 20px', border: 'none', borderRadius: 10, background: 'var(--portal-accent)', color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
              Add First Prospect
            </button>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map(p => (
            <div key={p.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', background: 'var(--portal-bg-secondary)', border: '1px solid var(--portal-border-default)', borderRadius: 14, gap: 12 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--portal-text-primary)', margin: 0 }}>{p.full_name}</p>
                <p style={{ fontSize: 12, color: 'var(--portal-text-tertiary)', margin: '2px 0 0' }}>{p.title ?? '—'}{p.account ? ` · ${p.account.company_name}` : ''}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                <IcpBadge score={p.icp_score} />
                <StagePill stage={p.stage} />
                {p.email && <a href={`mailto:${p.email}`} style={{ fontSize: 12, color: 'var(--portal-accent)', textDecoration: 'none' }}>Email</a>}
                {p.linkedin_url && <a href={p.linkedin_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: 'var(--portal-accent)', textDecoration: 'none' }}>LinkedIn</a>}
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && <AddProspectModal onClose={() => setShowModal(false)} onSave={handleSave} />}
    </div>
  );
}
