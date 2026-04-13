import { NextRequest, NextResponse } from 'next/server';
import { apollo, type ApolloOrgMatch } from '@/lib/integrations/apollo';

/**
 * GET /portal/api/leadforge/org-search?q=johnson
 * Returns up to 8 Apollo org matches for autocomplete.
 */
export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.trim();
  if (!q || q.length < 2) return NextResponse.json({ orgs: [] });

  try {
    const res = await apollo<{ organizations?: ApolloOrgMatch[] }>(
      'POST',
      '/organizations/search',
      {
        q_organization_name: q,
        page: 1,
        per_page: 8,
      }
    );
    const orgs = (res.organizations ?? []).map(o => ({
      id: o.id,
      name: o.name,
      domain: o.primary_domain,
      headcount: o.estimated_num_employees,
      industry: o.industry,
    }));
    return NextResponse.json({ orgs });
  } catch (err: any) {
    return NextResponse.json({ orgs: [] });
  }
}
