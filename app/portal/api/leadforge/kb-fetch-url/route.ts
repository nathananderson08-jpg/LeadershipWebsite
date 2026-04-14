import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    if (!url?.trim()) return NextResponse.json({ error: 'URL is required.' }, { status: 400 });

    const res = await fetch(url.trim(), {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; LeadForge/1.0)' },
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) throw new Error(`Page returned ${res.status}`);
    const html = await res.text();

    // Extract title
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim().replace(/\s+/g, ' ') : url;

    // Strip HTML: remove scripts, styles, nav/header/footer, then tags
    const cleaned = html
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<nav[\s\S]*?<\/nav>/gi, '')
      .replace(/<header[\s\S]*?<\/header>/gi, '')
      .replace(/<footer[\s\S]*?<\/footer>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&[a-z]+;/gi, ' ')
      .replace(/\s{2,}/g, ' ')
      .trim();

    // Cap at ~4000 chars to stay within reasonable token limits
    const content = cleaned.slice(0, 4000) + (cleaned.length > 4000 ? '\n\n[Content truncated — paste the full text manually if needed.]' : '');

    return NextResponse.json({ title, content, url });

  } catch (err: any) {
    console.error('KB fetch URL error:', err);
    return NextResponse.json({ error: err.message ?? 'Could not fetch URL.' }, { status: 500 });
  }
}
