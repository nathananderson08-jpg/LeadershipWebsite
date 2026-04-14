import { NextRequest, NextResponse } from 'next/server';
import {
  isConfigured,
  createProgramEvent,
  updateProgramEvent,
  deleteProgramEvent,
  syncEventAttendees,
  getEventAttendees,
  type CalendarAttendee,
} from '@/lib/integrations/google-calendar';
import { createAdminClient } from '@/lib/portal/supabase-server';

// ── Helpers ───────────────────────────────────────────────────────────────────

async function getConfirmedAttendees(programId: string): Promise<CalendarAttendee[]> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('program_assignments')
    .select('status, practitioner:profiles(email, full_name)')
    .eq('program_id', programId)
    .in('status', ['invited', 'accepted', 'confirmed']);

  return (data ?? []).map((a: any) => ({
    email: a.practitioner.email,
    name: a.practitioner.full_name,
  }));
}

async function getProgramEventId(programId: string): Promise<string | null> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('programs')
    .select('google_event_id')
    .eq('id', programId)
    .single();
  return data?.google_event_id ?? null;
}

async function saveEventId(programId: string, eventId: string): Promise<void> {
  const supabase = createAdminClient();
  await supabase
    .from('programs')
    .update({ google_event_id: eventId })
    .eq('id', programId);
}

async function clearEventId(programId: string): Promise<void> {
  const supabase = createAdminClient();
  await supabase
    .from('programs')
    .update({ google_event_id: null })
    .eq('id', programId);
}

// ── Route ─────────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  if (!isConfigured()) {
    return NextResponse.json(
      { error: 'Google Calendar is not configured. Add GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY, and GOOGLE_CALENDAR_ID to your environment variables.' },
      { status: 503 }
    );
  }

  try {
    const body = await req.json();
    const { action, program_id } = body;

    if (!program_id) {
      return NextResponse.json({ error: 'program_id is required.' }, { status: 400 });
    }

    // Load program data
    const supabase = createAdminClient();
    const { data: program, error: progErr } = await supabase
      .from('programs')
      .select('*')
      .eq('id', program_id)
      .single();

    if (progErr || !program) {
      return NextResponse.json({ error: 'Program not found.' }, { status: 404 });
    }

    // ── create_event ── create a new calendar event for this program
    if (action === 'create_event') {
      // If event already exists, update it instead
      const existingId = program.google_event_id;
      if (existingId) {
        const attendees = await getConfirmedAttendees(program_id);
        await updateProgramEvent(existingId, program, attendees);
        return NextResponse.json({ success: true, event_id: existingId, action: 'updated' });
      }

      const attendees = await getConfirmedAttendees(program_id);
      const eventId = await createProgramEvent(program, attendees);
      await saveEventId(program_id, eventId);
      return NextResponse.json({ success: true, event_id: eventId, action: 'created' });
    }

    // ── sync_attendees ── update attendee list to match current assignments
    if (action === 'sync_attendees') {
      const eventId = program.google_event_id;
      if (!eventId) {
        // Auto-create if not yet on calendar
        const attendees = await getConfirmedAttendees(program_id);
        const newEventId = await createProgramEvent(program, attendees);
        await saveEventId(program_id, newEventId);
        return NextResponse.json({ success: true, event_id: newEventId, action: 'created' });
      }
      const attendees = await getConfirmedAttendees(program_id);
      await syncEventAttendees(eventId, attendees);
      return NextResponse.json({ success: true, event_id: eventId, attendees });
    }

    // ── update_event ── update event details (name, dates, location)
    if (action === 'update_event') {
      const eventId = program.google_event_id;
      if (!eventId) {
        return NextResponse.json({ error: 'No calendar event exists for this program. Create one first.' }, { status: 404 });
      }
      const attendees = await getConfirmedAttendees(program_id);
      await updateProgramEvent(eventId, program, attendees);
      return NextResponse.json({ success: true, event_id: eventId });
    }

    // ── delete_event ── remove event from calendar
    if (action === 'delete_event') {
      const eventId = program.google_event_id;
      if (!eventId) {
        return NextResponse.json({ success: true, message: 'No calendar event to delete.' });
      }
      await deleteProgramEvent(eventId);
      await clearEventId(program_id);
      return NextResponse.json({ success: true });
    }

    // ── get_attendees ── fetch current attendees from Google
    if (action === 'get_attendees') {
      const eventId = program.google_event_id;
      if (!eventId) {
        return NextResponse.json({ attendees: [] });
      }
      const attendees = await getEventAttendees(eventId);
      return NextResponse.json({ attendees });
    }

    return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });

  } catch (err: any) {
    console.error('Google Calendar API error:', err);
    // Surface credential errors clearly
    const msg = err.message?.includes('not configured')
      ? err.message
      : err.message ?? 'Google Calendar operation failed.';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ configured: isConfigured() });
}
