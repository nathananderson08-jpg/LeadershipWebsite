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
    const res = await apollo<any>(
      'POST',
      '/mixed_companies/api_search',
      {
        q_organization_fuzzy_name: q,
        page: 1,
        per_page: 8,
      }
    );
    // Log raw keys so we can see what Apollo actually returns
    console.log('[org-search] Apollo raw keys:', Object.keys(res));
    const rawList: ApolloOrgMatch[] = res.companies ?? res.organizations ?? res.accounts ?? res.results ?? [];
    const orgs = rawList.map(o => ({
      id: o.id,
      name: o.name,
      domain: o.primary_domain,
      headcount: o.estimated_num_employees,
      industry: o.industry,
    }));
    return NextResponse.json({ orgs, _debug_keys: Object.keys(res) });
  } catch (err: any) {
    console.error('[org-search] Apollo error:', err.message);
    return NextResponse.json({ orgs: [], _debug_error: err.message });
  }
}
