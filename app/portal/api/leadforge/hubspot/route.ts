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
      // 1. Upsert contact
      const { contact, created } = await upsertContact({
        full_name: prospect.full_name,
        email: prospect.email,
        title: prospect.title,
        company: prospect.account?.company_name,
        linkedin_url: prospect.linkedin_url,
        pipeline_stage: prospect.pipeline_stage,
        warmth_score: prospect.warmth_score,
        trigger_context: prospect.trigger_context,
      });

      let companyId: string | null = null;
      let dealId: string | null = null;

      // 2. Upsert company if we have one
      if (prospect.account?.company_name) {
        const company = await upsertCompany(
          prospect.account.company_name,
          prospect.account.domain
        );
        companyId = company.id;
        await associateContactToCompany(contact.id, company.id);
      }

      // 3. Upsert deal
      const dealName = `${prospect.full_name}${prospect.account?.company_name ? ` · ${prospect.account.company_name}` : ''}`;
      const deal = await upsertDeal({
        name: dealName,
        pipeline_stage: prospect.pipeline_stage ?? 'identified',
        contact_name: prospect.full_name,
        company_name: prospect.account?.company_name,
      });
      dealId = deal.id;
      await associateDealToContact(deal.id, contact.id);
      if (companyId) await associateDealToCompany(deal.id, companyId);

      // 4. Log trigger context as a note if newly created
      if (created && prospect.trigger_context) {
        await createNote(contact.id, `Why target: ${prospect.trigger_context}`);
      }

      return NextResponse.json({ contact_id: contact.id, deal_id: dealId, company_id: companyId, created });
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
