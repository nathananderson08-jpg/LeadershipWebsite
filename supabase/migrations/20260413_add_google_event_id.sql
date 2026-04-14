-- Add google_event_id to programs table for Google Calendar integration
ALTER TABLE programs ADD COLUMN IF NOT EXISTS google_event_id TEXT;
