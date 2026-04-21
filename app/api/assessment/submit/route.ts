import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { Resend } from 'resend';
import { createAdminClient } from '@/lib/portal/supabase-server';
import { FIRM_NAME } from '@/lib/constants';

let _anthropic: Anthropic | null = null;
let _resend: InstanceType<typeof Resend> | null = null;

function getAnthropic() {
  if (!_anthropic) _anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  return _anthropic;
}

function getResend() {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY);
  return _resend;
}


// ── Helpers ──────────────────────────────────────────────────────────────────

function headcountFromRange(range: string | null): number | null {
  if (!range) return null;
  const map: Record<string, number> = {
    '50-250':     150,
    '250-1000':   500,
    '1000-5000':  2500,
    '5000-20000': 10000,
    '20000+':     50000,
  };
  return map[range] ?? null;
}

function calcIcpScore(title: string | null, headcount_range: string | null): number {
  let score = 55;
  const t = (title ?? '').toLowerCase();
  if (t.includes('chro') || t.includes('chief people') || t.includes('chief hr') || t.includes('cpo') || t.includes('clo')) score = 95;
  else if (t.includes('chief') || t.includes('ceo') || t.includes('coo') || t.includes('cfo') || t.includes('cto') || t.includes('cmo') || t.includes('president')) score = 88;
  else if ((t.includes('vp') || t.includes('vice president')) && (t.includes('hr') || t.includes('people') || t.includes('talent'))) score = 82;
  else if (t.includes('vp') || t.includes('vice president') || t.includes('svp')) score = 74;
  else if (t.includes('director') && (t.includes('hr') || t.includes('people') || t.includes('talent'))) score = 67;
  else if (t.includes('director')) score = 60;
  if (headcount_range === '20000+') score = Math.min(100, score + 10);
  else if (headcount_range === '5000-20000') score = Math.min(100, score + 6);
  else if (headcount_range === '1000-5000') score = Math.min(100, score + 3);
  return score;
}

// ── Claude report generation ──────────────────────────────────────────────────

async function generateReport(input: {
  company_name: string;
  industry: string | null;
  headcount_range: string | null;
  full_name: string;
  title: string | null;
  challenge: string | null;
  focus_areas: string[] | null;
}): Promise<Record<string, any>> {
  const { company_name, industry, headcount_range, full_name, title, challenge, focus_areas } = input;

  const prompt = `You are a senior leadership development consultant at ${FIRM_NAME}, a premier executive coaching and leadership consulting firm working with Fortune 500 companies and high-growth mid-market organizations.

Generate a personalized Leadership Readiness Assessment for an inbound inquiry. Make it substantive and genuinely valuable — like a real consulting deliverable, not generic advice.

COMPANY: ${company_name}
INDUSTRY: ${industry ?? 'Not specified'}
COMPANY SIZE: ${headcount_range ?? 'Not specified'}
CONTACT: ${full_name}${title ? `, ${title}` : ''}
PRIMARY CHALLENGE: ${challenge ?? 'General leadership development'}
FOCUS AREAS: ${focus_areas?.join(', ') ?? 'Not specified'}

Respond ONLY with this JSON (no markdown fences, no preamble):
{
  "headline": "One sharp, specific sentence summarizing the core leadership opportunity for this company right now",
  "executive_summary": "3-4 sentences: their likely situation given industry + size + stated challenge, what the leadership risk looks like if unaddressed, and the single most critical priority",
  "leadership_profile": {
    "industry_context": "2 sentences on how this industry uniquely shapes leadership demands — be specific about sector dynamics, not generic",
    "maturity_stage": "Foundational OR Developing OR Established OR Leading",
    "maturity_description": "1-2 sentences explaining what that stage means for their specific situation"
  },
  "opportunity_areas": [
    {
      "title": "Short title (3-6 words)",
      "description": "2-3 sentences: what the gap typically looks like at this size/industry, why it creates compounding risk, what leading organizations do differently",
      "urgency": "high"
    },
    {
      "title": "Short title",
      "description": "2-3 sentences",
      "urgency": "medium"
    },
    {
      "title": "Short title",
      "description": "2-3 sentences",
      "urgency": "medium"
    }
  ],
  "recommended_focus": "2-3 sentences: the single most important area to address first, and why — grounded in their specific situation, not generic best practices",
  "next_steps": [
    { "action": "Specific, concrete action (not vague)", "why": "Why this specifically for their situation" },
    { "action": "Specific, concrete action", "why": "Why this specifically" },
    { "action": "Specific, concrete action", "why": "Why this specifically" }
  ],
  "engagement_suggestion": "1-2 sentences: a specific, credible suggestion for how ${FIRM_NAME} could support their top priority — tied to their stated challenge, name a specific service type (e.g. CHRO advisory, leadership diagnostic, succession architecture)"
}`;

  const msg = await getAnthropic().messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1800,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = msg.content[0].type === 'text' ? msg.content[0].text : '{}';
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('Claude returned invalid JSON');
  return JSON.parse(match[0]);
}

