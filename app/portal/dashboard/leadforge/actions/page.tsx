'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Activity, AlertTriangle, TrendingUp, UserCheck, Building2,
  Zap, Bell, ArrowRight, CheckCircle2, Clock, Filter,
} from 'lucide-react';
import { createPortalClient } from '@/lib/portal/supabase';

// ── Types ──────────────────────────────────────────────────────────────────

interface FeedEvent {
  id: string;
  account_id: string | null;
  prospect_id: string | null;
  event_type: string | null;
  title: string | null;
  description: string | null;
  priority: 'critical' | 'high' | 'medium' | null;
  created_at: string;
  acted_on: boolean | null;
  // joined
  account: { company_name: string } | null;
  prospect: { full_name: string; title: string | null } | null;
}

// ── Constants ──────────────────────────────────────────────────────────────

const PRIORITY_CONFIG: Record<string, { color: string; bg: string; border: string; label: string }> = {
  critical: { color: '#ef4444', bg: 'rgba(239,68,68,0.08)',  border: 'rgba(239,68,68,0.35)',  label: 'Critical' },
  high:     { color: '#f97316', bg: 'rgba(249,115,22,0.08)', border: 'rgba(249,115,22,0.35)', label: 'High'     },
  medium:   { color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.25)', label: 'Medium'   },
};

const EVENT_TYPE_LABELS: Record<string, string> = {
  executive_move:  'Executive Move',
  organizational:  'Org Change',
  ma:              'M&A Activity',
  culture_signal:  'Culture Signal',
  growth_signal:   'Growth Signal',
  funding:         'Funding',
  hiring_signal:   'Hiring Signal',
  news:            'News',
};

function getEventIcon(type: string | null) {
  switch (type) {
    case 'executive_move':  return <UserCheck  size={15} />;
    case 'organizational':  return <Building2  size={15} />;
    case 'ma':              return <ArrowRight  size={15} />;
    case 'culture_signal':  return <Bell       size={15} />;
    case 'growth_signal':   return <TrendingUp size={15} />;
    case 'funding':         return <Zap        size={15} />;
    case 'hiring_signal':   return <UserCheck  size={15} />;
    default:                return <Activity   size={15} />;
  }
}

// ── Time helpers ───────────────────────────────────────────────────────────

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1)  return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHrs = Math.floor(diffMins / 60);
  if (diffHrs < 24)  return `${diffHrs}h ago`;
  const diffDays = Math.floor(diffHrs / 24);
  if (diffDays === 1) return 'yesterday';
  if (diffDays < 7)  return `${diffDays}d ago`;
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

type Group = 'Today' | 'Yesterday' | 'This Week' | 'Earlier';

function getGroup(iso: string): Group {
  const now = new Date();
  const date = new Date(iso);
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterdayStart = new Date(todayStart.getTime() - 86400000);
  const weekStart = new Date(todayStart.getTime() - 6 * 86400000);

  if (date >= todayStart)      return 'Today';
  if (date >= yesterdayStart)  return 'Yesterday';
  if (date >= weekStart)       return 'This Week';
  return 'Earlier';
}

const GROUP_ORDER: Group[] = ['Today', 'Yesterday', 'This Week', 'Earlier'];

// ── Hook ───────────────────────────────────────────────────────────────────

function useFeedEvents() {
  const [events, setEvents] = useState<FeedEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createPortalClient();
  const initialized = useRef(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('leadforge_trigger_events')
        .select(`
          id, account_id, prospect_id, event_type, title, description,
          priority, created_at, acted_on,
          account:leadforge_accounts(company_name),
          prospect:leadforge_prospects(full_name, title)
        `)
        .order('created_at', { ascending: false })
        .limit(200);
      if (!error && data) setEvents(data as unknown as FeedEvent[]);
    } catch {
      // silently fail — show empty state
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    load();
    const channel = supabase
      .channel('leadforge-feed-events')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'leadforge_trigger_events' }, load)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [load, supabase]);

  const markActioned = useCallback(async (id: string) => {
    const { error } = await supabase
      .from('leadforge_trigger_events')
      .update({ acted_on: true })
      .eq('id', id);
    if (error) throw error;
    setEvents(prev => prev.map(e => e.id === id ? { ...e, acted_on: true } : e));
  }, [supabase]);

  return { events, loading, markActioned, reload: load };
}

// ── Sub-components ─────────────────────────────────────────────────────────

