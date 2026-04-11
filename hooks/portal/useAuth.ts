'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { createPortalClient } from '@/lib/portal/supabase';
import type { Profile } from '@/lib/portal/types';
import type { User, Session, AuthChangeEvent } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  error: string | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    loading: true,
    error: null,
  });

  const supabase = createPortalClient();
  const initialized = useRef(false);

  const loadProfile = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      setState(s => ({ ...s, error: error.message, loading: false }));
      return;
    }
    setState(s => ({ ...s, profile: data, loading: false }));
  }, [supabase]);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    supabase.auth.getSession().then((result: { data: { session: Session | null } }) => {
      const session = result.data.session;
      if (session?.user) {
        setState(s => ({ ...s, user: session.user }));
        loadProfile(session.user.id);
      } else {
        setState(s => ({ ...s, loading: false }));
      }
    }).catch(() => {
      setState(s => ({ ...s, loading: false }));
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        if (session?.user) {
          setState(s => ({ ...s, user: session.user }));
          loadProfile(session.user.id);
        } else {
          setState({ user: null, profile: null, loading: false, error: null });
        }
      }
    );

    const timeout = setTimeout(() => {
      setState(s => s.loading ? { ...s, loading: false } : s);
    }, 5000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, [loadProfile, supabase]);

  const signIn = async (email: string, password: string) => {
    setState(s => ({ ...s, loading: true, error: null }));
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setState(s => ({ ...s, error: error.message, loading: false }));
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setState({ user: null, profile: null, loading: false, error: null });
    window.location.href = '/portal/login';
  };

  return {
    ...state,
    signIn,
    signOut,
    isAdmin: state.profile?.role === 'admin' || state.profile?.role === 'primary_admin',
    isPrimaryAdmin: state.profile?.role === 'primary_admin',
  };
}
