// Daily news scan cron job — runs every day at 8am UTC.
// Each run processes accounts in parallel batches of 5, skipping any account
// already scanned in the last 5 days. This naturally cycles through the full
// account list over the course of a week with no account scanned more than once.
//
// Vercel calls this via GET with Authorization: Bearer {CRON_SECRET}.

import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/portal/supabase-server';
import { enrichAccountWithNews } from '@/lib/leadforge/news-enrich';

// Increase Vercel function timeout to 5 minutes (Pro plan)
export const maxDuration = 300;

const BATCH_SIZE = 5;                  // parallel accounts per batch
const SKIP_IF_SCANNED_WITHIN_DAYS = 5; // prevents re-scanning the same account twice in a week

export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization');
  if (!process.env.CRON_SECRET || auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createAdminClient();
  const skipCutoff = new Date(Date.now() - SKIP_IF_SCANNED_WITHIN_DAYS * 24 * 60 * 60 * 1000).toISOString();

  // Load all accounts + recently scanned set in parallel
  const [accountsResult, recentResult] = await Promise.all([
    supabase.from('leadforge_accounts').select('id, company_name, icp_fit').order('company_name'),
    supabase.from('leadforge_trigger_events').select('account_id').gte('detected_at', skipCutoff),
  ]);

  const accounts = accountsResult.data ?? [];
  if (!accounts.length) {
    return NextResponse.json({ scanned: 0, message: 'No accounts found.' });
  }

  const recentlyScanned = new Set((recentResult.data ?? []).map((e: any) => e.account_id));

  // Prioritise un-scanned accounts: High ICP first, then Medium, then Low, then alphabetical
  const icpOrder: Record<string, number> = { High: 0, Medium: 1, Low: 2 };
  const candidates = accounts
    .filter(a => !recentlyScanned.has(a.id))
    .sort((a, b) => {
      const ia = icpOrder[a.icp_fit ?? ''] ?? 3;
      const ib = icpOrder[b.icp_fit ?? ''] ?? 3;
      return ia !== ib ? ia - ib : a.company_name.localeCompare(b.company_name);
    });

  if (!candidates.length) {
    return NextResponse.json({ scanned: 0, message: 'All accounts scanned within the last 5 days — nothing to do today.' });
  }

  // Process in parallel batches of BATCH_SIZE
  const results: { company: string; signals: number; skipped: number; error?: string }[] = [];

  for (let i = 0; i < candidates.length; i += BATCH_SIZE) {
    const batch = candidates.slice(i, i + BATCH_SIZE);
    const batchResults = await Promise.all(
      batch.map(async account => {
        try {
          const result = await enrichAccountWithNews(account.id, account.company_name);
          return { company: account.company_name, signals: result.count, skipped: result.skipped_duplicates };
        } catch (err: any) {
          console.error(`News scan failed for ${account.company_name}:`, err.message);
          return { company: account.company_name, signals: 0, skipped: 0, error: err.message };
        }
      })
    );
    results.push(...batchResults);
  }

  const totalSignals = results.reduce((sum, r) => sum + r.signals, 0);
  const totalSkipped = results.reduce((sum, r) => sum + r.skipped, 0);
  console.log(`Cron news-scan: processed ${results.length} accounts, ${totalSignals} new signals, ${totalSkipped} duplicates skipped.`);

  return NextResponse.json({
    scanned: results.length,
    total_signals: totalSignals,
    duplicates_skipped: totalSkipped,
    already_current: accounts.length - candidates.length,
    results,
  });
}
