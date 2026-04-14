import { google } from 'googleapis';

// ── Auth ──────────────────────────────────────────────────────────────────────
// Uses a service account — no per-user OAuth needed.
// The service account creates/owns events on GOOGLE_CALENDAR_ID and invites
// practitioners as attendees. Google sends them standard calendar invitations.

function getAuth() {
  const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, '\n');
  if (!privateKey || !process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL) {
    throw new Error('Google Calendar not configured. Set GOOGLE_SERVICE_ACCOUNT_EMAIL and GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY.');
  }
  return new google.auth.JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: privateKey,
    scopes: ['https://www.googleapis.com/auth/calendar'],
  });
}

function getCalendar() {
  return google.calendar({ version: 'v3', auth: getAuth() });
}

function calendarId() {
  return process.env.GOOGLE_CALENDAR_ID ?? 'primary';
}

export function isConfigured(): boolean {
  return !!(
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
    process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY &&
    process.env.GOOGLE_CALENDAR_ID
  );
}

// ── Types ─────────────────────────────────────────────────────────────────────

export interface CalendarAttendee {
  email: string;
  name: string;
}

export interface ProgramEventInput {
  name: string;
  description: string | null;
  start_date: string;   // ISO date, e.g. "2025-09-01"
  end_date: string;     // ISO date, e.g. "2025-09-05"
  location: string | null;
}

// ── CRUD ──────────────────────────────────────────────────────────────────────

export async function createProgramEvent(
  program: ProgramEventInput,
  attendees: CalendarAttendee[] = []
): Promise<string> {
  const calendar = getCalendar();

  // Google Calendar all-day events: end date is exclusive, so add 1 day
  const endDate = new Date(program.end_date);
  endDate.setDate(endDate.getDate() + 1);
  const endDateStr = endDate.toISOString().slice(0, 10);

  const { data } = await calendar.events.insert({
    calendarId: calendarId(),
    sendUpdates: 'all',        // Google sends email invites to all attendees
    requestBody: {
      summary: program.name,
      description: program.description ?? undefined,
      location: program.location ?? undefined,
      start: { date: program.start_date },
      end: { date: endDateStr },
      attendees: attendees.map(a => ({ email: a.email, displayName: a.name })),
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 60 * 24 * 7 },  // 1 week before
          { method: 'email', minutes: 60 * 24 },       // 1 day before
        ],
      },
    },
  });

  if (!data.id) throw new Error('Google Calendar event creation failed — no event ID returned.');
  return data.id;
}

export async function updateProgramEvent(
  eventId: string,
  program: ProgramEventInput,
  attendees: CalendarAttendee[] = []
): Promise<void> {
  const calendar = getCalendar();

  const endDate = new Date(program.end_date);
  endDate.setDate(endDate.getDate() + 1);
  const endDateStr = endDate.toISOString().slice(0, 10);

  await calendar.events.patch({
    calendarId: calendarId(),
    eventId,
    sendUpdates: 'all',
    requestBody: {
      summary: program.name,
      description: program.description ?? undefined,
      location: program.location ?? undefined,
      start: { date: program.start_date },
      end: { date: endDateStr },
      attendees: attendees.map(a => ({ email: a.email, displayName: a.name })),
    },
  });
}

export async function deleteProgramEvent(eventId: string): Promise<void> {
  const calendar = getCalendar();
  await calendar.events.delete({
    calendarId: calendarId(),
    eventId,
    sendUpdates: 'all',
  });
}

export async function getEventAttendees(eventId: string): Promise<CalendarAttendee[]> {
  const calendar = getCalendar();
  const { data } = await calendar.events.get({
    calendarId: calendarId(),
    eventId,
  });
  return (data.attendees ?? [])
    .filter(a => !a.self)   // exclude the service account itself
    .map(a => ({ email: a.email ?? '', name: a.displayName ?? '' }));
}

export async function syncEventAttendees(
  eventId: string,
  attendees: CalendarAttendee[]
): Promise<void> {
  const calendar = getCalendar();
  await calendar.events.patch({
    calendarId: calendarId(),
    eventId,
    sendUpdates: 'all',
    requestBody: {
      attendees: attendees.map(a => ({ email: a.email, displayName: a.name })),
    },
  });
}
