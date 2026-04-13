import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { prospect, content_type, kb_context } = await req.json();

    if (!prospect || !content_type) {
      return NextResponse.json({ error: 'prospect and content_type are required.' }, { status: 400 });
    }

    const company = prospect.account?.company_name ?? 'their company';
    const context = [
      prospect.trigger_context && `Trigger context: ${prospect.trigger_context}`,
      prospect.notes && `Background notes: ${prospect.notes}`,
      prospect.pipeline_stage && `Pipeline stage: ${prospect.pipeline_stage}`,
    ].filter(Boolean).join('\n');

    const firmContext = `You are writing on behalf of a senior leadership consulting firm that specialises in executive development, CHRO advisory, leadership program design, and organisational transformation. The firm works with Fortune 500 and mid-market companies. Tone: insightful, peer-level, never salesy. No buzzwords. No generic compliments.`;

    const firmContextWithKB = kb_context
      ? `${firmContext}\n\nFIRM KNOWLEDGE BASE — use this to ground your output in the firm's actual IP, methodologies, and case studies:\n${kb_context}`
      : firmContext;

    let prompt = '';
    let titleHint = '';

    if (content_type === 'micro_research') {
      titleHint = `90-Day Priorities Brief — ${prospect.full_name}, ${company}`;
      prompt = `${firmContextWithKB}

Write a "Micro-Research Brief" for ${prospect.full_name}, ${prospect.title ?? 'senior leader'} at ${company}.

${context}

The brief should read like insider intelligence — the kind of thing a trusted advisor would send. Structure it as:

**EXECUTIVE SNAPSHOT**
2–3 sentences on who they are, their mandate, and what they're likely facing right now.

**THE BIG 3 PRIORITIES**
Three specific challenges or opportunities that someone in this role at this company is almost certainly navigating. Be specific — reference industry dynamics, company signals, common patterns for new leaders in this seat.

**WHERE WE ADD VALUE**
2–3 precise ways our work maps to their priorities. Specific, not generic.

**CONVERSATION STARTER**
One sharp, non-salesy question that would be genuinely interesting to a senior exec in this role. Should provoke thinking, not pitch a service.

Keep it to ~350 words. Write in first person plural (we/our) from the firm's perspective.`;

    } else if (content_type === 'email_sequence') {
      titleHint = `First-Touch Email — ${prospect.full_name}`;
      prompt = `${firmContextWithKB}

Write a first-touch outreach email to ${prospect.full_name}, ${prospect.title ?? 'senior leader'} at ${company}.

${context}

Requirements:
- Subject line that doesn't sound like marketing
- Open with a specific, relevant observation — not a generic compliment
- 3–4 sentences max body — respect their time
- One clear, low-commitment CTA (15-min call, share a brief, ask a question)
- No attachments, no "I hope this finds you well", no "I wanted to reach out"
- Signed from a senior partner perspective

Format:
Subject: [subject line]

[body]

[sign-off]`;

    } else if (content_type === 'linkedin_post') {
      titleHint = `LinkedIn Message — ${prospect.full_name}`;
      prompt = `${firmContextWithKB}

Write a LinkedIn connection request message + follow-up message for ${prospect.full_name}, ${prospect.title ?? 'senior leader'} at ${company}.

${context}

Format as two separate messages:

**CONNECTION REQUEST (300 chars max):**
[message — specific, warm, no pitch]

**FOLLOW-UP MESSAGE (after they accept):**
[3–4 sentences — add value, reference something specific, soft CTA]`;

    } else if (content_type === 'executive_summary') {
      titleHint = `Account Brief — ${company}`;
      prompt = `${firmContextWithKB}

Write an internal account brief for ${company}, focused on ${prospect.full_name} (${prospect.title ?? 'key contact'}) as the primary contact.

${context}

Structure:
**COMPANY SITUATION** — What's happening at ${company} that creates leadership development urgency right now?
**CONTACT PROFILE** — Who is ${prospect.full_name}, what's their mandate, what do they care about?
**OPPORTUNITY THESIS** — Why is now the right moment to engage? What's the entry point?
**RECOMMENDED APPROACH** — Sequence of touches: what to send, when, what to say
**RISKS / WATCH-OUTS** — What could kill this deal or slow it down?

Write for internal use — honest, direct, strategic.`;

    } else if (content_type === 'comment_draft') {
      titleHint = `LinkedIn Comment Draft — ${prospect.full_name}`;
      prompt = `${firmContextWithKB}

Write 3 LinkedIn comment options for posts that ${prospect.full_name}, ${prospect.title ?? 'senior leader'} at ${company} might publish.

${context}

Each comment should:
- Be substantive (2–4 sentences), not just "great post!"
- Add a distinct perspective or follow-on insight
- Optionally end with a genuine question
- Sound like a peer, not a vendor

Label them Option A, B, C with a note on what type of post each fits best.`;
    }

    const message = await client.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 1500,
      messages: [{ role: 'user', content: prompt }],
    });

    const body = message.content[0].type === 'text' ? message.content[0].text : '';

    return NextResponse.json({ title: titleHint, body });
  } catch (err: any) {
    console.error('LeadForge generate error:', err);
    return NextResponse.json({ error: err.message ?? 'Generation failed.' }, { status: 500 });
  }
}
