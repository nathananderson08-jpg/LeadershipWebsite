import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/portal/supabase-server';
import { upsertContact } from '@/lib/integrations/hubspot';

export async function POST(req: NextRequest) {
  try {
    const { program_code, full_name, email, title, company, phone } = await req.json();

    if (!program_code || !full_name || !email) {
      return NextResponse.json({ error: 'program_code, full_name, and email are required.' }, { status: 400 });
    }

    const code = (program_code as string).toUpperCase();
    const supabase = createAdminClient();

    // Look up program
    const { data: program, error: progError } = await supabase
      .from('participant_programs')
      .select('id, program_name, company_name')
      .eq('code', code)
      .eq('is_active', true)
      .maybeSingle();

    if (progError) return NextResponse.json({ error: 'Failed to load program.' }, { status: 500 });
    if (!program) return NextResponse.json({ error: 'Program not found.' }, { status: 404 });

    // Insert participant
    const { error: insertError } = await supabase.from('program_participants').insert({
      program_id: program.id,
      program_code: code,
      full_name: full_name.trim(),
      email: email.trim().toLowerCase(),
      title: title?.trim() || null,
      company: company?.trim() || null,
      phone: phone?.trim() || null,
    });

    if (insertError) {
      // Duplicate email for same program is fine — treat as success
      if (insertError.code === '23505') {
        return NextResponse.json({ ok: true, duplicate: true });
      }
      return NextResponse.json({ error: 'Registration failed. Please try again.' }, { status: 500 });
    }

    // Sync to HubSpot fire-and-forget
    upsertContact({
      full_name: full_name.trim(),
      email: email.trim().toLowerCase(),
      title: title?.trim() || null,
      company: company?.trim() || program.company_name || null,
      trigger_context: `Registered for ${program.program_name} (${code})`,
    }).catch(() => { /* non-fatal */ });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error('Program registration error:', err);
    return NextResponse.json({ error: 'Registration failed. Please try again.' }, { status: 500 });
  }
}
