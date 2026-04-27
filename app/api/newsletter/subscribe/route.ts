import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/portal/supabase-server';

export async function POST(req: NextRequest) {
  try {
    const { email, name, source } = await req.json();
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email required.' }, { status: 400 });
    }

    const supabase = createAdminClient();

    const { error } = await supabase.from('newsletter_subscribers').upsert(
      {
        email: email.trim().toLowerCase(),
        name: name?.trim() || null,
        source: source || 'website_footer',
        status: 'active',
        subscribed_at: new Date().toISOString(),
      },
      { onConflict: 'email', ignoreDuplicates: false }
    );

    if (error) {
      console.error('Newsletter subscribe error:', error);
      return NextResponse.json({ error: 'Failed to subscribe.' }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to subscribe.' }, { status: 500 });
  }
}
