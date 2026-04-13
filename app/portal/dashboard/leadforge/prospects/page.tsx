'use client';

import { useState } from 'react';
import {
  Search, Plus, X, ChevronUp, ChevronDown, Mail, ExternalLink,
  MoreHorizontal, Clock, Zap, FileText, Loader2, CheckCircle,
  MessageSquare, Calendar, Phone, Users, AlertTriangle, Send,
  Download, Trash2, CheckSquare, Square, LayoutList, Kanban,
} from 'lucide-react';
import {
  useProspects, useAccounts, useActivities, useLeadForgeContent,
  type CreateProspectInput, type CreateAccountInput, type LeadForgeProspect, type LeadForgeActivity,
} from '@/hooks/portal/useLeadForge';

// ── Constants ──────────────────────────────────────────────────────────────

const PIPELINE_STAGES = [
  { id: 'identified',  label: 'Identified',  color: '#94a3b8', bg: 'rgba(148,163,184,0.1)' },
  { id: 'researched',  label: 'Researched',  color: '#6366f1', bg: 'rgba(99,102,241,0.1)'  },
  { id: 'warming',     label: 'Warming',     color: '#f59e0b', bg: 'rgba(245,158,11,0.1)'  },
  { id: 'outreach',    label: 'Outreach',    color: '#f97316', bg: 'rgba(249,115,22,0.1)'  },
  { id: 'engaged',     label: 'Engaged',     color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)'  },
  { id: 'qualified',   label: 'Qualified',   color: '#22c55e', bg: 'rgba(34,197,94,0.1)'   },
  { id: 'proposal',    label: 'Proposal',    color: '#4ade80', bg: 'rgba(74,222,128,0.1)'  },
  { id: 'client',      label: 'Client',      color: '#5dab79', bg: 'rgba(93,171,121,0.15)' },
];

const WARMTH = [
  { id: 'cold', label: 'Cold', color: '#94a3b8' },
  { id: 'warm', label: 'Warm', color: '#f59e0b' },
  { id: 'hot',  label: 'Hot',  color: '#ef4444' },
];

const ACTIVITY_TYPES = [
  { id: 'note',              label: 'Note',              icon: MessageSquare, color: '#94a3b8' },
  { id: 'email_sent',        label: 'Email Sent',        icon: Send,          color: '#6366f1' },
  { id: 'email_received',    label: 'Email Received',    icon: Mail,          color: '#22c55e' },
  { id: 'linkedin_message',  label: 'LinkedIn Message',  icon: ExternalLink,  color: '#0ea5e9' },
  { id: 'call',              label: 'Call',              icon: Phone,         color: '#f59e0b' },
  { id: 'meeting',           label: 'Meeting',           icon: Calendar,      color: '#8b5cf6' },
  { id: 'content_shared',    label: 'Content Shared',    icon: FileText,      color: '#5dab79' },
  { id: 'trigger_flagged',   label: 'Trigger Detected',  icon: AlertTriangle, color: '#ef4444' },
  { id: 'referral',          label: 'Referral',          icon: Users,         color: '#f97316' },
];

const GENERATE_TYPES = [
  { id: 'micro_research', label: 'Micro-Research Brief',  desc: 'Insights brief personalised to their priorities' },
  { id: 'email_sequence', label: 'First-Touch Email',     desc: 'Personalized outreach email, no fluff'           },
  { id: 'linkedin_post',  label: 'LinkedIn Message',      desc: 'Connection request + follow-up message'          },
  { id: 'executive_summary', label: 'Account Brief',     desc: 'Internal brief on opportunity & approach'        },
  { id: 'comment_draft',  label: 'Comment Drafts',        desc: 'LinkedIn comment options for their posts'        },
];

// ── Shared UI ──────────────────────────────────────────────────────────────

function IcpBadge({ score }: { score: number }) {
  const [tip, setTip] = useState(false);
  const color = score >= 80 ? '#4ade80' : score >= 60 ? '#f59e0b' : '#ef4444';
  const bg    = score >= 80 ? 'rgba(74,222,128,0.1)' : score >= 60 ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)';
  const explanation = score >= 80
    ? 'High ICP (80–100): C-Suite HR/People leader — CHRO, CPO, CLO. Strong budget authority and strategic mandate for leadership programs.'
    : score >= 60
    ? 'Medium ICP (60–79): VP-level — VP HR, VP People, VP Talent. Significant influence over people programs and vendor selection.'
    : 'Lower ICP (<60): Director or Senior Manager level. Relevant but typically limited buying authority for senior leadership programs.';
  return (
    <span
      style={{ position: 'relative', background: bg, color, fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 999, cursor: 'default' }}
      onMouseEnter={() => setTip(true)}
      onMouseLeave={() => setTip(false)}
    >
      ICP {score}
      {tip && (
        <span style={{
          position: 'absolute', bottom: 'calc(100% + 6px)', left: '50%', transform: 'translateX(-50%)',
          background: 'var(--portal-bg-secondary)', border: '1px solid var(--portal-border-default)',
          borderRadius: 8, padding: '8px 12px', fontSize: 11, fontWeight: 400, color: 'var(--portal-text-secondary)',
          whiteSpace: 'normal', width: 220, lineHeight: 1.5, zIndex: 100,
          boxShadow: '0 4px 16px rgba(0,0,0,0.12)', pointerEvents: 'none',
        }}>
          {explanation}
        </span>
      )}
    </span>
  );
}

function StagePill({ stage }: { stage: string }) {
  const s = PIPELINE_STAGES.find(p => p.id === stage) ?? PIPELINE_STAGES[0];
  return <span style={{ background: s.bg, color: s.color, fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 999 }}>{s.label}</span>;
}

function WarmthDot({ warmth }: { warmth?: string | null }) {
  const w = WARMTH.find(x => x.id === warmth) ?? WARMTH[0];
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: w.color }}>
      <span style={{ width: 7, height: 7, borderRadius: '50%', background: w.color, display: 'inline-block' }} />
      {w.label}
    </span>
  );
}

function EmailConfidenceBadge({ confidence }: { confidence?: string | null }) {
  if (!confidence || confidence === 'unknown') return <span style={{ fontSize: 11, color: 'var(--portal-text-tertiary)' }}>—</span>;
  const color = confidence === 'verified' ? '#4ade80' : '#f59e0b';
  return <span style={{ fontSize: 10, color, fontWeight: 600, textTransform: 'capitalize' as const }}>{confidence}</span>;
}

