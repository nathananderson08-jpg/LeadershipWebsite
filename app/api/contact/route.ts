import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { FIRM_NAME, FIRM_EMAIL } from '@/lib/constants';

export async function POST(req: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const { inquiry_type, full_name, email, company, role, message } = await req.json();

    if (!full_name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json({ error: 'Name, email, and message are required.' }, { status: 400 });
    }

    await resend.emails.send({
      from: `${FIRM_NAME} Website <onboarding@resend.dev>`,
      to: FIRM_EMAIL,
      replyTo: email.trim(),
      subject: `[${inquiry_type ?? 'General Inquiry'}] New inquiry from ${full_name.trim()}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; color: #1a1a2e;">
          <h2 style="margin-bottom: 4px;">${full_name.trim()}</h2>
          <p style="color: #888; margin-top: 0;">${inquiry_type ?? 'General Inquiry'}</p>
          <table style="border-collapse: collapse; width: 100%; margin-bottom: 24px;">
            <tr><td style="padding: 6px 0; color: #666; width: 100px;">Email</td><td><a href="mailto:${email.trim()}">${email.trim()}</a></td></tr>
            ${company?.trim() ? `<tr><td style="padding: 6px 0; color: #666;">Company</td><td>${company.trim()}</td></tr>` : ''}
            ${role?.trim() ? `<tr><td style="padding: 6px 0; color: #666;">Role</td><td>${role.trim()}</td></tr>` : ''}
          </table>
          <div style="background: #f9f7f4; border-radius: 8px; padding: 16px; white-space: pre-wrap; line-height: 1.6;">${message.trim()}</div>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Contact form error:', err);
    return NextResponse.json({ error: err.message ?? 'Failed to send.' }, { status: 500 });
  }
}
