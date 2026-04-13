'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { createPortalClient } from '@/lib/portal/supabase';

// ── Types ──────────────────────────────────────────────────────

export interface LeadForgeAccount {
  id: string;
  company_name: string;
  industry: string | null;
  size: string | null;
  revenue_range: string | null;
  hq_location: string | null;
  domain: string | null;
  headcount: number | null;
  icp_fit: string | null;
  key_challenges: string | null;
  created_at: string;
}

export interface LeadForgeProspect {
  id: string;
  account_id: string | null;
  full_name: string;
  title: string | null;
  email: string | null;
  linkedin_url: string | null;
  icp_score: number;
  stage: 'awareness' | 'value_delivery' | 'outreach' | 'conversion';
  notes: string | null;
  created_at: string;
  // CRM fields (added via migration)
  warmth_score: string | null;
  pipeline_stage: string | null;
  role_start_date: string | null;
  last_activity_at: string | null;
  next_action: string | null;
  next_action_date: string | null;
  email_confidence: string | null;
  enrichment_source: string | null;
  bio_summary: string | null;
  trigger_context: string | null;
  account?: LeadForgeAccount;
}

export interface LeadForgeTriggerEvent {
  id: string;
  account_id: string | null;
  event_type: string | null;
  description: string | null;
  priority: 'critical' | 'high' | 'medium' | null;
  source_url: string | null;
  detected_at: string;
  response_status: string;
  account?: LeadForgeAccount;
}

export interface LeadForgeContent {
  id: string;
  prospect_id: string | null;
  content_type: string | null;
  title: string | null;
  body: string | null;
  status: 'draft' | 'pending_review' | 'approved';
  created_at: string;
  prospect?: LeadForgeProspect;
}

export interface CreateProspectInput {
  full_name: string;
  title?: string;
  email?: string;
  linkedin_url?: string;
  icp_score?: number;
  stage?: string;
  notes?: string;
  account_id?: string;
  // CRM fields
  warmth_score?: string;
  pipeline_stage?: string;
  role_start_date?: string;
  next_action?: string;
  next_action_date?: string;
  email_confidence?: string;
  enrichment_source?: string;
  bio_summary?: string;
  trigger_context?: string;
}

export interface CreateAccountInput {
  company_name: string;
  industry?: string;
  size?: string;
  revenue_range?: string;
  hq_location?: string;
  domain?: string;
  headcount?: number;
  icp_fit?: string;
  key_challenges?: string;
}

export interface CreateTriggerInput {
  account_id?: string;
  event_type: string;
  description: string;
  priority: string;
  source_url?: string;
}

export interface CreateContentInput {
  prospect_id?: string;
  content_type: string;
  title: string;
  body: string;
}

export interface LeadForgeActivity {
  id: string;
  prospect_id: string | null;
  account_id: string | null;
  activity_type: string;
  direction: string;
  subject: string | null;
  notes: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  created_by: string;
}

export interface CreateActivityInput {
  prospect_id?: string;
  account_id?: string;
  activity_type: string;
  direction?: string;
  subject?: string;
  notes?: string;
  metadata?: Record<string, unknown>;
  created_by?: string;
}

// ── useProspects ───────────────────────────────────────────────

export function useProspects() {
  const [prospects, setProspects] = useState<LeadForgeProspect[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createPortalClient();
  const initialized = useRef(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('leadforge_prospects')
        .select('*, account:leadforge_accounts(*)')
        .order('icp_score', { ascending: false });
      if (!error && data) setProspects(data as LeadForgeProspect[]);
    } catch {
      // silently fail — show empty state
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    load();
    const channel = supabase
      .channel('leadforge-prospects')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'leadforge_prospects' }, load)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [load, supabase]);

  const createProspect = async (input: CreateProspectInput) => {
    const { data, error } = await supabase
      .from('leadforge_prospects')
      .insert(input)
      .select()
      .single();
    if (error) throw error;
    await load();
    return data;
  };

  const updateProspect = async (id: string, updates: Partial<LeadForgeProspect>) => {
    const { error } = await supabase
      .from('leadforge_prospects')
      .update({ ...updates, last_activity_at: new Date().toISOString() })
      .eq('id', id);
    if (error) throw error;
    await load();
  };

  const deleteProspect = async (id: string) => {
    const { error } = await supabase
      .from('leadforge_prospects')
      .delete()
      .eq('id', id);
    if (error) throw error;
    await load();
  };

  return { prospects, loading, createProspect, updateProspect, deleteProspect, reload: load };
}