// ── Resend email ──────────────────────────────────────────────────────────────

async function sendReportEmail(params: {
  full_name: string;
  email: string;
  company_name: string;
  report: Record<string, any>;
}) {
  const { full_name, email, company_name, report } = params;
  const firstName = full_name.split(' ')[0];

  const opportunityRows = (report.opportunity_areas ?? [])
    .map((o: any) => `
      <tr>
        <td style="padding:16px 20px;border-bottom:1px solid rgba(255,255,255,0.06);">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;">
            <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${o.urgency === 'high' ? '#ef4444' : '#f59e0b'};flex-shrink:0;"></span>
            <strong style="color:#e8f5ed;font-size:14px;">${o.title}</strong>
          </div>
          <p style="color:rgba(232,245,237,0.7);font-size:13px;margin:0;line-height:1.6;padding-left:18px;">${o.description}</p>
        </td>
      </tr>`).join('');

  const nextStepRows = (report.next_steps ?? [])
    .map((s: any, i: number) => `
      <tr>
        <td style="padding:12px 20px;border-bottom:1px solid rgba(255,255,255,0.05);">
          <div style="display:flex;gap:12px;align-items:flex-start;">
            <span style="display:inline-flex;align-items:center;justify-content:center;width:22px;height:22px;border-radius:50%;background:#5dab79;color:white;font-size:11px;font-weight:700;flex-shrink:0;margin-top:1px;">${i + 1}</span>
            <div>
              <p style="color:#e8f5ed;font-size:13px;font-weight:600;margin:0 0 3px;">${s.action}</p>
              <p style="color:rgba(232,245,237,0.6);font-size:12px;margin:0;line-height:1.5;">${s.why}</p>
            </div>
          </div>
        </td>
      </tr>`).join('');

  const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0c1222;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
<div style="max-width:560px;margin:0 auto;padding:32px 16px;">

  <!-- Header -->
  <div style="text-align:center;margin-bottom:32px;">
    <p style="font-size:11px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#5dab79;margin:0 0 8px;">${FIRM_NAME}</p>
    <h1 style="color:#ffffff;font-size:22px;font-weight:800;margin:0 0 6px;">Your Leadership Readiness Report</h1>
    <p style="color:rgba(255,255,255,0.5);font-size:13px;margin:0;">${company_name}</p>
  </div>

  <!-- Greeting -->
  <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:20px 24px;margin-bottom:20px;">
    <p style="color:rgba(255,255,255,0.85);font-size:14px;margin:0 0 12px;">Hi ${firstName},</p>
    <p style="color:rgba(255,255,255,0.65);font-size:13px;margin:0;line-height:1.7;">Thank you for completing your assessment. Below is your personalized Leadership Readiness Report for <strong style="color:rgba(255,255,255,0.85);">${company_name}</strong>.</p>
  </div>

  <!-- Headline -->
  <div style="background:linear-gradient(135deg,rgba(93,171,121,0.15),rgba(93,171,121,0.05));border:1px solid rgba(93,171,121,0.3);border-radius:12px;padding:20px 24px;margin-bottom:20px;">
    <p style="font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#5dab79;margin:0 0 8px;">Key Finding</p>
    <p style="color:#e8f5ed;font-size:15px;font-weight:600;margin:0;line-height:1.5;">${report.headline ?? ''}</p>
  </div>

  <!-- Executive Summary -->
  <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:20px 24px;margin-bottom:20px;">
    <p style="font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:rgba(255,255,255,0.4);margin:0 0 10px;">Executive Summary</p>
    <p style="color:rgba(255,255,255,0.75);font-size:14px;margin:0;line-height:1.7;">${report.executive_summary ?? ''}</p>
  </div>

  <!-- Maturity Stage -->
  ${report.leadership_profile ? `
  <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:20px 24px;margin-bottom:20px;">
    <p style="font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:rgba(255,255,255,0.4);margin:0 0 10px;">Leadership Maturity</p>
    <div style="display:inline-block;padding:4px 14px;border-radius:999px;background:rgba(93,171,121,0.15);border:1px solid rgba(93,171,121,0.3);font-size:12px;font-weight:700;color:#5dab79;margin-bottom:10px;">${report.leadership_profile.maturity_stage ?? ''}</div>
    <p style="color:rgba(255,255,255,0.65);font-size:13px;margin:0 0 10px;line-height:1.6;">${report.leadership_profile.maturity_description ?? ''}</p>
    <p style="color:rgba(255,255,255,0.5);font-size:12px;margin:0;line-height:1.6;">${report.leadership_profile.industry_context ?? ''}</p>
  </div>` : ''}

  <!-- Opportunity Areas -->
  <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:12px;overflow:hidden;margin-bottom:20px;">
    <div style="padding:16px 20px;border-bottom:1px solid rgba(255,255,255,0.08);">
      <p style="font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:rgba(255,255,255,0.4);margin:0;">Key Opportunity Areas</p>
    </div>
    <table style="width:100%;border-collapse:collapse;">${opportunityRows}</table>
  </div>

  <!-- Recommended Focus -->
  ${report.recommended_focus ? `
  <div style="background:rgba(212,175,55,0.08);border:1px solid rgba(212,175,55,0.25);border-radius:12px;padding:20px 24px;margin-bottom:20px;">
    <p style="font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#d4af37;margin:0 0 10px;">Recommended Focus</p>
    <p style="color:rgba(255,255,255,0.8);font-size:14px;margin:0;line-height:1.7;">${report.recommended_focus}</p>
  </div>` : ''}

  <!-- Next Steps -->
  <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:12px;overflow:hidden;margin-bottom:20px;">
    <div style="padding:16px 20px;border-bottom:1px solid rgba(255,255,255,0.08);">
      <p style="font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:rgba(255,255,255,0.4);margin:0;">Suggested Next Steps</p>
    </div>
    <table style="width:100%;border-collapse:collapse;">${nextStepRows}</table>
  </div>

  <!-- CTA -->
  <div style="text-align:center;padding:24px;background:rgba(93,171,121,0.08);border:1px solid rgba(93,171,121,0.2);border-radius:12px;margin-bottom:28px;">
    <p style="color:rgba(255,255,255,0.85);font-size:14px;font-weight:600;margin:0 0 6px;">Ready to act on these insights?</p>
    <p style="color:rgba(255,255,255,0.5);font-size:13px;margin:0 0 16px;line-height:1.5;">${report.engagement_suggestion ?? 'Speak with one of our senior advisors to explore how we can support your priorities.'}</p>
    <a href="${process.env.NEXT_PUBLIC_APP_URL ?? ''}/contact" style="display:inline-block;padding:12px 28px;background:#5dab79;color:white;text-decoration:none;border-radius:8px;font-size:13px;font-weight:700;">Book a Conversation →</a>
  </div>

  <p style="color:rgba(255,255,255,0.25);font-size:11px;text-align:center;line-height:1.6;margin:0;">
    This report was generated based on your assessment responses and industry benchmarks. For a comprehensive diagnostic, contact us for a full leadership review.<br/>
    © ${new Date().getFullYear()} ${FIRM_NAME}
  </p>
</div>
</body></html>`;

  await getResend().emails.send({
    from: `${FIRM_NAME} <onboarding@resend.dev>`,
    to: email,
    subject: `Your Leadership Readiness Report — ${company_name}`,
    html,
  });
}

// ── Route handler ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { company_name, industry, headcount_range, full_name, title, email, challenge, focus_areas } = body;

    if (!company_name?.trim() || !full_name?.trim() || !email?.trim()) {
      return NextResponse.json({ error: 'company_name, full_name, and email are required.' }, { status: 400 });
    }

    const emailLower = email.trim().toLowerCase();

    // Phase 1: run report generation + both DB lookups in parallel
    const supabase = createAdminClient();
    const [report, { data: existingAccount }, { data: existingProspect }] = await Promise.all([
      generateReport({ company_name, industry, headcount_range, full_name, title, challenge, focus_areas }),
      supabase.from('leadforge_accounts').select('id').ilike('company_name', company_name.trim()).maybeSingle(),
      supabase.from('leadforge_prospects').select('id').eq('email', emailLower).maybeSingle(),
    ]);

    // Phase 2: resolve account ID
    let accountId: string;
    if (existingAccount) {
      accountId = existingAccount.id;
      const patch: Record<string, any> = {};
      if (industry) patch.industry = industry;
      const hc = headcountFromRange(headcount_range);
      if (hc) patch.headcount = hc;
      if (Object.keys(patch).length > 0) {
        await supabase.from('leadforge_accounts').update(patch).eq('id', accountId);
      }
    } else {
      const { data: newAccount, error: acctErr } = await supabase
        .from('leadforge_accounts')
        .insert({
          company_name: company_name.trim(),
          industry: industry || null,
          headcount: headcountFromRange(headcount_range),
        })
        .select('id')
        .single();
      if (acctErr) throw acctErr;
      accountId = newAccount.id;
    }

    // Phase 3: resolve prospect ID
    let prospectId: string;

    if (existingProspect) {
      prospectId = existingProspect.id;
      await supabase.from('leadforge_prospects').update({
        account_id: accountId,
        warmth_score: 'warm',
        pipeline_stage: 'identified',
      }).eq('id', prospectId);
    } else {
      const { data: newProspect, error: prospectErr } = await supabase
        .from('leadforge_prospects')
        .insert({
          full_name: full_name.trim(),
          title: title?.trim() || null,
          email: emailLower,
          account_id: accountId,
          icp_score: calcIcpScore(title, headcount_range),
          pipeline_stage: 'identified',
          warmth_score: 'warm',
          trigger_context: `Inbound: completed leadership readiness assessment on website. Primary challenge: ${challenge ?? 'not specified'}.`,
          enrichment_source: 'website_assessment',
        })
        .select('id')
        .single();
      if (prospectErr) throw prospectErr;
      prospectId = newProspect.id;
    }

    // Phase 4: save content + trigger event in parallel
    await Promise.all([
      supabase.from('leadforge_content').insert({
        prospect_id: prospectId,
        content_type: 'assessment_report',
        title: `Leadership Readiness Assessment — ${company_name}`,
        body: JSON.stringify(report),
        status: 'approved',
      }),
      supabase.from('leadforge_trigger_events').insert({
        account_id: accountId,
        event_type: 'inbound_lead',
        description: `${full_name.trim()}${title ? ` (${title})` : ''} completed a free Leadership Readiness Assessment on the website. Primary challenge: "${challenge ?? 'not specified'}". High-intent inbound — recommend outreach within 24 hours.`,
        priority: 'high',
        detected_at: new Date().toISOString(),
        response_status: 'pending',
      }),
    ]);

    // Fire-and-forget email (don't let it fail the response)
    sendReportEmail({ full_name: full_name.trim(), email: emailLower, company_name: company_name.trim(), report }).catch(err => {
      console.error('Assessment email failed:', err);
    });

    return NextResponse.json({ success: true, report, prospect_id: prospectId, account_id: accountId });

  } catch (err: any) {
    console.error('Assessment submit error:', err);
    return NextResponse.json({ error: err.message ?? 'Submission failed.' }, { status: 500 });
  }
}
