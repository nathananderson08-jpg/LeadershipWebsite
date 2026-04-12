'use client';

import { useState } from 'react';
import { Clock, Mail, ExternalLink, ChevronRight } from 'lucide-react';
import { useProspects, type LeadForgeProspect } from '@/hooks/portal/useLeadForge';

const COLUMNS = [
  { id: 'identified',  label: 'Identified',  color: '#94a3b8', bg: 'rgba(148,163,184,0.08)' },
  { id: 'researched',  label: 'Researched',  color: '#6366f1', bg: 'rgba(99,102,241,0.08)'  },
  { id: 'warming',     label: 'Warming',     color: '#f59e0b', bg: 'rgba(245,158,11,0.08)'  },
  { id: 'outreach',    label: 'Outreach',    color: '#f97316', bg: 'rgba(249,115,22,0.08)'  },
  { id: 'engaged',     label: 'Engaged',     color: '#8b5cf6', bg: 'rgba(139,92,246,0.08)'  },
  { id: 'qualified',   label: 'Qualified',   color: '#22c55e', bg: 'rgba(34,197,94,0.08)'   },
  { id: 'proposal',    label: 'Proposal',    color: '#4ade80', bg: 'rgba(74,222,128,0.08)'  },
  { id: 'client',      label: 'Client ✓',   color: '#5dab79', bg: 'rgba(93,171,121,0.12)'  },
] as const;

type ColumnId = typeof COLUMNS[number]['id'];

function IcpDot({ score }: { score: number }) {
  const color = score >= 80 ? '#4ade80' : score >= 60 ? '#f59e0b' : '#ef4444';
  return <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, display: 'inline-block', flexShrink: 0 }} />;
}

function WarmthIndicator({ warmth }: { warmth?: string | null }) {
  if (!warmth || warmth === 'cold') return null;
  const color = warmth === 'hot' ? '#ef4444' : '#f59e0b';
  const label = warmth === 'hot' ? '🔥' : '~';
  return <span style={{ fontSize: 10, color, fontWeight: 700 }}>{label}</span>;
}

