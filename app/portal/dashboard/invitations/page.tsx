'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/portal/useAuth';
import { createPortalClient } from '@/lib/portal/supabase';
import { formatDateRange } from '@/lib/portal/utils';
import type { ProgramWithAssignments } from '@/lib/portal/types';
import { Send, XCircle, Clock, MapPin, ArrowLeft, UserCheck, ShieldCheck, Calendar } from 'lucide-react';

export default function InvitationsPage() {
  const { profile, isAdmin, loading: authLoading } = useAuth();
  const supabase = createPortalClient();

  const [programs, setPrograms] = useState<ProgramWithAssignments[]>([]);
  const [selectedProgram, setSelectedProgram] = useState<ProgramWithAssignments | null>(null);
  const [loading, setLoading] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    if (!profile || authLoading || dataLoaded) return;

    async function loadPrograms() {
      setLoading(true);
      if (isAdmin) {
        const { data } = await supabase
          .from('programs')
          .select('*, assignments:program_assignments(*, practitioner:profiles(*))')
          .order('start_date');
        setPrograms((data as ProgramWithAssignments[]) || []);
      }
      setLoading(false);
      setDataLoaded(true);
    }

    loadPrograms();
  }, [profile, isAdmin, authLoading, dataLoaded, supabase]);

  const reloadPrograms = async () => {
    const { data } = await supabase
      .from('programs')
      .select('*, assignments:program_assignments(*, practitioner:profiles(*))')
      .order('start_date');
    setPrograms((data as ProgramWithAssignments[]) || []);

    if (selectedProgram) {
      const updated = (data as ProgramWithAssignments[])?.find(p => p.id === selectedProgram.id);
      if (updated) setSelectedProgram(updated);
    }
  };

  const handleStatusChange = async (assignmentId: string, newStatus: 'confirmed' | 'rejected') => {
    await supabase.from('program_assignments')
      .update({ status: newStatus, responded_at: new Date().toISOString() })
      .eq('id', assignmentId);
    await reloadPrograms();
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

    return (
      <div className="flex flex-col h-full">
        <div className="px-24 pt-12 pb-14">
          <button onClick={() => setSelectedProgram(null)}
            className="flex items-center gap-2 text-[14px] transition-colors mb-6"
            style={{ color: 'var(--portal-text-secondary)' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--portal-accent)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--portal-text-secondary)')}>
            <ArrowLeft size={16} />
            Back to Program Invitations
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
        </div>

        <div className="flex-1 overflow-auto px-24 pb-10" style={{ borderTop: '1px solid var(--portal-border-default)', paddingTop: '32px' }}>
          <div style={{ maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '40px' }}>
            {accepted.length > 0 && (
              <div>
                <h2 className="text-[13px] font-bold uppercase tracking-wider" style={{ color: 'var(--portal-text-tertiary)', marginBottom: '16px' }}>
                  Accepted — Awaiting Your Confirmation
                </h2>
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
                            <p className="text-[13px]" style={{ color: 'var(--portal-text-tertiary)' }}>
                              {a.role_in_program === 'senior' ? 'Senior' : 'Junior'} Practitioner · {a.practitioner.email}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button onClick={() => handleStatusChange(a.id, 'confirmed')}
                            className="flex items-center gap-1.5 rounded-xl text-[14px] font-semibold transition-all portal-glow-accent text-white"
                            style={{ background: 'var(--portal-gradient-accent)', padding: '10px 20px' }}>
                            <ShieldCheck size={15} />
                            Confirm
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
                <h2 className="text-[13px] font-bold uppercase tracking-wider" style={{ color: 'var(--portal-text-tertiary)', marginBottom: '16px' }}>
                  Invited — Awaiting Practitioner Response
                </h2>
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
                          <p className="text-[13px]" style={{ color: 'var(--portal-text-tertiary)' }}>
                            {a.role_in_program === 'senior' ? 'Senior' : 'Junior'} Practitioner · Invited {new Date(a.invited_at).toLocaleDateString()}
                          </p>
                        </div>
                        <span className="ml-auto px-3 py-1 rounded-full text-[12px] font-medium" style={{ background: 'var(--portal-warning-subtle)', color: 'var(--portal-warning)' }}>
                          Pending
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {confirmed.length > 0 && (
              <div>
                <h2 className="text-[13px] font-bold uppercase tracking-wider" style={{ color: 'var(--portal-text-tertiary)', marginBottom: '16px' }}>
                  Confirmed — Officially Staffed
                </h2>
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
                        <span className="ml-auto px-3 py-1 rounded-full text-[12px] font-medium" style={{ background: 'var(--portal-success-subtle)', color: 'var(--portal-success)' }}>
                          Confirmed
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(declined.length > 0 || rejected.length > 0) && (
              <div>
                <h2 className="text-[13px] font-bold uppercase tracking-wider" style={{ color: 'var(--portal-text-tertiary)', marginBottom: '16px' }}>
                  Declined / Rejected
                </h2>
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
                          <p className="text-[13px]" style={{ color: 'var(--portal-text-tertiary)' }}>
                            {a.role_in_program === 'senior' ? 'Senior' : 'Junior'} · {a.status === 'declined' ? 'Practitioner declined' : 'Admin rejected'}
                          </p>
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
                <p className="text-[16px]" style={{ color: 'var(--portal-text-tertiary)' }}>No practitioners have been invited to this program yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-24 pt-12 pb-14">
        <h1 className="text-4xl" style={{ color: 'var(--portal-text-primary)' }}>Program Invitations</h1>
        <p className="text-[16px]" style={{ marginTop: '8px', color: 'var(--portal-text-tertiary)' }}>
          Click a program to manage practitioner invitations and confirmations
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
                      <h3 className="text-[18px]" style={{ fontFamily: "'DM Serif Display', serif", color: 'var(--portal-text-primary)' }}>
                        {prog.name}
                      </h3>
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
                    {acc > 0 && (
                      <span className="px-3 py-1.5 rounded-full text-[12px] font-semibold shrink-0"
                        style={{ background: 'rgba(108,140,255,0.1)', color: '#6c8cff', border: '1px solid rgba(108,140,255,0.2)' }}>
                        {acc} to confirm
                      </span>
                    )}
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
