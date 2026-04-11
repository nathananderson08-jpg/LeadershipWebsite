'use client';

import Link from 'next/link';
import { Target, Upload, FileText, Zap, AlertCircle, TrendingUp } from 'lucide-react';
import { useLeadForgeStats, useProspects, useTriggerEvents } from '@/hooks/portal/useLeadForge';

function IcpBadge({ score }: { score: number }) {
  const color = score >= 80 ? '#4ade80' : score >= 60 ? '#f59e0b' : '#ef4444';
  const bg = score >= 80 ? 'rgba(74,222,128,0.1)' : score >= 60 ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)';
  return (
    <span style={{ background: bg, color, fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '999px' }}>
      {score}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: string | null }) {
  const map: Record<string, { color: string; bg: string }> = {
    critical: { color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
    high: { color: '#f97316', bg: 'rgba(249,115,22,0.1)' },
    medium: { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  };
  const style = map[priority ?? ''] ?? { color: '#6b9a7d', bg: 'rgba(93,171,121,0.1)' };
  return (
    <span style={{ ...style, fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '999px', textTransform: 'capitalize' }}>
      {priority ?? 'unknown'}
    </span>
  );
}

export default function LeadForgePage() {
  const { prospectsTotal, triggerEventsThisWeek, activeCampaigns, pendingReview, loading } = useLeadForgeStats();
  const { prospects } = useProspects();
  const { events } = useTriggerEvents();

  const topProspects = prospects.slice(0, 5);
  const recentEvents = events.slice(0, 5);

  const statCards = [
    { label: 'Prospects in Pipeline', value: prospectsTotal, href: '/portal/dashboard/leadforge/prospects', action: '+ Add' },
    { label: 'Trigger Events This Week', value: triggerEventsThisWeek, href: '/portal/dashboard/leadforge/triggers', action: null },
    { label: 'Active Campaigns', value: activeCampaigns, href: '/portal/dashboard/leadforge/campaigns', action: null },
    { label: 'Content Pending Review', value: pendingReview, href: '/portal/dashboard/leadforge/content', action: null },
  ];

  const quickActions = [
    { label: 'Import Prospects', description: 'Upload a CSV or add prospects manually.', icon: Upload, href: '/portal/dashboard/leadforge/prospects' },
    { label: 'Generate Content', description: 'Create micro-research briefs, emails, and posts.', icon: FileText, href: '/portal/dashboard/leadforge/content' },
    { label: 'View Campaigns', description: 'Track accounts across all four pipeline phases.', icon: Zap, href: '/portal/dashboard/leadforge/campaigns' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        {statCards.map((s) => (
          <Link key={s.label} href={s.href} style={{ textDecoration: 'none' }}>
            <div style={{ background: 'var(--portal-bg-secondary)', border: '1px solid var(--portal-border-default)', borderRadius: 16, padding: '20px 24px', cursor: 'pointer', transition: 'border-color 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--portal-border-accent)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--portal-border-default)')}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <p style={{ fontSize: '32px', fontWeight: 800, color: 'var(--portal-text-primary)', margin: 0, lineHeight: 1 }}>
                  {loading ? '—' : s.value}
                </p>
                {s.action && (
                  <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--portal-accent)', background: 'var(--portal-accent-subtle)', padding: '3px 8px', borderRadius: 999 }}>
                    {s.action}
                  </span>
                )}
              </div>
              <p style={{ fontSize: '12px', color: 'var(--portal-text-tertiary)', marginTop: 8 }}>{s.label}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Two-column panels */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Recent trigger events */}
        <div style={{ background: 'var(--portal-bg-secondary)', border: '1px solid var(--portal-border-default)', borderRadius: 16, padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <p style={{ fontWeight: 700, fontSize: '14px', color: 'var(--portal-text-primary)', margin: 0 }}>Recent Trigger Events</p>
            <Link href="/portal/dashboard/leadforge/triggers" style={{ fontSize: '12px', color: 'var(--portal-accent)', textDecoration: 'none' }}>View all →</Link>
          </div>
          {recentEvents.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 0' }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--portal-accent-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                <AlertCircle size={20} strokeWidth={1.8} color="var(--portal-accent)" />
              </div>
              <p style={{ fontSize: '13px', color: 'var(--portal-text-tertiary)', margin: 0 }}>No trigger events detected yet.</p>
              <p style={{ fontSize: '12px', color: 'var(--portal-text-tertiary)', marginTop: 4, opacity: 0.7 }}>Add prospects to begin monitoring.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {recentEvents.map(ev => (
                <div key={ev.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'var(--portal-bg-hover)', borderRadius: 10 }}>
                  <div>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--portal-text-primary)', margin: 0 }}>
                      {ev.account?.company_name ?? 'Unknown company'}
                    </p>
                    <p style={{ fontSize: '11px', color: 'var(--portal-text-tertiary)', margin: '2px 0 0', textTransform: 'capitalize' }}>
                      {ev.event_type?.replace(/_/g, ' ') ?? '—'}
                    </p>
                  </div>
                  <PriorityBadge priority={ev.priority} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top prospects */}
        <div style={{ background: 'var(--portal-bg-secondary)', border: '1px solid var(--portal-border-default)', borderRadius: 16, padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <p style={{ fontWeight: 700, fontSize: '14px', color: 'var(--portal-text-primary)', margin: 0 }}>Top Prospects by ICP Score</p>
            <Link href="/portal/dashboard/leadforge/prospects" style={{ fontSize: '12px', color: 'var(--portal-accent)', textDecoration: 'none' }}>View all →</Link>
          </div>
          {topProspects.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 0' }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--portal-accent-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                <TrendingUp size={20} strokeWidth={1.8} color="var(--portal-accent)" />
              </div>
              <p style={{ fontSize: '13px', color: 'var(--portal-text-tertiary)', margin: 0 }}>No prospects loaded yet.</p>
              <Link href="/portal/dashboard/leadforge/prospects" style={{ fontSize: '12px', color: 'var(--portal-accent)', textDecoration: 'none', display: 'inline-block', marginTop: 8 }}>
                Import your first prospects →
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {topProspects.map(p => (
                <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'var(--portal-bg-hover)', borderRadius: 10 }}>
                  <div>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--portal-text-primary)', margin: 0 }}>{p.full_name}</p>
                    <p style={{ fontSize: '11px', color: 'var(--portal-text-tertiary)', margin: '2px 0 0' }}>
                      {p.title ?? '—'}{p.account ? ` · ${p.account.company_name}` : ''}
                    </p>
                  </div>
                  <IcpBadge score={p.icp_score} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div>
        <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--portal-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Quick Actions</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {quickActions.map(({ label, description, icon: Icon, href }) => (
            <Link key={label} href={href} style={{ textDecoration: 'none' }}>
              <div style={{ background: 'var(--portal-bg-secondary)', border: '1px solid var(--portal-border-default)', borderRadius: 16, padding: '20px', cursor: 'pointer', transition: 'border-color 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--portal-border-accent)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--portal-border-default)')}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--portal-accent-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                  <Icon size={18} strokeWidth={1.8} color="var(--portal-accent)" />
                </div>
                <p style={{ fontSize: '14px', fontWeight: 700, color: 'var(--portal-text-primary)', margin: '0 0 4px' }}>{label}</p>
                <p style={{ fontSize: '12px', color: 'var(--portal-text-tertiary)', margin: 0 }}>{description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
