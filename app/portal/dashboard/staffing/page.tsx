'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/portal/useAuth';
import { createPortalClient } from '@/lib/portal/supabase';
import type { Profile, ProgramWithAssignments, SeniorityLevel } from '@/lib/portal/types';
import { Send, MapPin, Calendar, ArrowLeft, ArrowRight, Edit3, Check, Clock, UserCheck, ShieldCheck, XCircle } from 'lucide-react';
import { formatDateRange } from '@/lib/portal/utils';

const DEFAULT_INVITE_TEXT = `Hi {name},

We'd like to invite you to participate in {program} as a {role} practitioner.

Program Details:
- Dates: {dates}
- Location: {location}

Please review the details and let us know if you're available to join this engagement. We look forward to having you on the team.

Best regards,
LeadershipCo Team`;

export default function StaffingPage() {
  const { profile, isAdmin, loading: authLoading } = useAuth();
  const supabase = createPortalClient();

  const [programs, setPrograms] = useState<ProgramWithAssignments[]>([]);
  const [practitioners, setPractitioners] = useState<Profile[]>([]);
  const [selectedProgram, setSelectedProgram] = useState<ProgramWithAssignments | null>(null);
  const [activeTab, setActiveTab] = useState<'status' | 'invite'>('status');
  const [selectedPractitioners, setSelectedPractitioners] = useState<Set<string>>(new Set());
  const [seniority, setSeniority] = useState<SeniorityLevel>('senior');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [inviteText, setInviteText] = useState(DEFAULT_INVITE_TEXT);
  const [showEditInvite, setShowEditInvite] = useState(false);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current || authLoading || !profile) return;
    initialized.current = true;
    loadData();
  }, [profile, authLoading]);

  async function loadData() {
    setLoading(true);
    const { data: progData } = await supabase
      .from('programs')
      .select('*, assignments:program_assignments(*, practitioner:profiles(*))')
      .order('start_date');
    const { data: practData } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'practitioner')
      .order('full_name');
    setPrograms((progData as ProgramWithAssignments[]) || []);
    setPractitioners(practData || []);
    setLoading(false);
  }

  async function reloadPrograms() {
    const { data: progData } = await supabase
      .from('programs')
      .select('*, assignments:program_assignments(*, practitioner:profiles(*))')
      .order('start_date');
    setPrograms((progData as ProgramWithAssignments[]) || []);
    if (selectedProgram) {
      const updated = (progData as ProgramWithAssignments[])?.find(p => p.id === selectedProgram.id);
      if (updated) setSelectedProgram(updated);
    }
  }

  const handleStatusChange = async (assignmentId: string, newStatus: 'confirmed' | 'rejected') => {
    await supabase.from('program_assignments')
      .update({ status: newStatus, responded_at: new Date().toISOString() })
      .eq('id', assignmentId);
    await reloadPrograms();
  };

  const getEligiblePractitioners = () => {
    if (!selectedProgram) return [];
    const alreadyAssigned = new Set(selectedProgram.assignments.map(a => a.practitioner_id));
    return practitioners.filter(p => !alreadyAssigned.has(p.id) && (p.seniority === seniority || !p.seniority));
  };

  const togglePractitioner = (id: string) => {
    const next = new Set(selectedPractitioners);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelectedPractitioners(next);
  };

  const handleSendInvitations = async () => {
    if (!selectedProgram || selectedPractitioners.size === 0) return;
    setSending(true);
    setSuccessMsg('');

    const assignments = Array.from(selectedPractitioners).map(pid => ({
      program_id: selectedProgram.id,
      practitioner_id: pid,
      role_in_program: seniority,
      status: 'invited' as const,
    }));

    const { error } = await supabase.from('program_assignments').insert(assignments);

    if (!error) {
      await fetch('/portal/api/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'send_invitations',
          programId: selectedProgram.id,
          practitionerIds: Array.from(selectedPractitioners),
          customMessage: inviteText,
        }),
      });

      setSuccessMsg(`${selectedPractitioners.size} invitation(s) sent successfully!`);
      setSelectedPractitioners(new Set());
      await reloadPrograms();
    }

    setSending(false);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center h-full" style={{ color: 'var(--portal-text-tertiary)' }}>
        You do not have permission to view this page.
      </div>
    );
  }

  if (selectedProgram) {
    const invited = selectedProgram.assignments.filter(a => a.status === 'invited');
    const accepted = selectedProgram.assignments.filter(a => a.status === 'accepted');
    const confirmed = selectedProgram.assignments.filter(a => a.status === 'confirmed');
    const declined = selectedProgram.assignments.filter(a => a.status === 'declined');
    const rejected = selectedProgram.assignments.filter(a => a.status === 'rejected');
    const confirmedSr = confirmed.filter(a => a.role_in_program === 'senior').length;
    const confirmedJr = confirmed.filter(a => a.role_in_program === 'junior').length;
    const eligible = getEligiblePractitioners();

    return (
      <div className="flex flex-col h-full">
        <div className="px-24 pt-12 pb-10">
          <button onClick={() => { setSelectedProgram(null); setActiveTab('status'); }}
            className="flex items-center gap-2 text-[14px] transition-colors"
            style={{ color: 'var(--portal-text-secondary)', marginBottom: '24px' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--portal-accent)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--portal-text-secondary)')}>
            <ArrowLeft size={16} />
            Back to all programs
          </button>

          <h1 className="text-4xl" style={{ color: 'var(--portal-text-primary)' }}>{selectedProgram.name}</h1>
          <div className="flex items-center gap-4" style={{ marginTop: '8px' }}>
            <span className="flex items-center gap-1.5 text-[15px]" style={{ color: 'var(--portal-text-tertiary)' }}>
              <Calendar size={15} />
              {formatDateRange(selectedProgram.start_date, selectedProgram.end_date)}
            </span>
            {selectedProgram.location && (
              <span className="flex items-center gap-1.5 text-[15px]" style={{ color: 'var(--portal-text-tertiary)' }}>
                <MapPin size={15} />
                {selectedProgram.location}
              </span>
            )}
          </div>

          <div className="grid grid-cols-4" style={{ gap: '20px', marginTop: '32px' }}>
            {[
              { count: invited.length, label: 'Awaiting Response', icon: <Clock size={18} />, bg: 'var(--portal-warning-subtle)', color: 'var(--portal-warning)' },
              { count: accepted.length, label: 'Needs Confirmation', icon: <UserCheck size={18} />, bg: 'rgba(108,140,255,0.1)', color: '#6c8cff' },
              { count: confirmedSr + confirmedJr, label: `Confirmed (${confirmedSr} Sr / ${confirmedJr} Jr)`, icon: <ShieldCheck size={18} />, bg: 'var(--portal-success-subtle)', color: 'var(--portal-success)' },
              { count: declined.length + rejected.length, label: 'Declined / Rejected', icon: <XCircle size={18} />, bg: 'var(--portal-danger-subtle)', color: 'var(--portal-danger)' },
            ].map((stat, i) => (
              <div key={i} className="portal-stat-card">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: stat.bg, color: stat.color }}>{stat.icon}</div>
                  <div>
                    <p className="text-2xl font-light" style={{ color: 'var(--portal-text-primary)' }}>{stat.count}</p>
                    <p className="text-[13px]" style={{ color: 'var(--portal-text-tertiary)' }}>{stat.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-1 p-1 rounded-xl w-fit" style={{ background: 'var(--portal-bg-elevated)', border: '1px solid var(--portal-border-default)', marginTop: '32px' }}>
            {(['status', 'invite'] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className="px-5 py-2.5 rounded-lg text-[14px] font-medium transition-all"
                style={{
                  background: activeTab === tab ? 'var(--portal-gradient-accent)' : 'transparent',
                  color: activeTab === tab ? 'white' : 'var(--portal-text-tertiary)',
                }}>
                {tab === 'status' ? 'Invitation Status' : 'Invite Practitioners'}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-auto px-24 pb-10" style={{ borderTop: '1px solid var(--portal-border-default)', paddingTop: '32px' }}>
          {activeTab === 'status' ? (
            <div style={{ maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '40px' }}>
              {accepted.length > 0 && (
                <div>
                  <h2 className="text-[13px] font-bold uppercase tracking-wider" style={{ color: 'var(--portal-text-tertiary)', marginBottom: '16px' }}>Accepted — Awaiting Your Confirmation</h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {accepted.map(a => (
                      <div key={a.id} className="portal-glass-card rounded-2xl" style={{ padding: '24px', borderLeft: '3px solid #6c8cff' }}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold relative overflow-hidden shrink-0">
                              <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, var(--portal-wc-lavender), var(--portal-wc-sage))', opacity: 0.6 }} />
                              <span className="relative z-10" style={{ color: 'var(--portal-text-primary)' }}>{a.practitioner.full_name.charAt(0).toUpperCase()}</span>
                            </div>
                            <div>
                              <p className="text-[16px] font-medium" style={{ color: 'var(--portal-text-primary)' }}>{a.practitioner.full_name}</p>
                              <p className="text-[13px]" style={{ color: 'var(--portal-text-tertiary)' }}>{a.role_in_program === 'senior' ? 'Senior' : 'Junior'} Practitioner · {a.practitioner.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <button onClick={() => handleStatusChange(a.id, 'confirmed')}
                              className="flex items-center gap-1.5 rounded-xl text-[14px] font-semibold transition-all portal-glow-accent text-white"
                              style={{ background: 'var(--portal-gradient-accent)', padding: '10px 20px' }}>
                              <ShieldCheck size={15} />Confirm
                            </button>
                            <button onClick={() => handleStatusChange(a.id, 'rejected')}
                              className="flex items-center gap-1.5 rounded-xl text-[14px] font-medium transition-all"
                              style={{ background: 'var(--portal-danger-subtle)', color: 'var(--portal-danger)', border: '1px solid rgba(196,114,114,0.2)', padding: '10px 20px' }}>
                              Reject
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {invited.length > 0 && (
                <div>
                  <h2 className="text-[13px] font-bold uppercase tracking-wider" style={{ color: 'var(--portal-text-tertiary)', marginBottom: '16px' }}>Invited — Awaiting Practitioner Response</h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {invited.map(a => (
                      <div key={a.id} className="portal-glass-card rounded-2xl" style={{ padding: '24px', borderLeft: '3px solid var(--portal-warning)' }}>
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold relative overflow-hidden shrink-0">
                            <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, var(--portal-wc-lavender), var(--portal-wc-sage))', opacity: 0.6 }} />
                            <span className="relative z-10" style={{ color: 'var(--portal-text-primary)' }}>{a.practitioner.full_name.charAt(0).toUpperCase()}</span>
                          </div>
                          <div>
                            <p className="text-[16px] font-medium" style={{ color: 'var(--portal-text-primary)' }}>{a.practitioner.full_name}</p>
                            <p className="text-[13px]" style={{ color: 'var(--portal-text-tertiary)' }}>{a.role_in_program === 'senior' ? 'Senior' : 'Junior'} · Invited {new Date(a.invited_at).toLocaleDateString()}</p>
                          </div>
                          <span className="ml-auto px-3 py-1 rounded-full text-[12px] font-medium" style={{ background: 'var(--portal-warning-subtle)', color: 'var(--portal-warning)' }}>Pending</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {confirmed.length > 0 && (
                <div>
                  <h2 className="text-[13px] font-bold uppercase tracking-wider" style={{ color: 'var(--portal-text-tertiary)', marginBottom: '16px' }}>Confirmed — Officially Staffed</h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {confirmed.map(a => (
                      <div key={a.id} className="portal-glass-card rounded-2xl" style={{ padding: '24px', borderLeft: '3px solid var(--portal-success)' }}>
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold relative overflow-hidden shrink-0">
                            <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, var(--portal-wc-lavender), var(--portal-wc-sage))', opacity: 0.6 }} />
                            <span className="relative z-10" style={{ color: 'var(--portal-text-primary)' }}>{a.practitioner.full_name.charAt(0).toUpperCase()}</span>
                          </div>
                          <div>
                            <p className="text-[16px] font-medium" style={{ color: 'var(--portal-text-primary)' }}>{a.practitioner.full_name}</p>
                            <p className="text-[13px]" style={{ color: 'var(--portal-text-tertiary)' }}>{a.role_in_program === 'senior' ? 'Senior' : 'Junior'} Practitioner</p>
                          </div>
                          <span className="ml-auto px-3 py-1 rounded-full text-[12px] font-medium" style={{ background: 'var(--portal-success-subtle)', color: 'var(--portal-success)' }}>Confirmed</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(declined.length > 0 || rejected.length > 0) && (
                <div>
                  <h2 className="text-[13px] font-bold uppercase tracking-wider" style={{ color: 'var(--portal-text-tertiary)', marginBottom: '16px' }}>Declined / Rejected</h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {[...declined, ...rejected].map(a => (
                      <div key={a.id} className="portal-glass-card rounded-2xl" style={{ padding: '24px', opacity: 0.6 }}>
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shrink-0"
                            style={{ background: 'var(--portal-bg-hover)', color: 'var(--portal-text-tertiary)' }}>
                            {a.practitioner.full_name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-[15px]" style={{ color: 'var(--portal-text-secondary)' }}>{a.practitioner.full_name}</p>
                            <p className="text-[13px]" style={{ color: 'var(--portal-text-tertiary)' }}>{a.role_in_program === 'senior' ? 'Senior' : 'Junior'} · {a.status === 'declined' ? 'Practitioner declined' : 'Admin rejected'}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedProgram.assignments.length === 0 && (
                <div className="text-center" style={{ padding: '60px 0' }}>
                  <Send size={36} className="mx-auto" style={{ color: 'var(--portal-text-tertiary)', marginBottom: '16px' }} />
                  <p className="text-[16px]" style={{ color: 'var(--portal-text-tertiary)' }}>No practitioners have been invited yet</p>
                  <button onClick={() => setActiveTab('invite')}
                    className="mt-4 px-5 py-2.5 rounded-xl text-[14px] font-semibold text-white transition-all"
                    style={{ background: 'var(--portal-gradient-accent)' }}>
                    Invite Practitioners
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ maxWidth: '700px' }}>
              <div className="flex p-1 rounded-xl w-fit" style={{ background: 'var(--portal-bg-elevated)', border: '1px solid var(--portal-border-default)', marginBottom: '24px' }}>
                {(['senior', 'junior'] as const).map(s => (
                  <button key={s} onClick={() => { setSeniority(s); setSelectedPractitioners(new Set()); }}
                    className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                    style={{
                      background: seniority === s ? 'var(--portal-gradient-gold)' : 'transparent',
                      color: seniority === s ? '#0c1222' : 'var(--portal-text-tertiary)',
                    }}>
                    {s === 'senior' ? 'Senior Practitioners' : 'Junior Practitioners'}
                  </button>
                ))}
              </div>

              {successMsg && (
                <div className="px-4 py-3 rounded-xl text-sm" style={{ background: 'var(--portal-success-subtle)', border: '1px solid rgba(16,185,129,0.2)', color: 'var(--portal-success)', marginBottom: '20px' }}>
                  {successMsg}
                </div>
              )}

              {eligible.length === 0 ? (
                <div className="p-8 rounded-2xl text-center text-sm portal-glass-card" style={{ color: 'var(--portal-text-tertiary)' }}>
                  No {seniority} practitioners available for this program
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {eligible.map((p, index) => (
                    <button key={p.id} onClick={() => togglePractitioner(p.id)}
                      className="flex items-center gap-4 w-full px-4 py-3 rounded-xl text-left transition-all portal-animate-fade-in portal-glass-card"
                      style={{
                        animationDelay: `${index * 40}ms`,
                        borderColor: selectedPractitioners.has(p.id) ? 'var(--portal-accent)' : undefined,
                        background: selectedPractitioners.has(p.id) ? 'var(--portal-accent-subtle)' : undefined,
                      }}>
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 transition-all"
                        style={selectedPractitioners.has(p.id)
                          ? { background: 'var(--portal-gradient-gold)', color: '#0c1222' }
                          : { background: 'var(--portal-bg-hover)', color: 'var(--portal-text-secondary)' }}>
                        {selectedPractitioners.has(p.id) ? <Check size={14} /> : p.full_name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium" style={{ color: 'var(--portal-text-primary)' }}>{p.full_name}</p>
                        <p className="text-xs" style={{ color: 'var(--portal-text-tertiary)' }}>{p.email}</p>
                      </div>
                      {p.seniority && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'var(--portal-bg-hover)', color: 'var(--portal-text-tertiary)' }}>
                          {p.seniority}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {selectedPractitioners.size > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '20px' }}>
                  <button onClick={() => setShowEditInvite(!showEditInvite)}
                    className="flex items-center gap-2 text-xs font-medium transition-all"
                    style={{ color: 'var(--portal-accent)' }}>
                    <Edit3 size={14} />
                    {showEditInvite ? 'Hide invite message' : 'Edit invite message'}
                  </button>

                  {showEditInvite && (
                    <div className="portal-glass-card rounded-2xl p-4 portal-animate-fade-in">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--portal-text-tertiary)' }}>Invitation Message</label>
                        <button onClick={() => setInviteText(DEFAULT_INVITE_TEXT)}
                          className="text-[10px] transition-colors"
                          style={{ color: 'var(--portal-text-tertiary)' }}
                          onMouseEnter={e => (e.currentTarget.style.color = 'var(--portal-accent)')}
                          onMouseLeave={e => (e.currentTarget.style.color = 'var(--portal-text-tertiary)')}>
                          Reset to default
                        </button>
                      </div>
                      <p className="text-[10px] mb-3" style={{ color: 'var(--portal-text-tertiary)' }}>
                        Use {'{name}'}, {'{program}'}, {'{role}'}, {'{dates}'}, {'{location}'} as placeholders
                      </p>
                      <textarea value={inviteText} onChange={e => setInviteText(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none transition-all resize-none"
                        style={{ background: 'var(--portal-bg-primary)', border: '1px solid var(--portal-border-default)', minHeight: '200px', fontFamily: 'inherit', lineHeight: '1.6', color: 'var(--portal-text-primary)' }}
                        onFocus={e => e.target.style.borderColor = 'var(--portal-accent)'}
                        onBlur={e => e.target.style.borderColor = 'var(--portal-border-default)'}
                      />
                    </div>
                  )}

                  <button onClick={handleSendInvitations} disabled={sending}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 portal-glow-accent w-fit text-white"
                    style={{ background: 'var(--portal-gradient-accent)' }}>
                    <Send size={16} />
                    {sending ? 'Sending...' : `Send ${selectedPractitioners.size} Invitation(s)`}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-24 pt-12 pb-14">
        <h1 className="text-4xl" style={{ color: 'var(--portal-text-primary)' }}>Program Staffing</h1>
        <p className="text-[16px]" style={{ marginTop: '8px', color: 'var(--portal-text-tertiary)' }}>
          Click a program to manage invitations and confirm practitioners
        </p>
      </div>

      <div className="flex-1 overflow-auto px-24 pb-10" style={{ borderTop: '1px solid var(--portal-border-default)', paddingTop: '32px' }}>
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 rounded-full border-2 portal-animate-spin"
              style={{ borderColor: 'var(--portal-accent)', borderTopColor: 'transparent' }} />
          </div>
        ) : programs.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Send size={36} className="mx-auto" style={{ color: 'var(--portal-text-tertiary)', marginBottom: '16px' }} />
              <p className="text-[16px]" style={{ color: 'var(--portal-text-tertiary)' }}>No programs yet</p>
            </div>
          </div>
        ) : (
          <div style={{ maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {programs.map(prog => {
              const inv = prog.assignments.filter(a => a.status === 'invited').length;
              const acc = prog.assignments.filter(a => a.status === 'accepted').length;
              const conf = prog.assignments.filter(a => a.status === 'confirmed').length;
              const total = prog.assignments.length;

              return (
                <button key={prog.id} onClick={() => setSelectedProgram(prog)}
                  className="w-full text-left portal-glass-card rounded-2xl transition-all"
                  style={{ padding: '24px' }}>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-[18px]" style={{ fontFamily: "'DM Serif Display', serif", color: 'var(--portal-text-primary)' }}>{prog.name}</h3>
                      <div className="flex items-center gap-4" style={{ marginTop: '6px' }}>
                        <span className="flex items-center gap-1.5 text-[14px]" style={{ color: 'var(--portal-text-tertiary)' }}>
                          <Calendar size={14} />
                          {formatDateRange(prog.start_date, prog.end_date)}
                        </span>
                        {prog.location && (
                          <span className="flex items-center gap-1.5 text-[14px]" style={{ color: 'var(--portal-text-tertiary)' }}>
                            <MapPin size={14} />
                            {prog.location}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {acc > 0 && (
                        <span className="px-3 py-1.5 rounded-full text-[12px] font-semibold" style={{ background: 'rgba(108,140,255,0.1)', color: '#6c8cff', border: '1px solid rgba(108,140,255,0.2)' }}>
                          {acc} to confirm
                        </span>
                      )}
                      <ArrowRight size={16} style={{ color: 'var(--portal-text-tertiary)' }} />
                    </div>
                  </div>
                  {total > 0 && (
                    <div className="flex items-center gap-4" style={{ marginTop: '16px' }}>
                      {inv > 0 && <span className="text-[13px]" style={{ color: 'var(--portal-warning)' }}>{inv} pending</span>}
                      {acc > 0 && <span className="text-[13px]" style={{ color: '#6c8cff' }}>{acc} accepted</span>}
                      {conf > 0 && <span className="text-[13px]" style={{ color: 'var(--portal-success)' }}>{conf} confirmed</span>}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
