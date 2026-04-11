'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createPortalClient } from '@/lib/portal/supabase';
import { useAuth } from '@/hooks/portal/useAuth';
import { IdentifyPractitioners } from '@/components/portal/programs/IdentifyPractitioners';
import { formatDateRange } from '@/lib/portal/utils';
import { PIPELINE_STAGES, ASSIGNMENT_STATUS_COLORS, ASSIGNMENT_STATUS_LABELS } from '@/lib/portal/constants';
import type { ProgramWithAssignments, SeniorityLevel } from '@/lib/portal/types';
import { ArrowLeft, MapPin, Calendar, Users, Trash2, UserCheck, Pencil, Save, X } from 'lucide-react';

export default function ProgramDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { isAdmin } = useAuth();
  const supabaseRef = useRef(createPortalClient());
  const supabase = supabaseRef.current;
  const [program, setProgram] = useState<ProgramWithAssignments | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'edit' | 'identify'>('overview');

  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editStartDate, setEditStartDate] = useState('');
  const [editEndDate, setEditEndDate] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editSeniorRequired, setEditSeniorRequired] = useState(0);
  const [editJuniorRequired, setEditJuniorRequired] = useState(0);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const loadProgram = useCallback(async () => {
    const { data, error } = await supabase
      .from('programs')
      .select(`*, assignments:program_assignments(*, practitioner:profiles(*))`)
      .eq('id', id)
      .single();

    if (!error && data) {
      setProgram(data as ProgramWithAssignments);
      setEditName(data.name);
      setEditDescription(data.description || '');
      setEditStartDate(data.start_date);
      setEditEndDate(data.end_date);
      setEditLocation(data.location || '');
      setEditSeniorRequired(data.senior_required);
      setEditJuniorRequired(data.junior_required);
    }
    setLoading(false);
  }, [id, supabase]);

  useEffect(() => {
    loadProgram();

    const channel = supabase
      .channel(`portal-program-${id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'program_assignments', filter: `program_id=eq.${id}` }, () => {
        loadProgram();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [id, loadProgram, supabase]);

  const handleInvite = async (practitionerIds: string[], seniority: SeniorityLevel) => {
    const assignments = practitionerIds.map(pid => ({
      program_id: id as string,
      practitioner_id: pid,
      role_in_program: seniority,
      status: 'invited' as const,
    }));

    const { error } = await supabase.from('program_assignments').insert(assignments);
    if (error) throw error;

    await fetch('/portal/api/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'send_invitations', programId: id, practitionerIds }),
    });

    await loadProgram();
  };

  const handleSave = async () => {
    if (!editName.trim() || !editStartDate || !editEndDate) return;
    setSaving(true);
    setSaveSuccess(false);

    await supabase.from('programs').update({
      name: editName.trim(),
      description: editDescription.trim() || null,
      start_date: editStartDate,
      end_date: editEndDate,
      location: editLocation.trim() || null,
      senior_required: editSeniorRequired,
      junior_required: editJuniorRequired,
    }).eq('id', id);

    await loadProgram();
    setSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this program?')) return;
    await supabase.from('programs').delete().eq('id', id);
    router.replace('/portal/dashboard/programs');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 rounded-full border-2 portal-animate-spin"
          style={{ borderColor: 'var(--portal-accent)', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  if (!program) {
    return (
      <div className="flex items-center justify-center h-full" style={{ color: 'var(--portal-text-tertiary)' }}>
        Program not found
      </div>
    );
  }

  const stage = PIPELINE_STAGES.find(s => s.key === program.pipeline_stage);
  const confirmedSenior = program.assignments.filter(a => a.role_in_program === 'senior' && a.status === 'confirmed').length;
  const confirmedJunior = program.assignments.filter(a => a.role_in_program === 'junior' && a.status === 'confirmed').length;
  const pendingCount = program.assignments.filter(a => a.status === 'invited' || a.status === 'accepted').length;

  const inputStyle = { background: 'var(--portal-bg-secondary)', border: '1px solid var(--portal-border-default)', padding: '16px 20px' };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-24 pt-12 pb-14">
        <button
          onClick={() => router.push('/portal/dashboard/programs')}
          className="flex items-center gap-2 text-[14px] mb-5 transition-colors"
          style={{ color: 'var(--portal-text-secondary)' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--portal-accent)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--portal-text-secondary)')}
        >
          <ArrowLeft size={16} />
          Back to Programs
        </button>

        <div className="flex items-start justify-between" style={{ marginBottom: '28px' }}>
          <div>
            <div className="flex items-center gap-3" style={{ marginBottom: '10px' }}>
              <h1 className="text-4xl" style={{ color: 'var(--portal-text-primary)' }}>{program.name}</h1>
              {stage && (
                <span className="px-3 py-1 rounded-full text-xs font-semibold"
                  style={{ backgroundColor: stage.color + '20', color: stage.color, border: `1px solid ${stage.color}30` }}>
                  {stage.label}
                </span>
              )}
            </div>
            <div className="flex items-center gap-4 text-[15px]" style={{ color: 'var(--portal-text-tertiary)' }}>
              <span className="flex items-center gap-1.5">
                <Calendar size={14} />
                {formatDateRange(program.start_date, program.end_date)}
              </span>
              {program.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin size={14} />
                  {program.location}
                </span>
              )}
            </div>
          </div>
          {isAdmin && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab(activeTab === 'edit' ? 'overview' : 'edit')}
                className="flex items-center gap-2 rounded-xl text-[14px] font-medium transition-all"
                style={{
                  padding: '10px 16px',
                  background: activeTab === 'edit' ? 'var(--portal-accent-subtle)' : 'var(--portal-bg-secondary)',
                  color: activeTab === 'edit' ? 'var(--portal-accent)' : 'var(--portal-text-secondary)',
                  border: activeTab === 'edit' ? '1px solid var(--portal-border-accent)' : '1px solid var(--portal-border-default)',
                }}
              >
                <Pencil size={15} />
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="rounded-xl transition-all"
                style={{ padding: '10px', border: '1px solid transparent', color: 'var(--portal-text-tertiary)' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--portal-danger)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--portal-text-tertiary)')}
                title="Delete program"
              >
                <Trash2 size={18} />
              </button>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3" style={{ gap: '20px', marginBottom: '24px' }}>
          <div className="portal-stat-card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--portal-success-subtle)' }}>
                <UserCheck size={18} style={{ color: 'var(--portal-success)' }} />
              </div>
              <div>
                <p className="text-lg font-bold">
                  <span style={{ color: confirmedSenior >= program.senior_required ? 'var(--portal-success)' : 'var(--portal-warning)' }}>{confirmedSenior}</span>
                  <span style={{ color: 'var(--portal-text-tertiary)' }}>/{program.senior_required}</span>
                </p>
                <p className="text-xs" style={{ color: 'var(--portal-text-tertiary)' }}>Senior Practitioners</p>
              </div>
            </div>
          </div>
          <div className="portal-stat-card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--portal-success-subtle)' }}>
                <UserCheck size={18} style={{ color: 'var(--portal-success)' }} />
              </div>
              <div>
                <p className="text-lg font-bold">
                  <span style={{ color: confirmedJunior >= program.junior_required ? 'var(--portal-success)' : 'var(--portal-warning)' }}>{confirmedJunior}</span>
                  <span style={{ color: 'var(--portal-text-tertiary)' }}>/{program.junior_required}</span>
                </p>
                <p className="text-xs" style={{ color: 'var(--portal-text-tertiary)' }}>Junior Practitioners</p>
              </div>
            </div>
          </div>
          <div className="portal-stat-card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--portal-warning-subtle)' }}>
                <Users size={18} style={{ color: 'var(--portal-warning)' }} />
              </div>
              <div>
                <p className="text-lg font-bold" style={{ color: 'var(--portal-text-primary)' }}>{pendingCount}</p>
                <p className="text-xs" style={{ color: 'var(--portal-text-tertiary)' }}>Pending Invites</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        {isAdmin && (
          <div className="flex rounded-xl w-fit" style={{ background: 'var(--portal-bg-secondary)', border: '1px solid var(--portal-border-default)', padding: '4px' }}>
            {(['overview', 'edit', 'identify'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="rounded-xl text-[14px] font-medium transition-all"
                style={{
                  padding: '10px 20px',
                  background: activeTab === tab ? 'var(--portal-bg-elevated)' : 'transparent',
                  color: activeTab === tab ? 'var(--portal-accent)' : 'var(--portal-text-tertiary)',
                  boxShadow: activeTab === tab ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
                }}
              >
                {tab === 'overview' ? 'Overview' : tab === 'edit' ? 'Edit Program' : 'Identify Practitioners'}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto px-24 pb-10 pt-10" style={{ borderTop: '1px solid var(--portal-border-default)' }}>
        {activeTab === 'edit' ? (
          <div className="max-w-2xl" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div>
              <label className="block text-[15px] font-medium" style={{ color: 'var(--portal-text-secondary)', marginBottom: '10px' }}>Program Name</label>
              <input type="text" value={editName} onChange={e => setEditName(e.target.value)}
                className="w-full rounded-2xl text-[16px] focus:outline-none transition-all"
                style={{ ...inputStyle, color: 'var(--portal-text-primary)' }}
                onFocus={e => e.target.style.borderColor = 'var(--portal-accent)'}
                onBlur={e => e.target.style.borderColor = 'var(--portal-border-default)'}
              />
            </div>
            <div>
              <label className="block text-[15px] font-medium" style={{ color: 'var(--portal-text-secondary)', marginBottom: '10px' }}>Description</label>
              <textarea value={editDescription} onChange={e => setEditDescription(e.target.value)}
                className="w-full rounded-2xl text-[16px] focus:outline-none transition-all resize-none"
                style={{ ...inputStyle, minHeight: '120px', color: 'var(--portal-text-primary)' }}
                onFocus={e => e.target.style.borderColor = 'var(--portal-accent)'}
                onBlur={e => e.target.style.borderColor = 'var(--portal-border-default)'}
                placeholder="Program description..."
              />
            </div>
            <div className="grid grid-cols-2" style={{ gap: '20px' }}>
              <div>
                <label className="block text-[15px] font-medium" style={{ color: 'var(--portal-text-secondary)', marginBottom: '10px' }}>Start Date</label>
                <input type="date" value={editStartDate} onChange={e => setEditStartDate(e.target.value)}
                  className="w-full rounded-2xl text-[16px] focus:outline-none transition-all"
                  style={{ ...inputStyle, color: 'var(--portal-text-primary)' }}
                  onFocus={e => e.target.style.borderColor = 'var(--portal-accent)'}
                  onBlur={e => e.target.style.borderColor = 'var(--portal-border-default)'}
                />
              </div>
              <div>
                <label className="block text-[15px] font-medium" style={{ color: 'var(--portal-text-secondary)', marginBottom: '10px' }}>End Date</label>
                <input type="date" value={editEndDate} onChange={e => setEditEndDate(e.target.value)}
                  className="w-full rounded-2xl text-[16px] focus:outline-none transition-all"
                  style={{ ...inputStyle, color: 'var(--portal-text-primary)' }}
                  onFocus={e => e.target.style.borderColor = 'var(--portal-accent)'}
                  onBlur={e => e.target.style.borderColor = 'var(--portal-border-default)'}
                />
              </div>
            </div>
            <div>
              <label className="block text-[15px] font-medium" style={{ color: 'var(--portal-text-secondary)', marginBottom: '10px' }}>Location</label>
              <input type="text" value={editLocation} onChange={e => setEditLocation(e.target.value)}
                className="w-full rounded-2xl text-[16px] focus:outline-none transition-all"
                style={{ ...inputStyle, color: 'var(--portal-text-primary)' }}
                onFocus={e => e.target.style.borderColor = 'var(--portal-accent)'}
                onBlur={e => e.target.style.borderColor = 'var(--portal-border-default)'}
                placeholder="e.g., New York, Virtual"
              />
            </div>
            <div className="grid grid-cols-2" style={{ gap: '20px' }}>
              <div className="portal-stat-card">
                <label className="block text-[15px] font-medium" style={{ color: 'var(--portal-text-secondary)', marginBottom: '16px' }}>Senior Practitioners</label>
                <div className="flex items-center gap-4">
                  <button type="button" onClick={() => setEditSeniorRequired(Math.max(0, editSeniorRequired - 1))}
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-lg font-bold transition-all"
                    style={{ background: 'var(--portal-bg-hover)', color: 'var(--portal-text-secondary)', border: '1px solid var(--portal-border-default)' }}>-</button>
                  <span className="text-3xl font-light" style={{ color: 'var(--portal-text-primary)', minWidth: '3rem', textAlign: 'center' }}>{editSeniorRequired}</span>
                  <button type="button" onClick={() => setEditSeniorRequired(editSeniorRequired + 1)}
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-lg font-bold transition-all"
                    style={{ background: 'var(--portal-accent-subtle)', color: 'var(--portal-accent)', border: '1px solid var(--portal-border-accent)' }}>+</button>
                </div>
              </div>
              <div className="portal-stat-card">
                <label className="block text-[15px] font-medium" style={{ color: 'var(--portal-text-secondary)', marginBottom: '16px' }}>Junior Practitioners</label>
                <div className="flex items-center gap-4">
                  <button type="button" onClick={() => setEditJuniorRequired(Math.max(0, editJuniorRequired - 1))}
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-lg font-bold transition-all"
                    style={{ background: 'var(--portal-bg-hover)', color: 'var(--portal-text-secondary)', border: '1px solid var(--portal-border-default)' }}>-</button>
                  <span className="text-3xl font-light" style={{ color: 'var(--portal-text-primary)', minWidth: '3rem', textAlign: 'center' }}>{editJuniorRequired}</span>
                  <button type="button" onClick={() => setEditJuniorRequired(editJuniorRequired + 1)}
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-lg font-bold transition-all"
                    style={{ background: 'var(--portal-accent-subtle)', color: 'var(--portal-accent)', border: '1px solid var(--portal-border-accent)' }}>+</button>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4" style={{ marginTop: '8px' }}>
              <button onClick={handleSave} disabled={saving || !editName.trim() || !editStartDate || !editEndDate}
                className="flex items-center gap-2 rounded-2xl text-[16px] font-semibold transition-all disabled:opacity-50 portal-glow-accent text-white"
                style={{ background: 'var(--portal-gradient-accent)', padding: '14px 28px' }}>
                <Save size={18} />
                {saving ? 'Saving...' : saveSuccess ? 'Saved!' : 'Save Changes'}
              </button>
              <button onClick={() => {
                if (program) {
                  setEditName(program.name);
                  setEditDescription(program.description || '');
                  setEditStartDate(program.start_date);
                  setEditEndDate(program.end_date);
                  setEditLocation(program.location || '');
                  setEditSeniorRequired(program.senior_required);
                  setEditJuniorRequired(program.junior_required);
                }
                setActiveTab('overview');
              }}
                className="rounded-2xl text-[15px] font-medium portal-glass-card transition-all"
                style={{ padding: '14px 24px', color: 'var(--portal-text-secondary)' }}>
                Cancel
              </button>
            </div>
          </div>
        ) : activeTab === 'overview' ? (
          <div className="max-w-3xl" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {program.description && (
              <div className="portal-glass-card rounded-2xl" style={{ padding: '24px' }}>
                <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--portal-text-tertiary)', marginBottom: '12px' }}>Description</h3>
                <p className="text-[15px] leading-relaxed" style={{ color: 'var(--portal-text-primary)' }}>{program.description}</p>
              </div>
            )}

            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--portal-text-tertiary)', marginBottom: '16px' }}>
                Assigned Practitioners ({program.assignments.length})
              </h3>

              {program.assignments.length === 0 ? (
                <div className="rounded-2xl text-center text-[15px] portal-glass-card" style={{ padding: '40px', borderStyle: 'dashed', color: 'var(--portal-text-tertiary)' }}>
                  No practitioners assigned yet.
                  {isAdmin && ' Switch to the "Identify Practitioners" tab to start.'}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {program.assignments.map((a, index) => (
                    <div key={a.id} className="flex items-center gap-4 rounded-xl portal-glass-card portal-animate-fade-in"
                      style={{ padding: '16px', animationDelay: `${index * 40}ms` }}>
                      <div className="flex items-center justify-center w-10 h-10 rounded-xl text-xs font-bold shrink-0 relative overflow-hidden">
                        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, var(--portal-wc-lavender), var(--portal-wc-sage))', opacity: 0.6 }} />
                        <span className="relative z-10" style={{ color: 'var(--portal-text-primary)' }}>
                          {a.practitioner.full_name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[15px] font-medium" style={{ color: 'var(--portal-text-primary)' }}>{a.practitioner.full_name}</p>
                        <p className="text-[13px]" style={{ color: 'var(--portal-text-tertiary)' }}>
                          {a.role_in_program === 'senior' ? 'Senior' : 'Junior'} Practitioner
                        </p>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-semibold"
                        style={{
                          backgroundColor: ASSIGNMENT_STATUS_COLORS[a.status] + '20',
                          color: ASSIGNMENT_STATUS_COLORS[a.status],
                          border: `1px solid ${ASSIGNMENT_STATUS_COLORS[a.status]}30`,
                        }}>
                        {ASSIGNMENT_STATUS_LABELS[a.status]}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="max-w-3xl">
            <IdentifyPractitioners program={program} onInvite={handleInvite} />
          </div>
        )}
      </div>
    </div>
  );
}
