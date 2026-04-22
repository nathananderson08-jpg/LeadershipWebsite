import { NextRequest, NextResponse } from 'next/server';
import { enrichAccountWithNews } from '@/lib/leadforge/news-enrich';

export async function POST(req: NextRequest) {
  try {
    const { account_id, company_name } = await req.json();

    if (!account_id || !company_name) {
      return NextResponse.json({ error: 'account_id and company_name are required.' }, { status: 400 });
    }

    const result = await enrichAccountWithNews(account_id, company_name);
    return NextResponse.json(result);

  } catch (err: any) {
    console.error('News enrich error:', err);
    return NextResponse.json({ error: err.message ?? 'News enrichment failed.' }, { status: 500 });
  }
}
