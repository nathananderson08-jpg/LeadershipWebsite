'use client';

import { PIPELINE_STAGES } from '@/lib/portal/constants';
import type { ProgramWithAssignments } from '@/lib/portal/types';
import { ProgramCard } from './ProgramCard';

interface ProgramPipelineProps {
  programs: ProgramWithAssignments[];
  onProgramClick: (id: string) => void;
}

export function ProgramPipeline({ programs, onProgramClick }: ProgramPipelineProps) {
  return (
    <div className="flex h-full overflow-x-auto" style={{ gap: '32px', padding: '40px 96px' }}>
      {PIPELINE_STAGES.map((stage) => {
        const stagePrograms = programs.filter((p) => p.pipeline_stage === stage.key);

        return (
          <div
            key={stage.key}
            className="flex flex-col min-w-[380px] w-[380px] shrink-0"
          >
            <div className="flex items-center gap-3 px-1" style={{ marginBottom: '32px' }}>
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: stage.color, opacity: 0.7 }}
              />
              <h3 className="text-[16px]" style={{ fontFamily: "'DM Serif Display', serif", color: 'var(--portal-text-primary)' }}>
                {stage.label}
              </h3>
              <span
                className="ml-auto text-[13px] font-medium px-3 py-1 rounded-full"
                style={{ background: 'var(--portal-bg-secondary)', color: 'var(--portal-text-tertiary)' }}
              >
                {stagePrograms.length}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto pr-1" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {stagePrograms.length === 0 ? (
                <div className="flex items-center justify-center h-32 border border-dashed rounded-2xl text-[13px]"
                  style={{ borderColor: 'var(--portal-border-default)', color: 'var(--portal-text-tertiary)' }}>
                  No programs in this stage
                </div>
              ) : (
                stagePrograms.map((program, index) => (
                  <div key={program.id} className="portal-animate-fade-in" style={{ animationDelay: `${index * 60}ms` }}>
                    <ProgramCard
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
