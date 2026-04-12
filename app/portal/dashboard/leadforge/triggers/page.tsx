'use client';

import { useState } from 'react';
import { AlertCircle, Plus, X, ExternalLink, Users, ChevronDown, ChevronUp, Flame } from 'lucide-react';
import { useTriggerEvents, useAccounts, useProspects, type CreateTriggerInput } from '@/hooks/portal/useLeadForge';

const EVENT_TYPES = ['executive_move', 'organizational', 'ma', 'culture_signal', 'growth_signal'] as const;
const TYPE_LABELS: Record<string, string> = {
  executive_move: 'Executive Move',
  organizational: 'Organizational',
  ma: 'M&A Activity',
  culture_signal: 'Culture Signal',
  growth_signal: 'Growth Signal',
};
const TYPE_DESCRIPTIONS: Record<string, string> = {
  executive_move:  'CHRO, CPO, CLO hire/departure or reorg',
  organizational:  'Restructure, layoffs, rapid headcount growth',
  ma:              'Acquisition, merger, or spin-off activity',
  culture_signal:  'Glassdoor trend, engagement score, culture press',
  growth_signal:   'Funding, IPO, expansion into new market',
};
const PRIORITY_CONFIG: Record<string, { color: string; bg: string; border: string }> = {
  critical: { color: '#ef4444', bg: 'rgba(239,68,68,0.08)',  border: 'rgba(239,68,68,0.25)'  },
  high:     { color: '#f97316', bg: 'rgba(249,115,22,0.08)', border: 'rgba(249,115,22,0.25)' },
  medium:   { color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.25)' },
};
const PIPELINE_STAGES: Record<string, { label: string; color: string }> = {
  identified: { label: 'Identified', color: '#94a3b8' },
  researched:  { label: 'Researched', color: '#6366f1' },
  warming:     { label: 'Warming',    color: '#f59e0b' },
  outreach:    { label: 'Outreach',   color: '#f97316' },
  engaged:     { label: 'Engaged',    color: '#8b5cf6' },
  qualified:   { label: 'Qualified',  color: '#22c55e' },
  proposal:    { label: 'Proposal',   color: '#4ade80' },
  client:      { label: 'Client',     color: '#5dab79' },
};

function PriorityBadge({ priority }: { priority: string | null }) {
  const s = PRIORITY_CONFIG[priority ?? ''] ?? { color: '#6b9a7d', bg: 'rgba(93,171,121,0.1)', border: 'transparent' };
  return (
    <span style={{ ...s, fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: 999, textTransform: 'capitalize' as const, border: `1px solid ${s.border}` }}>
      {priority ?? '—'}
    </span>
  );
}

function TypeBadge({ type }: { type: string }) {
  return (
    <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 999, background: 'var(--portal-accent-subtle)', color: 'var(--portal-accent)' }}>
      {TYPE_LABELS[type] ?? type}
    </span>
  );
}

