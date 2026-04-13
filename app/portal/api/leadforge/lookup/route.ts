import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { findOrganization, searchPeopleByOrgId, searchPeopleAtCompany, emailConfidenceFromStatus, type ApolloPerson } from '@/lib/integrations/apollo';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export interface LookupPerson {
  full_name: string;
  title: string;
  seniority: 'C-Suite' | 'VP' | 'Director' | 'Senior Manager';
  relevance: string;
  linkedin_url: string | null;
  email_guess: string | null;
  email_confidence: 'verified' | 'inferred' | 'unknown';
  email_pattern: string | null;
  apollo_id: string | null;
  source: 'apollo' | 'claude';
}

export interface LookupResult {
  company_name: string;
  domain: string | null;
  email_pattern: string | null;
  headcount_estimate: string | null;
  people: LookupPerson[];
}

function seniorityFromTitle(title: string): LookupPerson['seniority'] {
  const t = title.toLowerCase();
  if (t.includes('chief') || t.includes('cpo') || t.includes('chro') || t.includes('clo') || t.startsWith('c ')) return 'C-Suite';
  if (t.includes('svp') || t.includes('vp ') || t.includes('vice president')) return 'VP';
  if (t.includes('director') || t.includes('head of')) return 'Director';
  return 'Senior Manager';
}

function apolloToLookupPerson(p: ApolloPerson): LookupPerson {
  // api_search may return name as empty string while first_name/last_name are populated
  const fullName = p.name?.trim() || `${p.first_name ?? ''} ${p.last_name ?? ''}`.trim() || '—';
  return {
    full_name: fullName,
    title: p.title ?? '—',
    seniority: seniorityFromTitle(p.title ?? ''),
    relevance: '',
    linkedin_url: p.linkedin_url,
    email_guess: p.email,
    email_confidence: emailConfidenceFromStatus(p.email_status),
    email_pattern: null,
    apollo_id: p.id,
    source: 'apollo',
  };
}