function PriorityBadge({ priority }: { priority: string | null }) {
  const cfg = PRIORITY_CONFIG[priority ?? ''];
  if (!cfg) return null;
  return (
    <span style={{
      fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 999,
      background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`,
      textTransform: 'uppercase', letterSpacing: '0.04em', flexShrink: 0,
    }}>
      {cfg.label}
    </span>
  );
}

function FeedItem({ event, onMarkActioned }: { event: FeedEvent; onMarkActioned: (id: string) => Promise<void> }) {
  const [actioning, setActioning] = useState(false);
  const isHigh = event.priority === 'critical' || event.priority === 'high';
  const priorityCfg = PRIORITY_CONFIG[event.priority ?? ''];

  const handleAction = async () => {
    setActioning(true);
    try { await onMarkActioned(event.id); }
    finally { setActioning(false); }
  };

  return (
    <div style={{
      display: 'flex',
      background: 'var(--portal-bg-secondary)',
      border: '1px solid var(--portal-border-default)',
      borderLeft: isHigh ? `3px solid ${priorityCfg?.color ?? 'var(--portal-accent)'}` : '1px solid var(--portal-border-default)',
      borderRadius: 12,
      overflow: 'hidden',
      opacity: event.acted_on ? 0.55 : 1,
      transition: 'opacity 0.2s',
    }}>
      {/* Icon column */}
      <div style={{
        width: 44,
        flexShrink: 0,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: 16,
        color: priorityCfg?.color ?? 'var(--portal-text-tertiary)',
      }}>
        {getEventIcon(event.event_type)}
      </div>

      {/* Main content */}
      <div style={{ flex: 1, minWidth: 0, padding: '13px 14px 13px 0' }}>
        {/* Top row: title + badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--portal-text-primary)', margin: 0, lineHeight: 1.3 }}>
            {event.title ?? EVENT_TYPE_LABELS[event.event_type ?? ''] ?? 'Activity'}
          </p>
          <PriorityBadge priority={event.priority} />
          {event.event_type && (
            <span style={{
              fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 999,
              background: 'var(--portal-accent-subtle)', color: 'var(--portal-accent)',
              flexShrink: 0,
            }}>
              {EVENT_TYPE_LABELS[event.event_type] ?? event.event_type}
            </span>
          )}
          {event.acted_on && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 10, color: '#22c55e', fontWeight: 600 }}>
              <CheckCircle2 size={10} /> Actioned
            </span>
          )}
        </div>

        {/* Description */}
        {event.description && (
          <p style={{ fontSize: 12, color: 'var(--portal-text-secondary)', margin: '0 0 7px', lineHeight: 1.55 }}>
            {event.description}
          </p>
        )}

        {/* Meta row: account / prospect / time */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          {event.account && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--portal-text-tertiary)' }}>
              <Building2 size={10} />
              {event.account.company_name}
            </span>
          )}
          {event.prospect && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--portal-text-tertiary)' }}>
              <UserCheck size={10} />
              {event.prospect.full_name}
              {event.prospect.title && <span style={{ color: 'var(--portal-text-tertiary)', opacity: 0.7 }}>· {event.prospect.title}</span>}
            </span>
          )}
          <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 11, color: 'var(--portal-text-tertiary)', marginLeft: 'auto' }}>
            <Clock size={10} />
            {timeAgo(event.created_at)}
          </span>
        </div>
      </div>

      {/* Action button */}
      {!event.acted_on && (
        <div style={{ display: 'flex', alignItems: 'center', padding: '0 14px', flexShrink: 0 }}>
          <button
            onClick={handleAction}
            disabled={actioning}
            style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '6px 11px', border: '1px solid var(--portal-border-default)',
              borderRadius: 8, background: 'none', fontSize: 11, fontWeight: 600,
              color: 'var(--portal-text-secondary)', cursor: 'pointer',
              opacity: actioning ? 0.5 : 1, whiteSpace: 'nowrap',
              transition: 'background 0.15s, color 0.15s',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.background = 'var(--portal-accent-subtle)';
              (e.currentTarget as HTMLButtonElement).style.color = 'var(--portal-accent)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.background = 'none';
              (e.currentTarget as HTMLButtonElement).style.color = 'var(--portal-text-secondary)';
            }}
          >
            <CheckCircle2 size={11} />
            {actioning ? 'Saving…' : 'Mark done'}
          </button>
        </div>
      )}
    </div>
  );
}

function DateGroupHeader({ label, count }: { label: string; count: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8 }}>
      <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--portal-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        {label}
      </span>
      <span style={{ fontSize: 10, color: 'var(--portal-text-tertiary)', background: 'var(--portal-bg-hover)', borderRadius: 99, padding: '1px 7px', fontWeight: 600 }}>
        {count}
      </span>
      <div style={{ flex: 1, height: 1, background: 'var(--portal-border-default)', opacity: 0.6 }} />
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────

type FilterKey = 'all' | 'high_priority' | 'unactioned';

export default function ActivityFeedPage() {
  const { events, loading, markActioned } = useFeedEvents();
  const [filter, setFilter] = useState<FilterKey>('all');

  const highPriority = events.filter(e => e.priority === 'critical' || e.priority === 'high');
  const unactioned  = events.filter(e => !e.acted_on);

  const displayed = filter === 'high_priority' ? highPriority
                  : filter === 'unactioned'    ? unactioned
                  : events;

  // Group by date bucket
  const grouped = GROUP_ORDER.reduce<Record<Group, FeedEvent[]>>(
    (acc, g) => { acc[g] = []; return acc; },
    { Today: [], Yesterday: [], 'This Week': [], Earlier: [] }
  );
  for (const e of displayed) {
    grouped[getGroup(e.created_at)].push(e);
  }

  const tabStyle = (active: boolean): React.CSSProperties => ({
    padding: '6px 14px', fontSize: 13, fontWeight: active ? 600 : 500,
    borderRadius: 8, border: 'none', cursor: 'pointer',
    background: active ? 'var(--portal-accent-subtle)' : 'transparent',
    color: active ? 'var(--portal-accent)' : 'var(--portal-text-tertiary)',
    transition: 'background 0.15s, color 0.15s',
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--portal-text-primary)', margin: 0 }}>
            Activity Feed
          </h1>
          <p style={{ fontSize: 13, color: 'var(--portal-text-tertiary)', margin: '4px 0 0' }}>
            Unified chronological log of all LeadForge trigger events
          </p>
        </div>

        {/* Stat cards */}
        <div style={{ display: 'flex', gap: 10 }}>
          {[
            { label: 'Total',        value: events.length,          key: 'all'           as FilterKey },
            { label: 'High Priority', value: highPriority.length,   key: 'high_priority' as FilterKey },
            { label: 'Unactioned',   value: unactioned.length,      key: 'unactioned'    as FilterKey },
          ].map(s => (
            <div
              key={s.key}
              onClick={() => setFilter(s.key)}
              style={{
                padding: '10px 16px',
                background: filter === s.key ? 'var(--portal-accent-subtle)' : 'var(--portal-bg-secondary)',
                border: `1px solid ${filter === s.key ? 'var(--portal-accent)' : 'var(--portal-border-default)'}`,
                borderRadius: 12, textAlign: 'center', cursor: 'pointer',
                transition: 'border 0.15s, background 0.15s',
              }}
            >
              <p style={{ fontSize: 20, fontWeight: 800, color: filter === s.key ? 'var(--portal-accent)' : 'var(--portal-text-primary)', margin: 0, lineHeight: 1 }}>
                {loading ? '—' : s.value}
              </p>
              <p style={{ fontSize: 11, color: 'var(--portal-text-tertiary)', margin: '3px 0 0', whiteSpace: 'nowrap' }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Filter tabs ── */}
      <div style={{ display: 'flex', gap: 4, padding: 4, background: 'var(--portal-bg-hover)', borderRadius: 12, width: 'fit-content' }}>
        <button style={tabStyle(filter === 'all')} onClick={() => setFilter('all')}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <Activity size={12} /> All ({events.length})
          </span>
        </button>
        <button style={tabStyle(filter === 'high_priority')} onClick={() => setFilter('high_priority')}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <AlertTriangle size={12} /> High Priority ({highPriority.length})
          </span>
        </button>
        <button style={tabStyle(filter === 'unactioned')} onClick={() => setFilter('unactioned')}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <Filter size={12} /> Unactioned ({unactioned.length})
          </span>
        </button>
      </div>

      {/* ── Feed ── */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
          <div style={{
            width: 28, height: 28, borderRadius: '50%',
            border: '2px solid var(--portal-accent)', borderTopColor: 'transparent',
            animation: 'spin 0.8s linear infinite',
          }} />
        </div>
      ) : displayed.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '80px 0',
          background: 'var(--portal-bg-secondary)',
          border: '1px solid var(--portal-border-default)', borderRadius: 16,
        }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14,
            background: 'var(--portal-accent-subtle)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
          }}>
            <Activity size={22} strokeWidth={1.5} color="var(--portal-accent)" />
          </div>
          <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--portal-text-primary)', margin: '0 0 4px' }}>
            No activity yet
          </p>
          <p style={{ fontSize: 13, color: 'var(--portal-text-tertiary)', margin: 0 }}>
            {filter === 'high_priority' ? 'No high-priority events to show.'
              : filter === 'unactioned' ? 'All caught up — nothing unactioned.'
              : 'Trigger events will appear here as they come in.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {GROUP_ORDER.map(group => {
            const items = grouped[group];
            if (items.length === 0) return null;
            return (
              <div key={group} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <DateGroupHeader label={group} count={items.length} />
                {items.map(event => (
                  <FeedItem key={event.id} event={event} onMarkActioned={markActioned} />
                ))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