// ── Add Event Modal ─────────────────────────────────────────────
function AddEventModal({ onClose, onSave }: { onClose: () => void; onSave: (input: CreateTriggerInput) => Promise<void> }) {
  const { accounts } = useAccounts();
  const [form, setForm] = useState<CreateTriggerInput>({ event_type: 'executive_move', description: '', priority: 'high', source_url: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handle = async () => {
    if (!form.description.trim()) { setError('Description is required.'); return; }
    setSaving(true);
    try {
      await onSave(form);
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
      <div style={{ background: 'var(--portal-bg-secondary)', borderRadius: 20, padding: 32, width: '100%', maxWidth: 520, boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--portal-text-primary)', margin: 0 }}>Log Trigger Event</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--portal-text-tertiary)', padding: 4 }}><X size={18} /></button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={labelStyle}>Account (required to auto-flag prospects)</label>
            <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.account_id ?? ''} onChange={e => setForm(f => ({ ...f, account_id: e.target.value || undefined }))}>
              <option value="">No account linked</option>
              {accounts.map(a => <option key={a.id} value={a.id}>{a.company_name}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Event Type</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {EVENT_TYPES.map(t => (
                <button key={t} onClick={() => setForm(f => ({ ...f, event_type: t }))}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 13px', border: `1px solid ${form.event_type === t ? 'var(--portal-border-accent)' : 'var(--portal-border-default)'}`, borderRadius: 9, background: form.event_type === t ? 'var(--portal-accent-subtle)' : 'none', cursor: 'pointer', textAlign: 'left' }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: form.event_type === t ? 'var(--portal-accent)' : 'var(--portal-text-primary)' }}>{TYPE_LABELS[t]}</span>
                  <span style={{ fontSize: 11, color: 'var(--portal-text-tertiary)' }}>{TYPE_DESCRIPTIONS[t]}</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label style={labelStyle}>Priority</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {['critical', 'high', 'medium'].map(p => {
                const conf = PRIORITY_CONFIG[p];
                return (
                  <button key={p} onClick={() => setForm(f => ({ ...f, priority: p }))}
                    style={{ flex: 1, padding: '9px 0', border: `1px solid ${form.priority === p ? conf.border : 'var(--portal-border-default)'}`, borderRadius: 9, background: form.priority === p ? conf.bg : 'none', cursor: 'pointer', fontSize: 12, fontWeight: 700, color: form.priority === p ? conf.color : 'var(--portal-text-tertiary)', textTransform: 'capitalize' }}>
                    {p}
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <label style={labelStyle}>Description</label>
            <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: 80 }} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="What happened and why it matters…" />
          </div>
          <div>
            <label style={labelStyle}>Source URL (optional)</label>
            <input style={inputStyle} value={form.source_url ?? ''} onChange={e => setForm(f => ({ ...f, source_url: e.target.value }))} placeholder="https://…" />
          </div>
          {error && <p style={{ fontSize: 12, color: '#ef4444', margin: 0 }}>{error}</p>}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
            <button onClick={onClose} style={{ padding: '10px 20px', border: '1px solid var(--portal-border-default)', borderRadius: 10, background: 'none', fontSize: 13, fontWeight: 600, color: 'var(--portal-text-secondary)', cursor: 'pointer' }}>Cancel</button>
            <button onClick={handle} disabled={saving} style={{ padding: '10px 20px', border: 'none', borderRadius: 10, background: 'var(--portal-accent)', color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer', opacity: saving ? 0.6 : 1 }}>
              {saving ? 'Saving…' : 'Log Event'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Event Card ──────────────────────────────────────────────────
function EventCard({ ev, linkedProspects, onAction }: {
  ev: any;
  linkedProspects: any[];
  onAction: (id: string) => Promise<void>;
}) {
  const [expanded, setExpanded] = useState(false);
  const [actioning, setActioning] = useState(false);
  const conf = PRIORITY_CONFIG[ev.priority ?? ''] ?? { color: '#94a3b8', bg: 'rgba(148,163,184,0.1)', border: 'rgba(148,163,184,0.2)' };

  const handleAction = async () => {
    setActioning(true);
    try { await onAction(ev.id); }
    finally { setActioning(false); }
  };

  return (
    <div style={{
      background: 'var(--portal-bg-secondary)',
      border: `1px solid ${ev.response_status === 'pending' && ev.priority === 'critical' ? conf.border : 'var(--portal-border-default)'}`,
      borderRadius: 14, overflow: 'hidden',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '18px 20px', gap: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 7, flexWrap: 'wrap' }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--portal-text-primary)', margin: 0 }}>
              {ev.account?.company_name ?? 'Unlinked account'}
            </p>
            <TypeBadge type={ev.event_type ?? ''} />
            <PriorityBadge priority={ev.priority} />
          </div>
          <p style={{ fontSize: 13, color: 'var(--portal-text-secondary)', margin: '0 0 8px', lineHeight: 1.5 }}>{ev.description}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <p style={{ fontSize: 11, color: 'var(--portal-text-tertiary)', margin: 0 }}>
              Detected {new Date(ev.detected_at).toLocaleDateString()}
            </p>
            {linkedProspects.length > 0 && (
              <button onClick={() => setExpanded(e => !e)}
                style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '3px 8px', border: '1px solid var(--portal-border-default)', borderRadius: 6, background: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 600, color: 'var(--portal-text-tertiary)' }}>
                <Users size={10} /> {linkedProspects.length} prospect{linkedProspects.length !== 1 ? 's' : ''} flagged
                {expanded ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
              </button>
            )}
            {linkedProspects.length === 0 && ev.account?.company_name && (
              <span style={{ fontSize: 11, color: 'var(--portal-text-tertiary)' }}>No prospects at this account yet</span>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexShrink: 0, alignItems: 'flex-start' }}>
          {ev.source_url && (
            <a href={ev.source_url} target="_blank" rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 12px', border: '1px solid var(--portal-border-default)', borderRadius: 8, fontSize: 12, color: 'var(--portal-text-tertiary)', textDecoration: 'none' }}>
              <ExternalLink size={12} /> Source
            </a>
          )}
          {ev.response_status === 'pending' && (
            <button onClick={handleAction} disabled={actioning}
              style={{ padding: '6px 14px', border: 'none', borderRadius: 8, background: 'var(--portal-accent)', color: 'white', fontSize: 12, fontWeight: 600, cursor: 'pointer', opacity: actioning ? 0.6 : 1 }}>
              {actioning ? 'Saving…' : 'Mark Actioned'}
            </button>
          )}
          {ev.response_status === 'actioned' && (
            <span style={{ fontSize: 11, fontWeight: 600, padding: '6px 12px', borderRadius: 8, background: 'rgba(74,222,128,0.1)', color: '#4ade80' }}>✓ Actioned</span>
          )}
        </div>
      </div>

      {/* Linked prospects */}
      {expanded && linkedProspects.length > 0 && (
        <div style={{ borderTop: '1px solid var(--portal-border-default)', padding: '12px 20px 16px' }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--portal-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 8px' }}>
            Flagged prospects at {ev.account?.company_name}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {linkedProspects.map((p: any) => {
              const stage = PIPELINE_STAGES[p.pipeline_stage ?? 'identified'];
              const warmthColor = p.warmth_score === 'hot' ? '#ef4444' : p.warmth_score === 'warm' ? '#f59e0b' : '#94a3b8';
              return (
                <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: 'var(--portal-bg-hover)', borderRadius: 8 }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: warmthColor, flexShrink: 0, display: 'inline-block' }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--portal-text-primary)', margin: 0 }}>{p.full_name}</p>
                    <p style={{ fontSize: 11, color: 'var(--portal-text-tertiary)', margin: '1px 0 0' }}>{p.title ?? '—'}</p>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 600, color: stage?.color ?? '#94a3b8', flexShrink: 0 }}>{stage?.label}</span>
                  {p.warmth_score === 'warm' && (
                    <span style={{ fontSize: 10, fontWeight: 700, color: '#f59e0b', flexShrink: 0 }}>↑ Bumped to Warm</span>
                  )}
                  {p.warmth_score === 'hot' && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 2, fontSize: 10, fontWeight: 700, color: '#ef4444', flexShrink: 0 }}>
                      <Flame size={9} /> Hot
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main page ───────────────────────────────────────────────────
export default function TriggersPage() {
  const { events, loading, createEvent, updateStatus } = useTriggerEvents();
  const { prospects } = useProspects();
  const [filter, setFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);

  const thisWeekStart = new Date(); thisWeekStart.setDate(thisWeekStart.getDate() - 7);
  const thisWeek = events.filter(e => new Date(e.detected_at) >= thisWeekStart).length;
  const pending = events.filter(e => e.response_status === 'pending').length;
  const totalFlagged = events.reduce((acc, ev) => {
    if (!(ev as any).account_id) return acc;
    return acc + prospects.filter(p => (p as any).account_id === (ev as any).account_id).length;
  }, 0);

  const filtered = filter === 'all' ? events : events.filter(e => e.event_type === filter);

  const tabStyle = (active: boolean): React.CSSProperties => ({
    padding: '7px 14px', fontSize: 13, fontWeight: active ? 600 : 500, borderRadius: 8, border: 'none', cursor: 'pointer',
    background: active ? 'var(--portal-accent-subtle)' : 'transparent',
    color: active ? 'var(--portal-accent)' : 'var(--portal-text-tertiary)',
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--portal-text-primary)', margin: 0 }}>Trigger Event Monitor</h1>
          <p style={{ fontSize: 13, color: 'var(--portal-text-tertiary)', margin: '4px 0 0' }}>Business events that create engagement opportunities</p>
        </div>
        <button onClick={() => setShowModal(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px', border: 'none', borderRadius: 10, background: 'var(--portal-accent)', color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
          <Plus size={15} strokeWidth={2} /> Log Event
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 12 }}>
        {[
          { label: 'Total Events',       value: events.length  },
          { label: 'This Week',          value: thisWeek       },
          { label: 'Pending Response',   value: pending        },
          { label: 'Prospects Flagged',  value: totalFlagged   },
        ].map(s => (
          <div key={s.label} style={{ flex: 1, padding: '14px 18px', background: 'var(--portal-bg-secondary)', border: '1px solid var(--portal-border-default)', borderRadius: 12 }}>
            <p style={{ fontSize: 22, fontWeight: 800, color: 'var(--portal-text-primary)', margin: 0, lineHeight: 1 }}>{loading ? '—' : s.value}</p>
            <p style={{ fontSize: 11, color: 'var(--portal-text-tertiary)', margin: '4px 0 0' }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 4, padding: '4px', background: 'var(--portal-bg-hover)', borderRadius: 12, width: 'fit-content', flexWrap: 'wrap' }}>
        <button style={tabStyle(filter === 'all')} onClick={() => setFilter('all')}>All ({events.length})</button>
        {EVENT_TYPES.map(t => {
          const count = events.filter(e => e.event_type === t).length;
          return <button key={t} style={tabStyle(filter === t)} onClick={() => setFilter(t)}>{TYPE_LABELS[t]} {count > 0 ? `(${count})` : ''}</button>;
        })}
      </div>

      {/* Events list */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', border: '2px solid var(--portal-accent)', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 0', background: 'var(--portal-bg-secondary)', border: '1px solid var(--portal-border-default)', borderRadius: 16 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: 'var(--portal-accent-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <AlertCircle size={22} strokeWidth={1.8} color="var(--portal-accent)" />
          </div>
          <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--portal-text-primary)', margin: '0 0 6px' }}>No trigger events yet</p>
          <p style={{ fontSize: 13, color: 'var(--portal-text-tertiary)', margin: '0 0 20px' }}>Log a business event to auto-flag the relevant prospects at that account.</p>
          <button onClick={() => setShowModal(true)} style={{ padding: '10px 20px', border: 'none', borderRadius: 10, background: 'var(--portal-accent)', color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Log First Event</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map(ev => {
            const linkedProspects = prospects.filter(p => (p as any).account_id === (ev as any).account_id && (ev as any).account_id);
            return (
              <EventCard
                key={ev.id}
                ev={ev}
                linkedProspects={linkedProspects}
                onAction={(id) => updateStatus(id, 'actioned')}
              />
            );
          })}
        </div>
      )}

      {showModal && <AddEventModal onClose={() => setShowModal(false)} onSave={createEvent} />}
    </div>
  );
}
