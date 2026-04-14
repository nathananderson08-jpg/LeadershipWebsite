'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/portal/useAuth';
import { usePrograms } from '@/hooks/portal/usePrograms';
import { CreateProgramModal } from '@/components/portal/programs/CreateProgramModal';
import {
  ASSIGNMENT_STATUS_COLORS,
  ASSIGNMENT_STATUS_LABELS,
  PIPELINE_STAGES,
} from '@/lib/portal/constants';
import { formatDateRange } from '@/lib/portal/utils';
import type { CreateProgramInput, ProgramWithAssignments } from '@/lib/portal/types';
import { PlusCircle, Calendar, MapPin, ArrowRight, Users, Sparkles } from 'lucide-react';

// ─── Pipeline card ────────────────────────────────────────────────────────────

function PipelineCard({
  program,
  stageColor,
  onClick,
}: {
  program: ProgramWithAssignments;
  stageColor: string;
  onClick: () => void;
}) {
  const confirmedCount = program.assignments.filter((a) => a.status === 'confirmed').length;
  const totalRequired = program.senior_required + program.junior_required;
  const isFullyStaffed = confirmedCount >= totalRequired && totalRequired > 0;

  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded-2xl portal-card portal-card-hover group"
      style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}
    >
      {/* Stage accent bar */}
      <div
        className="absolute top-0 left-0 right-0 h-[3px]"
        style={{
          background: `linear-gradient(90deg, ${stageColor}, transparent)`,
          opacity: 0.7,
        }}
      />

      {/* Fully staffed badge */}
      {isFullyStaffed && (
        <div className="absolute top-4 right-4 portal-badge portal-badge-gold flex items-center gap-1">
          <Sparkles size={10} />
          Staffed
        </div>
      )}

      {/* Program name */}
      <h4
        className="text-[18px] group-hover:text-[var(--portal-gold-600)] transition-colors truncate pr-20"
        style={{ fontFamily: "'DM Serif Display', serif", color: 'var(--portal-text-primary)' }}
      >
        {program.name}
      </h4>

      {/* Dates */}
      <div
        className="flex items-center gap-1.5 text-[13px]"
        style={{ marginTop: '8px', color: 'var(--portal-text-tertiary)' }}
      >
        <Calendar size={13} strokeWidth={1.5} />
        {formatDateRange(program.start_date, program.end_date)}
      </div>

      {/* Location */}
      {program.location && (
        <div
          className="flex items-center gap-1.5 text-[13px]"
          style={{ marginTop: '4px', color: 'var(--portal-text-tertiary)' }}
        >
          <MapPin size={13} strokeWidth={1.5} />
          {program.location}
        </div>
      )}

      {/* Staffing progress */}
      <div
        className="flex items-center gap-3"
        style={{
          marginTop: '16px',
          paddingTop: '16px',
          borderTop: '1px solid var(--portal-border-default)',
        }}
      >
        <Users size={14} strokeWidth={1.5} style={{ color: 'var(--portal-text-tertiary)' }} />
        <span className="text-[13px] font-medium" style={{ color: 'var(--portal-text-secondary)' }}>
          {confirmedCount}
          <span style={{ color: 'var(--portal-text-tertiary)', fontWeight: 400 }}>/{totalRequired} confirmed</span>
        </span>

        {/* Progress bar */}
        <div
          className="flex-1 rounded-full overflow-hidden"
          style={{ height: '5px', background: 'var(--portal-bg-hover)' }}
        >
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: totalRequired > 0 ? `${Math.min(100, (confirmedCount / totalRequired) * 100)}%` : '0%',
              background: isFullyStaffed
                ? 'linear-gradient(90deg, var(--portal-gold-500), var(--portal-gold-400))'
                : stageColor,
            }}
          />
        </div>
      </div>
    </button>
  );
}

// ─── Inline pipeline board ───────────────────────────────────────────────────

