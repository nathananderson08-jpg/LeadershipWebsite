'use client';

import { useState, useEffect } from 'react';
import { createPortalClient } from '@/lib/portal/supabase';
import { SENIORITY_LABELS } from '@/lib/portal/constants';
import type { Profile, ProgramWithAssignments, SeniorityLevel } from '@/lib/portal/types';
import { Send, Check } from 'lucide-react';

interface IdentifyPractitionersProps {
  program: ProgramWithAssignments;
  onInvite: (practitionerIds: string[], seniority: SeniorityLevel) => Promise<void>;
}

export function IdentifyPractitioners({ program, onInvite }: IdentifyPractitionersProps) {
  const [availableSenior, setAvailableSenior] = useState<Profile[]>([]);
  const [availableJunior, setAvailableJunior] = useState<Profile[]>([]);
  const [selectedSenior, setSelectedSenior] = useState<Set<string>>(new Set());
  const [selectedJunior, setSelectedJunior] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const supabase = createPortalClient();

  useEffect(() => {
    loadAvailablePractitioners();
  }, [program]);

  async function loadAvailablePractitioners() {
    setLoading(true);

    const { data: practitioners } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'practitioner')
      .order('full_name');

    if (!practitioners) { setLoading(false); return; }

    const { data: availableBlocks } = await supabase
      .from('availability_blocks')
      .select('practitioner_id')
      .eq('type', 'available')
      .lte('start_date', program.start_date)
      .gte('end_date', program.end_date);

    const availableIds = new Set(availableBlocks?.map((b: any) => b.practitioner_id) || []);

    const { data: conflicts } = await supabase
      .from('program_assignments')
      .select(`practitioner_id, program:programs!inner(start_date, end_date)`)
      .eq('status', 'accepted');

    const conflictIds = new Set<string>();
    conflicts?.forEach((c: any) => {
      const p = c.program;
      if (p.start_date <= program.end_date && p.end_date >= program.start_date) {
        conflictIds.add(c.practitioner_id);
      }
    });

    const alreadyAssigned = new Set(program.assignments.map(a => a.practitioner_id));

    const eligible = practitioners.filter(
      (p: any) => availableIds.has(p.id) && !conflictIds.has(p.id) && !alreadyAssigned.has(p.id)
    );

    setAvailableSenior(eligible.filter((p: any) => p.seniority === 'senior'));
    setAvailableJunior(eligible.filter((p: any) => p.seniority === 'junior'));
    setLoading(false);
  }

  const toggleSenior = (id: string) => {
    const next = new Set(selectedSenior);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelectedSenior(next);
  };

  const toggleJunior = (id: string) => {
    const next = new Set(selectedJunior);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelectedJunior(next);
  };

  const handleSendInvitations = async () => {
    setSending(true);
    try {
      if (selectedSenior.size > 0) {
        await onInvite(Array.from(selectedSenior), 'senior');
      }
      if (selectedJunior.size > 0) {
        await onInvite(Array.from(selectedJunior), 'junior');
      }
      setSelectedSenior(new Set());
      setSelectedJunior(new Set());
      await loadAvailablePractitioners();
    } finally {
      setSending(false);
    }
  };

  const acceptedSenior = program.assignments.filter(a => a.role_in_program === 'senior' && a.status === 'accepted').length;
  const acceptedJunior = program.assignments.filter(a => a.role_in_program === 'junior' && a.status === 'accepted').length;
  const neededSenior = Math.max(0, program.senior_required - acceptedSenior);
  const neededJunior = Math.max(0, program.junior_required - acceptedJunior);

  if (loading) {
    return <div className="text-center py-8" style={{ color: 'var(--portal-text-tertiary)' }}>Loading available practitioners...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-xl portal-glass-card">
          <p className="text-xs mb-1" style={{ color: 'var(--portal-text-tertiary)' }}>Senior Practitioners</p>
          <p className="text-lg font-semibold">
            <span style={{ color: acceptedSenior >= program.senior_required ? 'var(--portal-success)' : 'var(--portal-warning)' }}>
              {acceptedSenior}
            </span>
            <span style={{ color: 'var(--portal-text-tertiary)' }}>/{program.senior_required}</span>
          </p>
          {neededSenior > 0 && <p className="text-xs mt-1" style={{ color: 'var(--portal-warning)' }}>Need {neededSenior} more</p>}
        </div>
        <div className="p-4 rounded-xl portal-glass-card">
          <p className="text-xs mb-1" style={{ color: 'var(--portal-text-tertiary)' }}>Junior Practitioners</p>
          <p className="text-lg font-semibold">
            <span style={{ color: acceptedJunior >= program.junior_required ? 'var(--portal-success)' : 'var(--portal-warning)' }}>
              {acceptedJunior}
            </span>
            <span style={{ color: 'var(--portal-text-tertiary)' }}>/{program.junior_required}</span>
          </p>
          {neededJunior > 0 && <p className="text-xs mt-1" style={{ color: 'var(--portal-warning)' }}>Need {neededJunior} more</p>}
        </div>
      </div>

      {neededSenior > 0 && (
        <PractitionerList
          title="Available Senior Practitioners"
          practitioners={availableSenior}
          selected={selectedSenior}
          onToggle={toggleSenior}
        />
      )}

      {neededJunior > 0 && (
        <PractitionerList
          title="Available Junior Practitioners"
          practitioners={availableJunior}
          selected={selectedJunior}
          onToggle={toggleJunior}
        />
      )}

      {(selectedSenior.size > 0 || selectedJunior.size > 0) && (
        <div className="flex justify-end pt-2">
          <button
            onClick={handleSendInvitations}
            disabled={sending}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-white disabled:opacity-50 transition-colors"
            style={{ background: 'var(--portal-accent)' }}
          >
            <Send size={16} />
            {sending ? 'Sending...' : `Send ${selectedSenior.size + selectedJunior.size} Invitation(s)`}
          </button>
        </div>
      )}
    </div>
  );
}

function PractitionerList({
  title,
  practitioners,
  selected,
  onToggle,
}: {
  title: string;
  practitioners: Profile[];
  selected: Set<string>;
  onToggle: (id: string) => void;
}) {
  if (practitioners.length === 0) {
    return (
      <div>
        <h4 className="text-sm font-medium mb-2" style={{ color: 'var(--portal-text-secondary)' }}>{title}</h4>
        <div className="p-4 border border-dashed rounded-xl text-center text-xs"
          style={{ borderColor: 'var(--portal-border-default)', color: 'var(--portal-text-tertiary)' }}>
          No practitioners available for these dates
        </div>
      </div>
    );
  }

  return (
    <div>
      <h4 className="text-sm font-medium mb-2" style={{ color: 'var(--portal-text-secondary)' }}>{title}</h4>
      <div className="space-y-1">
        {practitioners.map((p) => (
          <button
            key={p.id}
            onClick={() => onToggle(p.id)}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-left transition-colors portal-glass-card"
            style={selected.has(p.id) ? { background: 'var(--portal-accent-subtle)', borderColor: 'var(--portal-accent)' } : undefined}
          >
            <div
              className="flex items-center justify-center w-8 h-8 rounded-full text-xs font-semibold"
              style={selected.has(p.id)
                ? { background: 'var(--portal-accent)', color: 'white' }
                : { background: 'var(--portal-bg-hover)', color: 'var(--portal-text-secondary)' }
              }
            >
              {selected.has(p.id) ? <Check size={14} /> : p.full_name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium" style={{ color: 'var(--portal-text-primary)' }}>{p.full_name}</p>
              <p className="text-xs" style={{ color: 'var(--portal-text-tertiary)' }}>{p.email}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
