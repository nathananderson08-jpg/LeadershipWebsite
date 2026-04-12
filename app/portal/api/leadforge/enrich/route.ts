import { NextRequest, NextResponse } from 'next/server';
import { enrichPerson, emailConfidenceFromStatus } from '@/lib/integrations/apollo';
import { upsertContact } from '@/lib/integrations/hubspot';

export async function POST(req: NextRequest) {
  try {
    const { prospect } = await req.json();
    if (!prospect?.full_name) {
      return NextResponse.json({ error: 'prospect.full_name is required.' }, { status: 400 });
    }

    const [first_name, ...rest] = prospect.full_name.trim().split(' ');
    const last_name = rest.join(' ');

    // Enrich via Apollo
    const person = await enrichPerson({
      first_name,
      last_name,
      organization_name: prospect.account?.company_name,
      email: prospect.email ?? undefined,
      linkedin_url: prospect.linkedin_url ?? undefined,
    });

    if (!person) {
      return NextResponse.json({ found: false, updates: {} });
    }

    const updates: Record<string, string | null> = {};

    if (person.email && person.email_status === 'verified') {
      updates.email = person.email;
      updates.email_confidence = 'verified';
    } else if (person.email && !prospect.email) {
      updates.email = person.email;
      updates.email_confidence = emailConfidenceFromStatus(person.email_status);
    }

    if (person.linkedin_url && !prospect.linkedin_url) {
      updates.linkedin_url = person.linkedin_url;
    }

    if (person.title && !prospect.title) {
      updates.title = person.title;
    }

    updates.enrichment_source = 'apollo';

    // Also sync to HubSpot with enriched data
    try {
      await upsertContact({
        full_name: prospect.full_name,
        email: updates.email ?? prospect.email,
        title: updates.title ?? prospect.title,
        company: prospect.account?.company_name,
        linkedin_url: updates.linkedin_url ?? prospect.linkedin_url,
        pipeline_stage: prospect.pipeline_stage,
      });
    } catch (hsErr) {
      console.warn('HubSpot sync after enrichment failed:', hsErr);
    }

    return NextResponse.json({ found: true, updates, apollo_id: person.id });
  } catch (err: any) {
    console.error('Enrich error:', err);
    return NextResponse.json({ error: err.message ?? 'Enrichment failed.' }, { status: 500 });
  }
}