function ProspectCard({ prospect, onStageChange }: { prospect: LeadForgeProspect; onStageChange: (id: string, stage: string) => Promise<void> }) {
  const p = prospect as any;
  const daysSince = Math.floor((Date.now() - new Date(p.last_activity_at ?? prospect.created_at).getTime()) / (1000 * 60 * 60 * 24));
  const isStale = daysSince > 14;
  const [moving, setMoving] = useState(false);

  const currentIdx = COLUMNS.findIndex(c => c.id === (p.pipeline_stage ?? 'identified'));
  const canAdvance = currentIdx < COLUMNS.length - 1;

  const handleAdvance = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!canAdvance || moving) return;
    setMoving(true);
    try {
      await onStageChange(prospect.id, COLUMNS[currentIdx + 1].id);
    } finally {
      setMoving(false);
    }
  };

  return (
    <div style={{
      padding: '12px 14px',
      background: 'var(--portal-bg-secondary)',
      border: '1px solid var(--portal-border-default)',
      borderRadius: 12,
      marginBottom: 8,
      cursor: 'default',
    }}>
      {/* Name row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
          <IcpDot score={prospect.icp_score} />
          <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--portal-text-primary)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{prospect.full_name}</p>
          <WarmthIndicator warmth={p.warmth_score} />
        </div>
        <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--portal-text-tertiary)', background: 'var(--portal-bg-hover)', padding: '1px 6px', borderRadius: 4, flexShrink: 0 }}>
          {prospect.icp_score}
        </span>
      </div>

      {/* Title / company */}
      <p style={{ fontSize: 11, color: 'var(--portal-text-tertiary)', margin: '0 0 8px', lineHeight: 1.4 }}>
        {prospect.title ?? '—'}{prospect.account ? ` · ${prospect.account.company_name}` : ''}
      </p>

      {/* Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 10, color: isStale ? '#ef4444' : 'var(--portal-text-tertiary)' }}>
            <Clock size={10} />{daysSince === 0 ? 'today' : `${daysSince}d`}
          </span>
          {prospect.email && (
            <a href={`mailto:${prospect.email}`} onClick={e => e.stopPropagation()} style={{ color: 'var(--portal-text-tertiary)', display: 'flex' }}>
              <Mail size={11} />
            </a>
          )}
          {prospect.linkedin_url && (
            <a href={prospect.linkedin_url} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} style={{ color: 'var(--portal-text-tertiary)', display: 'flex' }}>
              <ExternalLink size={11} />
            </a>
          )}
        </div>
        {canAdvance && (
          <button
            onClick={handleAdvance}
            disabled={moving}
            title={`Move to ${COLUMNS[currentIdx + 1].label}`}
            style={{
              display: 'flex', alignItems: 'center', gap: 3,
              padding: '3px 7px', border: `1px solid ${COLUMNS[currentIdx + 1].color}40`,
              borderRadius: 6, background: 'transparent',
              color: COLUMNS[currentIdx + 1].color, fontSize: 10, fontWeight: 600,
              cursor: moving ? 'default' : 'pointer', opacity: moving ? 0.5 : 1,
            }}
          >
            {COLUMNS[currentIdx + 1].label} <ChevronRight size={9} />
          </button>
        )}
      </div>

      {/* Next action if set */}
      {p.next_action && (
        <div style={{ marginTop: 8, padding: '5px 8px', background: 'rgba(99,102,241,0.07)', borderRadius: 6 }}>
          <p style={{ fontSize: 10, color: '#6366f1', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>→ {p.next_action}</p>
        </div>
      )}
    </div>
  );
}

export default function CampaignsPage() {
  const { prospects, loading, updateProspect } = useProspects();
  const [highlight, setHighlight] = useState<string | null>(null);

  const byStage = (stage: string) =>
    prospects
      .filter(p => (p as any).pipeline_stage === stage || (!( p as any).pipeline_stage && stage === 'identified'))
      .sort((a, b) => b.icp_score - a.icp_score);

  const handleStageChange = async (prospectId: string, newStage: string) => {
    setHighlight(prospectId);
    await updateProspect(prospectId, { pipeline_stage: newStage } as any);
    setTimeout(() => setHighlight(null), 1500);
  };

  const totalActive = prospects.filter(p => {
    const s = (p as any).pipeline_stage ?? 'identified';
    return s !== 'client' && s !== 'identified';
  }).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, height: '100%' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--portal-text-primary)', margin: 0 }}>Pipeline</h1>
        <p style={{ fontSize: 13, color: 'var(--portal-text-tertiary)', margin: '4px 0 0' }}>
          {prospects.length} prospect{prospects.length !== 1 ? 's' : ''} · {totalActive} active · click "→ Stage" to advance
        </p>
      </div>

      {/* Stage summary bar */}
      {!loading && prospects.length > 0 && (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {COLUMNS.map(col => {
            const count = byStage(col.id).length;
            if (count === 0) return null;
            return (
              <div key={col.id} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px', background: col.bg, border: `1px solid ${col.color}30`, borderRadius: 999 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: col.color, display: 'inline-block' }} />
                <span style={{ fontSize: 11, fontWeight: 600, color: col.color }}>{col.label}</span>
                <span style={{ fontSize: 11, color: col.color, opacity: 0.7 }}>{count}</span>
              </div>
            );
          })}
        </div>
      )}

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', border: '2px solid var(--portal-accent)', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
        </div>
      ) : (
        /* Horizontal scroll kanban */
        <div style={{ overflowX: 'auto', flex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${COLUMNS.length}, 220px)`, gap: 12, minWidth: COLUMNS.length * 232, paddingBottom: 16 }}>
            {COLUMNS.map(col => {
              const colProspects = byStage(col.id);
              return (
                <div key={col.id} style={{ display: 'flex', flexDirection: 'column', gap: 0, minWidth: 220 }}>
                  {/* Column header */}
                  <div style={{
                    padding: '10px 14px', borderRadius: '10px 10px 0 0',
                    background: col.bg, borderBottom: `2px solid ${col.color}`,
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <p style={{ fontSize: 12, fontWeight: 700, color: col.color, margin: 0 }}>{col.label}</p>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: '1px 7px', borderRadius: 999, background: `${col.color}18`, color: col.color }}>
                        {colProspects.length}
                      </span>
                    </div>
                  </div>

                  {/* Column body */}
                  <div style={{ flex: 1, padding: '10px', background: 'var(--portal-bg-hover)', borderRadius: '0 0 10px 10px', minHeight: 200 }}>
                    {colProspects.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '24px 8px', border: '1px dashed var(--portal-border-default)', borderRadius: 8 }}>
                        <p style={{ fontSize: 11, color: 'var(--portal-text-tertiary)', margin: 0 }}>Empty</p>
                      </div>
                    ) : (
                      colProspects.map(p => (
                        <div key={p.id} style={{ opacity: highlight === p.id ? 0.5 : 1, transition: 'opacity 0.3s' }}>
                          <ProspectCard prospect={p} onStageChange={handleStageChange} />
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