// ── useAccounts ────────────────────────────────────────────────

export function useAccounts() {
  const [accounts, setAccounts] = useState<LeadForgeAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createPortalClient();
  const initialized = useRef(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('leadforge_accounts')
        .select('*')
        .order('company_name');
      if (!error && data) setAccounts(data as LeadForgeAccount[]);
    } catch {
      // silently fail — show empty state
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    load();
  }, [load]);

  const createAccount = async (input: CreateAccountInput) => {
    const { data, error } = await supabase
      .from('leadforge_accounts')
      .insert(input)
      .select()
      .single();
    if (error) throw error;
    await load();
    return data;
  };

  const updateAccount = async (id: string, updates: Partial<CreateAccountInput>) => {
    const { error } = await supabase
      .from('leadforge_accounts')
      .update(updates)
      .eq('id', id);
    if (error) throw error;
    await load();
  };

  return { accounts, loading, createAccount, updateAccount, reload: load };
}

// ── useTriggerEvents ───────────────────────────────────────────

export function useTriggerEvents() {
  const [events, setEvents] = useState<LeadForgeTriggerEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createPortalClient();
  const initialized = useRef(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('leadforge_trigger_events')
        .select('*, account:leadforge_accounts(*)')
        .order('detected_at', { ascending: false });
      if (!error && data) setEvents(data as LeadForgeTriggerEvent[]);
    } catch {
      // silently fail — show empty state
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    load();
    const channel = supabase
      .channel('leadforge-triggers')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'leadforge_trigger_events' }, load)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [load, supabase]);

  const createEvent = async (input: CreateTriggerInput) => {
    const { data, error } = await supabase
      .from('leadforge_trigger_events')
      .insert(input)
      .select()
      .single();
    if (error) throw error;

    // Auto-flag all prospects at this account
    if (input.account_id) {
      const { data: linkedProspects } = await supabase
        .from('leadforge_prospects')
        .select('id, warmth_score')
        .eq('account_id', input.account_id);

      if (linkedProspects && linkedProspects.length > 0) {
        // Log a trigger_flagged activity for each prospect
        await supabase.from('leadforge_activities').insert(
          linkedProspects.map((p: { id: string; warmth_score: string | null }) => ({
            prospect_id: p.id,
            account_id: input.account_id,
            activity_type: 'trigger_flagged',
            direction: 'inbound',
            subject: `Trigger: ${input.event_type.replace(/_/g, ' ')}`,
            notes: input.description,
            metadata: { priority: input.priority, event_type: input.event_type },
            created_by: 'system',
          }))
        );

        // Bump warmth from cold → warm for critical/high priority events
        if (input.priority === 'critical' || input.priority === 'high') {
          const coldProspects = linkedProspects.filter((p: { id: string; warmth_score: string | null }) => !p.warmth_score || p.warmth_score === 'cold');
          if (coldProspects.length > 0) {
            await supabase
              .from('leadforge_prospects')
              .update({ warmth_score: 'warm', last_activity_at: new Date().toISOString() })
              .in('id', coldProspects.map((p: { id: string }) => p.id));
          }
        }
      }
    }

    await load();
    return data;
  };

  const updateStatus = async (id: string, response_status: string) => {
    const { error } = await supabase
      .from('leadforge_trigger_events')
      .update({ response_status })
      .eq('id', id);
    if (error) throw error;
    await load();
  };

  return { events, loading, createEvent, updateStatus, reload: load };
}

