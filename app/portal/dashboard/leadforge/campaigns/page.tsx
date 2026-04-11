'use client';

import { useProspects, type LeadForgeProspect } from '@/hooks/portal/useLeadForge';

const COLUMNS = [
  { id: 'awareness', label: 'Awareness', color: '#5dab79', bg: 'rgba(93,171,121,0.08)' },
  { id: 'value_delivery', label: 'Value Delivery', color: '#6366f1', bg: 'rgba(99,102,241,0.08)' },
  { id: 'outreach', label: 'Outreach', color: '#f59e0b', bg: 'rgba(245,158,11,0.08)' },
  { id: 'conversion', label: 'Conversion', color: '#22c55e', bg: 'rgba(34,197,94,0.08)' },
] as const;

function IcpBadge({ score }: { score: number }) {
  const color = score >= 80 ? '#4ade80' : score >= 60 ? '#f59e0b' : '#ef4444';
  const bg = score >= 80 ? 'rgba(74,222,128,0.1)' : score >= 60 ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)';
  return <span style={{ background: bg, color, fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: 999 }}>{score}</span>;
}

function ProspectCard({ prospect }: { prospect: LeadForgeProspect }) {
  const daysSince = Math.floor((Date.now() - new Date(prospect.created_at).getTime()) / (1000 * 60 * 60 * 24));
  return (
    <div style={{ padding: '14px 16px', background: 'var(--portal-bg-secondary)', border: '1px solid var(--portal-border-default)', borderRadius: 12, marginBottom: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--portal-text-primary)', margin: 0, lineHeight: 1.3 }}>{prospect.full_name}</p>
        <IcpBadge score={prospect.icp_score} />
      </div>
      <p style={{ fontSize: 11, color: 'var(--portal-text-tertiary)', margin: '0 0 8px', lineHeight: 1.4 }}>
        {prospect.title ?? '—'}{prospect.account ? ` · ${prospect.account.company_name}` : ''}
      </p>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 10, color: 'var(--portal-text-tertiary)' }}>{daysSince}d in stage</span>
        <div style={{ display: 'flex', gap: 8 }}>
          {prospect.email && <a href={`mailto:${prospect.email}`} style={{ fontSize: 10, color: 'var(--portal-accent)', textDecoration: 'none', fontWeight: 600 }}>Email</a>}
          {prospect.linkedin_url && <a href={prospect.linkedin_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 10, color: 'var(--portal-accent)', textDecoration: 'none', fontWeight: 600 }}>LinkedIn</a>}
        </div>
      </div>
    </div>
  );
}

export default function CampaignsPage() {
  const { prospects, loading } = useProspects();

  const byStage = (stage: string) => prospects.filter(p => p.stage === stage);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, height: '100%' }}>
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--portal-text-primary)', margin: 0 }}>Campaign Dashboard</h1>
        <p style={{ fontSize: 13, color: 'var(--portal-text-tertiary)', margin: '4px 0 0' }}>
          {prospects.length} prospect{prospects.length !== 1 ? 's' : ''} across {COLUMNS.filter(c => byStage(c.id).length > 0).length} active phase{COLUMNS.filter(c => byStage(c.id).length > 0).length !== 1 ? 's' : ''}
        </p>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', border: '2px solid var(--portal-accent)', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, flex: 1 }}>
          {COLUMNS.map(col => {
            const colProspects = byStage(col.id);
            return (
              <div key={col.id} style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {/* Column header */}
                <div style={{ padding: '12px 16px', borderRadius: '12px 12px 0 0', background: col.bg, borderBottom: `2px solid ${col.color}`, marginBottom: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: col.color, margin: 0 }}>{col.label}</p>
                    <span style={{ fontSize: 12, fontWeight: 700, padding: '2px 8px', borderRadius: 999, background: col.bg, color: col.color, border: `1px solid ${col.color}40` }}>
                      {colProspects.length}
                    </span>
                  </div>
                </div>

                {/* Column body */}
                <div style={{ flex: 1, padding: '12px', background: 'var(--portal-bg-hover)', borderRadius: '0 0 12px 12px', minHeight: 300 }}>
                  {colProspects.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '32px 12px', border: '1px dashed var(--portal-border-default)', borderRadius: 10 }}>
                      <p style={{ fontSize: 12, color: 'var(--portal-text-tertiary)', margin: 0 }}>No accounts in this phase</p>
                    </div>
                  ) : (
                    colProspects.map(p => <ProspectCard key={p.id} prospect={p} />)
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
