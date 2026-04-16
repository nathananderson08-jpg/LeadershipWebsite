import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createAdminClient } from '@/lib/portal/supabase-server';
import { FIRM_NAME } from '@/lib/constants';

export async function POST(req: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const { to_email, to_name, subject, body, prospect_id, account_id, sender_name } = await req.json();

    if (!to_email?.trim() || !subject?.trim() || !body?.trim()) {
      return NextResponse.json({ error: 'to_email, subject, and body are required.' }, { status: 400 });
    }

    const firstName = to_name?.split(' ')[0] ?? to_name ?? '';
    const htmlBody = body.split('\n').map((line: string) =>
      line.trim()
        ? `<p style="color:rgba(255,255,255,0.8);font-size:14px;line-height:1.75;margin:0 0 12px;">${line}</p>`
        : '<br/>'
    ).join('');

    const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0c1222;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
<div style="max-width:560px;margin:0 auto;padding:32px 16px;">
  <div style="text-align:center;margin-bottom:28px;">
    <p style="font-size:11px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#5dab79;margin:0;">${FIRM_NAME}</p>
  </div>
  <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:28px 32px;">
    ${htmlBody}
    <div style="margin-top:24px;padding-top:20px;border-top:1px solid rgba(255,255,255,0.08);">
      <p style="color:rgba(255,255,255,0.5);font-size:13px;margin:0;">${sender_name ?? 'The Team'}</p>
      <p style="color:rgba(255,255,255,0.3);font-size:12px;margin:4px 0 0;">${FIRM_NAME}</p>
    </div>
  </div>
  <p style="color:rgba(255,255,255,0.2);font-size:11px;text-align:center;margin-top:24px;">
    You are receiving this because of your professional connection with ${FIRM_NAME}.
  </p>
</div>
</body></html>`;

    await resend.emails.send({
      from: `${FIRM_NAME} <onboarding@resend.dev>`,
      to: to_email.trim(),
      subject: subject.trim(),
      html,
    });

    // Log as a trigger event
    if (prospect_id || account_id) {
      const supabase = createAdminClient();
      await supabase.from('leadforge_trigger_events').insert({
        account_id: account_id ?? null,
        prospect_id: prospect_id ?? null,
        event_type: 'outreach',
        description: `Email sent: "${subject.trim()}"`,
        priority: 'medium',
        detected_at: new Date().toISOString(),
        response_status: 'pending',
        acted_on: true,
      });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Send email error:', err);
    return NextResponse.json({ error: err.message ?? 'Failed to send.' }, { status: 500 });
  }
}
