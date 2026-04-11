'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { createPortalClient } from '@/lib/portal/supabase';
import type { Profile, CreateUserInput } from '@/lib/portal/types';

export function usePractitioners() {
  const [practitioners, setPractitioners] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createPortalClient();
  const initialized = useRef(false);

  const loadPractitioners = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('full_name');

    if (!error && data) {
      setPractitioners(data);
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    loadPractitioners();
  }, [loadPractitioners]);

  const addUser = async (input: CreateUserInput) => {
    const response = await fetch('/portal/api/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'create_user', ...input }),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || 'Failed to create user');
    }

    await loadPractitioners();
    return response.json();
  };

  const updateUser = async (id: string, updates: Partial<Profile>) => {
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', id);

    if (error) throw error;
    await loadPractitioners();
  };

  const removeUser = async (id: string) => {
    const response = await fetch('/portal/api/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'remove_user', userId: id }),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || 'Failed to remove user');
    }

    await loadPractitioners();
  };

  return { practitioners, loading, loadPractitioners, addUser, updateUser, removeUser };
}