function PipelineBoard({
  programs,
  onProgramClick,
}: {
  programs: ProgramWithAssignments[];
  onProgramClick: (id: string) => void;
}) {
  return (
    <div
      className="flex h-full overflow-x-auto"
      style={{ gap: '28px', padding: '40px 96px' }}
    >
      {PIPELINE_STAGES.map((stage) => {
        const stagePrograms = programs.filter((p) => p.pipeline_stage === stage.key);

        return (
          <div
            key={stage.key}
            className="flex flex-col shrink-0"
            style={{ minWidth: '340px', width: '340px' }}
          >
            {/* Column header */}
            <div
              className="flex items-center gap-2.5 px-1"
              style={{ marginBottom: '24px' }}
            >
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: stage.color, opacity: 0.8 }}
              />
              <h3
                className="text-[15px] font-medium"
                style={{ color: 'var(--portal-text-primary)' }}
              >
                {stage.label}
              </h3>
              <span
                className="ml-auto text-[12px] font-medium px-2.5 py-0.5 rounded-full"
                style={{
                  background: 'var(--portal-bg-secondary)',
                  color: 'var(--portal-text-tertiary)',
                  border: '1px solid var(--portal-border-default)',
                }}
              >
                {stagePrograms.length}
              </span>
            </div>

            {/* Cards */}
            <div
              className="flex-1 overflow-y-auto"
              style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingRight: '2px' }}
            >
              {stagePrograms.length === 0 ? (
                <div
                  className="flex items-center justify-center rounded-2xl text-[13px]"
                  style={{
                    height: '96px',
                    border: '1px dashed var(--portal-border-default)',
                    color: 'var(--portal-text-tertiary)',
                  }}
                >
                  No programs
                </div>
              ) : (
                stagePrograms.map((program, i) => (
                  <div
                    key={program.id}
                    className="portal-animate-fade-in"
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    <PipelineCard
                      program={program}
                      stageColor={stage.color}
                      onClick={() => onProgramClick(program.id)}
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function ProgramsPage() {
  const { isAdmin, loading: authLoading } = useAuth();
  const { programs, loading, createProgram } = usePrograms();
  const router = useRouter();
  const [showCreate, setShowCreate] = useState(false);
  const [view, setView] = useState<'pipeline' | 'list'>('pipeline');

  const handleCreate = async (input: CreateProgramInput) => {
    const program = await createProgram(input);
    setShowCreate(false);
    router.push(`/portal/dashboard/programs/${program.id}`);
  };

  const handleProgramClick = (id: string) => {
    router.push(`/portal/dashboard/programs/${id}`);
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center h-full py-20">
        <div
          className="w-8 h-8 rounded-full border-2 portal-animate-spin"
          style={{ borderColor: 'var(--portal-accent)', borderTopColor: 'transparent' }}
        />
      </div>
    );
  }

  if (isAdmin) {
    return (
      <div className="flex flex-col h-full -m-6">
        {/* ── Header ── */}
        <div
          className="px-24 pt-12 pb-10 flex items-center justify-between"
          style={{ borderBottom: '1px solid var(--portal-border-default)' }}
        >
          <div>
            <h1 className="text-4xl" style={{ color: 'var(--portal-text-primary)' }}>
              Active Programs
            </h1>
            <p className="text-[16px] mt-2" style={{ color: 'var(--portal-text-tertiary)' }}>
              {programs.length} program{programs.length !== 1 ? 's' : ''} across the pipeline
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* View toggle */}
            <div
              className="flex p-1 rounded-xl"
              style={{
                background: 'var(--portal-bg-secondary)',
                border: '1px solid var(--portal-border-default)',
              }}
            >
              {(['pipeline', 'list'] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize"
                  style={{
                    background: view === v ? 'var(--portal-bg-elevated)' : 'transparent',
                    color: view === v ? 'var(--portal-accent)' : 'var(--portal-text-tertiary)',
                  }}
                >
                  {v === 'pipeline' ? 'Pipeline' : 'List'}
                </button>
              ))}
            </div>

            {/* New program button */}
            <button
              onClick={() => setShowCreate(true)}
              className="portal-btn portal-btn-primary portal-glow-accent flex items-center gap-2"
            >
              <PlusCircle size={17} />
              New Program
            </button>
          </div>
        </div>

        {/* ── Content ── */}
        <div className="flex-1 overflow-hidden">
          {programs.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-[18px] mb-4" style={{ color: 'var(--portal-text-tertiary)' }}>
                  No programs yet
                </p>
                <button
                  onClick={() => setShowCreate(true)}
                  className="portal-btn portal-btn-primary portal-glow-accent flex items-center gap-2"
                >
                  <PlusCircle size={16} />
                  Create First Program
                </button>
              </div>
            </div>
          ) : view === 'pipeline' ? (
            <PipelineBoard programs={programs} onProgramClick={handleProgramClick} />
          ) : (
            /* ── List view ── */
            <div className="px-24 pt-8 overflow-auto h-full pb-10">
              <div style={{ maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {programs.map((prog) => (
                  <button
                    key={prog.id}
                    onClick={() => handleProgramClick(prog.id)}
                    className="w-full text-left portal-glass-card rounded-2xl transition-all portal-animate-fade-in"
                    style={{ padding: '24px' }}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3
                          className="text-[18px]"
                          style={{
                            fontFamily: "'DM Serif Display', serif",
                            color: 'var(--portal-text-primary)',
                          }}
                        >
                          {prog.name}
                        </h3>
                        <div className="flex items-center gap-4 mt-1.5">
                          <span
                            className="flex items-center gap-1.5 text-[14px]"
                            style={{ color: 'var(--portal-text-tertiary)' }}
                          >
                            <Calendar size={14} />
                            {formatDateRange(prog.start_date, prog.end_date)}
                          </span>
                          {prog.location && (
                            <span
                              className="flex items-center gap-1.5 text-[14px]"
                              style={{ color: 'var(--portal-text-tertiary)' }}
                            >
                              <MapPin size={14} />
                              {prog.location}
                            </span>
                          )}
                        </div>
                      </div>
                      <ArrowRight size={16} style={{ color: 'var(--portal-text-tertiary)' }} />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <CreateProgramModal
          open={showCreate}
          onClose={() => setShowCreate(false)}
          onCreate={handleCreate}
        />
      </div>
    );
  }

  // ── Practitioner view — show their assigned programs ──
  return (
    <div className="flex flex-col h-full -m-6">
      <div
        className="px-24 pt-12 pb-14"
        style={{ borderBottom: '1px solid var(--portal-border-default)' }}
      >
        <h1 className="text-4xl" style={{ color: 'var(--portal-text-primary)' }}>
          My Programs
        </h1>
        <p className="text-[16px] mt-2" style={{ color: 'var(--portal-text-tertiary)' }}>
          Your program invitations and confirmed assignments
        </p>
      </div>

      <div className="flex-1 overflow-auto px-24 pt-8 pb-10">
        {programs.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-[16px]" style={{ color: 'var(--portal-text-tertiary)' }}>
              No programs assigned yet
            </p>
          </div>
        ) : (
          <div style={{ maxWidth: '700px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {programs.map((prog) => {
              const myAssignment = prog.assignments[0];
              if (!myAssignment) return null;
              return (
                <button
                  key={prog.id}
                  onClick={() => handleProgramClick(prog.id)}
                  className="w-full text-left portal-glass-card rounded-2xl portal-animate-fade-in"
                  style={{ padding: '24px' }}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3
                        className="text-[18px]"
                        style={{
                          fontFamily: "'DM Serif Display', serif",
                          color: 'var(--portal-text-primary)',
                        }}
                      >
                        {prog.name}
                      </h3>
                      <div className="flex items-center gap-4 mt-1.5">
                        <span
                          className="flex items-center gap-1.5 text-[14px]"
                          style={{ color: 'var(--portal-text-tertiary)' }}
                        >
                          <Calendar size={14} />
                          {formatDateRange(prog.start_date, prog.end_date)}
                        </span>
                      </div>
                    </div>
                    <span
                      className="px-3 py-1 rounded-full text-xs font-semibold shrink-0"
                      style={{
                        backgroundColor: ASSIGNMENT_STATUS_COLORS[myAssignment.status] + '20',
                        color: ASSIGNMENT_STATUS_COLORS[myAssignment.status],
                      }}
                    >
                      {ASSIGNMENT_STATUS_LABELS[myAssignment.status]}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
