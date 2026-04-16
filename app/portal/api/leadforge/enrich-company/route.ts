import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

export async function POST(req: NextRequest) {
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  try {
    const { domain, company_name } = await req.json();
    const resolvedDomain = domain?.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '') || null;
    const identifier = company_name?.trim() || resolvedDomain;
    if (!identifier) return NextResponse.json({ found: false });

    const msg = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 600,
      messages: [{
        role: 'user',
        content: `You are a business research expert. Provide accurate, specific information about the company: "${identifier}".

Reply ONLY with a JSON object — no markdown, no explanation:
{
  "domain": "example.com",
  "industry": "e.g. Manufacturing, Technology, Healthcare, Financial Services",
  "headcount": 50000,
  "description": "2-3 sentences: what they make/do, their market position, and recent strategic direction.",
  "founded_year": 1908,
  "hq_location": "City, State/Country",
  "key_challenges": "2-3 sentences on the leadership and organizational challenges this company likely faces right now — things like integration after M&A, talent retention pressure, digital transformation of their workforce, succession planning, or culture change. Frame these as buying signals for an executive coaching and leadership development firm."
}

Use null for any fields you are not confident about. headcount must be a number, not a string.`,
      }],
    });

    const text = msg.content[0].type === 'text' ? msg.content[0].text : '{}';
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return NextResponse.json({ found: false });

    const data = JSON.parse(match[0]);
    return NextResponse.json({
      found: true,
      domain: data.domain ?? resolvedDomain,
      industry: data.industry ?? null,
      headcount: typeof data.headcount === 'number' ? data.headcount : null,
      description: data.description ?? null,
      founded_year: data.founded_year ?? null,
      hq_location: data.hq_location ?? null,
      key_challenges: data.key_challenges ?? null,
    });
  } catch (err: any) {
    console.error('Company enrich error:', err);
    return NextResponse.json({ error: err.message ?? 'Enrichment failed.' }, { status: 500 });
  }
}
