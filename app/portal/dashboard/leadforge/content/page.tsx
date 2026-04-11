'use client';

import { useState } from 'react';
import { FileText, Plus, X, Loader2, CheckCircle, Clock } from 'lucide-react';
import { useLeadForgeContent, useProspects, type CreateContentInput } from '@/hooks/portal/useLeadForge';

const CONTENT_TYPES = [
  { id: 'micro_research', label: 'Micro-Research Brief' },
  { id: 'email_sequence', label: 'Email Sequence' },
  { id: 'linkedin_post', label: 'LinkedIn Post' },
  { id: 'executive_summary', label: 'Executive Summary' },
  { id: 'comment_draft', label: 'Comment Draft' },
];

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: React.ComponentType<any> }> = {
  draft: { label: 'Draft', color: '#6b9a7d', bg: 'rgba(93,171,121,0.1)', icon: FileText },
  pending_review: { label: 'Pending Review', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', icon: Clock },
  approved: { label: 'Approved', color: '#22c55e', bg: 'rgba(34,197,94,0.1)', icon: CheckCircle },
};

function GenerateModal({ onClose, onSave }: { onClose: () => void; onSave: (input: CreateContentInput) => Promise<void> }) {
  const { prospects } = useProspects();
  const [form, setForm] = useState<CreateContentInput>({ content_type: 'micro_research', title: '', body: '', prospect_id: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handle = async () => {
    if (!form.title.trim()) { setError('Title is required.'); return; }
    setSaving(true);
    try {
      await onSave({ ...form, prospect_id: form.prospect_id || undefined });
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
          <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--portal-text-primary)', margin: 0 }}>Create Content</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--portal-text-tertiary)', padding: 4 }}><X size={18} /></button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={labelStyle}>Prospect (optional)</label>
            <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.prospect_id ?? ''} onChange={e => setForm(f => ({ ...f, prospect_id: e.target.value }))}>
              <option value="">No prospect linked</option>
              {prospects.map(p => <option key={p.id} value={p.id}>{p.full_name}{p.account ? ` · ${p.account.company_name}` : ''}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Content Type</label>
            <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.content_type} onChange={e => setForm(f => ({ ...f, content_type: e.target.value }))}>
              {CONTENT_TYPES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Title</label>
            <input style={inputStyle} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. 90-Day Priorities Brief for Jane Smith" />
          </div>
          <div>
            <label style={labelStyle}>Content</label>
            <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: 140 }} value={form.body} onChange={e => setForm(f => ({ ...f, body: e.target.value }))} placeholder="Paste or write the content here…" />
          </div>
          {error && <p style={{ fontSize: 12, color: '#ef4444', margin: 0 }}>{error}</p>}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
            <button onClick={onClose} style={{ padding: '10px 20px', border: '1px solid var(--portal-border-default)', borderRadius: 10, background: 'none', fontSize: 13, fontWeight: 600, color: 'var(--portal-text-secondary)', cursor: 'pointer' }}>Cancel</button>
            <button onClick={handle} disabled={saving} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 20px', border: 'none', borderRadius: 10, background: 'var(--portal-accent)', color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer', opacity: saving ? 0.6 : 1 }}>
              {saving ? <><Loader2 size={14} style={{ animation: 'spin 0.8s linear infinite' }} /> Saving…</> : 'Save Content'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ContentPage() {
  const { content, loading, createContent, updateStatus } = useLeadForgeContent();
  const [filter, setFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);

  const filtered = filter === 'all' ? content : content.filter(c => c.content_type === filter);

  const stats = {
    total: content.length,
    pending: content.filter(c => c.status === 'pending_review').length,
    approved: content.filter(c => c.status === 'approved').length,
  };

  const tabStyle = (active: boolean): React.CSSProperties => ({
    padding: '7px 14px', fontSize: 13, fontWeight: active ? 600 : 500, borderRadius: 8, border: 'none', cursor: 'pointer',
    background: active ? 'var(--portal-accent-subtle)' : 'transparent',
    color: active ? 'var(--portal-accent)' : 'var(--portal-text-tertiary)',
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--portal-text-primary)', margin: 0 }}>Content & IP Generator</h1>
          <p style={{ fontSize: 13, color: 'var(--portal-text-tertiary)', margin: '4px 0 0' }}>Personalized thought leadership for every target account</p>
        </div>
        <button onClick={() => setShowModal(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px', border: 'none', borderRadius: 10, background: 'var(--portal-accent)', color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
          <Plus size={15} strokeWidth={2} /> Create Content
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 12 }}>
        {[
          { label: 'Total Pieces', value: stats.total },
          { label: 'Pending Review', value: stats.pending },
          { label: 'Approved', value: stats.approved },
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
          <p style={{ fontSize: 13, color: 'var(--portal-text-tertiary)', margin: '0 0 20px' }}>Create your first piece to start building the content library.</p>
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
            return (
              <div key={c.id} style={{ padding: '18px 20px', background: 'var(--portal-bg-secondary)', border: '1px solid var(--portal-border-default)', borderRadius: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
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
                    {c.body && <p style={{ fontSize: 12, color: 'var(--portal-text-secondary)', margin: 0, lineHeight: 1.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as any }}>{c.body}</p>}
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexShrink: 0, alignItems: 'flex-start' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 999, background: statusConf.bg, color: statusConf.color }}>
                      <StatusIcon size={11} /> {statusConf.label}
                    </span>
                    {c.status === 'draft' && (
                      <button onClick={() => updateStatus(c.id, 'pending_review')}
                        style={{ padding: '4px 12px', border: '1px solid var(--portal-border-accent)', borderRadius: 8, background: 'none', color: 'var(--portal-accent)', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                        Submit for Review
                      </button>
                    )}
                    {c.status === 'pending_review' && (
                      <button onClick={() => updateStatus(c.id, 'approved')}
                        style={{ padding: '4px 12px', border: 'none', borderRadius: 8, background: 'var(--portal-accent)', color: 'white', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                        Approve
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showModal && <GenerateModal onClose={() => setShowModal(false)} onSave={createContent} />}
    </div>
  );
}
