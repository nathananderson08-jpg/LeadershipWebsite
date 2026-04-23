import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/portal/supabase-server';

// Generate a 6-char uppercase alphanumeric code, excluding confusable chars (0 1 I O)
function generateCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

async function generateUniqueCode(supabase: ReturnType<typeof createAdminClient>): Promise<string> {
  for (let attempt = 0; attempt < 10; attempt++) {
    const code = generateCode();
    const { data } = await supabase
      .from('participant_programs')
      .select('code')
      .eq('code', code)
      .maybeSingle();
    if (!data) return code;
  }
  throw new Error('Failed to generate unique code');
}

export async function GET(req: NextRequest) {
  const supabase = createAdminClient();

  const { searchParams } = new URL(req.url);
  const programId = searchParams.get('id');

  if (programId) {
    // Fetch single program + participants
    const [programResult, participantsResult] = await Promise.all([
      supabase
        .from('participant_programs')
        .select('*')
        .eq('id', programId)
        .single(),
      supabase
        .from('program_participants')
        .select('id, full_name, email, title, company, phone, created_at')
        .eq('program_id', programId)
        .order('created_at', { ascending: false }),
    ]);

    if (programResult.error) return NextResponse.json({ error: 'Not found.' }, { status: 404 });

    return NextResponse.json({
      program: programResult.data,
      participants: participantsResult.data ?? [],
    });
  }

  // List all programs
  const { data, error } = await supabase
    .from('participant_programs')
    .select('id, code, program_name, company_name, company_logo_url, is_active, created_at')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: 'Failed to load programs.' }, { status: 500 });

  // Get participant counts per program
  const ids = (data ?? []).map(p => p.id);
  let counts: Record<string, number> = {};
  if (ids.length > 0) {
    const { data: countData } = await supabase
      .from('program_participants')
      .select('program_id')
      .in('program_id', ids);
    (countData ?? []).forEach((r: any) => {
      counts[r.program_id] = (counts[r.program_id] ?? 0) + 1;
    });
  }

  return NextResponse.json({
    programs: (data ?? []).map(p => ({ ...p, participant_count: counts[p.id] ?? 0 })),
  });
}

export async function POST(req: NextRequest) {
  const supabase = createAdminClient();

  try {
    const body = await req.json();
    const { action } = body;

    if (action === 'create') {
      const { program_name, company_name, company_logo_url } = body;
      if (!program_name || !company_name) {
        return NextResponse.json({ error: 'program_name and company_name are required.' }, { status: 400 });
      }

      const code = await generateUniqueCode(supabase);

      const { data, error } = await supabase
        .from('participant_programs')
        .insert({
          code,
          program_name: program_name.trim(),
          company_name: company_name.trim(),
          company_logo_url: company_logo_url?.trim() || null,
          is_active: true,
        })
        .select()
        .single();

      if (error) return NextResponse.json({ error: 'Failed to create program.' }, { status: 500 });
      return NextResponse.json({ program: data });
    }

    if (action === 'toggle_active') {
      const { id, is_active } = body;
      const { error } = await supabase
        .from('participant_programs')
        .update({ is_active })
        .eq('id', id);
      if (error) return NextResponse.json({ error: 'Update failed.' }, { status: 500 });
      return NextResponse.json({ ok: true });
    }

    if (action === 'delete') {
      const { id } = body;
      const { error } = await supabase
        .from('participant_programs')
        .delete()
        .eq('id', id);
      if (error) return NextResponse.json({ error: 'Delete failed.' }, { status: 500 });
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: 'Unknown action.' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? 'Request failed.' }, { status: 500 });
  }
}
