import { NextRequest, NextResponse } from 'next/server';
import { scanCompanySignals } from '@/lib/integrations/github';

/**
 * POST /portal/api/leadforge/github-scan
 * Body: { company_name: string }
 *
 * Scans GitHub's public index for buying signals about a company.
 * Returns an array of GitHubSignal objects — caller is responsible
 * for saving them as trigger events via the useLeadForge hook.
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
    console.error('GitHub scan error:', err);
    return NextResponse.json({ error: err.message ?? 'Scan failed.' }, { status: 500 });
  }
}