function ActivityIcon({ type }: { type: string }) {
  const cfg = ACTIVITY_TYPES.find(a => a.id === type) ?? ACTIVITY_TYPES[0];
  const Icon = cfg.icon;
  return (
    <div style={{ width: 28, height: 28, borderRadius: '50%', background: `${cfg.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <Icon size={13} color={cfg.color} />
    </div>
  );
}

// ── HubSpot sync helper (fire-and-forget from client) ─────────────────────

async function syncToHubSpot(prospect: LeadForgeProspect) {
  try {
    await fetch('/portal/api/leadforge/hubspot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'sync_prospect', prospect }),
    });
  } catch {
    // non-blocking — don't surface HubSpot errors to user
  }
}

// ── Enrich Button ──────────────────────────────────────────────────────────

function EnrichButton({ prospect, onUpdate }: { prospect: LeadForgeProspect; onUpdate: (id: string, u: Partial<LeadForgeProspect>) => Promise<void> }) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'not_found' | 'error'>('idle');

  const handleEnrich = async () => {
    setStatus('loading');
    try {
      const res = await fetch('/portal/api/leadforge/enrich', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prospect }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      if (!data.found || !Object.keys(data.updates).length) {
        setStatus('not_found');
        setTimeout(() => setStatus('idle'), 3000);
        return;
      }
      await onUpdate(prospect.id, data.updates);
      setStatus('done');
      setTimeout(() => setStatus('idle'), 3000);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  const label = status === 'loading' ? 'Enriching…' : status === 'done' ? '✓ Enriched' : status === 'not_found' ? 'Not found' : status === 'error' ? 'Failed' : 'Enrich via Apollo';
  const color = status === 'done' ? '#4ade80' : status === 'not_found' || status === 'error' ? '#ef4444' : 'var(--portal-accent)';

  return (
    <button
      onClick={handleEnrich}
      disabled={status === 'loading' || status === 'done'}
      style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', border: `1px solid ${color}40`, borderRadius: 7, background: 'transparent', color, fontSize: 11, fontWeight: 600, cursor: status === 'idle' ? 'pointer' : 'default', opacity: status === 'loading' ? 0.7 : 1 }}
    >
      {status === 'loading' ? <Loader2 size={10} style={{ animation: 'spin 0.8s linear infinite' }} /> : <Zap size={10} />}
      {label}
    </button>
  );
}

// ── Drawer Tabs ────────────────────────────────────────────────────────────

function InlineEditField({ label, value, onSave, multiline, placeholder, accent }: {
  label: string; value: string | null | undefined; onSave: (v: string | null) => Promise<void>;
  multiline?: boolean; placeholder?: string; accent?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value ?? '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(draft.trim() || null);
      setEditing(false);
    } finally { setSaving(false); }
  };

  const inputStyle: React.CSSProperties = { width: '100%', padding: '8px 10px', border: '1px solid var(--portal-border-default)', borderRadius: 8, fontSize: 12, color: 'var(--portal-text-primary)', background: 'var(--portal-bg-secondary)', outline: 'none', boxSizing: 'border-box', resize: 'vertical' as const, minHeight: multiline ? 64 : undefined, fontFamily: 'inherit' };

  if (!editing) {
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
          <p style={{ ...sectionLabel, color: accent ?? undefined, margin: 0 }}>{label}</p>
          <button onClick={() => { setDraft(value ?? ''); setEditing(true); }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 11, color: 'var(--portal-accent)', fontWeight: 600, padding: 0 }}>
            {value ? 'Edit' : '+ Add'}
          </button>
        </div>
        {value ? (
          <p style={{ fontSize: 12, color: 'var(--portal-text-secondary)', margin: 0, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{value}</p>
        ) : (
          <p style={{ fontSize: 12, color: 'var(--portal-text-tertiary)', margin: 0, fontStyle: 'italic' }}>{placeholder ?? 'Not set'}</p>
        )}
      </div>
    );
  }

  return (
    <div>
      <p style={{ ...sectionLabel, color: accent ?? undefined }}>{label}</p>
      {multiline ? (
        <textarea style={inputStyle} value={draft} onChange={e => setDraft(e.target.value)} autoFocus rows={3} />
      ) : (
        <input style={inputStyle} value={draft} onChange={e => setDraft(e.target.value)} autoFocus />
      )}
      <div style={{ display: 'flex', gap: 6, marginTop: 6, justifyContent: 'flex-end' }}>
        <button onClick={() => setEditing(false)} style={{ padding: '5px 12px', border: '1px solid var(--portal-border-default)', borderRadius: 7, background: 'none', fontSize: 12, fontWeight: 600, color: 'var(--portal-text-tertiary)', cursor: 'pointer' }}>Cancel</button>
        <button onClick={handleSave} disabled={saving} style={{ padding: '5px 12px', border: 'none', borderRadius: 7, background: 'var(--portal-accent)', color: 'white', fontSize: 12, fontWeight: 600, cursor: 'pointer', opacity: saving ? 0.6 : 1 }}>
          {saving ? 'Saving…' : 'Save'}
        </button>
      </div>
    </div>
  );
}

function ProfileTab({ prospect, onUpdate }: { prospect: LeadForgeProspect; onUpdate: (id: string, u: Partial<LeadForgeProspect>) => Promise<void> }) {
  const p = prospect as any;
  const [saving, setSaving] = useState(false);
  const { logActivity } = useActivities(prospect.id);

  const handleStageChange = async (pipeline_stage: string) => {
    setSaving(true);
    try {
      await onUpdate(prospect.id, { pipeline_stage } as any);
      await logActivity({ activity_type: 'stage_change', subject: `Stage → ${pipeline_stage}`, created_by: 'user' });
    } finally { setSaving(false); }
  };

  const handleWarmthChange = async (warmth_score: string) => {
    setSaving(true);
    try {
      await onUpdate(prospect.id, { warmth_score } as any);
      await logActivity({ activity_type: 'warmth_change', subject: `Warmth → ${warmth_score}`, created_by: 'user' });
    } finally { setSaving(false); }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {/* Stage */}
      <div>
        <p style={sectionLabel}>Pipeline Stage</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {PIPELINE_STAGES.map(s => {
            const active = (p.pipeline_stage ?? 'identified') === s.id;
            return (
              <button key={s.id} onClick={() => handleStageChange(s.id)} disabled={saving}
                style={{ padding: '5px 11px', borderRadius: 8, border: `1px solid ${active ? s.color : 'var(--portal-border-default)'}`, background: active ? s.bg : 'transparent', color: active ? s.color : 'var(--portal-text-tertiary)', fontSize: 12, fontWeight: active ? 700 : 500, cursor: 'pointer' }}>
                {s.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Warmth */}
      <div>
        <p style={sectionLabel}>Relationship Warmth</p>
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
      <div style={{ padding: '12px 14px', background: 'var(--portal-bg-hover)', borderRadius: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <p style={{ ...sectionLabel, margin: 0 }}>Contact</p>
          <EnrichButton prospect={prospect} onUpdate={onUpdate} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          {prospect.email ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Mail size={12} color="var(--portal-text-tertiary)" />
                <a href={`mailto:${prospect.email}`} style={{ fontSize: 12, color: 'var(--portal-text-primary)', fontFamily: 'monospace', textDecoration: 'none' }}>{prospect.email}</a>
              </div>
              <EmailConfidenceBadge confidence={p.email_confidence} />
            </div>
          ) : null}
          {prospect.linkedin_url ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <ExternalLink size={12} color="var(--portal-text-tertiary)" />
              <a href={prospect.linkedin_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: 'var(--portal-accent)', textDecoration: 'none' }}>View LinkedIn</a>
            </div>
          ) : null}
          {!prospect.email && !prospect.linkedin_url && (
            <p style={{ fontSize: 12, color: 'var(--portal-text-tertiary)', margin: 0 }}>No contact info — click Enrich to find via Apollo</p>
          )}
        </div>
      </div>

      {/* Editable fields */}
      <InlineEditField
        label="Why Target"
        value={p.trigger_context}
        placeholder="Why is this person worth pursuing right now?"
        accent="#f59e0b"
        multiline
        onSave={v => onUpdate(prospect.id, { trigger_context: v } as any)}
      />
      <InlineEditField
        label="Next Action"
        value={p.next_action}
        placeholder="What's the next step with this prospect?"
        accent="#6366f1"
        onSave={v => onUpdate(prospect.id, { next_action: v } as any)}
      />
      <InlineEditField
        label="Notes"
        value={prospect.notes}
        placeholder="Connections, context, background…"
        multiline
        onSave={v => onUpdate(prospect.id, { notes: v } as any)}
      />
    </div>
  );
}

function TimelineTab({ prospect }: { prospect: LeadForgeProspect }) {
  const { activities, loading, logActivity } = useActivities(prospect.id);
  const [actType, setActType] = useState('note');
  const [subject, setSubject] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const handleLog = async () => {
    if (!notes.trim() && !subject.trim()) return;
    setSaving(true);
    try {
      await logActivity({ activity_type: actType, subject: subject || undefined, notes: notes || undefined, created_by: 'user' });
      setSubject('');
      setNotes('');
    } finally { setSaving(false); }
  };

  const formatDate = (d: string) => {
    const date = new Date(d);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    if (diff < 60) return `${diff}m ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
    if (diff < 10080) return `${Math.floor(diff / 1440)}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const inputStyle = { width: '100%', padding: '9px 12px', border: '1px solid var(--portal-border-default)', borderRadius: 8, fontSize: 12, color: 'var(--portal-text-primary)', background: 'var(--portal-bg-hover)', outline: 'none', boxSizing: 'border-box' as const };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Log activity */}
      <div style={{ padding: '14px', background: 'var(--portal-bg-hover)', borderRadius: 12 }}>
        <p style={sectionLabel}>Log Activity</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <select value={actType} onChange={e => setActType(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
            {ACTIVITY_TYPES.filter(a => a.id !== 'trigger_flagged').map(a => (
              <option key={a.id} value={a.id}>{a.label}</option>
            ))}
          </select>
          <input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Subject / title (optional)" style={inputStyle} />
          <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Notes on what happened, outcome, next step…"
            style={{ ...inputStyle, resize: 'vertical', minHeight: 70 }} />
          <button onClick={handleLog} disabled={saving || (!notes.trim() && !subject.trim())}
            style={{ alignSelf: 'flex-end', padding: '7px 16px', border: 'none', borderRadius: 8, background: 'var(--portal-accent)', color: 'white', fontSize: 12, fontWeight: 600, cursor: 'pointer', opacity: (!notes.trim() && !subject.trim()) ? 0.5 : 1 }}>
            {saving ? 'Saving…' : 'Log'}
          </button>
        </div>
      </div>

      {/* Activity list */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 24 }}>
          <Loader2 size={18} color="var(--portal-accent)" style={{ animation: 'spin 0.8s linear infinite' }} />
        </div>
      ) : activities.length === 0 ? (
        <p style={{ fontSize: 12, color: 'var(--portal-text-tertiary)', textAlign: 'center', padding: '24px 0' }}>No activity yet — log the first touch above.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {activities.map((a, i) => {
            const cfg = ACTIVITY_TYPES.find(t => t.id === a.activity_type) ?? ACTIVITY_TYPES[0];
            const isLast = i === activities.length - 1;
            return (
              <div key={a.id} style={{ display: 'flex', gap: 10, paddingBottom: isLast ? 0 : 12, position: 'relative' }}>
                {/* Timeline line */}
                {!isLast && (
                  <div style={{ position: 'absolute', left: 13, top: 28, bottom: 0, width: 1, background: 'var(--portal-border-default)' }} />
                )}
                <ActivityIcon type={a.activity_type} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 6 }}>
                    <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--portal-text-primary)', margin: 0 }}>
                      {a.subject ?? cfg.label}
                    </p>
                    <span style={{ fontSize: 10, color: 'var(--portal-text-tertiary)', flexShrink: 0 }}>{formatDate(a.created_at)}</span>
                  </div>
                  {a.notes && <p style={{ fontSize: 11, color: 'var(--portal-text-secondary)', margin: '3px 0 0', lineHeight: 1.5 }}>{a.notes}</p>}
                  {a.created_by === 'system' && <span style={{ fontSize: 10, color: '#6366f1', fontWeight: 600 }}>auto-detected</span>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function GenerateTab({ prospect }: { prospect: LeadForgeProspect }) {
  const { createContent } = useLeadForgeContent();
  const { logActivity } = useActivities(prospect.id);
  const [contentType, setContentType] = useState('micro_research');
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState<{ title: string; body: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    setGenerating(true);
    setGenerated(null);
    setError('');
    setSaved(false);
    try {
      const res = await fetch('/portal/api/leadforge/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prospect, content_type: contentType }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Generation failed.');
      setGenerated(data);
    } catch (e: any) {
      setError(e.message ?? 'Something went wrong.');
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!generated) return;
    setSaving(true);
    try {
      await createContent({ prospect_id: prospect.id, content_type: contentType, title: generated.title, body: generated.body });
      await logActivity({ activity_type: 'content_shared', subject: generated.title, notes: `Generated ${contentType.replace(/_/g, ' ')}`, created_by: 'user' });
      setSaved(true);
    } finally { setSaving(false); }
  };

  const selected = GENERATE_TYPES.find(t => t.id === contentType)!;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Type picker */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {GENERATE_TYPES.map(t => {
          const active = contentType === t.id;
          return (
            <button key={t.id} onClick={() => { setContentType(t.id); setGenerated(null); setSaved(false); }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '10px 12px', border: `1px solid ${active ? 'var(--portal-border-accent)' : 'var(--portal-border-default)'}`, borderRadius: 10, background: active ? 'var(--portal-accent-subtle)' : 'transparent', cursor: 'pointer', textAlign: 'left' }}>
              <span style={{ fontSize: 13, fontWeight: active ? 700 : 500, color: active ? 'var(--portal-accent)' : 'var(--portal-text-primary)' }}>{t.label}</span>
              <span style={{ fontSize: 11, color: 'var(--portal-text-tertiary)', marginTop: 1 }}>{t.desc}</span>
            </button>
          );
        })}
      </div>

      <button onClick={handleGenerate} disabled={generating}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, padding: '11px', border: 'none', borderRadius: 10, background: 'var(--portal-accent)', color: 'white', fontSize: 13, fontWeight: 600, cursor: generating ? 'default' : 'pointer', opacity: generating ? 0.7 : 1 }}>
        {generating ? <><Loader2 size={14} style={{ animation: 'spin 0.8s linear infinite' }} /> Generating with Claude…</> : <><Zap size={14} /> Generate {selected.label}</>}
      </button>

      {error && <p style={{ fontSize: 12, color: '#ef4444', margin: 0 }}>{error}</p>}

      {generated && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ padding: '14px', background: 'var(--portal-bg-hover)', borderRadius: 12, border: '1px solid var(--portal-border-default)' }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--portal-text-primary)', margin: '0 0 10px' }}>{generated.title}</p>
            <p style={{ fontSize: 12, color: 'var(--portal-text-secondary)', margin: 0, lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{generated.body}</p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => { setGenerated(null); setSaved(false); }}
              style={{ flex: 1, padding: '8px', border: '1px solid var(--portal-border-default)', borderRadius: 8, background: 'none', fontSize: 12, fontWeight: 600, color: 'var(--portal-text-secondary)', cursor: 'pointer' }}>
              Regenerate
            </button>
            <button onClick={handleSave} disabled={saving || saved}
              style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, padding: '8px', border: 'none', borderRadius: 8, background: saved ? 'rgba(74,222,128,0.15)' : 'var(--portal-accent)', color: saved ? '#4ade80' : 'white', fontSize: 12, fontWeight: 600, cursor: (saving || saved) ? 'default' : 'pointer' }}>
              {saved ? <><CheckCircle size={13} /> Saved to Library</> : saving ? 'Saving…' : <><FileText size={13} /> Save to Library</>}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Drawer ─────────────────────────────────────────────────────────────────

const sectionLabel: React.CSSProperties = { fontSize: 11, fontWeight: 600, color: 'var(--portal-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 8px' };

type DrawerTab = 'profile' | 'timeline' | 'generate';

function ProspectDrawer({ prospect, onClose, onUpdate, onDelete }: {
  prospect: LeadForgeProspect;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<LeadForgeProspect>) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
}) {
  const [tab, setTab] = useState<DrawerTab>('profile');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const p = prospect as any;

  const handleDelete = async () => {
    if (!onDelete) return;
    setDeleting(true);
    try {
      await onDelete(prospect.id);
      onClose();
    } finally {
      setDeleting(false);
    }
  };

  const tabStyle = (active: boolean): React.CSSProperties => ({
    flex: 1, padding: '8px 0', fontSize: 12, fontWeight: active ? 700 : 500, border: 'none',
    background: 'none', cursor: 'pointer', borderBottom: `2px solid ${active ? 'var(--portal-accent)' : 'transparent'}`,
    color: active ? 'var(--portal-accent)' : 'var(--portal-text-tertiary)', transition: 'all 0.15s',
  });

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex' }} onClick={onClose}>
      <div style={{ flex: 1, background: 'rgba(0,0,0,0.3)' }} />
      <div style={{ width: 440, background: 'var(--portal-bg-secondary)', height: '100%', display: 'flex', flexDirection: 'column', boxShadow: '-20px 0 60px rgba(0,0,0,0.15)' }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{ padding: '24px 24px 16px', borderBottom: '1px solid var(--portal-border-default)', flexShrink: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--portal-text-primary)', margin: '0 0 3px' }}>{prospect.full_name}</h2>
              <p style={{ fontSize: 12, color: 'var(--portal-text-tertiary)', margin: 0 }}>
                {prospect.title ?? '—'}{prospect.account ? ` · ${prospect.account.company_name}` : ''}
              </p>
            </div>
            <div style={{ display: 'flex', gap: 4 }}>
              {onDelete && !confirmDelete && (
                <button onClick={() => setConfirmDelete(true)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--portal-text-tertiary)', padding: 4, fontSize: 11, fontWeight: 600 }}>
                  Delete
                </button>
              )}
              {confirmDelete && (
                <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                  <span style={{ fontSize: 11, color: '#ef4444', fontWeight: 600 }}>Delete?</span>
                  <button onClick={handleDelete} disabled={deleting}
                    style={{ padding: '3px 8px', border: 'none', borderRadius: 5, background: '#ef4444', color: 'white', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
                    {deleting ? '…' : 'Yes'}
                  </button>
                  <button onClick={() => setConfirmDelete(false)}
                    style={{ padding: '3px 8px', border: '1px solid var(--portal-border-default)', borderRadius: 5, background: 'none', fontSize: 11, fontWeight: 600, color: 'var(--portal-text-tertiary)', cursor: 'pointer' }}>
                    No
                  </button>
                </div>
              )}
              <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--portal-text-tertiary)', padding: 4 }}><X size={17} /></button>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <IcpBadge score={prospect.icp_score} />
            <WarmthDot warmth={p.warmth_score} />
            {p.enrichment_source === 'ai_lookup' && (
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#6366f1', fontWeight: 600 }}>
                <Zap size={10} /> AI Enriched
              </span>
            )}
            <StagePill stage={p.pipeline_stage ?? 'identified'} />
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--portal-border-default)', flexShrink: 0 }}>
          <button style={tabStyle(tab === 'profile')}  onClick={() => setTab('profile')}>Profile</button>
          <button style={tabStyle(tab === 'timeline')} onClick={() => setTab('timeline')}>Timeline</button>
          <button style={tabStyle(tab === 'generate')} onClick={() => setTab('generate')}>Generate</button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
          {tab === 'profile'  && <ProfileTab  prospect={prospect} onUpdate={onUpdate} />}
          {tab === 'timeline' && <TimelineTab prospect={prospect} />}
          {tab === 'generate' && <GenerateTab prospect={prospect} />}
        </div>
      </div>
    </div>
  );
}

// ── Add Prospect Modal ─────────────────────────────────────────────────────

function AddProspectModal({ onClose, onSave }: { onClose: () => void; onSave: (p: CreateProspectInput, a?: CreateAccountInput) => Promise<void> }) {
  const { accounts } = useAccounts();
  const [form, setForm] = useState<any>({ full_name: '', title: '', email: '', linkedin_url: '', icp_score: 50, stage: 'awareness', notes: '', warmth_score: 'cold', pipeline_stage: 'identified' });
  const [companyMode, setCompanyMode] = useState<'existing' | 'new'>('existing');
  const [selectedAccountId, setSelectedAccountId] = useState('');
  const [newCompanyName, setNewCompanyName] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handle = async () => {
    if (!form.full_name.trim()) { setError('Full name is required.'); return; }
    setSaving(true);
    try {
      if (companyMode === 'existing' && selectedAccountId) {
        // Link to existing account directly
        await onSave({ ...form, account_id: selectedAccountId });
      } else if (companyMode === 'new' && newCompanyName.trim()) {
        await onSave(form, { company_name: newCompanyName.trim() });
      } else {
        await onSave(form);
      }
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
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Full Name *</label>
              <input style={inputStyle} value={form.full_name} onChange={e => setForm((f: any) => ({ ...f, full_name: e.target.value }))} placeholder="Jane Smith" />
            </div>
            <div>
              <label style={labelStyle}>Title</label>
              <input style={inputStyle} value={form.title} onChange={e => setForm((f: any) => ({ ...f, title: e.target.value }))} placeholder="CHRO" />
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <label style={{ ...labelStyle, marginBottom: 0 }}>Company</label>
                <div style={{ display: 'flex', gap: 4, background: 'var(--portal-bg-secondary)', borderRadius: 6, padding: 2 }}>
                  {(['existing', 'new'] as const).map(m => (
                    <button key={m} onClick={() => setCompanyMode(m)}
                      style={{ padding: '2px 8px', borderRadius: 4, border: 'none', background: companyMode === m ? 'var(--portal-accent-subtle)' : 'transparent', color: companyMode === m ? 'var(--portal-accent)' : 'var(--portal-text-tertiary)', fontSize: 11, fontWeight: 600, cursor: 'pointer', textTransform: 'capitalize' as const }}>
                      {m === 'existing' ? 'Existing' : 'New'}
                    </button>
                  ))}
                </div>
              </div>
              {companyMode === 'existing' ? (
                <select style={{ ...inputStyle, cursor: 'pointer' }} value={selectedAccountId} onChange={e => setSelectedAccountId(e.target.value)}>
                  <option value="">No account linked</option>
                  {accounts.map(a => <option key={a.id} value={a.id}>{a.company_name}</option>)}
                </select>
              ) : (
                <input style={inputStyle} value={newCompanyName} onChange={e => setNewCompanyName(e.target.value)} placeholder="Acme Corp" />
              )}
            </div>
            <div>
              <label style={labelStyle}>Email</label>
              <input style={inputStyle} type="email" value={form.email} onChange={e => setForm((f: any) => ({ ...f, email: e.target.value }))} placeholder="jane@acme.com" />
            </div>
            <div>
              <label style={labelStyle}>LinkedIn URL</label>
              <input style={inputStyle} value={form.linkedin_url} onChange={e => setForm((f: any) => ({ ...f, linkedin_url: e.target.value }))} placeholder="linkedin.com/in/..." />
            </div>
            <div>
              <label style={labelStyle}>ICP Score</label>
              <input style={inputStyle} type="number" min={0} max={100} value={form.icp_score} onChange={e => setForm((f: any) => ({ ...f, icp_score: parseInt(e.target.value) || 0 }))} />
            </div>
            <div>
              <label style={labelStyle}>Pipeline Stage</label>
              <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.pipeline_stage} onChange={e => setForm((f: any) => ({ ...f, pipeline_stage: e.target.value }))}>
                {PIPELINE_STAGES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label style={labelStyle}>Why Target</label>
            <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: 60 }} value={form.trigger_context ?? ''} onChange={e => setForm((f: any) => ({ ...f, trigger_context: e.target.value }))} placeholder="New CHRO since March 2024, building leadership team…" />
          </div>
          <div>
            <label style={labelStyle}>Notes</label>
            <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: 60 }} value={form.notes} onChange={e => setForm((f: any) => ({ ...f, notes: e.target.value }))} placeholder="Context, connections, background…" />
          </div>
          {error && <p style={{ fontSize: 12, color: '#ef4444', margin: 0 }}>{error}</p>}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
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

// ── CSV Export ────────────────────────────────────────────────────────────

function exportToCSV(prospects: LeadForgeProspect[]) {
  const headers = ['Name', 'Title', 'Company', 'Email', 'LinkedIn', 'ICP Score', 'Stage', 'Warmth', 'Next Action', 'Why Target', 'Notes', 'Added'];
  const rows = prospects.map(p => {
    const pa = p as any;
    return [
      p.full_name,
      p.title ?? '',
      p.account?.company_name ?? '',
      p.email ?? '',
      p.linkedin_url ?? '',
      p.icp_score,
      pa.pipeline_stage ?? 'identified',
      pa.warmth_score ?? 'cold',
      pa.next_action ?? '',
      pa.trigger_context ?? '',
      p.notes ?? '',
      new Date(p.created_at).toLocaleDateString('en-US'),
    ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(',');
  });
  const csv = [headers.map(h => `"${h}"`).join(','), ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `leadforge-prospects-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ── Bulk Action Bar ────────────────────────────────────────────────────────

function BulkActionBar({ selected, total, prospects, onClearSelection, onBulkDelete, onBulkStageChange }: {
  selected: Set<string>;
  total: number;
  prospects: LeadForgeProspect[];
  onClearSelection: () => void;
  onBulkDelete: () => void;
  onBulkStageChange: (stage: string) => void;
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [stagePickerOpen, setStagePickerOpen] = useState(false);
  const count = selected.size;
  const selectedProspects = prospects.filter(p => selected.has(p.id));

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', background: 'var(--portal-accent-subtle)', border: '1px solid var(--portal-border-accent)', borderRadius: 12, flexWrap: 'wrap' }}>
      <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--portal-accent)' }}>{count} selected</span>
      <span style={{ fontSize: 12, color: 'var(--portal-text-tertiary)' }}>of {total}</span>
      <div style={{ flex: 1 }} />

      {/* Export */}
      <button
        onClick={() => exportToCSV(selectedProspects)}
        style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', border: '1px solid var(--portal-border-default)', borderRadius: 8, background: 'var(--portal-bg-secondary)', fontSize: 12, fontWeight: 600, color: 'var(--portal-text-secondary)', cursor: 'pointer' }}
      >
        <Download size={12} /> Export CSV
      </button>

      {/* Stage change */}
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => { setStagePickerOpen(o => !o); setConfirmDelete(false); }}
          style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', border: '1px solid var(--portal-border-default)', borderRadius: 8, background: 'var(--portal-bg-secondary)', fontSize: 12, fontWeight: 600, color: 'var(--portal-text-secondary)', cursor: 'pointer' }}
        >
          Move Stage ▾
        </button>
        {stagePickerOpen && (
          <div style={{ position: 'absolute', top: '110%', right: 0, background: 'var(--portal-bg-secondary)', border: '1px solid var(--portal-border-default)', borderRadius: 12, boxShadow: '0 8px 24px rgba(0,0,0,0.12)', zIndex: 100, minWidth: 160, padding: 6 }}>
            {PIPELINE_STAGES.map(s => (
              <button key={s.id} onClick={() => { onBulkStageChange(s.id); setStagePickerOpen(false); }}
                style={{ display: 'block', width: '100%', padding: '8px 12px', border: 'none', borderRadius: 8, background: 'none', textAlign: 'left', fontSize: 12, fontWeight: 600, color: s.color, cursor: 'pointer' }}
                onMouseEnter={e => (e.currentTarget.style.background = s.bg)}
                onMouseLeave={e => (e.currentTarget.style.background = 'none')}
              >
                {s.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Delete */}
      {!confirmDelete ? (
        <button
          onClick={() => setConfirmDelete(true)}
          style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, background: 'rgba(239,68,68,0.05)', fontSize: 12, fontWeight: 600, color: '#ef4444', cursor: 'pointer' }}
        >
          <Trash2 size={12} /> Delete
        </button>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 12, color: '#ef4444', fontWeight: 600 }}>Delete {count}?</span>
          <button onClick={() => { onBulkDelete(); setConfirmDelete(false); }}
            style={{ padding: '5px 10px', border: 'none', borderRadius: 7, background: '#ef4444', color: 'white', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Yes</button>
          <button onClick={() => setConfirmDelete(false)}
            style={{ padding: '5px 10px', border: '1px solid var(--portal-border-default)', borderRadius: 7, background: 'none', fontSize: 12, fontWeight: 600, color: 'var(--portal-text-tertiary)', cursor: 'pointer' }}>No</button>
        </div>
      )}

      {/* Clear */}
      <button onClick={onClearSelection} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--portal-text-tertiary)', padding: 4 }}>
        <X size={15} />
      </button>
    </div>
  );
}

// ── Kanban Board ──────────────────────────────────────────────────────────

function KanbanBoard({ prospects, onOpen, onStageChange }: {
  prospects: LeadForgeProspect[];
  onOpen: (p: LeadForgeProspect) => void;
  onStageChange: (id: string, stage: string) => Promise<void>;
}) {
  const [dragging, setDragging] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState<string | null>(null);
  const [moving, setMoving] = useState<string | null>(null);

  const handleDragStart = (id: string) => setDragging(id);
  const handleDragEnd   = () => { setDragging(null); setDragOver(null); };

  const handleDrop = async (stageId: string) => {
    if (!dragging || dragOver === stageId) return;
    setDragOver(null);
    const prospect = prospects.find(p => p.id === dragging);
    const currentStage = (prospect as any)?.pipeline_stage ?? 'identified';
    if (currentStage === stageId) return;
    setMoving(dragging);
    try {
      await onStageChange(dragging, stageId);
    } finally {
      setMoving(null);
      setDragging(null);
    }
  };

  return (
    <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 8, alignItems: 'flex-start' }}>
      {PIPELINE_STAGES.map(stage => {
        const stageProspects = prospects.filter(p => ((p as any).pipeline_stage ?? 'identified') === stage.id);
        const isDropTarget = dragOver === stage.id;

        return (
          <div
            key={stage.id}
            onDragOver={e => { e.preventDefault(); setDragOver(stage.id); }}
            onDragLeave={() => setDragOver(null)}
            onDrop={() => handleDrop(stage.id)}
            style={{
              minWidth: 200, maxWidth: 220, flexShrink: 0,
              background: isDropTarget ? `${stage.color}12` : 'var(--portal-bg-hover)',
              border: `1px solid ${isDropTarget ? stage.color : 'var(--portal-border-default)'}`,
              borderRadius: 14, padding: '12px 10px', transition: 'border-color 0.15s, background 0.15s',
            }}
          >
            {/* Column header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: stage.color, display: 'inline-block' }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: stage.color }}>{stage.label}</span>
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--portal-text-tertiary)', background: 'var(--portal-bg-secondary)', padding: '2px 7px', borderRadius: 999 }}>{stageProspects.length}</span>
            </div>

            {/* Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              {stageProspects.length === 0 ? (
                <div style={{ height: 60, border: `1.5px dashed ${stage.color}40`, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 11, color: 'var(--portal-text-tertiary)' }}>Drop here</span>
                </div>
              ) : (
                stageProspects.map(p => {
                  const pa = p as any;
                  const isDragging = dragging === p.id;
                  const isMoving   = moving === p.id;
                  return (
                    <div
                      key={p.id}
                      draggable
                      onDragStart={() => handleDragStart(p.id)}
                      onDragEnd={handleDragEnd}
                      onClick={() => onOpen(p)}
                      style={{
                        padding: '11px 12px', background: isDragging ? `${stage.color}18` : 'var(--portal-bg-secondary)',
                        border: `1px solid ${isDragging ? stage.color : 'var(--portal-border-default)'}`,
                        borderRadius: 10, cursor: 'grab', opacity: isMoving ? 0.5 : isDragging ? 0.7 : 1,
                        transition: 'opacity 0.15s, border-color 0.15s',
                        userSelect: 'none',
                      }}
                    >
                      <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--portal-text-primary)', margin: '0 0 2px', lineHeight: 1.3 }}>{p.full_name}</p>
                      {p.title && <p style={{ fontSize: 11, color: 'var(--portal-text-tertiary)', margin: '0 0 6px' }}>{p.title}</p>}
                      {p.account && <p style={{ fontSize: 10, color: 'var(--portal-accent)', fontWeight: 600, margin: '0 0 6px' }}>{p.account.company_name}</p>}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <IcpBadge score={p.icp_score} />
                        <WarmthDot warmth={pa.warmth_score} />
                      </div>
                      {pa.next_action && (
                        <p style={{ fontSize: 10, color: '#6366f1', margin: '6px 0 0', fontStyle: 'italic', lineHeight: 1.4, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as any }}>
                          → {pa.next_action}
                        </p>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Sort ───────────────────────────────────────────────────────────────────

type SortField = 'icp_score' | 'full_name' | 'last_activity_at' | 'pipeline_stage' | 'warmth_score';
type SortDir = 'asc' | 'desc';

function SortIcon({ field, current, dir }: { field: SortField; current: SortField; dir: SortDir }) {
  if (field !== current) return <ChevronDown size={12} style={{ opacity: 0.3 }} />;
  return dir === 'asc' ? <ChevronUp size={12} color="var(--portal-accent)" /> : <ChevronDown size={12} color="var(--portal-accent)" />;
}

// ── Main Page ──────────────────────────────────────────────────────────────

export default function ProspectsPage() {
  const { prospects, loading, createProspect, updateProspect, deleteProspect } = useProspects();
  const { createAccount } = useAccounts();
  const [search, setSearch] = useState('');
  const [filterScore, setFilterScore] = useState('all');
  const [filterStage, setFilterStage] = useState('all');
  const [filterWarmth, setFilterWarmth] = useState('all');
  const [filterSeniority, setFilterSeniority] = useState('all');
  const [filterEmail, setFilterEmail] = useState('all');
  const [filterNextAction, setFilterNextAction] = useState('all');
  const [filterCompany, setFilterCompany] = useState('all');
  const [sortField, setSortField] = useState<SortField>('icp_score');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [showModal, setShowModal] = useState(false);
  const [drawerProspect, setDrawerProspect] = useState<LeadForgeProspect | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'table' | 'board'>('table');

  const toggleSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filtered.length && filtered.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map(p => p.id)));
    }
  };

  const handleBulkDelete = async () => {
    for (const id of Array.from(selectedIds)) {
      await deleteProspect(id);
    }
    setSelectedIds(new Set());
  };

  const handleBulkStageChange = async (stage: string) => {
    for (const id of Array.from(selectedIds)) {
      await updateProspect(id, { pipeline_stage: stage } as any);
    }
    setSelectedIds(new Set());
  };

  const handleSave = async (input: CreateProspectInput, accountInput?: CreateAccountInput) => {
    let account_id: string | undefined;
    let accountForSync: { company_name: string; domain?: string } | undefined;
    if (accountInput) {
      const acct = await createAccount(accountInput);
      account_id = (acct as any).id;
      accountForSync = { company_name: accountInput.company_name, domain: accountInput.domain };
    }
    const newProspect = await createProspect({ ...input, account_id });
    if (newProspect) {
      syncToHubSpot({ ...(newProspect as any), account: accountForSync ? { company_name: accountForSync.company_name, domain: accountForSync.domain } : undefined });
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('desc'); }
  };

  const filtered = prospects
    .filter(p => {
      const pa = p as any;
      const q = search.toLowerCase();
      const title = (p.title ?? '').toLowerCase();
      const matchSearch     = !q || p.full_name.toLowerCase().includes(q) || title.includes(q) || (p.account?.company_name ?? '').toLowerCase().includes(q);
      const matchScore      = filterScore === 'all' ? true : filterScore === '80+' ? p.icp_score >= 80 : filterScore === '60-79' ? p.icp_score >= 60 && p.icp_score < 80 : p.icp_score < 60;
      const matchStage      = filterStage === 'all' || pa.pipeline_stage === filterStage;
      const matchWarmth     = filterWarmth === 'all' || pa.warmth_score === filterWarmth;
      const isCsuite        = title.includes('chief') || title.includes('ceo') || title.includes('coo') || title.includes('cfo') || title.includes('cto') || title.includes('cmo') || title.includes('cro') || title.includes('president');
      const isVP            = title.includes('svp') || title.includes('vp ') || title.includes('vice president');
      const matchSeniority  = filterSeniority === 'all' || (filterSeniority === 'csuite' ? isCsuite : isVP);
      const matchEmail      = filterEmail === 'all' || (filterEmail === 'yes' ? !!p.email : !p.email);
      const matchNextAction = filterNextAction === 'all' || (filterNextAction === 'yes' ? !!pa.next_action : !pa.next_action);
      const matchCompany    = filterCompany === 'all' || (p.account?.company_name ?? '') === filterCompany;
      return matchSearch && matchScore && matchStage && matchWarmth && matchSeniority && matchEmail && matchNextAction && matchCompany;
    })
    .sort((a, b) => {
      let av: any, bv: any;
      if (sortField === 'icp_score')        { av = a.icp_score; bv = b.icp_score; }
      else if (sortField === 'full_name')   { av = a.full_name; bv = b.full_name; }
      else if (sortField === 'last_activity_at') { av = (a as any).last_activity_at ?? a.created_at; bv = (b as any).last_activity_at ?? b.created_at; }
      else if (sortField === 'pipeline_stage')   { av = PIPELINE_STAGES.findIndex(s => s.id === (a as any).pipeline_stage); bv = PIPELINE_STAGES.findIndex(s => s.id === (b as any).pipeline_stage); }
      else if (sortField === 'warmth_score')     { av = WARMTH.findIndex(w => w.id === (a as any).warmth_score); bv = WARMTH.findIndex(w => w.id === (b as any).warmth_score); }
      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

  const companies = Array.from(new Set(prospects.map(p => p.account?.company_name).filter(Boolean))) as string[];

  const selectStyle: React.CSSProperties = { padding: '8px 12px', border: '1px solid var(--portal-border-default)', borderRadius: 10, fontSize: 13, color: 'var(--portal-text-secondary)', background: 'var(--portal-bg-secondary)', cursor: 'pointer', outline: 'none' };
  const thStyle: React.CSSProperties = { padding: '10px 14px', fontSize: 11, fontWeight: 600, color: 'var(--portal-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.07em', textAlign: 'left', userSelect: 'none', whiteSpace: 'nowrap' };
  const thClick: React.CSSProperties = { ...thStyle, cursor: 'pointer' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: 'var(--portal-text-primary)', margin: 0 }}>All Prospects</h1>
          <p style={{ fontSize: 13, color: 'var(--portal-text-tertiary)', margin: '3px 0 0' }}>
            {prospects.length} total · {filtered.length} shown
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {/* View toggle */}
          <div style={{ display: 'flex', gap: 2, padding: 3, background: 'var(--portal-bg-hover)', borderRadius: 9, border: '1px solid var(--portal-border-default)' }}>
            <button onClick={() => setViewMode('table')}
              style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px', borderRadius: 7, border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer', background: viewMode === 'table' ? 'var(--portal-bg-secondary)' : 'transparent', color: viewMode === 'table' ? 'var(--portal-text-primary)' : 'var(--portal-text-tertiary)', boxShadow: viewMode === 'table' ? '0 1px 4px rgba(0,0,0,0.07)' : 'none' }}>
              <LayoutList size={13} /> List
            </button>
            <button onClick={() => setViewMode('board')}
              style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px', borderRadius: 7, border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer', background: viewMode === 'board' ? 'var(--portal-bg-secondary)' : 'transparent', color: viewMode === 'board' ? 'var(--portal-text-primary)' : 'var(--portal-text-tertiary)', boxShadow: viewMode === 'board' ? '0 1px 4px rgba(0,0,0,0.07)' : 'none' }}>
              <Kanban size={13} /> Board
            </button>
          </div>
          {filtered.length > 0 && selectedIds.size === 0 && viewMode === 'table' && (
            <button onClick={() => exportToCSV(filtered)}
              style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '9px 14px', border: '1px solid var(--portal-border-default)', borderRadius: 10, background: 'var(--portal-bg-secondary)', fontSize: 13, fontWeight: 600, color: 'var(--portal-text-secondary)', cursor: 'pointer' }}>
              <Download size={14} /> Export
            </button>
          )}
          <button onClick={() => setShowModal(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px', border: 'none', borderRadius: 10, background: 'var(--portal-accent)', color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            <Plus size={15} strokeWidth={2} /> Add Manually
          </button>
        </div>
      </div>

      {/* Bulk action bar */}
      {selectedIds.size > 0 && (
        <BulkActionBar
          selected={selectedIds}
          total={filtered.length}
          prospects={prospects}
          onClearSelection={() => setSelectedIds(new Set())}
          onBulkDelete={handleBulkDelete}
          onBulkStageChange={handleBulkStageChange}
        />
      )}

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
        <select value={filterSeniority} onChange={e => setFilterSeniority(e.target.value)} style={selectStyle}>
          <option value="all">All Seniority</option>
          <option value="csuite">C-Suite</option>
          <option value="vp">VP / SVP</option>
        </select>
        <select value={filterEmail} onChange={e => setFilterEmail(e.target.value)} style={selectStyle}>
          <option value="all">All Contacts</option>
          <option value="yes">Has Email</option>
          <option value="no">No Email</option>
        </select>
        <select value={filterNextAction} onChange={e => setFilterNextAction(e.target.value)} style={selectStyle}>
          <option value="all">All Actions</option>
          <option value="yes">Has Next Action</option>
          <option value="no">No Next Action</option>
        </select>
        {companies.length > 0 && (
          <select value={filterCompany} onChange={e => setFilterCompany(e.target.value)} style={selectStyle}>
            <option value="all">All Companies</option>
            {companies.sort().map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        )}
      </div>

      {/* Board view */}
      {!loading && viewMode === 'board' && (
        <KanbanBoard
          prospects={filtered}
          onOpen={setDrawerProspect}
          onStageChange={async (id, stage) => {
            await updateProspect(id, { pipeline_stage: stage } as any);
            // if drawer is open for this prospect, update it too
            if (drawerProspect?.id === id) {
              setDrawerProspect(prev => prev ? { ...prev, pipeline_stage: stage } as any : null);
            }
          }}
        />
      )}

      {/* Table */}
      {viewMode === 'table' && (loading ? (
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
            {prospects.length === 0 ? 'Use AI Lookup or add manually.' : 'Try adjusting your filters.'}
          </p>
        </div>
      ) : (
        <div style={{ background: 'var(--portal-bg-secondary)', border: '1px solid var(--portal-border-default)', borderRadius: 14, overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '40px 2fr 1.2fr 1fr 1fr 1fr 80px', borderBottom: '1px solid var(--portal-border-default)', background: 'var(--portal-bg-hover)' }}>
            <div style={{ ...thStyle, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} onClick={toggleSelectAll}>
              {selectedIds.size > 0 && selectedIds.size === filtered.length
                ? <CheckSquare size={14} color="var(--portal-accent)" />
                : <Square size={14} color="var(--portal-text-tertiary)" />}
            </div>
            <div style={thStyle}>Prospect</div>
            <div style={thClick} onClick={() => handleSort('pipeline_stage')}><span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>Stage <SortIcon field="pipeline_stage" current={sortField} dir={sortDir} /></span></div>
            <div style={thClick} onClick={() => handleSort('icp_score')}><span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>ICP <SortIcon field="icp_score" current={sortField} dir={sortDir} /></span></div>
            <div style={thClick} onClick={() => handleSort('warmth_score')}><span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>Warmth <SortIcon field="warmth_score" current={sortField} dir={sortDir} /></span></div>
            <div style={thClick} onClick={() => handleSort('last_activity_at')}><span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>Last Activity <SortIcon field="last_activity_at" current={sortField} dir={sortDir} /></span></div>
            <div style={thStyle}>Actions</div>
          </div>

          {filtered.map(p => {
            const pa = p as any;
            const lastActivity = pa.last_activity_at ?? p.created_at;
            const daysSince = Math.floor((Date.now() - new Date(lastActivity).getTime()) / (1000 * 60 * 60 * 24));
            const isStale = daysSince > 14;
            const isSelected = selectedIds.has(p.id);
            return (
              <div key={p.id}
                onClick={() => setDrawerProspect(p)}
                style={{ display: 'grid', gridTemplateColumns: '40px 2fr 1.2fr 1fr 1fr 1fr 80px', borderBottom: '1px solid var(--portal-border-default)', cursor: 'pointer', background: isSelected ? 'var(--portal-accent-subtle)' : 'transparent' }}
                onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = 'var(--portal-bg-hover)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = isSelected ? 'var(--portal-accent-subtle)' : 'transparent'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 0 0 4px' }} onClick={e => toggleSelect(p.id, e)}>
                  {isSelected
                    ? <CheckSquare size={14} color="var(--portal-accent)" />
                    : <Square size={14} color="var(--portal-text-tertiary)" style={{ opacity: 0.5 }} />}
                </div>
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
                <div style={{ padding: '13px 14px', display: 'flex', alignItems: 'center' }}>
                  <StagePill stage={pa.pipeline_stage ?? 'identified'} />
                </div>
                <div style={{ padding: '13px 14px', display: 'flex', alignItems: 'center' }}>
                  <IcpBadge score={p.icp_score} />
                </div>
                <div style={{ padding: '13px 14px', display: 'flex', alignItems: 'center' }}>
                  <WarmthDot warmth={pa.warmth_score} />
                </div>
                <div style={{ padding: '13px 14px', display: 'flex', alignItems: 'center' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: isStale ? '#ef4444' : 'var(--portal-text-tertiary)' }}>
                    <Clock size={11} />
                    {daysSince === 0 ? 'Today' : `${daysSince}d ago`}
                    {isStale && <span style={{ fontWeight: 700 }}>!</span>}
                  </span>
                </div>
                <div style={{ padding: '13px 14px', display: 'flex', alignItems: 'center', gap: 8 }} onClick={e => e.stopPropagation()}>
                  {p.email && <a href={`mailto:${p.email}`} style={{ color: 'var(--portal-text-tertiary)', display: 'flex' }}><Mail size={14} /></a>}
                  {p.linkedin_url && <a href={p.linkedin_url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--portal-text-tertiary)', display: 'flex' }}><ExternalLink size={14} /></a>}
                  <button onClick={() => setDrawerProspect(p)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--portal-text-tertiary)', display: 'flex', padding: 0 }}><MoreHorizontal size={14} /></button>
                </div>
              </div>
            );
          })}
        </div>
      ))}

      {showModal && <AddProspectModal onClose={() => setShowModal(false)} onSave={handleSave} />}
      {drawerProspect && (
        <ProspectDrawer
          prospect={drawerProspect}
          onClose={() => setDrawerProspect(null)}
          onDelete={async (id) => {
            await deleteProspect(id);
            setDrawerProspect(null);
          }}
          onUpdate={async (id, updates) => {
            await updateProspect(id, updates);
            setDrawerProspect(prev => prev ? { ...prev, ...updates } : null);
            // Sync stage change to HubSpot
            if ((updates as any).pipeline_stage) {
              const updatedProspect = { ...drawerProspect, ...updates };
              syncToHubSpot(updatedProspect as LeadForgeProspect).catch(() => {});
            }
          }}
        />
      )}
    </div>
  );
}
