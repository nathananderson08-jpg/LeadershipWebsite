// Apollo.io API client — server-side only

const BASE = 'https://api.apollo.io/v1';

function headers() {
  return {
    'x-api-key': process.env.APOLLO_API_KEY ?? '',
    'Content-Type': 'application/json',
  };
}

async function apollo<T>(method: string, path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: headers(),
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Apollo ${method} ${path} → ${res.status}: ${err}`);
  }
  return res.json();
}

// ── Types ──────────────────────────────────────────────────────────────────

export interface ApolloPerson {
  id: string;
  name: string;
  first_name: string;
  last_name: string;
  title: string | null;
  email: string | null;
  email_status: string | null; // 'verified', 'unverified', 'likely to engage', etc.
  linkedin_url: string | null;
  organization_name: string | null;
  seniority: string | null;
  departments: string[];
  organization?: {
    id: string;
    name: string;
    website_url: string | null;
    estimated_num_employees: number | null;
    industry: string | null;
    primary_domain: string | null;
  };
}

export interface ApolloSearchResult {
  people: ApolloPerson[];
  pagination: {
    page: number;
    per_page: number;
    total_entries: number;
    total_pages: number;
  };
}

export interface ApolloEnrichResult {
  person: ApolloPerson | null;
}

// ── Organization lookup ────────────────────────────────────────────────────

export interface ApolloOrgMatch {
  id: string;
  name: string;
  primary_domain: string | null;
  estimated_num_employees: number | null;
  industry: string | null;
}

/**
 * Find an organization's Apollo ID by name.
 * Returns null if not found. Uses the exact org ID in downstream people
 * searches so we only get *current* employees, not past ones.
 */
export async function findOrganization(companyName: string): Promise<ApolloOrgMatch | null> {
  try {
    const res = await apollo<{ organizations?: ApolloOrgMatch[]; companies?: ApolloOrgMatch[] }>(
      'POST',
      '/mixed_companies/api_search',
      {
        q_organization_fuzzy_name: companyName,
        page: 1,
        per_page: 1,
      }
    );
    // api_search returns 'companies', legacy returned 'organizations'
    return (res.companies ?? res.organizations)?.[0] ?? null;
  } catch {
    return null;
  }
}

// ── People Search ──────────────────────────────────────────────────────────

const HR_TITLES = [
  'Chief People Officer',
  'Chief Human Resources Officer',
  'CHRO',
  'CPO',
  'Chief Talent Officer',
  'CLO',
  'Chief Learning Officer',
  'SVP Human Resources',
  'SVP People',
  'SVP Talent',
  'VP Human Resources',
  'VP People',
  'VP Talent',
  'VP Learning',
  'VP Organizational',
  'Head of HR',
  'Head of People',
  'Head of Talent',
  'Head of Learning',
  'Director of Human Resources',
  'Director of People',
  'Director of Talent',
  'Director of Learning',
  'Director of Organizational',
];

/**
 * Precise search: uses Apollo organization_ids (current employment only).
 * Much more accurate than the name-based search — only returns people
 * who are *currently* at this org according to Apollo's data.
 */
export async function searchPeopleByOrgId(orgId: string, page = 1): Promise<ApolloSearchResult> {
  return apollo<ApolloSearchResult>('POST', '/mixed_people/api_search', {
    organization_ids: [orgId],
    person_titles: HR_TITLES,
    page,
    per_page: 20,
    prospected_by_current_team: ['no'],
  });
}

/**
 * Fallback: fuzzy name search. Less precise — can return past employees.
 * Only used when findOrganization() returns no match.
 */
export async function searchPeopleAtCompany(companyName: string, page = 1): Promise<ApolloSearchResult> {
  return apollo<ApolloSearchResult>('POST', '/mixed_people/api_search', {
    q_organization_name: companyName,
    person_titles: HR_TITLES,
    page,
    per_page: 20,
    prospected_by_current_team: ['no'],
  });
}

export async function searchPeopleByTicker(ticker: string, page = 1): Promise<ApolloSearchResult> {
  return apollo<ApolloSearchResult>('POST', '/mixed_people/api_search', {
    q_organization_fuzzy_name: ticker,
    person_titles: HR_TITLES,
    page,
    per_page: 15,
    prospected_by_current_team: ['no'],
  });
}

// ── Person Enrichment ──────────────────────────────────────────────────────

/**
 * Enrich up to N people in parallel using /people/match by ID.
 * This is the reliable path to get last_name + linkedin_url on paid plans.
 */
export async function enrichPeopleByIds(people: Pick<ApolloPerson, 'id' | 'first_name' | 'last_name' | 'organization_name'>[], limit = 8): Promise<ApolloPerson[]> {
  if (people.length === 0) return [];
  const batch = people.slice(0, limit);
  const results = await Promise.allSettled(
    batch.map(p =>
      apollo<{ person?: ApolloPerson }>('POST', '/people/match', {
        id: p.id,
        first_name: p.first_name,
        last_name: p.last_name,
        organization_name: p.organization_name,
        reveal_personal_emails: false,
        reveal_phone_number: false,
      })
    )
  );
  return results
    .filter((r): r is PromiseFulfilledResult<{ person?: ApolloPerson }> => r.status === 'fulfilled')
    .map(r => r.value.person)
    .filter((p): p is ApolloPerson => !!p);
}

export async function enrichPerson(props: {
  first_name: string;
  last_name: string;
  organization_name?: string;
  email?: string;
  linkedin_url?: string;
}): Promise<ApolloPerson | null> {
  try {
    const res = await apollo<ApolloEnrichResult>('POST', '/people/match', {
      first_name: props.first_name,
      last_name: props.last_name,
      ...(props.organization_name ? { organization_name: props.organization_name } : {}),
      ...(props.email ? { email: props.email } : {}),
      ...(props.linkedin_url ? { linkedin_url: props.linkedin_url } : {}),
      reveal_personal_emails: true,
    });
    return res.person ?? null;
  } catch {
    return null;
  }
}

// ── Company Enrichment ─────────────────────────────────────────────────────

export interface ApolloOrganization {
  id: string;
  name: string;
  website_url: string | null;
  blog_url: string | null;
  linkedin_url: string | null;
  primary_domain: string | null;
  industry: string | null;
  estimated_num_employees: number | null;
  short_description: string | null;
  founded_year: number | null;
}

export async function enrichCompany(domain: string): Promise<ApolloOrganization | null> {
  try {
    const res = await apollo<{ organization: ApolloOrganization }>('GET', `/organizations/enrich?domain=${encodeURIComponent(domain)}`);
    return res.organization ?? null;
  } catch {
    return null;
  }
}

// ── Email Confidence Helper ────────────────────────────────────────────────

export function emailConfidenceFromStatus(status: string | null): 'verified' | 'inferred' | 'unknown' {
  if (!status) return 'unknown';
  if (status === 'verified') return 'verified';
  if (status === 'likely to engage' || status === 'unverified') return 'inferred';
  return 'unknown';
}
