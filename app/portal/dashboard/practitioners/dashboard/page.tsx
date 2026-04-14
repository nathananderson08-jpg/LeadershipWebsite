'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/portal/useAuth';
import { createPortalClient } from '@/lib/portal/supabase';
import { formatDateRange, formatDate } from '@/lib/portal/utils';
import type { Program, ProgramAssignment } from '@/lib/portal/types';
import {
  Calendar,
  MapPin,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Briefcase,
  ChevronRight,
  Star,
  Mail,
  Phone,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

interface AssignmentWithProgram extends ProgramAssignment {
  program: Program;
}

// ─────────────────────────────────────────────────────────────
// Small reusable components
// ─────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-xs font-bold tracking-widest uppercase mb-4"
      style={{ color: 'var(--color-forest-600)', letterSpacing: '0.15em' }}
    >
      {children}
    </p>
  );
}

function EmptyState({ icon, message }: { icon: React.ReactNode; message: string }) {
  return (
    <div
      className="flex flex-col items-center justify-center py-10 rounded-2xl"
      style={{ background: 'var(--color-warm-50)', border: '1px dashed var(--color-warm-200, #e8ddd0)' }}
    >
      <div className="mb-3 opacity-40">{icon}</div>
      <p className="text-sm" style={{ color: 'var(--color-forest-600)' }}>{message}</p>
    </div>
  );
}

function RolePill({ role }: { role: 'senior' | 'junior' }) {
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold"
      style={{
        background: role === 'senior' ? 'rgba(184,148,72,0.12)' : 'rgba(93,171,121,0.12)',
        color: role === 'senior' ? 'var(--color-gold-600)' : 'var(--color-forest-700)',
        border: role === 'senior' ? '1px solid rgba(184,148,72,0.25)' : '1px solid rgba(93,171,121,0.25)',
      }}
    >
      {role === 'senior' ? 'Senior' : 'Junior'} Practitioner
    </span>
  );
}

// ─────────────────────────────────────────────────────────────
// Card: Confirmed Program
// ─────────────────────────────────────────────────────────────

