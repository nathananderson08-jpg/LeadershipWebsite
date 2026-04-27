import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/portal/supabase-server';

export async function GET() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('open_roles')
    .select('id, title, department, location, type, description')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ roles: [] });
  return NextResponse.json({ roles: data ?? [] });
}
