// Weekly news scan cron job — runs every Monday at 8am UTC.
// Vercel calls this via GET with Authorization: Bearer {CRON_SECRET}.
// Processes up to 15 accounts per run (sequential to respect external API rate limits),
// skipping any account that already has a trigger event from the last 5 days.
// Accounts with no recent events are prioritised first; within that, highest ICP fit first.

import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/portal/supabase-server';
import { enrichAccountWithNews } from '@/lib/leadforge/news-enrich';

const MAX_ACCOUNTS_PER_RUN = 15;
const SKIP_IF_SCANNED_WITHIN_DAYS = 5;

export async function GET(req: NextRequest) {
  // Verify this is a legitimate Vercel cron call
  const auth = req.headers.get('authorization');
  if (!process.env.CRON_SECRET || auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createAdminClient();
  const skipCutoff = new Date(Date.now() - SKIP_IF_SCANNED_WITHIN_DAYS * 24 * 60 * 60 * 1000).toISOString();

  // Load all accounts
  const { data: accounts, error: accountsError } = await supabase
    .from('leadforge_accounts')
    .select('id, company_name, icp_fit')
    .order('company_name');

  if (accountsError || !accounts?.length) {
    return NextResponse.json({ scanned: 0, message: 'No accounts found.' });
  }

  // Find accounts that have been touched (any trigger event) within the skip window
  const { data: recentActivity } = await supabase
    .from('leadforge_trigger_events')
    .select('account_id')
    .gte('detected_at', skipCutoff);

  const recentlyScanned = new Set((recentActivity ?? []).map((e: any) => e.account_id));

  // Filter and prioritise: un-scanned first, then high ICP fit, then alphabetical
  const icpOrder: Record<string, number> = { High: 0, Medium: 1, Low: 2 };
  const candidates = accounts
    .filter(a => !recentlyScanned.has(a.id))
    .sort((a, b) => {
      const ia = icpOrder[a.icp_fit ?? ''] ?? 3;
      const ib = icpOrder[b.icp_fit ?? ''] ?? 3;
      return ia - ib;
    })
    .slice(0, MAX_ACCOUNTS_PER_RUN);

  if (!candidates.length) {
    return NextResponse.json({ scanned: 0, message: 'All accounts were scanned recently — nothing to do.' });
  }

  // Process sequentially to avoid hammering external APIs
  const results: { company: string; signals: number; error?: string }[] = [];

  for (const account of candidates) {
    try {
      const result = await enrichAccountWithNews(account.id, account.company_name);
      results.push({ company: account.company_name, signals: result.count });
    } catch (err: any) {
      console.error(`News scan failed for ${account.company_name}:`, err.message);
      results.push({ company: account.company_name, signals: 0, error: err.message });
    }
  }

  const totalSignals = results.reduce((sum, r) => sum + r.signals, 0);
  console.log(`Cron news-scan: processed ${results.length} accounts, ${totalSignals} new signals.`);

  return NextResponse.json({
    scanned: results.length,
    total_signals: totalSignals,
    skipped: accounts.length - candidates.length,
    results,
  });
}
