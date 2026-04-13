import { NextRequest, NextResponse } from 'next/server';
import { findOrganization } from '@/lib/integrations/apollo';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

async function enrichWithClaude(companyName: string, domain: string | null) {
  const identifier = domain ?? companyName;
  const msg = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 300,
    messages: [{
      role: 'user',
      content: `What are the key facts about the company "${identifier}"? Reply ONLY with JSON, no markdown:
{"domain":"example.com","industry":"Technology","headcount":50000,"description":"One sentence about what they do.","founded_year":1990}
Use null for any unknown fields. headcount should be a number.`,
    }],
  });
  const text = msg.content[0].type === 'text' ? msg.content[0].text : '{}';
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return null;
  return JSON.parse(match[0]);
}

export async function POST(req: NextRequest) {
  try {
    const { domain, company_name } = await req.json();

    let resolvedDomain = domain?.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '') || null;

    // Step 1: try Apollo org search (free — no export credits)
    if (company_name?.trim()) {
      const org = await findOrganization(company_name.trim());
      if (org) {
        if (!resolvedDomain && org.primary_domain) resolvedDomain = org.primary_domain;
        return NextResponse.json({
          found: true,
          domain: resolvedDomain,
          industry: org.industry ?? null,
          headcount: org.estimated_num_employees ?? null,
          description: null,
          linkedin_url: null,
          founded_year: null,
        });
      }
    }

    // Step 2: fall back to Claude Haiku — no Apollo credits spent
    const clue = company_name?.trim() || resolvedDomain;
    if (clue) {
      const data = await enrichWithClaude(clue, resolvedDomain);
      if (data) {
        return NextResponse.json({
          found: true,
          domain: data.domain ?? resolvedDomain,
          industry: data.industry ?? null,
          headcount: typeof data.headcount === 'number' ? data.headcount : null,
          description: data.description ?? null,
          linkedin_url: null,
          founded_year: data.founded_year ?? null,
        });
      }
    }

    return NextResponse.json({ found: false });
  } catch (err: any) {
    console.error('Company enrich error:', err);
    return NextResponse.json({ error: err.message ?? 'Enrichment failed.' }, { status: 500 });
  }
}
