import { NextRequest, NextResponse } from 'next/server';
import { enrichCompany } from '@/lib/integrations/apollo';

export async function POST(req: NextRequest) {
  try {
    const { domain } = await req.json();
    if (!domain?.trim()) {
      return NextResponse.json({ error: 'domain is required.' }, { status: 400 });
    }

    const org = await enrichCompany(domain.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, ''));
    if (!org) {
      return NextResponse.json({ found: false });
    }

    return NextResponse.json({
      found: true,
      industry: org.industry ?? null,
      headcount: org.estimated_num_employees ?? null,
      description: org.short_description ?? null,
      linkedin_url: org.linkedin_url ?? null,
      founded_year: org.founded_year ?? null,
    });
  } catch (err: any) {
    console.error('Company enrich error:', err);
    return NextResponse.json({ error: err.message ?? 'Enrichment failed.' }, { status: 500 });
  }
}
