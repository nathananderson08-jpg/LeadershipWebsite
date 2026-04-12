import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export interface LookupPerson {
  full_name: string;
  title: string;
  seniority: 'C-Suite' | 'VP' | 'Director' | 'Senior Manager';
  relevance: string;          // why they matter for leadership consulting
  linkedin_url: string | null;
  email_guess: string | null;
  email_confidence: 'inferred' | 'unknown';
  email_pattern: string | null;
}

export interface LookupResult {
  company_name: string;
  domain: string | null;
  email_pattern: string | null;
  headcount_estimate: string | null;
  people: LookupPerson[];
}

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();
    if (!query?.trim()) {
      return NextResponse.json({ error: 'Query is required.' }, { status: 400 });
    }

    const prompt = `You are a B2B sales research assistant helping a leadership consulting firm identify senior HR and People leaders to target.

Given the company name or stock ticker: "${query.trim()}"

Your task:
1. Identify the company (resolve ticker to company name if needed)
2. List the top 8–12 senior HR/People leaders at this company — focus on:
   - CHRO, CPO, Chief People Officer, Chief Talent Officer
   - SVP/VP of HR, Talent, Learning & Development, Organizational Effectiveness, People Operations
   - Head of Leadership Development, Director of Talent Management
   - CLO (Chief Learning Officer)
   DO NOT include general HR managers or non-people-leadership roles.
3. For each person, estimate their likely corporate email based on common patterns at that company
4. Provide their likely LinkedIn URL pattern (linkedin.com/in/firstname-lastname or similar)

Respond ONLY with valid JSON in this exact structure:
{
  "company_name": "Full Company Name",
  "domain": "company.com",
  "email_pattern": "firstname.lastname@company.com",
  "headcount_estimate": "10,000–50,000",
  "people": [
    {
      "full_name": "Jane Smith",
      "title": "Chief People Officer",
      "seniority": "C-Suite",
      "relevance": "Decision maker for all leadership development spend. New in role since Jan 2024 — high urgency window.",
      "linkedin_url": "https://www.linkedin.com/in/jane-smith",
      "email_guess": "jane.smith@company.com",
      "email_confidence": "inferred",
      "email_pattern": "firstname.lastname@company.com"
    }
  ]
}

Seniority levels: "C-Suite", "VP", "Director", "Senior Manager"
email_confidence: "inferred" if you used a pattern, "unknown" if genuinely uncertain

If you cannot identify the company or find relevant people, return:
{ "company_name": null, "domain": null, "email_pattern": null, "headcount_estimate": null, "people": [] }`;

    const message = await client.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 2048,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = message.content[0].type === 'text' ? message.content[0].text : '';

    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: 'Could not parse response.' }, { status: 500 });
    }

    const result: LookupResult = JSON.parse(jsonMatch[0]);
    return NextResponse.json(result);
  } catch (err: any) {
    console.error('LeadForge lookup error:', err);
    return NextResponse.json({ error: err.message ?? 'Lookup failed.' }, { status: 500 });
  }
}