async function getRelevanceFromClaude(
  people: LookupPerson[],
  companyName: string
): Promise<LookupPerson[]> {
  if (!people.length) return people;

  const list = people.map((p, i) => `${i + 1}. ${p.full_name} — ${p.title}`).join('\n');

  const prompt = `You are a B2B sales advisor for a senior leadership consulting firm (executive coaching, CHRO advisory, leadership development programs).

For each person below at ${companyName}, write a 1–2 sentence "why target" — specific, intelligent, no fluff. Reference role urgency, common mandates for this title, or signals that create buying intent.

${list}

Respond ONLY with a JSON array of objects in this exact format:
[{"index": 1, "relevance": "..."}, {"index": 2, "relevance": "..."}, ...]`;

  try {
    const msg = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    });
    const text = msg.content[0].type === 'text' ? msg.content[0].text : '[]';
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) return people;
    const relevances: { index: number; relevance: string }[] = JSON.parse(jsonMatch[0]);
    return people.map((p, i) => ({
      ...p,
      relevance: relevances.find(r => r.index === i + 1)?.relevance ?? '',
    }));
  } catch {
    return people;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();
    if (!query?.trim()) {
      return NextResponse.json({ error: 'Query is required.' }, { status: 400 });
    }

    // Try Apollo first
    let people: LookupPerson[] = [];
    let companyName = query.trim();
    let domain: string | null = null;
    let headcount: string | null = null;
    let emailPattern: string | null = null;
    let apolloWorked = false;

    try {
      // Run org lookup and name-based people search in parallel to save ~1-2s
      const [orgCandidate, namePeopleResult] = await Promise.all([
        findOrganization(query.trim()),
        searchPeopleAtCompany(query.trim()),
      ]);

      const queryLower = query.trim().toLowerCase();
      const org = orgCandidate && (
        orgCandidate.name.toLowerCase().includes(queryLower) ||
        queryLower.includes(orgCandidate.name.toLowerCase()) ||
        (orgCandidate.primary_domain ?? '').toLowerCase().includes(queryLower.replace(/\s+/g, ''))
      ) ? orgCandidate : null;


      let rawPeople: ApolloPerson[] = [];

      if (org) {
        // We have a verified org — fetch by org ID for current-employees-only results
        const orgPeopleResult = await searchPeopleByOrgId(org.id);
        rawPeople = orgPeopleResult.people ?? [];
        companyName = org.name;
        domain = org.primary_domain;
        if (org.estimated_num_employees) headcount = org.estimated_num_employees.toLocaleString();

        // If org_id search returned nothing, use the name search results we already have
        if (rawPeople.length === 0) {
          rawPeople = namePeopleResult.people ?? [];
        }
      } else {
        // No org match — use the name search results already fetched in parallel
        rawPeople = namePeopleResult.people ?? [];
        const firstPerson = rawPeople[0];
        if (firstPerson?.organization) {
          companyName = firstPerson.organization.name ?? query.trim();
          domain = firstPerson.organization.primary_domain;
          const emp = firstPerson.organization.estimated_num_employees;
          if (emp) headcount = emp.toLocaleString();
        }
      }

      // Drop people whose title contains "former" — stale Apollo title data
      rawPeople = rawPeople.filter(p => !p.title?.toLowerCase().includes('former'));

      if (rawPeople.length > 0) {
        apolloWorked = true;

        // Derive email pattern from verified emails
        const verifiedEmails = rawPeople
          .filter(p => p.email && p.email_status === 'verified' && domain)
          .map(p => p.email!);

        if (verifiedEmails.length > 0 && domain) {
          const firstEmail = verifiedEmails[0];
          const local = firstEmail.split('@')[0];
          if (local.includes('.')) emailPattern = 'firstname.lastname@' + domain;
          else emailPattern = 'firstname@' + domain;
        }

        people = rawPeople.map(apolloToLookupPerson);
      }
    } catch (apolloErr: any) {
      console.warn('Apollo lookup failed, falling back to Claude:', apolloErr);
    }

    // If Apollo returned nothing or failed, fall back to Claude
    if (!apolloWorked) {
      const prompt = `You are a B2B sales research assistant for a leadership consulting firm.

Given company name or ticker: "${query.trim()}"

Find 8–10 senior HR/People leaders (CHRO, CPO, VP HR, VP People, CLO, Head of People, etc.) and for each provide:
- Full name, title, seniority (C-Suite/VP/Director/Senior Manager)
- Why they're worth targeting (1-2 sentences, specific to their role)
- Likely LinkedIn URL
- Inferred email based on company email pattern

Respond ONLY with this JSON structure:
{
  "company_name": "...",
  "domain": "...",
  "email_pattern": "firstname.lastname@domain.com",
  "headcount_estimate": "10,000–50,000",
  "people": [
    {
      "full_name": "...", "title": "...", "seniority": "C-Suite",
      "relevance": "...", "linkedin_url": "...", "email_guess": "...",
      "email_confidence": "inferred", "email_pattern": "..."
    }
  ]
}`;

      const msg = await anthropic.messages.create({
        model: 'claude-opus-4-6',
        max_tokens: 2048,
        messages: [{ role: 'user', content: prompt }],
      });

      const text = msg.content[0].type === 'text' ? msg.content[0].text : '';
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        return NextResponse.json({ company_name: null, domain: null, email_pattern: null, headcount_estimate: null, people: [] });
      }

      const claudeResult = JSON.parse(jsonMatch[0]);
      return NextResponse.json({
        ...claudeResult,
        people: (claudeResult.people ?? []).map((p: any) => ({ ...p, apollo_id: null, source: 'claude' })),
      });
    }

    // Skip Claude relevance pass to keep response fast — relevance shown on expand

    return NextResponse.json({
      company_name: companyName,
      domain,
      email_pattern: emailPattern,
      headcount_estimate: headcount,
      people,
    } as LookupResult);

  } catch (err: any) {
    console.error('Lookup error:', err);
    return NextResponse.json({ error: err.message ?? 'Lookup failed.' }, { status: 500 });
  }
}
