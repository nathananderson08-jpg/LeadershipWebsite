import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/portal/supabase-server';

export async function GET() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('open_roles')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: 'Failed to load.' }, { status: 500 });
  return NextResponse.json({ roles: data ?? [] });
}

export async function POST(req: NextRequest) {
  const supabase = createAdminClient();
  try {
    const body = await req.json();
    const { action } = body;

    if (action === 'create' || action === 'update') {
      const { id, title, department, location, type, description, is_active, sort_order } = body;
      if (!title) return NextResponse.json({ error: 'title is required.' }, { status: 400 });

      const payload = {
        title: title.trim(),
        department: department?.trim() || '',
        location: location?.trim() || '',
        type: type?.trim() || 'Full-time',
        description: description?.trim() || '',
        is_active: is_active ?? true,
        sort_order: sort_order ?? 0,
        updated_at: new Date().toISOString(),
      };

      if (action === 'update' && id) {
        const { error } = await supabase.from('open_roles').update(payload).eq('id', id);
        if (error) return NextResponse.json({ error: 'Update failed.' }, { status: 500 });
        return NextResponse.json({ ok: true });
      } else {
        const { data, error } = await supabase
          .from('open_roles')
          .insert({ ...payload, created_at: new Date().toISOString() })
          .select('id')
          .single();
        if (error) return NextResponse.json({ error: 'Create failed.' }, { status: 500 });
        return NextResponse.json({ id: data.id });
      }
    }

    if (action === 'toggle_active') {
      const { id, is_active } = body;
      const { error } = await supabase.from('open_roles').update({ is_active }).eq('id', id);
      if (error) return NextResponse.json({ error: 'Update failed.' }, { status: 500 });
      return NextResponse.json({ ok: true });
    }

    if (action === 'delete') {
      await supabase.from('open_roles').delete().eq('id', body.id);
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: 'Unknown action.' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? 'Request failed.' }, { status: 500 });
  }
}