function ProgramCard({ assignment }: { assignment: AssignmentWithProgram }) {
  const { program } = assignment;
  const isPast = new Date(program.end_date) < new Date();

  return (
    <div
      className="rounded-2xl p-5 transition-shadow hover:shadow-md"
      style={{
        background: 'white',
        border: '1px solid var(--color-warm-100, #f0e9e0)',
        boxShadow: '0 1px 4px rgba(10,28,18,0.05)',
        opacity: isPast ? 0.65 : 1,
      }}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h3
            className="font-semibold text-base leading-snug truncate"
            style={{ color: 'var(--color-forest-950)' }}
          >
            {program.name}
          </h3>
          {isPast && (
            <span
              className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
              style={{ background: 'var(--color-warm-100, #f0e9e0)', color: 'var(--color-forest-500)' }}
            >
              Completed
            </span>
          )}
        </div>
        <RolePill role={assignment.role_in_program} />
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-forest-700)' }}>
          <Calendar size={13} style={{ color: 'var(--color-gold-500)', flexShrink: 0 }} />
          {formatDateRange(program.start_date, program.end_date)}
        </div>
        {program.location && (
          <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-forest-700)' }}>
            <MapPin size={13} style={{ color: 'var(--color-gold-500)', flexShrink: 0 }} />
            {program.location}
          </div>
        )}
      </div>

      {program.description && (
        <p
          className="mt-3 text-sm leading-relaxed line-clamp-2"
          style={{ color: 'var(--color-forest-600)' }}
        >
          {program.description}
        </p>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Card: Pending Invitation
// ─────────────────────────────────────────────────────────────

function InvitationCard({
  assignment,
  onRespond,
}: {
  assignment: AssignmentWithProgram;
  onRespond: (id: string, status: 'accepted' | 'declined') => Promise<void>;
}) {
  const { program } = assignment;
  const [responding, setResponding] = useState<'accepted' | 'declined' | null>(null);

  const handleRespond = async (status: 'accepted' | 'declined') => {
    setResponding(status);
    await onRespond(assignment.id, status);
    setResponding(null);
  };

  return (
    <div
      className="rounded-2xl p-5 transition-shadow hover:shadow-md"
      style={{
        background: 'white',
        border: '1px solid var(--color-gold-200, #e8d9a8)',
        boxShadow: '0 1px 4px rgba(184,148,72,0.08)',
      }}
    >
      {/* Gold accent bar */}
      <div
        className="h-0.5 w-10 rounded-full mb-4"
        style={{ background: 'linear-gradient(90deg, var(--color-gold-500), var(--color-gold-300, #e6c96a))' }}
      />

      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h3
            className="font-semibold text-base leading-snug truncate"
            style={{ color: 'var(--color-forest-950)' }}
          >
            {program.name}
          </h3>
          <p className="text-xs mt-0.5" style={{ color: 'var(--color-forest-500)' }}>
            Invited {formatDate(assignment.invited_at)}
          </p>
        </div>
        <RolePill role={assignment.role_in_program} />
      </div>

      <div className="space-y-1.5 mb-4">
        <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-forest-700)' }}>
          <Calendar size={13} style={{ color: 'var(--color-gold-500)', flexShrink: 0 }} />
          {formatDateRange(program.start_date, program.end_date)}
        </div>
        {program.location && (
          <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-forest-700)' }}>
            <MapPin size={13} style={{ color: 'var(--color-gold-500)', flexShrink: 0 }} />
            {program.location}
          </div>
        )}
      </div>

      {program.description && (
        <p
          className="mb-4 text-sm leading-relaxed line-clamp-2"
          style={{ color: 'var(--color-forest-600)' }}
        >
          {program.description}
        </p>
      )}

      {/* Action row */}
      <div className="flex items-center gap-2 pt-3" style={{ borderTop: '1px solid var(--color-warm-100, #f0e9e0)' }}>
        <button
          onClick={() => handleRespond('declined')}
          disabled={!!responding}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all disabled:opacity-50"
          style={{
            background: 'var(--color-warm-50)',
            border: '1px solid var(--color-warm-200, #e8ddd0)',
            color: 'var(--color-forest-600)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = '#fef2f2';
            e.currentTarget.style.borderColor = '#fca5a5';
            e.currentTarget.style.color = '#dc2626';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'var(--color-warm-50)';
            e.currentTarget.style.borderColor = 'var(--color-warm-200, #e8ddd0)';
            e.currentTarget.style.color = 'var(--color-forest-600)';
          }}
        >
          {responding === 'declined' ? (
            <span className="w-3.5 h-3.5 rounded-full border-2 border-current border-t-transparent animate-spin inline-block" />
          ) : (
            <XCircle size={14} />
          )}
          Decline
        </button>

        <button
          onClick={() => handleRespond('accepted')}
          disabled={!!responding}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all disabled:opacity-50 text-white"
          style={{
            background: 'linear-gradient(135deg, var(--color-gold-600), var(--color-gold-500))',
            border: '1px solid var(--color-gold-600)',
            boxShadow: '0 1px 3px rgba(184,148,72,0.3)',
          }}
        >
          {responding === 'accepted' ? (
            <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin inline-block" />
          ) : (
            <CheckCircle size={14} />
          )}
          Accept
        </button>

        <Link
          href={`/portal/invitation/${assignment.invitation_token}`}
          className="ml-auto flex items-center gap-1 text-xs transition-colors"
          style={{ color: 'var(--color-forest-500)' }}
          onMouseEnter={e => { e.currentTarget.style.color = 'var(--color-forest-800)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-forest-500)'; }}
        >
          Full details
          <ChevronRight size={12} />
        </Link>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Main page
// ─────────────────────────────────────────────────────────────

export default function PractitionerDashboardPage() {
  const { profile, loading: authLoading } = useAuth();
  const router = useRouter();
  const supabase = createPortalClient();

  const [assignments, setAssignments] = useState<AssignmentWithProgram[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  // Redirect admins away — this is a practitioner-only view
  useEffect(() => {
    if (!authLoading && profile) {
      if (profile.role === 'admin' || profile.role === 'primary_admin') {
        router.replace('/portal/dashboard/programs');
      }
    }
    if (!authLoading && !profile) {
      router.replace('/portal/login');
    }
  }, [authLoading, profile, router]);

  const loadAssignments = useCallback(async () => {
    if (!profile) return;
    setDataLoading(true);

    const { data, error } = await supabase
      .from('program_assignments')
      .select('*, program:programs(*)')
      .eq('practitioner_id', profile.id)
      .order('invited_at', { ascending: false });

    if (!error && data) {
      // Supabase returns the joined program as a nested object
      setAssignments(data as unknown as AssignmentWithProgram[]);
    }

    setDataLoading(false);
  }, [profile, supabase]);

  useEffect(() => {
    if (profile) loadAssignments();
  }, [profile, loadAssignments]);

  const handleRespond = async (assignmentId: string, status: 'accepted' | 'declined') => {
    await supabase
      .from('program_assignments')
      .update({ status, responded_at: new Date().toISOString() })
      .eq('id', assignmentId);

    setAssignments(prev =>
      prev.map(a => (a.id === assignmentId ? { ...a, status, responded_at: new Date().toISOString() } : a))
    );
  };

  // ── Derived lists ──────────────────────────────────────────
  const confirmedPrograms = assignments.filter(a => a.status === 'confirmed');
  const pendingInvitations = assignments.filter(a => a.status === 'invited' || a.status === 'accepted');

  // Sort confirmed: upcoming first, then past
  const sortedConfirmed = [...confirmedPrograms].sort((a, b) => {
    const aDate = new Date(a.program.start_date).getTime();
    const bDate = new Date(b.program.start_date).getTime();
    const now = Date.now();
    const aFuture = aDate >= now;
    const bFuture = bDate >= now;
    if (aFuture && !bFuture) return -1;
    if (!aFuture && bFuture) return 1;
    return aFuture ? aDate - bDate : bDate - aDate;
  });

  const upcomingCount = confirmedPrograms.filter(
    a => new Date(a.program.end_date) >= new Date()
  ).length;

  // ── Loading state ──────────────────────────────────────────
  if (authLoading) {
    return (
      <div
        className="flex items-center justify-center min-h-[60vh]"
        style={{ background: 'var(--color-warm-50)' }}
      >
        <div
          className="w-8 h-8 rounded-full border-2 animate-spin"
          style={{ borderColor: 'var(--color-gold-400)', borderTopColor: 'transparent' }}
        />
      </div>
    );
  }

  if (!profile) return null;

  // ── First name for the greeting ───────────────────────────
  const firstName = profile.full_name.split(' ')[0];
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  // ── Render ─────────────────────────────────────────────────
  return (
    <div
      className="min-h-full"
      style={{ background: 'linear-gradient(160deg, var(--color-forest-50) 0%, var(--color-warm-50) 60%, white 100%)' }}
    >
      <div className="max-w-4xl mx-auto px-6 py-10 space-y-10">

        {/* ── Hero greeting ─────────────────────────────────── */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <p
              className="text-xs font-bold tracking-widest uppercase mb-2"
              style={{ color: 'var(--color-gold-600)', letterSpacing: '0.15em' }}
            >
              Practitioner Portal
            </p>
            <h1
              className="text-3xl font-bold leading-tight"
              style={{ color: 'var(--color-forest-950)', fontWeight: 700 }}
            >
              {greeting}, {firstName}.
            </h1>
            <p className="mt-1 text-base" style={{ color: 'var(--color-forest-600)' }}>
              {pendingInvitations.length > 0
                ? `You have ${pendingInvitations.length} pending invitation${pendingInvitations.length > 1 ? 's' : ''} awaiting your response.`
                : upcomingCount > 0
                ? `You have ${upcomingCount} upcoming program${upcomingCount > 1 ? 's' : ''} confirmed.`
                : 'Welcome back — your dashboard is up to date.'}
            </p>
          </div>

          {/* Quick-link to calendar */}
          <Link
            href="/portal/dashboard/calendar"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
            style={{
              background: 'white',
              border: '1px solid var(--color-warm-200, #e8ddd0)',
              color: 'var(--color-forest-800)',
              boxShadow: '0 1px 3px rgba(10,28,18,0.06)',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-gold-400)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-warm-200, #e8ddd0)'; }}
          >
            <Calendar size={15} style={{ color: 'var(--color-gold-500)' }} />
            My Calendar
          </Link>
        </div>

        {/* ── Stats strip ───────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-4">
          {[
            {
              value: upcomingCount,
              label: 'Upcoming Programs',
              icon: <Briefcase size={18} />,
              accent: 'var(--color-forest-600)',
              bg: 'rgba(93,171,121,0.10)',
            },
            {
              value: pendingInvitations.length,
              label: 'Pending Invitations',
              icon: <Clock size={18} />,
              accent: 'var(--color-gold-600)',
              bg: 'rgba(184,148,72,0.10)',
            },
            {
              value: confirmedPrograms.length,
              label: 'Total Assignments',
              icon: <Star size={18} />,
              accent: 'var(--color-navy-700, #2d4a6b)',
              bg: 'rgba(45,74,107,0.08)',
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="rounded-2xl p-5"
              style={{
                background: 'white',
                border: '1px solid var(--color-warm-100, #f0e9e0)',
                boxShadow: '0 1px 3px rgba(10,28,18,0.04)',
              }}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
                style={{ background: stat.bg, color: stat.accent }}
              >
                {stat.icon}
              </div>
              <p className="text-2xl font-bold" style={{ color: 'var(--color-forest-950)', fontWeight: 700 }}>
                {dataLoading ? '—' : stat.value}
              </p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--color-forest-500)' }}>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* ── Pending Invitations ───────────────────────────── */}
        {(dataLoading || pendingInvitations.length > 0) && (
          <section>
            <SectionLabel>Pending Invitations</SectionLabel>
            {dataLoading ? (
              <div className="space-y-3">
                {[1, 2].map(i => (
                  <div
                    key={i}
                    className="rounded-2xl h-36 animate-pulse"
                    style={{ background: 'var(--color-warm-100, #f0e9e0)' }}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {pendingInvitations.map(a => (
                  <InvitationCard key={a.id} assignment={a} onRespond={handleRespond} />
                ))}
              </div>
            )}
          </section>
        )}

        {/* ── Confirmed Programs ────────────────────────────── */}
        <section>
          <SectionLabel>Your Programs</SectionLabel>
          {dataLoading ? (
            <div className="space-y-3">
              {[1, 2].map(i => (
                <div
                  key={i}
                  className="rounded-2xl h-28 animate-pulse"
                  style={{ background: 'var(--color-warm-100, #f0e9e0)' }}
                />
              ))}
            </div>
          ) : sortedConfirmed.length === 0 ? (
            <EmptyState
              icon={<Briefcase size={32} style={{ color: 'var(--color-forest-400)' }} />}
              message="No confirmed programs yet. Check back once an invitation has been confirmed."
            />
          ) : (
            <div className="space-y-4">
              {sortedConfirmed.map(a => (
                <ProgramCard key={a.id} assignment={a} />
              ))}
            </div>
          )}
        </section>

        {/* ── Profile summary ───────────────────────────────── */}
        <section>
          <SectionLabel>Your Profile</SectionLabel>
          <div
            className="rounded-2xl p-6"
            style={{
              background: 'white',
              border: '1px solid var(--color-warm-100, #f0e9e0)',
              boxShadow: '0 1px 4px rgba(10,28,18,0.05)',
            }}
          >
            <div className="flex items-start gap-5">
              {/* Avatar */}
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-bold shrink-0"
                style={{
                  background: 'linear-gradient(135deg, var(--color-gold-100, #f5e9c0), var(--color-gold-200, #e8d380))',
                  color: 'var(--color-gold-700, #a07820)',
                }}
              >
                {profile.full_name.charAt(0).toUpperCase()}
              </div>

              <div className="flex-1 min-w-0">
                <h2
                  className="text-lg font-semibold"
                  style={{ color: 'var(--color-forest-950)', fontWeight: 700 }}
                >
                  {profile.full_name}
                </h2>

                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <span
                    className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
                    style={{
                      background: 'rgba(93,171,121,0.12)',
                      color: 'var(--color-forest-700)',
                      border: '1px solid rgba(93,171,121,0.2)',
                    }}
                  >
                    Practitioner
                  </span>
                  {profile.seniority && (
                    <span
                      className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
                      style={{
                        background: 'rgba(184,148,72,0.10)',
                        color: 'var(--color-gold-600)',
                        border: '1px solid rgba(184,148,72,0.2)',
                      }}
                    >
                      {profile.seniority === 'senior' ? 'Senior' : 'Junior'}
                    </span>
                  )}
                </div>

                {profile.bio && (
                  <p
                    className="mt-3 text-sm leading-relaxed"
                    style={{ color: 'var(--color-forest-600)' }}
                  >
                    {profile.bio}
                  </p>
                )}

                <div className="mt-3 space-y-1.5">
                  <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-forest-600)' }}>
                    <Mail size={13} style={{ color: 'var(--color-gold-500)', flexShrink: 0 }} />
                    {profile.email}
                  </div>
                  {profile.phone && (
                    <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-forest-600)' }}>
                      <Phone size={13} style={{ color: 'var(--color-gold-500)', flexShrink: 0 }} />
                      {profile.phone}
                    </div>
                  )}
                  {profile.program_types && profile.program_types.length > 0 && (
                    <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-forest-600)' }}>
                      <Briefcase size={13} style={{ color: 'var(--color-gold-500)', flexShrink: 0 }} />
                      {profile.program_types
                        .map(t => t.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase()))
                        .join(', ')}
                    </div>
                  )}
                </div>
              </div>

              {/* Settings link */}
              <Link
                href="/portal/dashboard/settings"
                className="shrink-0 inline-flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-xl transition-all"
                style={{
                  background: 'var(--color-warm-50)',
                  border: '1px solid var(--color-warm-200, #e8ddd0)',
                  color: 'var(--color-forest-600)',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-gold-400)'; e.currentTarget.style.color = 'var(--color-forest-900)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-warm-200, #e8ddd0)'; e.currentTarget.style.color = 'var(--color-forest-600)'; }}
              >
                <User size={12} />
                Edit Profile
              </Link>
            </div>
          </div>
        </section>

        {/* ── Availability nudge ────────────────────────────── */}
        <section>
          <div
            className="rounded-2xl p-6 flex items-center justify-between gap-6 flex-wrap"
            style={{
              background: 'linear-gradient(135deg, var(--color-forest-50) 0%, var(--color-warm-50) 100%)',
              border: '1px solid var(--color-forest-100, #d4e8db)',
            }}
          >
            <div className="flex items-center gap-4">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: 'rgba(93,171,121,0.15)', color: 'var(--color-forest-700)' }}
              >
                <Calendar size={20} />
              </div>
              <div>
                <p className="font-semibold text-sm" style={{ color: 'var(--color-forest-950)' }}>
                  Availability &amp; Calendar
                </p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--color-forest-600)' }}>
                  Keep your availability up to date so you can be matched to upcoming programs.
                </p>
              </div>
            </div>

            <Link
              href="/portal/dashboard/calendar"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all text-white shrink-0"
              style={{
                background: 'linear-gradient(135deg, var(--color-forest-700), var(--color-forest-600))',
                boxShadow: '0 1px 4px rgba(10,28,18,0.2)',
              }}
              onMouseEnter={e => { e.currentTarget.style.opacity = '0.92'; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
            >
              Manage Availability
              <ChevronRight size={15} />
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}
