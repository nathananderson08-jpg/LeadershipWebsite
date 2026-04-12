// HubSpot API client — server-side only (never import in client components)

const BASE = 'https://api.hubapi.com';

function headers() {
  return {
    'Authorization': `Bearer ${process.env.HUBSPOT_API_KEY}`,
    'Content-Type': 'application/json',
  };
}

async function hs<T>(method: string, path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: headers(),
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`HubSpot ${method} ${path} → ${res.status}: ${err}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

// ── Types ──────────────────────────────────────────────────────────────────

export interface HubSpotContact {
  id: string;
  properties: {
    firstname?: string;
    lastname?: string;
    email?: string;
    jobtitle?: string;
    company?: string;
    linkedin_url?: string;
    hs_lead_status?: string;
    notes_last_updated?: string;
    [key: string]: string | undefined;
  };
}

export interface HubSpotCompany {
  id: string;
  properties: {
    name?: string;
    domain?: string;
    industry?: string;
    numberofemployees?: string;
    [key: string]: string | undefined;
  };
}

export interface HubSpotDeal {
  id: string;
  properties: {
    dealname?: string;
    dealstage?: string;
    pipeline?: string;
    amount?: string;
    closedate?: string;
    [key: string]: string | undefined;
  };
}

// ── Contacts ───────────────────────────────────────────────────────────────

export async function searchContactByEmail(email: string): Promise<HubSpotContact | null> {
  try {
    const res = await hs<{ results: HubSpotContact[] }>('POST', '/crm/v3/objects/contacts/search', {
      filterGroups: [{ filters: [{ propertyName: 'email', operator: 'EQ', value: email }] }],
      properties: ['firstname', 'lastname', 'email', 'jobtitle', 'company', 'linkedin_url'],
      limit: 1,
    });
    return res.results[0] ?? null;
  } catch {
    return null;
  }
}

export async function searchContactByName(fullName: string, company?: string): Promise<HubSpotContact | null> {
  try {
    const [firstname, ...rest] = fullName.trim().split(' ');
    const lastname = rest.join(' ');
    const filters: any[] = [
      { propertyName: 'firstname', operator: 'EQ', value: firstname },
    ];
    if (lastname) filters.push({ propertyName: 'lastname', operator: 'EQ', value: lastname });
    const res = await hs<{ results: HubSpotContact[] }>('POST', '/crm/v3/objects/contacts/search', {
      filterGroups: [{ filters }],
      properties: ['firstname', 'lastname', 'email', 'jobtitle', 'company', 'linkedin_url'],
      limit: 5,
    });
    if (!res.results.length) return null;
    if (company) {
      const match = res.results.find(c => c.properties.company?.toLowerCase() === company.toLowerCase());
      return match ?? res.results[0];
    }
    return res.results[0];
  } catch {
    return null;
  }
}

export async function createContact(props: {
  full_name: string;
  email?: string | null;
  title?: string | null;
  company?: string | null;
  linkedin_url?: string | null;
  icp_score?: number;
  pipeline_stage?: string | null;
  warmth_score?: string | null;
  trigger_context?: string | null;
}): Promise<HubSpotContact> {
  const [firstname, ...rest] = (props.full_name ?? '').trim().split(' ');
  const lastname = rest.join(' ');
  return hs<HubSpotContact>('POST', '/crm/v3/objects/contacts', {
    properties: {
      firstname,
      lastname,
      ...(props.email ? { email: props.email } : {}),
      ...(props.title ? { jobtitle: props.title } : {}),
      ...(props.company ? { company: props.company } : {}),
      ...(props.linkedin_url ? { linkedin_url: props.linkedin_url } : {}),
      ...(props.pipeline_stage ? { hs_lead_status: props.pipeline_stage } : {}),
      ...(props.trigger_context ? { notes_last_updated: new Date().toISOString() } : {}),
    },
  });
}

export async function updateContact(hubspotId: string, props: Record<string, string>): Promise<HubSpotContact> {
  return hs<HubSpotContact>('PATCH', `/crm/v3/objects/contacts/${hubspotId}`, { properties: props });
}

export async function upsertContact(props: {
  full_name: string;
  email?: string | null;
  title?: string | null;
  company?: string | null;
  linkedin_url?: string | null;
  icp_score?: number;
  pipeline_stage?: string | null;
  warmth_score?: string | null;
  trigger_context?: string | null;
}): Promise<{ contact: HubSpotContact; created: boolean }> {
  // Try to find existing contact
  let existing: HubSpotContact | null = null;
  if (props.email) {
    existing = await searchContactByEmail(props.email);
  }
  if (!existing) {
    existing = await searchContactByName(props.full_name, props.company ?? undefined);
  }

  if (existing) {
    const [firstname, ...rest] = (props.full_name ?? '').trim().split(' ');
    const updated = await updateContact(existing.id, {
      firstname,
      lastname: rest.join(' '),
      ...(props.email ? { email: props.email } : {}),
      ...(props.title ? { jobtitle: props.title } : {}),
      ...(props.company ? { company: props.company } : {}),
      ...(props.linkedin_url ? { linkedin_url: props.linkedin_url } : {}),
      ...(props.pipeline_stage ? { hs_lead_status: props.pipeline_stage } : {}),
    });
    return { contact: updated, created: false };
  }

  const contact = await createContact(props);
  return { contact, created: true };
}

// ── Companies ──────────────────────────────────────────────────────────────

export async function searchCompanyByName(name: string): Promise<HubSpotCompany | null> {
  try {
    const res = await hs<{ results: HubSpotCompany[] }>('POST', '/crm/v3/objects/companies/search', {
      filterGroups: [{ filters: [{ propertyName: 'name', operator: 'EQ', value: name }] }],
      properties: ['name', 'domain', 'industry', 'numberofemployees'],
      limit: 1,
    });
    return res.results[0] ?? null;
  } catch {
    return null;
  }
}

export async function upsertCompany(name: string, domain?: string | null): Promise<HubSpotCompany> {
  const existing = await searchCompanyByName(name);
  if (existing) return existing;
  return hs<HubSpotCompany>('POST', '/crm/v3/objects/companies', {
    properties: {
      name,
      ...(domain ? { domain } : {}),
    },
  });
}

// ── Associations ───────────────────────────────────────────────────────────

export async function associateContactToCompany(contactId: string, companyId: string): Promise<void> {
  await hs<void>('PUT', `/crm/v4/objects/contacts/${contactId}/associations/companies/${companyId}`, [
    { associationCategory: 'HUBSPOT_DEFINED', associationTypeId: 1 }
  ]);
}

export async function associateDealToContact(dealId: string, contactId: string): Promise<void> {
  await hs<void>('PUT', `/crm/v4/objects/deals/${dealId}/associations/contacts/${contactId}`, [
    { associationCategory: 'HUBSPOT_DEFINED', associationTypeId: 3 }
  ]);
}

export async function associateDealToCompany(dealId: string, companyId: string): Promise<void> {
  await hs<void>('PUT', `/crm/v4/objects/deals/${dealId}/associations/companies/${companyId}`, [
    { associationCategory: 'HUBSPOT_DEFINED', associationTypeId: 5 }
  ]);
}

// ── Deals ──────────────────────────────────────────────────────────────────

// Map LeadForge pipeline stages to HubSpot deal stages
// HubSpot free CRM has default stages: appointmentscheduled, qualifiedtobuy, presentationscheduled, decisionmakerboughtin, contractsent, closedwon, closedlost
const STAGE_MAP: Record<string, string> = {
  identified:  'appointmentscheduled',
  researched:  'appointmentscheduled',
  warming:     'appointmentscheduled',
  outreach:    'qualifiedtobuy',
  engaged:     'presentationscheduled',
  qualified:   'decisionmakerboughtin',
  proposal:    'contractsent',
  client:      'closedwon',
};

export async function findDealByName(name: string): Promise<HubSpotDeal | null> {
  try {
    const res = await hs<{ results: HubSpotDeal[] }>('POST', '/crm/v3/objects/deals/search', {
      filterGroups: [{ filters: [{ propertyName: 'dealname', operator: 'EQ', value: name }] }],
      properties: ['dealname', 'dealstage', 'pipeline'],
      limit: 1,
    });
    return res.results[0] ?? null;
  } catch {
    return null;
  }
}

export async function upsertDeal(props: {
  name: string;
  pipeline_stage: string;
  contact_name?: string;
  company_name?: string;
}): Promise<HubSpotDeal> {
  const hsStage = STAGE_MAP[props.pipeline_stage] ?? 'appointmentscheduled';
  const existing = await findDealByName(props.name);

  if (existing) {
    return hs<HubSpotDeal>('PATCH', `/crm/v3/objects/deals/${existing.id}`, {
      properties: { dealstage: hsStage },
    });
  }

  return hs<HubSpotDeal>('POST', '/crm/v3/objects/deals', {
    properties: {
      dealname: props.name,
      dealstage: hsStage,
      pipeline: 'default',
    },
  });
}

// ── Notes ──────────────────────────────────────────────────────────────────

export async function createNote(contactId: string, body: string): Promise<void> {
  const note = await hs<{ id: string }>('POST', '/crm/v3/objects/notes', {
    properties: {
      hs_note_body: body,
      hs_timestamp: new Date().toISOString(),
    },
  });
  // Associate note to contact
  await hs<void>('PUT', `/crm/v4/objects/notes/${note.id}/associations/contacts/${contactId}`, [
    { associationCategory: 'HUBSPOT_DEFINED', associationTypeId: 202 }
  ]);
}