// ── useLeadForgeContent ────────────────────────────────────────

export function useLeadForgeContent() {
  const [content, setContent] = useState<LeadForgeContent[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createPortalClient();
  const initialized = useRef(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('leadforge_content')
        .select('*, prospect:leadforge_prospects(full_name, title)')
        .order('created_at', { ascending: false });
      if (!error && data) setContent(data as LeadForgeContent[]);
    } catch {
      // silently fail — show empty state
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    load();
  }, [load]);

  const createContent = async (input: CreateContentInput) => {
    const { data, error } = await supabase
      .from('leadforge_content')
      .insert({ ...input, status: 'draft' })
      .select()
      .single();
    if (error) throw error;
    await load();
    return data;
  };

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from('leadforge_content')
      .update({ status })
      .eq('id', id);
    if (error) throw error;
    await load();
  };

  return { content, loading, createContent, updateStatus, reload: load };
}

// ── useActivities ──────────────────────────────────────────────

export function useActivities(prospect_id: string) {
  const [activities, setActivities] = useState<LeadForgeActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createPortalClient();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('leadforge_activities')
        .select('*')
        .eq('prospect_id', prospect_id)
        .order('created_at', { ascending: false });
      if (!error && data) setActivities(data as LeadForgeActivity[]);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, [supabase, prospect_id]);

  useEffect(() => {
    load();
    const channel = supabase
      .channel(`leadforge-activities-${prospect_id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'leadforge_activities', filter: `prospect_id=eq.${prospect_id}` }, load)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [load, supabase, prospect_id]);

  const logActivity = async (input: CreateActivityInput) => {
    const { error } = await supabase
      .from('leadforge_activities')
      .insert({ ...input, prospect_id });
    if (error) throw error;
    // also stamp last_activity_at on the prospect
    await supabase
      .from('leadforge_prospects')
      .update({ last_activity_at: new Date().toISOString() })
      .eq('id', prospect_id);
    await load();
  };

  return { activities, loading, logActivity };
}

// ── useAllActivities ──────────────────────────────────────────

export function useAllActivities(limit = 20) {
  const [activities, setActivities] = useState<LeadForgeActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createPortalClient();
  const initialized = useRef(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('leadforge_activities')
        .select('*, prospect:leadforge_prospects(full_name, title)')
        .order('created_at', { ascending: false })
        .limit(limit);
      if (!error && data) setActivities(data as any[]);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, [supabase, limit]);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    load();
    const channel = supabase
      .channel('leadforge-all-activities')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'leadforge_activities' }, load)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [load, supabase]);

  return { activities, loading };
}

// ── useLeadForgeStats ──────────────────────────────────────────

export function useLeadForgeStats() {
  const { prospects, loading: pLoading } = useProspects();
  const { events, loading: eLoading } = useTriggerEvents();
  const { content, loading: cLoading } = useLeadForgeContent();

  const thisWeekStart = new Date();
  thisWeekStart.setDate(thisWeekStart.getDate() - 7);

  const triggerEventsThisWeek = events.filter(
    e => new Date(e.detected_at) >= thisWeekStart
  ).length;

  const activeCampaigns = prospects.filter(p => {
    const s = (p as any).pipeline_stage ?? p.stage;
    return s === 'outreach' || s === 'engaged' || s === 'qualified' || s === 'proposal';
  }).length;

  const pendingReview = content.filter(c => c.status === 'pending_review').length;

  return {
    prospectsTotal: prospects.length,
    triggerEventsThisWeek,
    activeCampaigns,
    pendingReview,
    loading: pLoading || eLoading || cLoading,
    // expose raw data so callers don't need to re-call sub-hooks
    prospects,
    events,
  };
}
