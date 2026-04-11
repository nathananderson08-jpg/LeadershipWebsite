import { NextResponse } from 'next/server';
import { createAdminClient, createServerSupabaseClient } from '@/lib/portal/supabase-server';
import { Resend } from 'resend';

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

export async function POST(request: Request) {
  try {
    let isAuthorized = false;

    try {
      const supabase = await createServerSupabaseClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (profile && (profile.role === 'admin' || profile.role === 'primary_admin')) {
          isAuthorized = true;
        }
      }
    } catch {
      try {
        const admin = createAdminClient();
        const { data: profiles } = await admin
          .from('profiles')
          .select('role')
          .in('role', ['admin', 'primary_admin']);

        if (profiles && profiles.length > 0) {
          isAuthorized = true;
        }
      } catch {
        // Admin client also failed
      }
    }

    if (!isAuthorized) {
      return NextResponse.json({ error: 'Unauthorized - please log in again' }, { status: 401 });
    }

    const body = await request.json();

    switch (body.type) {
      case 'create_user':
        return handleCreateUser(body);
      case 'resend_invite':
        return handleResendInvite(body);
      case 'remove_user':
        return handleRemoveUser(body);
      case 'send_invitations':
        return handleSendInvitations(body);
      default:
        return NextResponse.json({ error: 'Unknown email type' }, { status: 400 });
    }
  } catch (err: any) {
    console.error('Email API error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

async function handleCreateUser(body: any) {
  const admin = createAdminClient();

  const { data: authUser, error: authError } = await admin.auth.admin.createUser({
    email: body.email,
    email_confirm: true,
    user_metadata: { full_name: body.full_name, role: body.role },
  });

  if (authError) {
    if (authError.code === 'email_exists') {
      return NextResponse.json({ error: 'A user with this email already exists' }, { status: 409 });
    }
    throw authError;
  }

  await admin.from('profiles').upsert({
    id: authUser.user.id,
    email: body.email,
    full_name: body.full_name,
    role: body.role || 'practitioner',
    seniority: body.seniority || null,
    phone: body.phone || null,
    bio: body.bio || null,
    program_types: body.program_types || [],
  }, { onConflict: 'id' });

  const { data: linkData } = await admin.auth.admin.generateLink({
    type: 'magiclink',
    email: body.email,
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/portal/api/auth/callback?next=/portal/dashboard/settings`,
    },
  });

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const loginUrl = linkData?.properties?.action_link || `${appUrl}/portal/login`;

  try {
    await getResend().emails.send({
      from: 'LeadershipCo <onboarding@resend.dev>',
      to: body.email,
      subject: 'Welcome to LeadershipCo - Practitioner Portal',
      html: `
        <div style="font-family: -apple-system, sans-serif; max-width: 520px; margin: 0 auto; padding: 40px 24px; background: #0c1222; color: #f0f2f8;">
          <div style="text-align: center; margin-bottom: 32px;">
            <div style="display: inline-block; background: linear-gradient(135deg, #d4af37, #f5d76e); width: 48px; height: 48px; border-radius: 12px; line-height: 48px; font-size: 20px; font-weight: bold; color: #0c1222;">L</div>
            <h1 style="font-size: 22px; margin: 16px 0 4px; color: #f0f2f8;">Welcome to LeadershipCo</h1>
            <p style="color: #94a3c4; font-size: 14px; margin: 0;">Practitioner Portal</p>
          </div>
          <p style="color: #94a3c4; font-size: 14px; line-height: 1.7;">Hi ${body.full_name},</p>
          <p style="color: #94a3c4; font-size: 14px; line-height: 1.7;">
            You've been added to the LeadershipCo Practitioner Portal as a <strong style="color: #d4af37;">${body.role}</strong>.
            Click below to set up your account and get started.
          </p>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${loginUrl}" style="display: inline-block; background: linear-gradient(135deg, #d4af37, #f5d76e); color: #0c1222; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-weight: 700; font-size: 14px;">
              Set Up Your Account
            </a>
          </div>
          <p style="color: #5b6b8a; font-size: 12px; text-align: center; margin-top: 40px; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 20px;">
            If you didn't expect this email, you can safely ignore it.
          </p>
        </div>
      `,
    });
  } catch (emailErr) {
    console.error('Failed to send welcome email:', emailErr);
  }

  return NextResponse.json({ success: true, userId: authUser.user.id });
}

async function handleResendInvite(body: any) {
  const admin = createAdminClient();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  const { data: linkData, error: linkError } = await admin.auth.admin.generateLink({
    type: 'magiclink',
    email: body.email,
    options: {
      redirectTo: `${appUrl}/portal/api/auth/callback?next=/portal/dashboard/settings`,
    },
  });

  if (linkError) throw linkError;

  const loginUrl = linkData?.properties?.action_link || `${appUrl}/portal/login`;

  try {
    await getResend().emails.send({
      from: 'LeadershipCo <onboarding@resend.dev>',
      to: body.email,
      subject: 'Your LeadershipCo Invite - Set Up Your Account',
      html: `
        <div style="font-family: -apple-system, sans-serif; max-width: 520px; margin: 0 auto; padding: 40px 24px; background: #0c1222; color: #f0f2f8;">
          <div style="text-align: center; margin-bottom: 32px;">
            <div style="display: inline-block; background: linear-gradient(135deg, #d4af37, #f5d76e); width: 48px; height: 48px; border-radius: 12px; line-height: 48px; font-size: 20px; font-weight: bold; color: #0c1222;">L</div>
            <h1 style="font-size: 22px; margin: 16px 0 4px; color: #f0f2f8;">Welcome to LeadershipCo</h1>
            <p style="color: #94a3c4; font-size: 14px; margin: 0;">Practitioner Portal</p>
          </div>
          <p style="color: #94a3c4; font-size: 14px; line-height: 1.7;">Hi ${body.full_name || 'there'},</p>
          <p style="color: #94a3c4; font-size: 14px; line-height: 1.7;">
            You've been invited to join the LeadershipCo Practitioner Portal. Click below to set up your account and get started.
          </p>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${loginUrl}" style="display: inline-block; background: linear-gradient(135deg, #d4af37, #f5d76e); color: #0c1222; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-weight: 700; font-size: 14px;">
              Set Up Your Account
            </a>
          </div>
          <p style="color: #5b6b8a; font-size: 12px; text-align: center; margin-top: 40px; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 20px;">
            If you didn't expect this email, you can safely ignore it.
          </p>
        </div>
      `,
    });
  } catch (emailErr) {
    console.error('Failed to resend invite:', emailErr);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

async function handleRemoveUser(body: any) {
  const admin = createAdminClient();
  const { error } = await admin.auth.admin.deleteUser(body.userId);
  if (error) throw error;
  return NextResponse.json({ success: true });
}

async function handleSendInvitations(body: any) {
  const admin = createAdminClient();

  const { data: program } = await admin.from('programs').select('*').eq('id', body.programId).single();
  if (!program) throw new Error('Program not found');

  const { data: assignments } = await admin
    .from('program_assignments')
    .select('*, practitioner:profiles(*)')
    .eq('program_id', body.programId)
    .in('practitioner_id', body.practitionerIds)
    .eq('status', 'invited');

  if (!assignments || assignments.length === 0) {
    return NextResponse.json({ success: true, sent: 0 });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const customMessage = body.customMessage || '';

  for (const assignment of assignments) {
    const inviteUrl = `${appUrl}/portal/invitation/${assignment.invitation_token}`;
    const practitioner = assignment.practitioner as any;

    const personalizedMessage = customMessage
      .replace(/{name}/g, practitioner.full_name)
      .replace(/{program}/g, program.name)
      .replace(/{role}/g, assignment.role_in_program)
      .replace(/{dates}/g, `${program.start_date} to ${program.end_date}`)
      .replace(/{location}/g, program.location || 'TBD');

    const messageHtml = personalizedMessage
      ? personalizedMessage.split('\n').map((line: string) =>
          line.trim() ? `<p style="color: #94a3c4; font-size: 14px; line-height: 1.7; margin: 4px 0;">${line}</p>` : '<br/>'
        ).join('')
      : `<p style="color: #94a3c4; font-size: 14px; line-height: 1.7;">
          Hi ${practitioner.full_name}, you've been invited to join
          <strong style="color: #d4af37;">${program.name}</strong> as a
          <strong style="color: #f0f2f8;">${assignment.role_in_program} practitioner</strong>.
        </p>`;

    try {
      await getResend().emails.send({
        from: 'LeadershipCo <onboarding@resend.dev>',
        to: practitioner.email,
        subject: `Program Invitation: ${program.name} - LeadershipCo`,
        html: `
          <div style="font-family: -apple-system, sans-serif; max-width: 520px; margin: 0 auto; padding: 40px 24px; background: #0c1222; color: #f0f2f8;">
            <div style="text-align: center; margin-bottom: 32px;">
              <div style="display: inline-block; background: linear-gradient(135deg, #d4af37, #f5d76e); width: 48px; height: 48px; border-radius: 12px; line-height: 48px; font-size: 20px; font-weight: bold; color: #0c1222;">L</div>
              <h1 style="font-size: 22px; margin: 16px 0 4px; color: #f0f2f8;">You're Invited</h1>
              <p style="color: #94a3c4; font-size: 14px; margin: 0;">LeadershipCo Program Invitation</p>
            </div>
            ${messageHtml}
            <div style="background: #162038; border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 24px; margin: 24px 0;">
              <h2 style="font-size: 18px; color: #f0f2f8; margin: 0 0 12px;">${program.name}</h2>
              <p style="color: #94a3c4; font-size: 13px; margin: 4px 0;">📅 ${program.start_date} to ${program.end_date}</p>
              ${program.location ? `<p style="color: #94a3c4; font-size: 13px; margin: 4px 0;">📍 ${program.location}</p>` : ''}
              ${program.description ? `<p style="color: #5b6b8a; font-size: 13px; margin: 8px 0 0;">${program.description}</p>` : ''}
            </div>
            <div style="text-align: center; margin: 32px 0;">
              <a href="${inviteUrl}" style="display: inline-block; background: linear-gradient(135deg, #d4af37, #f5d76e); color: #0c1222; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-weight: 700; font-size: 14px;">
                View &amp; Respond
              </a>
            </div>
            <p style="color: #5b6b8a; font-size: 12px; text-align: center; margin-top: 40px; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 20px;">
              Click the button above to accept or decline this invitation.
            </p>
          </div>
        `,
      });
    } catch (emailErr) {
      console.error(`Failed to send invite to ${practitioner.email}:`, emailErr);
    }
  }

  return NextResponse.json({ success: true, sent: assignments.length });
}
