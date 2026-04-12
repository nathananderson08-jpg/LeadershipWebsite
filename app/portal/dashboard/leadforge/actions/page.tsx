'use client';

import { useState } from 'react';
import { Clock, AlertTriangle, CheckCircle, Zap, Mail, ExternalLink, ChevronRight } from 'lucide-react';
import { useProspects, useActivities, type LeadForgeProspect } from '@/hooks/portal/useLeadForge';

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

const WARMTH_COLOR: Record<string, string> = { cold: '#94a3b8', warm: '#f59e0b', hot: '#ef4444' };

function ActionRow({ prospect, onDone }: { prospect: LeadForgeProspect; onDone: (id: string) => Promise<void> }) {
  const p = prospect as any;
  const { logActivity } = useActivities(prospect.id);
  const [completing, setCompleting] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);

  const lastActivity = p.last_activity_at ?? prospect.created_at;
  const daysSince = Math.floor((Date.now() - new Date(lastActivity).getTime()) / (1000 * 60 * 60 * 24));
  const isOverdue = daysSince > 14;
  const stage = PIPELINE_STAGES[p.pipeline_stage ?? 'identified'];
  const warmthColor = WARMTH_COLOR[p.warmth_score ?? 'cold'];

  const handleComplete = async () => {
    setCompleting(true);
    try {
      await logActivity({ activity_type: 'note', subject: `Completed: ${p.next_action}`, notes: note || undefined, created_by: 'user' });
      await onDone(prospect.id);
    } finally {
      setCompleting(false);
    }
  };

  const handleQuickLog = async () => {
    if (!note.trim()) return;
    setSaving(true);
    try {
      await logActivity({ activity_type: 'note', subject: 'Quick note', notes: note, created_by: 'user' });
      setNote('');
      setExpanded(false);
    } finally { setSaving(false); }
  };

  return (
    <div style={{
      background: 'var(--portal-bg-secondary)',
      border: `1px solid ${isOverdue ? 'rgba(239,68,68,0.3)' : 'var(--portal-border-default)'}`,
      borderRadius: 12, overflow: 'hidden',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '14px 16px' }}>
        {/* Warmth dot */}
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: warmthColor, flexShrink: 0, marginTop: 4 }} />

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 3 }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--portal-text-primary)', margin: 0 }}>{prospect.full_name}</p>
            <span style={{ fontSize: 11, color: stage.color, fontWeight: 600 }}>{stage.label}</span>
            {isOverdue && (
              <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 10, color: '#ef4444', fontWeight: 700 }}>
                <AlertTriangle size={10} /> Stale {daysSince}d
              </span>
            )}
          </div>
          <p style={{ fontSize: 12, color: 'var(--portal-text-tertiary)', margin: '0 0 8px' }}>
            {prospect.title ?? '—'}{prospect.account ? ` · ${prospect.account.company_name}` : ''}
          </p>

          {/* Next action */}
          {p.next_action && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 10px', background: 'rgba(99,102,241,0.07)', borderRadius: 7, marginBottom: 6 }}>
              <ChevronRight size={11} color="#6366f1" />
              <p style={{ fontSize: 12, color: '#6366f1', margin: 0, fontWeight: 500 }}>{p.next_action}</p>
            </div>
          )}

          {/* Trigger context */}
          {p.trigger_context && (
            <p style={{ fontSize: 11, color: 'var(--portal-text-tertiary)', margin: 0, lineHeight: 1.5 }}>
              <strong style={{ color: '#f59e0b' }}>Why: </strong>{p.trigger_context}
            </p>
          )}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0, alignItems: 'flex-end' }}>
          <div style={{ display: 'flex', gap: 6 }}>
            {prospect.email && (
              <a href={`mailto:${prospect.email}`} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '5px 10px', border: '1px solid var(--portal-border-default)', borderRadius: 7, fontSize: 11, color: 'var(--portal-text-tertiary)', textDecoration: 'none', fontWeight: 600 }}>
                <Mail size={11} /> Email
              </a>
            )}
            {prospect.linkedin_url && (
              <a href={prospect.linkedin_url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '5px 10px', border: '1px solid var(--portal-border-default)', borderRadius: 7, fontSize: 11, color: 'var(--portal-text-tertiary)', textDecoration: 'none', fontWeight: 600 }}>
                <ExternalLink size={11} /> LinkedIn
              </a>
            )}
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button onClick={() => setExpanded(e => !e)}
              style={{ padding: '5px 10px', border: '1px solid var(--portal-border-default)', borderRadius: 7, background: 'none', fontSize: 11, fontWeight: 600, color: 'var(--portal-text-secondary)', cursor: 'pointer' }}>
              Log Note
            </button>
            <button onClick={handleComplete} disabled={completing}
              style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '5px 10px', border: 'none', borderRadius: 7, background: 'var(--portal-accent)', color: 'white', fontSize: 11, fontWeight: 600, cursor: 'pointer', opacity: completing ? 0.6 : 1 }}>
              <CheckCircle size={11} /> Done
            </button>
          </div>
          <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 10, color: 'var(--portal-text-tertiary)' }}>
            <Clock size={9} /> {daysSince === 0 ? 'Today' : `${daysSince}d ago`}
          </span>
        </div>
      </div>

      {/* Inline note */}
      {expanded && (
        <div style={{ padding: '0 16px 14px', borderTop: '1px solid var(--portal-border-default)', paddingTop: 12 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <input value={note} onChange={e => setNote(e.target.value)} placeholder="What happened? Outcome or next step…"
              onKeyDown={e => e.key === 'Enter' && handleQuickLog()}
              style={{ flex: 1, padding: '8px 12px', border: '1px solid var(--portal-border-default)', borderRadius: 8, fontSize: 12, color: 'var(--portal-text-primary)', background: 'var(--portal-bg-hover)', outline: 'none' }} />
            <button onClick={handleQuickLog} disabled={saving || !note.trim()}
              style={{ padding: '8px 14px', border: 'none', borderRadius: 8, background: 'var(--portal-accent)', color: 'white', fontSize: 12, fontWeight: 600, cursor: 'pointer', opacity: !note.trim() ? 0.5 : 1 }}>
              {saving ? '…' : 'Save'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ActionsPage() {
  const { prospects, loading, updateProspect } = useProspects();
  const [filter, setFilter] = useState<'all' | 'overdue' | 'hot'>('all');

  // All prospects that need attention — stale OR have a next_action set
  const actionable = prospects.filter(p => {
    const pa = p as any;
    if (pa.pipeline_stage === 'client') return false;
    const lastActivity = pa.last_activity_at ?? p.created_at;
    const daysSince = Math.floor((Date.now() - new Date(lastActivity).getTime()) / (1000 * 60 * 60 * 24));
    return pa.next_action || daysSince > 7;
  }).sort((a, b) => {
    // Sort: hot first, then overdue, then by icp_score
    const aHot = (a as any).warmth_score === 'hot';
    const bHot = (b as any).warmth_score === 'hot';
    if (aHot && !bHot) return -1;
    if (!aHot && bHot) return 1;
    const aDays = Math.floor((Date.now() - new Date((a as any).last_activity_at ?? a.created_at).getTime()) / 86400000);
    const bDays = Math.floor((Date.now() - new Date((b as any).last_activity_at ?? b.created_at).getTime()) / 86400000);
    if (aDays !== bDays) return bDays - aDays;
    return b.icp_score - a.icp_score;
  });

  const overdue = actionable.filter(p => {
    const d = Math.floor((Date.now() - new Date((p as any).last_activity_at ?? p.created_at).getTime()) / 86400000);
    return d > 14;
  });
  const hot = actionable.filter(p => (p as any).warmth_score === 'hot');

  const displayed = filter === 'overdue' ? overdue : filter === 'hot' ? hot : actionable;

  const handleDone = async (id: string) => {
    await updateProspect(id, { next_action: null } as any);
  };

  const tabStyle = (active: boolean): React.CSSProperties => ({
    padding: '7px 14px', fontSize: 13, fontWeight: active ? 600 : 500, borderRadius: 8, border: 'none',
    cursor: 'pointer', background: active ? 'var(--portal-accent-subtle)' : 'transparent',
    color: active ? 'var(--portal-accent)' : 'var(--portal-text-tertiary)',
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--portal-text-primary)', margin: 0 }}>Next Actions</h1>
          <p style={{ fontSize: 13, color: 'var(--portal-text-tertiary)', margin: '4px 0 0' }}>
            Prospects that need your attention right now
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          {[
            { label: 'All', value: actionable.length, key: 'all' as const },
            { label: 'Overdue (14d+)', value: overdue.length, key: 'overdue' as const },
            { label: '🔥 Hot', value: hot.length, key: 'hot' as const },
          ].map(s => (
            <div key={s.key} style={{ padding: '12px 18px', background: 'var(--portal-bg-secondary)', border: '1px solid var(--portal-border-default)', borderRadius: 12, textAlign: 'center', cursor: 'pointer' }} onClick={() => setFilter(s.key)}>
              <p style={{ fontSize: 20, fontWeight: 800, color: 'var(--portal-text-primary)', margin: 0, lineHeight: 1 }}>{loading ? '—' : s.value}</p>
              <p style={{ fontSize: 11, color: 'var(--portal-text-tertiary)', margin: '3px 0 0' }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 4, padding: '4px', background: 'var(--portal-bg-hover)', borderRadius: 12, width: 'fit-content' }}>
        <button style={tabStyle(filter === 'all')} onClick={() => setFilter('all')}>All ({actionable.length})</button>
        <button style={tabStyle(filter === 'overdue')} onClick={() => setFilter('overdue')}>Overdue ({overdue.length})</button>
        <button style={tabStyle(filter === 'hot')} onClick={() => setFilter('hot')}>Hot ({hot.length})</button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', border: '2px solid var(--portal-accent)', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
        </div>
      ) : displayed.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 0', background: 'var(--portal-bg-secondary)', border: '1px solid var(--portal-border-default)', borderRadius: 16 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: 'var(--portal-accent-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <CheckCircle size={22} strokeWidth={1.5} color="var(--portal-accent)" />
          </div>
          <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--portal-text-primary)', margin: '0 0 4px' }}>All clear</p>
          <p style={{ fontSize: 13, color: 'var(--portal-text-tertiary)', margin: 0 }}>No prospects need attention right now.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {displayed.map(p => <ActionRow key={p.id} prospect={p} onDone={handleDone} />)}
        </div>
      )}
    </div>
  );
}
