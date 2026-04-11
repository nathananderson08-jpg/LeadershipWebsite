'use client';

import { formatDateRange } from '@/lib/portal/utils';
import type { ProgramWithAssignments } from '@/lib/portal/types';
import { MapPin, Clock } from 'lucide-react';
import { DonutChart } from '@/components/portal/ui/DonutChart';

interface ProgramCardProps {
  program: ProgramWithAssignments;
  stageColor: string;
  onClick: () => void;
}

export function ProgramCard({ program, stageColor, onClick }: ProgramCardProps) {
  const confirmedSenior = program.assignments.filter(
    (a) => a.role_in_program === 'senior' && a.status === 'confirmed'
  ).length;
  const confirmedJunior = program.assignments.filter(
    (a) => a.role_in_program === 'junior' && a.status === 'confirmed'
  ).length;
  const pendingCount = program.assignments.filter(
    (a) => a.status === 'invited'
  ).length;
  const acceptedCount = program.assignments.filter(
    (a) => a.status === 'accepted'
  ).length;

  const totalRequired = program.senior_required + program.junior_required;
  const totalConfirmed = confirmedSenior + confirmedJunior;

  const daysUntil = Math.ceil((new Date(program.start_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  return (
    <button
      onClick={onClick}
      className="w-full text-left p-7 rounded-2xl group portal-glass-card portal-card-hover"
      style={{ position: 'relative', overflow: 'hidden' }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-[3px]"
        style={{ background: `linear-gradient(90deg, ${stageColor}, transparent)`, opacity: 0.6 }}
      />

      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h4 className="text-[19px] group-hover:text-[var(--portal-accent)] transition-colors truncate"
            style={{ fontFamily: "'DM Serif Display', serif", color: 'var(--portal-text-primary)' }}>
            {program.name}
          </h4>

          <p className="text-[14px]" style={{ marginTop: '6px', color: 'var(--portal-text-tertiary)' }}>
            {formatDateRange(program.start_date, program.end_date)}
          </p>

          {program.location && (
            <div className="flex items-center gap-2 text-[13px]" style={{ marginTop: '4px', color: 'var(--portal-text-tertiary)' }}>
              <MapPin size={13} strokeWidth={1.5} />
              {program.location}
            </div>
          )}

          {daysUntil > 0 && daysUntil <= 30 && (
            <div className="flex items-center gap-1.5 text-[12px] font-medium" style={{ marginTop: '8px', color: daysUntil <= 7 ? 'var(--portal-danger)' : 'var(--portal-warning)' }}>
              <Clock size={12} />
              {daysUntil} day{daysUntil !== 1 ? 's' : ''} away
            </div>
          )}
        </div>

        <DonutChart
          value={totalConfirmed}
          max={totalRequired}
          size={60}
          strokeWidth={5}
          color={totalConfirmed >= totalRequired ? 'var(--portal-success)' : stageColor}
        />
      </div>

      <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--portal-border-default)' }}>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <DonutChart
              value={confirmedSenior}
              max={program.senior_required}
              size={36}
              strokeWidth={3.5}
              color="var(--portal-accent)"
              delay={200}
            />
            <div>
              <p className="text-[12px] font-medium" style={{ color: 'var(--portal-text-secondary)' }}>Senior</p>
              <p className="text-[11px]" style={{ color: 'var(--portal-text-tertiary)' }}>{confirmedSenior}/{program.senior_required}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <DonutChart
              value={confirmedJunior}
              max={program.junior_required}
              size={36}
              strokeWidth={3.5}
              color="var(--portal-accent-secondary)"
              delay={400}
            />
            <div>
              <p className="text-[12px] font-medium" style={{ color: 'var(--portal-text-secondary)' }}>Junior</p>
              <p className="text-[11px]" style={{ color: 'var(--portal-text-tertiary)' }}>{confirmedJunior}/{program.junior_required}</p>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-2">
            {acceptedCount > 0 && (
              <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold" style={{ background: 'rgba(108,140,255,0.1)', color: '#6c8cff' }}>
                {acceptedCount} to confirm
              </span>
            )}
            {pendingCount > 0 && (
              <span className="px-2.5 py-1 rounded-full text-[10px] font-medium" style={{ background: 'var(--portal-warning-subtle)', color: 'var(--portal-warning)' }}>
                {pendingCount} pending
              </span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}
