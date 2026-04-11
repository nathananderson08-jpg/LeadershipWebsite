'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/portal/useAuth';
import { usePrograms } from '@/hooks/portal/usePrograms';
import { ProgramPipeline } from '@/components/portal/programs/ProgramPipeline';
import { CreateProgramModal } from '@/components/portal/programs/CreateProgramModal';
import { ASSIGNMENT_STATUS_COLORS, ASSIGNMENT_STATUS_LABELS } from '@/lib/portal/constants';
import { formatDateRange } from '@/lib/portal/utils';
import type { CreateProgramInput } from '@/lib/portal/types';
import { PlusCircle, Calendar, MapPin, ArrowRight } from 'lucide-react';

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
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent portal-animate-spin"
          style={{ borderColor: 'var(--portal-accent)', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  if (isAdmin) {
    return (
      <div className="flex flex-col h-full -m-6">
        {/* Header */}
        <div className="px-24 pt-12 pb-10 flex items-center justify-between" style={{ borderBottom: '1px solid var(--portal-border-default)' }}>
          <div>
            <h1 className="text-4xl" style={{ color: 'var(--portal-text-primary)' }}>Active Programs</h1>
            <p className="text-[16px] mt-2" style={{ color: 'var(--portal-text-tertiary)' }}>
              {programs.length} program{programs.length !== 1 ? 's' : ''} across the pipeline
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex p-1 rounded-xl" style={{ background: 'var(--portal-bg-secondary)', border: '1px solid var(--portal-border-default)' }}>
              <button onClick={() => setView('pipeline')}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                style={{ background: view === 'pipeline' ? 'var(--portal-bg-elevated)' : 'transparent', color: view === 'pipeline' ? 'var(--portal-accent)' : 'var(--portal-text-tertiary)' }}>
                Pipeline
              </button>
              <button onClick={() => setView('list')}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                style={{ background: view === 'list' ? 'var(--portal-bg-elevated)' : 'transparent', color: view === 'list' ? 'var(--portal-accent)' : 'var(--portal-text-tertiary)' }}>
                List
              </button>
            </div>
            <button
              onClick={() => setShowCreate(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-[15px] font-semibold text-white transition-all portal-glow-accent"
              style={{ background: 'var(--portal-gradient-accent)' }}
            >
              <PlusCircle size={18} />
              New Program
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {programs.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-[18px] mb-4" style={{ color: 'var(--portal-text-tertiary)' }}>No programs yet</p>
                <button onClick={() => setShowCreate(true)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-semibold text-white portal-glow-accent"
                  style={{ background: 'var(--portal-gradient-accent)' }}>
                  <PlusCircle size={16} />
                  Create First Program
                </button>
              </div>
            </div>
          ) : view === 'pipeline' ? (
            <ProgramPipeline programs={programs} onProgramClick={handleProgramClick} />
          ) : (
            <div className="px-24 pt-8 overflow-auto h-full pb-10">
              <div style={{ maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {programs.map((prog) => (
                  <button key={prog.id} onClick={() => handleProgramClick(prog.id)}
                    className="w-full text-left portal-glass-card rounded-2xl transition-all portal-animate-fade-in"
                    style={{ padding: '24px' }}>
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-[18px]" style={{ fontFamily: "'DM Serif Display', serif", color: 'var(--portal-text-primary)' }}>{prog.name}</h3>
                        <div className="flex items-center gap-4 mt-1.5">
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
                      <ArrowRight size={16} style={{ color: 'var(--portal-text-tertiary)' }} />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <CreateProgramModal open={showCreate} onClose={() => setShowCreate(false)} onCreate={handleCreate} />
      </div>
    );
  }

  // Practitioner view — show their assigned programs
  return (
    <div className="flex flex-col h-full -m-6">
      <div className="px-24 pt-12 pb-14" style={{ borderBottom: '1px solid var(--portal-border-default)' }}>
        <h1 className="text-4xl" style={{ color: 'var(--portal-text-primary)' }}>My Programs</h1>
        <p className="text-[16px] mt-2" style={{ color: 'var(--portal-text-tertiary)' }}>
          Your program invitations and confirmed assignments
        </p>
      </div>

      <div className="flex-1 overflow-auto px-24 pt-8 pb-10">
        {programs.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-[16px]" style={{ color: 'var(--portal-text-tertiary)' }}>No programs assigned yet</p>
          </div>
        ) : (
          <div style={{ maxWidth: '700px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {programs.map((prog) => {
              const myAssignment = prog.assignments[0];
              if (!myAssignment) return null;
              return (
                <button key={prog.id} onClick={() => handleProgramClick(prog.id)}
                  className="w-full text-left portal-glass-card rounded-2xl portal-animate-fade-in"
                  style={{ padding: '24px' }}>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-[18px]" style={{ fontFamily: "'DM Serif Display', serif", color: 'var(--portal-text-primary)' }}>{prog.name}</h3>
                      <div className="flex items-center gap-4 mt-1.5">
                        <span className="flex items-center gap-1.5 text-[14px]" style={{ color: 'var(--portal-text-tertiary)' }}>
                          <Calendar size={14} />
                          {formatDateRange(prog.start_date, prog.end_date)}
                        </span>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold shrink-0"
                      style={{ backgroundColor: ASSIGNMENT_STATUS_COLORS[myAssignment.status] + '20', color: ASSIGNMENT_STATUS_COLORS[myAssignment.status] }}>
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
