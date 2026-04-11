import { NextResponse } from 'next/server';

function getAdminClient() {
  const { createClient } = require('@supabase/supabase-js');
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const admin = getAdminClient();

    if (body.action === 'block') {
      const { data, error } = await admin.from('availability_blocks').insert({
        practitioner_id: body.practitioner_id,
        start_date: body.start_date,
        end_date: body.end_date,
        type: 'blocked',
      }).select().single();
      if (error) throw error;
      return NextResponse.json({ success: true, data });

    } else if (body.action === 'unblock') {
      const { data: existing } = await admin
        .from('availability_blocks')
        .select('id')
        .eq('id', body.block_id)
        .single();

      if (!existing) {
        return NextResponse.json({ success: true, message: 'Already deleted' });
      }

      const { error, count } = await admin
        .from('availability_blocks')
        .delete({ count: 'exact' })
        .match({ id: body.block_id });

      if (error) throw error;

      return NextResponse.json({ success: true, deleted: count });

    } else if (body.action === 'list') {
      const { data, error } = await admin
        .from('availability_blocks')
        .select('*')
        .eq('practitioner_id', body.practitioner_id);
      if (error) throw error;
      return NextResponse.json({ data });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Availability API error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
