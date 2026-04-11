'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createPortalClient } from '@/lib/portal/supabase';
import { useAuth } from '@/hooks/portal/useAuth';
import { formatDateRange } from '@/lib/portal/utils';
import type { Program, ProgramAssignment } from '@/lib/portal/types';
import { Calendar, MapPin, CheckCircle, XCircle } from 'lucide-react';

export default function InvitationPage() {
  const { token } = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const supabase = createPortalClient();

  const [assignment, setAssignment] = useState<ProgramAssignment | null>(null);
  const [program, setProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState(true);
  const [responding, setResponding] = useState(false);
  const [responded, setResponded] = useState(false);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.replace(`/portal/login?next=/portal/invitation/${token}`);
      return;
    }

    loadInvitation();
  }, [user, authLoading, token]);

  async function loadInvitation() {
    const { data: assignmentData } = await supabase
      .from('program_assignments')
      .select('*')
      .eq('invitation_token', token)
      .single();

    if (!assignmentData) {
      setLoading(false);
      return;
    }

    setAssignment(assignmentData);

    const { data: programData } = await supabase
      .from('programs')
      .select('*')
      .eq('id', assignmentData.program_id)
      .single();

    setProgram(programData);
    setLoading(false);
  }

  const handleRespond = async (status: 'accepted' | 'declined') => {
    if (!assignment) return;
    setResponding(true);

    await supabase.from('program_assignments').update({
      status,
      responded_at: new Date().toISOString(),
    }).eq('id', assignment.id);

    setAssignment({ ...assignment, status });
    setResponded(true);
    setResponding(false);
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ background: 'var(--portal-bg-primary)' }}>
        <div style={{ color: 'var(--portal-text-tertiary)' }}>Loading invitation...</div>
      </div>
    );
  }

  if (!assignment || !program) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ background: 'var(--portal-bg-primary)' }}>
        <div className="text-center">
          <h2 className="text-lg font-semibold mb-2" style={{ color: 'var(--portal-text-primary)' }}>Invitation Not Found</h2>
          <p className="text-sm" style={{ color: 'var(--portal-text-tertiary)' }}>This invitation link may have expired or been removed.</p>
          <button onClick={() => router.push('/portal/dashboard/programs')}
            className="mt-4 px-4 py-2 rounded-lg text-sm font-medium text-white"
            style={{ background: 'var(--portal-accent)' }}>
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const alreadyResponded = assignment.status !== 'invited';

  return (
    <div className="flex items-center justify-center min-h-screen p-4" style={{ background: 'var(--portal-bg-primary)' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4"
            style={{ background: 'var(--portal-accent-subtle)' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--portal-accent)" strokeWidth="2">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold" style={{ color: 'var(--portal-text-primary)' }}>Program Invitation</h1>
        </div>

        <div className="rounded-2xl p-6 mb-6"
          style={{ background: 'var(--portal-bg-elevated)', border: '1px solid var(--portal-border-default)' }}>
          <h2 className="text-lg font-semibold mb-1" style={{ color: 'var(--portal-text-primary)' }}>{program.name}</h2>
          <p className="text-xs mb-4" style={{ color: 'var(--portal-text-tertiary)' }}>
            {assignment.role_in_program === 'senior' ? 'Senior' : 'Junior'} Practitioner
          </p>

          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--portal-text-secondary)' }}>
              <Calendar size={14} style={{ color: 'var(--portal-text-tertiary)' }} />
              {formatDateRange(program.start_date, program.end_date)}
            </div>
            {program.location && (
              <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--portal-text-secondary)' }}>
                <MapPin size={14} style={{ color: 'var(--portal-text-tertiary)' }} />
                {program.location}
              </div>
            )}
          </div>

          {program.description && (
            <p className="text-sm" style={{ color: 'var(--portal-text-tertiary)' }}>{program.description}</p>
          )}
        </div>

        {alreadyResponded || responded ? (
          <div className="text-center p-4 rounded-xl" style={{
            background: assignment.status === 'accepted' ? 'var(--portal-success-subtle)' : 'var(--portal-danger-subtle)',
            color: assignment.status === 'accepted' ? 'var(--portal-success)' : 'var(--portal-danger)',
          }}>
            <p className="font-medium">
              {assignment.status === 'accepted' ? 'You accepted this invitation' : 'You declined this invitation'}
            </p>
            <button onClick={() => router.push('/portal/dashboard/calendar')}
              className="mt-3 px-4 py-2 rounded-lg text-sm"
              style={{ background: 'var(--portal-bg-elevated)', color: 'var(--portal-text-primary)' }}>
              Go to My Calendar
            </button>
          </div>
        ) : (
          <div className="flex gap-3">
            <button onClick={() => handleRespond('declined')} disabled={responding}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium disabled:opacity-50 transition-colors"
              style={{ background: 'var(--portal-bg-elevated)', border: '1px solid var(--portal-border-default)', color: 'var(--portal-text-secondary)' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--portal-danger-subtle)'; e.currentTarget.style.color = 'var(--portal-danger)'; e.currentTarget.style.borderColor = 'var(--portal-danger)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--portal-bg-elevated)'; e.currentTarget.style.color = 'var(--portal-text-secondary)'; e.currentTarget.style.borderColor = 'var(--portal-border-default)'; }}>
              <XCircle size={18} />
              Decline
            </button>
            <button onClick={() => handleRespond('accepted')} disabled={responding}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium disabled:opacity-50 transition-colors text-white"
              style={{ background: 'var(--portal-accent)' }}>
              <CheckCircle size={18} />
              Accept
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
