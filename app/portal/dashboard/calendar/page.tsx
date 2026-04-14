'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { useAuth } from '@/hooks/portal/useAuth';
import { createPortalClient } from '@/lib/portal/supabase';
import { FIRM_NAME } from '@/lib/constants';
import { ASSIGNMENT_STATUS_COLORS } from '@/lib/portal/constants';
import type { Program, ProgramAssignment, AvailabilityBlock } from '@/lib/portal/types';
import nextDynamic from 'next/dynamic';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

const FullCalendar = nextDynamic(() => import('@fullcalendar/react'), { ssr: false });

export default function CalendarPage() {
  const { profile, isAdmin, loading: authLoading } = useAuth();
  const supabaseRef = useRef(createPortalClient());
  const supabase = supabaseRef.current;
  const [programs, setPrograms] = useState<Program[]>([]);
  const [assignments, setAssignments] = useState<(ProgramAssignment & { program: Program })[]>([]);
  const [availability, setAvailability] = useState<AvailabilityBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const initialized = useRef(false);

  useEffect(() => {
    if (!profile || authLoading || initialized.current) return;
    initialized.current = true;

    async function loadData() {
      setLoading(true);

      if (isAdmin) {
        const { data } = await supabase.from('programs').select('*');
        setPrograms(data || []);
      } else {
        const { data: assignData } = await supabase
          .from('program_assignments')
          .select('*, program:programs(*)')
          .eq('practitioner_id', profile!.id);
        setAssignments((assignData as any) || []);

        const res = await fetch('/portal/api/availability', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'list', practitioner_id: profile!.id }),
        });
        if (res.ok) {
          const { data } = await res.json();
          setAvailability(data || []);
        }
      }

      setLoading(false);
    }

    loadData();
  }, [profile, isAdmin, authLoading]);

  const reloadAvailability = async () => {
    if (!profile) return;
    const res = await fetch('/portal/api/availability', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'list', practitioner_id: profile.id }),
    });
    if (res.ok) {
      const { data } = await res.json();
      setAvailability(data || []);
    }
  };

  const handleDateClick = async (info: any) => {
    if (isAdmin || !profile) return;

    const clickedDate = info.dateStr;
    const matchingBlocks = availability.filter(
      a => a.type === 'blocked' && a.start_date <= clickedDate && a.end_date >= clickedDate
    );

    if (matchingBlocks.length > 0) {
      const blockIds = new Set(matchingBlocks.map(b => b.id));
      setAvailability(prev => prev.filter(a => !blockIds.has(a.id)));

      for (const block of matchingBlocks) {
        await fetch('/portal/api/availability', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'unblock', block_id: block.id }),
        });
      }
    } else {
      const tempId = `temp-${Date.now()}`;
      setAvailability(prev => [...prev, {
        id: tempId,
        practitioner_id: profile.id,
        start_date: clickedDate,
        end_date: clickedDate,
        type: 'blocked' as const,
        note: null,
        created_at: new Date().toISOString(),
      }]);

      await fetch('/portal/api/availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'block', practitioner_id: profile.id, start_date: clickedDate, end_date: clickedDate }),
      });
      await reloadAvailability();
    }
  };

  const events = useMemo(() => {
    const evts: any[] = [];

    if (isAdmin) {
      programs.forEach(p => {
        evts.push({
          id: `prog-${p.id}`,
          title: p.name,
          start: p.start_date,
          end: new Date(new Date(p.end_date).getTime() + 86400000).toISOString().split('T')[0],
          backgroundColor: 'var(--portal-accent)',
          borderColor: 'var(--portal-accent)',
          textColor: 'white',
          url: `/portal/dashboard/programs/${p.id}`,
        });
      });
    } else {
      assignments.forEach(a => {
        if (a.program && a.status !== 'declined' && a.status !== 'rejected') {
          evts.push({
            id: `assign-${a.id}`,
            title: a.status === 'confirmed' ? a.program.name : `${a.program.name} (${a.status})`,
            start: a.program.start_date,
            end: new Date(new Date(a.program.end_date).getTime() + 86400000).toISOString().split('T')[0],
            backgroundColor: ASSIGNMENT_STATUS_COLORS[a.status],
            borderColor: ASSIGNMENT_STATUS_COLORS[a.status],
            textColor: 'white',
          });
        }
      });

      availability.forEach(block => {
        if (block.type === 'blocked') {
          evts.push({
            id: `block-${block.id}`,
            title: 'Blocked',
            start: block.start_date,
            end: new Date(new Date(block.end_date).getTime() + 86400000).toISOString().split('T')[0],
            backgroundColor: 'var(--portal-danger)',
            borderColor: 'var(--portal-danger)',
            textColor: 'white',
          });
        }
      });
    }

    return evts;
  }, [programs, assignments, availability, isAdmin]);

  const isPageLoading = authLoading || loading;

  return (
    <div className="flex flex-col h-full">
      <div className="px-24 pt-12 pb-14">
        <h1 className="text-4xl" style={{ color: 'var(--portal-text-primary)' }}>
          {isAdmin ? `${FIRM_NAME} Calendar` : 'My Calendar'}
        </h1>
        <p className="text-[16px]" style={{ marginTop: '8px', color: 'var(--portal-text-tertiary)' }}>
          {isAdmin
            ? 'Master schedule for all leadership development programs'
            : 'Click a date to block it out. Click the red block to unblock.'}
        </p>
        {!isAdmin && (
          <div className="flex items-center gap-6" style={{ marginTop: '16px' }}>
            <div className="flex items-center gap-2">
              <div style={{ width: '14px', height: '14px', borderRadius: '4px', background: 'rgba(196,114,114,0.3)', border: '2px solid var(--portal-danger)' }} />
              <span className="text-[14px]" style={{ color: 'var(--portal-text-tertiary)' }}>Blocked / Unavailable</span>
            </div>
            <div className="flex items-center gap-2">
              <div style={{ width: '14px', height: '14px', borderRadius: '4px', background: ASSIGNMENT_STATUS_COLORS.invited }} />
              <span className="text-[14px]" style={{ color: 'var(--portal-text-tertiary)' }}>Pending invite</span>
            </div>
            <div className="flex items-center gap-2">
              <div style={{ width: '14px', height: '14px', borderRadius: '4px', background: ASSIGNMENT_STATUS_COLORS.accepted }} />
              <span className="text-[14px]" style={{ color: 'var(--portal-text-tertiary)' }}>Accepted</span>
            </div>
            <div className="flex items-center gap-2">
              <div style={{ width: '14px', height: '14px', borderRadius: '4px', background: ASSIGNMENT_STATUS_COLORS.confirmed }} />
              <span className="text-[14px]" style={{ color: 'var(--portal-text-tertiary)' }}>Confirmed program</span>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 px-24 pb-10 overflow-auto" style={{ borderTop: '1px solid var(--portal-border-default)', paddingTop: '32px' }}>
        {isPageLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 rounded-full border-2 portal-animate-spin"
              style={{ borderColor: 'var(--portal-accent)', borderTopColor: 'transparent' }} />
          </div>
        ) : (
          <div className="portal-glass-card rounded-2xl" style={{ padding: '32px' }}>
            <FullCalendar
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              events={events}
              dateClick={!isAdmin ? handleDateClick : undefined}
              selectable={false}
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,dayGridWeek',
              }}
              height="auto"
              eventClick={(info: any) => {
                const eventId = info.event.id as string;
                if (eventId.startsWith('block-')) {
                  info.jsEvent.preventDefault();
                  const blockId = eventId.replace('block-', '');
                  setAvailability(prev => prev.filter(a => a.id !== blockId));
                  fetch('/portal/api/availability', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: 'unblock', block_id: blockId }),
                  });
                } else if (info.event.url) {
                  info.jsEvent.preventDefault();
                  window.location.href = info.event.url;
                }
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
