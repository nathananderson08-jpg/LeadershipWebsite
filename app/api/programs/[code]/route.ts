import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/portal/supabase-server';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code: rawCode } = await params;
  const code = rawCode.toUpperCase();
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('participant_programs')
    .select('id, program_name, company_name, company_logo_url')
    .eq('code', code)
    .eq('is_active', true)
    .maybeSingle();

  if (error) return NextResponse.json({ error: 'Failed to load program.' }, { status: 500 });
  if (!data) return NextResponse.json({ error: 'Program not found.' }, { status: 404 });

  return NextResponse.json(data);
}
