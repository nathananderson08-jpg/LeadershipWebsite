import { NextRequest, NextResponse } from 'next/server';
import { enrichCompany, findOrganization } from '@/lib/integrations/apollo';

export async function POST(req: NextRequest) {
  try {
    const { domain, company_name } = await req.json();

    let resolvedDomain = domain?.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '') || null;

    // If no domain provided, try to find org by name to get domain
    if (!resolvedDomain && company_name?.trim()) {
      const org = await findOrganization(company_name.trim());
      if (org?.primary_domain) resolvedDomain = org.primary_domain;
    }

    if (!resolvedDomain) {
      return NextResponse.json({ found: false });
    }

    const orgData = await enrichCompany(resolvedDomain);
    if (!orgData) {
      return NextResponse.json({ found: false });
    }

    return NextResponse.json({
      found: true,
      domain: resolvedDomain,
      industry: orgData.industry ?? null,
      headcount: orgData.estimated_num_employees ?? null,
      description: orgData.short_description ?? null,
      linkedin_url: orgData.linkedin_url ?? null,
      founded_year: orgData.founded_year ?? null,
    });
  } catch (err: any) {
    console.error('Company enrich error:', err);
    return NextResponse.json({ error: err.message ?? 'Enrichment failed.' }, { status: 500 });
  }
}
