import { NextRequest, NextResponse } from 'next/server';
import { scanCompanySignals } from '@/lib/integrations/news';

/**
 * POST /portal/api/leadforge/github-scan
 * Body: { company_name: string }
 *
 * Scans Google News + synthesizes with Claude to detect buying signals.
 * Returns NewsSignal[] — same shape as GitHubSignal so caller code is unchanged.
 */
export async function POST(req: NextRequest) {
  try {
    const { company_name } = await req.json();
    if (!company_name?.trim()) {
      return NextResponse.json({ error: 'company_name is required.' }, { status: 400 });
    }

    const signals = await scanCompanySignals(company_name.trim());

    return NextResponse.json({ signals, company_name: company_name.trim() });
  } catch (err: any) {
    console.error('News scan error:', err);
    return NextResponse.json({ error: err.message ?? 'Scan failed.' }, { status: 500 });
  }
}
