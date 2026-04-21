// HubSpot sync endpoint — called server-side when prospects are created/updated
import { NextRequest, NextResponse } from 'next/server';
import {
  upsertContact, upsertCompany, upsertDeal,
  associateContactToCompany, associateDealToContact, associateDealToCompany,
  createNote,
} from '@/lib/integrations/hubspot';

export async function POST(req: NextRequest) {
  try {
    const { action, prospect, activity } = await req.json();

    if (action === 'sync_prospect') {
      const dealName = `${prospect.full_name}${prospect.account?.company_name ? ` · ${prospect.account.company_name}` : ''}`;

      // Phase 1: upsert contact + upsert company in parallel
      const [{ contact, created }, companyResult] = await Promise.all([
        upsertContact({
          full_name: prospect.full_name,
          email: prospect.email,
          title: prospect.title,
          company: prospect.account?.company_name,
          linkedin_url: prospect.linkedin_url,
          pipeline_stage: prospect.pipeline_stage,
          warmth_score: prospect.warmth_score,
          trigger_context: prospect.trigger_context,
        }),
        prospect.account?.company_name
          ? upsertCompany(prospect.account.company_name, prospect.account.domain)
          : Promise.resolve(null),
      ]);

      const companyId = companyResult?.id ?? null;

      // Phase 2: upsert deal + associate contact→company in parallel
      const [deal] = await Promise.all([
        upsertDeal({
          name: dealName,
          pipeline_stage: prospect.pipeline_stage ?? 'identified',
          contact_name: prospect.full_name,
          company_name: prospect.account?.company_name,
        }),
        companyId ? associateContactToCompany(contact.id, companyId) : Promise.resolve(),
      ]);

      // Phase 3: all associations + note in parallel
      await Promise.all([
        associateDealToContact(deal.id, contact.id),
        companyId ? associateDealToCompany(deal.id, companyId) : Promise.resolve(),
        created && prospect.trigger_context
          ? createNote(contact.id, `Why target: ${prospect.trigger_context}`)
          : Promise.resolve(),
      ]);

      return NextResponse.json({ contact_id: contact.id, deal_id: deal.id, company_id: companyId, created });
    }

    if (action === 'update_stage') {
      // Update deal stage in HubSpot
      const { prospect: p } = await req.json().catch(() => ({ prospect: null }));
      const dealName = `${prospect.full_name}${prospect.account?.company_name ? ` · ${prospect.account.company_name}` : ''}`;
      await upsertDeal({
        name: dealName,
        pipeline_stage: prospect.pipeline_stage ?? 'identified',
      });
      return NextResponse.json({ ok: true });
    }

    if (action === 'log_activity') {
      // Find contact and log a note
      const { contact_id, body } = activity;
      if (contact_id && body) {
        await createNote(contact_id, body);
      }
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: 'Unknown action.' }, { status: 400 });
  } catch (err: any) {
    console.error('HubSpot sync error:', err);
    return NextResponse.json({ error: err.message ?? 'Sync failed.' }, { status: 500 });
  }
}
