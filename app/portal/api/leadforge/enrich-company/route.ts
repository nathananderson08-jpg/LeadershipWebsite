import { NextRequest, NextResponse } from 'next/server';
import { enrichCompany, findOrganization } from '@/lib/integrations/apollo';

export async function POST(req: NextRequest) {
  try {
    const { domain, company_name } = await req.json();

    let resolvedDomain = domain?.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '') || null;

    // Step 1: try findOrganization by name — returns industry + headcount directly
    if (company_name?.trim()) {
      const org = await findOrganization(company_name.trim());
      if (org) {
        // Use domain from org if we don't have one
        if (!resolvedDomain && org.primary_domain) resolvedDomain = org.primary_domain;

        // Return org data directly — no need for second enrichCompany call
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

    // Step 2: if we have a domain but no org match, try enrichCompany
    if (resolvedDomain) {
      const orgData = await enrichCompany(resolvedDomain);
      if (orgData) {
        return NextResponse.json({
          found: true,
          domain: resolvedDomain,
          industry: orgData.industry ?? null,
          headcount: orgData.estimated_num_employees ?? null,
          description: orgData.short_description ?? null,
          linkedin_url: orgData.linkedin_url ?? null,
          founded_year: orgData.founded_year ?? null,
        });
      }
    }

    return NextResponse.json({ found: false });
  } catch (err: any) {
    console.error('Company enrich error:', err);
    return NextResponse.json({ error: err.message ?? 'Enrichment failed.' }, { status: 500 });
  }
}
