'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { createPortalClient } from '@/lib/portal/supabase';
import type { Program, ProgramWithAssignments, CreateProgramInput } from '@/lib/portal/types';

export function usePrograms() {
  const [programs, setPrograms] = useState<ProgramWithAssignments[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createPortalClient();
  const initialized = useRef(false);

  const loadPrograms = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('programs')
      .select(`
        *,
        assignments:program_assignments(
          *,
          practitioner:profiles(*)
        )
      `)
      .order('start_date', { ascending: true });

    if (!error && data) {
      setPrograms(data as ProgramWithAssignments[]);
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    loadPrograms();

    const channel = supabase
      .channel('portal-programs-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'programs' }, () => {
        loadPrograms();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'program_assignments' }, () => {
        loadPrograms();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [loadPrograms, supabase]);

  const createProgram = async (input: CreateProgramInput) => {
    const { data, error } = await supabase
      .from('programs')
      .insert(input)
      .select()
      .single();

    if (error) throw error;
    await loadPrograms();
    return data;
  };

  const updateProgram = async (id: string, updates: Partial<Program>) => {
    const { error } = await supabase
      .from('programs')
      .update(updates)
      .eq('id', id);

    if (error) throw error;
    await loadPrograms();
  };

  const deleteProgram = async (id: string) => {
    const { error } = await supabase
      .from('programs')
      .delete()
      .eq('id', id);

    if (error) throw error;
    await loadPrograms();
  };

  return { programs, loading, loadPrograms, createProgram, updateProgram, deleteProgram };
}
