import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, password, full_name } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    const { createClient } = require('@supabase/supabase-js');
    const admin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: users, error: listError } = await admin.auth.admin.listUsers();
    if (listError) throw listError;

    const user = users.users.find((u: any) => u.email === email.toLowerCase().trim());
    if (!user) {
      return NextResponse.json({ error: 'This email has not been invited' }, { status: 404 });
    }

    const { error: updateError } = await admin.auth.admin.updateUserById(user.id, {
      password: password,
    });
    if (updateError) throw updateError;

    await admin
      .from('profiles')
      .upsert({
        id: user.id,
        email: user.email,
        full_name: (full_name || user.email.split('@')[0]).trim(),
        role: 'practitioner',
        program_types: [],
      }, { onConflict: 'id' });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Auth setup error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
