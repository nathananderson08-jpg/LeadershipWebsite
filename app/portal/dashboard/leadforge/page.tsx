'use client';

import Link from 'next/link';
import { Target, FileText, Zap, AlertCircle, TrendingUp, AlertTriangle, Clock, ChevronRight, Building2 } from 'lucide-react';
import { useLeadForgeStats, useAccounts } from '@/hooks/portal/useLeadForge';

function IcpBadge({ score }: { score: number }) {
  const color = score >= 80 ? '#4ade80' : score >= 60 ? '#f59e0b' : '#ef4444';
  const bg    = score >= 80 ? 'rgba(74,222,128,0.1)' : score >= 60 ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)';
  return <span style={{ background: bg, color, fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '999px' }}>{score}</span>;
}

function PriorityBadge({ priority }: { priority: string | null }) {
  const map: Record<string, { color: string; bg: string }> = {
    critical: { color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
    high:     { color: '#f97316', bg: 'rgba(249,115,22,0.1)' },
    medium:   { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  };
  const style = map[priority ?? ''] ?? { color: '#6b9a7d', bg: 'rgba(93,171,121,0.1)' };
  return <span style={{ ...style, fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '999px', textTransform: 'capitalize' }}>{priority ?? 'low'}</span>;
}

function StageDot({ stage }: { stage: string }) {
  const colors: Record<string, string> = {
    identified: '#94a3b8', researched: '#6366f1', warming: '#f59e0b',
    outreach: '#f97316', engaged: '#8b5cf6', qualified: '#22c55e', proposal: '#4ade80', client: '#5dab79',
  };
  const c = colors[stage] ?? '#94a3b8';
  return <span style={{ width: 7, height: 7, borderRadius: '50%', background: c, display: 'inline-block', flexShrink: 0 }} />;
}

const PIPELINE_STAGES_ORDERED = [
  { id: 'identified',  label: 'Identified',  color: '#94a3b8' },
  { id: 'researched',  label: 'Researched',  color: '#6366f1' },
  { id: 'warming',     label: 'Warming',     color: '#f59e0b' },
  { id: 'outreach',    label: 'Outreach',    color: '#f97316' },
  { id: 'engaged',     label: 'Engaged',     color: '#8b5cf6' },
  { id: 'qualified',   label: 'Qualified',   color: '#22c55e' },
  { id: 'proposal',    label: 'Proposal',    color: '#4ade80' },
  { id: 'client',      label: 'Client',      color: '#5dab79' },
];

function PipelineFunnel({ prospects }: { prospects: any[] }) {
  const maxCount = Math.max(...PIPELINE_STAGES_ORDERED.map(s =>
    prospects.filter(p => (p.pipeline_stage ?? 'identified') === s.id).length
  ), 1);

  return (
    <div style={{ background: 'var(--portal-bg-secondary)', border: '1px solid var(--portal-border-default)', borderRadius: 16, padding: '20px 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <p style={{ fontWeight: 700, fontSize: '13px', color: 'var(--portal-text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
          <TrendingUp size={14} color="var(--portal-accent)" /> Pipeline Funnel
        </p>
        <Link href="/portal/dashboard/leadforge/campaigns" style={{ fontSize: '11px', color: 'var(--portal-accent)', textDecoration: 'none' }}>Open Kanban →</Link>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        {PIPELINE_STAGES_ORDERED.map(stage => {
          const count = prospects.filter(p => (p.pipeline_stage ?? 'identified') === stage.id).length;
          const widthPct = Math.max((count / maxCount) * 100, 2);
          return (
            <div key={stage.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--portal-text-tertiary)', width: 68, textAlign: 'right', flexShrink: 0 }}>{stage.label}</span>
              <div style={{ flex: 1, height: 20, background: 'var(--portal-bg-hover)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: `${widthPct}%`, height: '100%', background: stage.color, borderRadius: 4, transition: 'width 0.4s ease', opacity: count === 0 ? 0.15 : 1 }} />
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, color: count > 0 ? stage.color : 'var(--portal-text-tertiary)', width: 22, flexShrink: 0 }}>{count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function LeadForgePage() {
  const { prospectsTotal, triggerEventsThisWeek, activeCampaigns, pendingReview, loading, prospects, events } = useLeadForgeStats();
  const { accounts } = useAccounts();

  const now = Date.now();

  // Hot prospects
  const hotProspects = prospects.filter(p => (p as any).warmth_score === 'hot').slice(0, 5);

  // Stale prospects (>14 days no activity, not client)
  const staleProspects = prospects
    .filter(p => {
      const pa = p as any;
      if (pa.pipeline_stage === 'client') return false;
      const days = Math.floor((now - new Date(pa.last_activity_at ?? p.created_at).getTime()) / 86400000);
      return days > 14;
    })
    .sort((a, b) => {
      const da = Math.floor((now - new Date((a as any).last_activity_at ?? a.created_at).getTime()) / 86400000);
      const db = Math.floor((now - new Date((b as any).last_activity_at ?? b.created_at).getTime()) / 86400000);
      return db - da;
    })
    .slice(0, 5);

  // Next actions
  const nextActions = prospects
    .filter(p => (p as any).next_action && (p as any).pipeline_stage !== 'client')
    .sort((a, b) => b.icp_score - a.icp_score)
    .slice(0, 5);

  const recentEvents = events.slice(0, 4);

  const statCards = [
    { label: 'Total Prospects',          value: prospectsTotal,         href: '/portal/dashboard/leadforge/prospects', badge: null },
    { label: 'Target Accounts',          value: accounts.length,        href: '/portal/dashboard/leadforge/accounts',  badge: null },
    { label: 'Trigger Events This Week', value: triggerEventsThisWeek,  href: '/portal/dashboard/leadforge/triggers',  badge: null },
    { label: 'Active Pipeline',          value: activeCampaigns,        href: '/portal/dashboard/leadforge/campaigns', badge: null },
    { label: 'Actions Needed',           value: staleProspects.length,  href: '/portal/dashboard/leadforge/actions',   badge: staleProspects.length > 0 ? '!' : null },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--portal-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Target size={20} color="white" strokeWidth={1.8} />
        </div>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--portal-text-primary)', margin: 0 }}>LeadForge</h1>
          <p style={{ fontSize: '13px', color: 'var(--portal-text-tertiary)', margin: 0 }}>Prospect Intelligence & Activation</p>
        </div>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '14px' }}>
        {statCards.map((s) => (
          <Link key={s.label} href={s.href} style={{ textDecoration: 'none' }}>
            <div style={{ background: 'var(--portal-bg-secondary)', border: '1px solid var(--portal-border-default)', borderRadius: 16, padding: '18px 22px', cursor: 'pointer', transition: 'border-color 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--portal-border-accent)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--portal-border-default)')}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <p style={{ fontSize: '30px', fontWeight: 800, color: 'var(--portal-text-primary)', margin: 0, lineHeight: 1 }}>
                  {loading ? '—' : s.value}
                </p>
                {s.badge && (
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#ef4444', background: 'rgba(239,68,68,0.1)', padding: '2px 8px', borderRadius: 999 }}>
                    {s.badge}
                  </span>
                )}
              </div>
              <p style={{ fontSize: '12px', color: 'var(--portal-text-tertiary)', marginTop: 8 }}>{s.label}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Three-column panels */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>

        {/* Hot prospects */}
        <div style={{ background: 'var(--portal-bg-secondary)', border: '1px solid var(--portal-border-default)', borderRadius: 16, padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <p style={{ fontWeight: 700, fontSize: '13px', color: 'var(--portal-text-primary)', margin: 0 }}>🔥 Hot Prospects</p>
            <Link href="/portal/dashboard/leadforge/prospects?warmth=hot" style={{ fontSize: '11px', color: 'var(--portal-accent)', textDecoration: 'none' }}>All →</Link>
          </div>
          {hotProspects.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <TrendingUp size={20} strokeWidth={1.5} color="var(--portal-text-tertiary)" style={{ margin: '0 auto 8px', display: 'block' }} />
              <p style={{ fontSize: '12px', color: 'var(--portal-text-tertiary)', margin: 0 }}>No hot prospects yet.</p>
              <p style={{ fontSize: '11px', color: 'var(--portal-text-tertiary)', margin: '4px 0 0', opacity: 0.7 }}>Mark prospects as Hot in their profile.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {hotProspects.map(p => (
                <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 12px', background: 'var(--portal-bg-hover)', borderRadius: 9 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, minWidth: 0 }}>
                    <StageDot stage={(p as any).pipeline_stage ?? 'identified'} />
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--portal-text-primary)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.full_name}</p>
                      <p style={{ fontSize: '10px', color: 'var(--portal-text-tertiary)', margin: '1px 0 0' }}>{p.account?.company_name ?? '—'}</p>
                    </div>
                  </div>
                  <IcpBadge score={p.icp_score} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Stale / needs attention */}
        <div style={{ background: 'var(--portal-bg-secondary)', border: '1px solid var(--portal-border-default)', borderRadius: 16, padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <p style={{ fontWeight: 700, fontSize: '13px', color: 'var(--portal-text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: 5 }}>
              <AlertTriangle size={13} color="#f59e0b" /> Needs Attention
            </p>
            <Link href="/portal/dashboard/leadforge/actions" style={{ fontSize: '11px', color: 'var(--portal-accent)', textDecoration: 'none' }}>All →</Link>
          </div>
          {staleProspects.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <p style={{ fontSize: '12px', color: 'var(--portal-text-tertiary)', margin: 0 }}>All caught up 🎉</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {staleProspects.map(p => {
                const days = Math.floor((now - new Date((p as any).last_activity_at ?? p.created_at).getTime()) / 86400000);
                return (
                  <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 12px', background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.15)', borderRadius: 9 }}>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--portal-text-primary)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.full_name}</p>
                      <p style={{ fontSize: '10px', color: 'var(--portal-text-tertiary)', margin: '1px 0 0' }}>{p.account?.company_name ?? '—'}</p>
                    </div>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 10, color: '#f59e0b', fontWeight: 700, flexShrink: 0 }}>
                      <Clock size={9} /> {days}d
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Next actions */}
        <div style={{ background: 'var(--portal-bg-secondary)', border: '1px solid var(--portal-border-default)', borderRadius: 16, padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <p style={{ fontWeight: 700, fontSize: '13px', color: 'var(--portal-text-primary)', margin: 0 }}>Next Actions</p>
            <Link href="/portal/dashboard/leadforge/actions" style={{ fontSize: '11px', color: 'var(--portal-accent)', textDecoration: 'none' }}>All →</Link>
          </div>
          {nextActions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <p style={{ fontSize: '12px', color: 'var(--portal-text-tertiary)', margin: 0 }}>No queued actions.</p>
              <p style={{ fontSize: '11px', color: 'var(--portal-text-tertiary)', margin: '4px 0 0', opacity: 0.7 }}>Set a next action in any prospect profile.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {nextActions.map(p => (
                <div key={p.id} style={{ padding: '9px 12px', background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: 9 }}>
                  <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--portal-text-primary)', margin: '0 0 3px' }}>{p.full_name}</p>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 4 }}>
                    <ChevronRight size={10} color="#6366f1" style={{ flexShrink: 0, marginTop: 2 }} />
                    <p style={{ fontSize: '10px', color: '#6366f1', margin: 0, lineHeight: 1.4 }}>{(p as any).next_action}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Pipeline funnel */}
      {!loading && prospects.length > 0 && <PipelineFunnel prospects={prospects} />}

      {/* Recent trigger events */}
      <div style={{ background: 'var(--portal-bg-secondary)', border: '1px solid var(--portal-border-default)', borderRadius: 16, padding: '20px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Zap size={14} color="var(--portal-accent)" />
            <p style={{ fontWeight: 700, fontSize: '13px', color: 'var(--portal-text-primary)', margin: 0 }}>Recent Trigger Events</p>
          </div>
          <Link href="/portal/dashboard/leadforge/triggers" style={{ fontSize: '11px', color: 'var(--portal-accent)', textDecoration: 'none' }}>View all →</Link>
        </div>
        {recentEvents.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <AlertCircle size={18} strokeWidth={1.5} color="var(--portal-text-tertiary)" style={{ margin: '0 auto 8px', display: 'block' }} />
            <p style={{ fontSize: '12px', color: 'var(--portal-text-tertiary)', margin: 0 }}>No trigger events yet. Log an event to see prospects auto-flagged.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
            {recentEvents.map(ev => (
              <div key={ev.id} style={{ padding: '10px 14px', background: 'var(--portal-bg-hover)', borderRadius: 10 }}>
                <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--portal-text-primary)', margin: '0 0 3px' }}>
                  {ev.account?.company_name ?? 'Unknown'}
                </p>
                <p style={{ fontSize: '10px', color: 'var(--portal-text-tertiary)', margin: '0 0 6px', textTransform: 'capitalize' }}>
                  {ev.event_type?.replace(/_/g, ' ') ?? '—'}
                </p>
                <PriorityBadge priority={ev.priority} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div>
        <p style={{ fontSize: '11px', fontWeight: 600, color: 'var(--portal-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Quick Actions</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
          {[
            { label: 'AI Prospect Lookup', desc: 'Find CHROs and People leaders at any company', icon: Target, href: '/portal/dashboard/leadforge/prospects/lookup' },
            { label: 'Import CSV',         desc: 'Bulk upload prospects from a spreadsheet',    icon: FileText, href: '/portal/dashboard/leadforge/prospects/import' },
            { label: 'Log Trigger Event',  desc: 'Record an event and auto-flag linked prospects', icon: Zap, href: '/portal/dashboard/leadforge/triggers' },
            { label: 'Review Content',     desc: 'Approve AI-generated pieces in the library',  icon: AlertCircle, href: '/portal/dashboard/leadforge/content' },
          ].map(({ label, desc, icon: Icon, href }) => (
            <Link key={label} href={href} style={{ textDecoration: 'none' }}>
              <div style={{ background: 'var(--portal-bg-secondary)', border: '1px solid var(--portal-border-default)', borderRadius: 14, padding: '16px', cursor: 'pointer', transition: 'border-color 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--portal-border-accent)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--portal-border-default)')}>
                <div style={{ width: 32, height: 32, borderRadius: 9, background: 'var(--portal-accent-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                  <Icon size={16} strokeWidth={1.8} color="var(--portal-accent)" />
                </div>
                <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--portal-text-primary)', margin: '0 0 3px' }}>{label}</p>
                <p style={{ fontSize: '11px', color: 'var(--portal-text-tertiary)', margin: 0, lineHeight: 1.4 }}>{desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
