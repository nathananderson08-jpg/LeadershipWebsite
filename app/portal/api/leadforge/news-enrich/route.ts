import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { createAdminClient } from '@/lib/portal/supabase-server';

// Lazy singleton — avoids build-time instantiation errors
let _anthropic: Anthropic | null = null;
function getAnthropic() {
  if (!_anthropic) _anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  return _anthropic;
}

// EDGAR requires a descriptive User-Agent per their terms of service
const EDGAR_UA = 'LeadForge/1.0 nate@sallyarundell.com';

export async function POST(req: NextRequest) {
  try {
    const { account_id, company_name } = await req.json();

    if (!account_id || !company_name) {
      return NextResponse.json({ error: 'account_id and company_name are required.' }, { status: 400 });
    }

    const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    const today = new Date().toISOString().slice(0, 10);

    // Fetch both sources in parallel — allSettled so one failure doesn't kill the other
    const [newsResult, edgarResult] = await Promise.allSettled([
      fetch(
        `https://news.google.com/rss/search?q=${encodeURIComponent(
          `"${company_name}" CEO OR executive OR leadership OR restructuring OR layoffs OR merger OR acquisition OR expansion OR "board of directors"`
        )}&hl=en-US&gl=US&ceid=US:en`,
        {
          headers: { 'User-Agent': 'Mozilla/5.0 (compatible; LeadForge/1.0; +https://leadershipfirm.com)' },
          signal: AbortSignal.timeout(8000),
        }
      ).then(r => r.text()),

      fetch(
        `https://efts.sec.gov/LATEST/search-index?q=%22${encodeURIComponent(company_name)}%22&forms=8-K&dateRange=custom&startdt=${ninetyDaysAgo}&enddt=${today}`,
        {
          headers: { 'User-Agent': EDGAR_UA },
          signal: AbortSignal.timeout(8000),
        }
      ).then(r => r.json()),
    ]);

    // Build context sections
    const newsXml = newsResult.status === 'fulfilled' ? newsResult.value : '';
    const edgarData = edgarResult.status === 'fulfilled' ? edgarResult.value : null;

    const edgarHits: any[] = edgarData?.hits?.hits ?? [];
    const edgarSection = edgarHits.length > 0
      ? `SEC EDGAR 8-K FILINGS (last 90 days):\n${
          edgarHits.slice(0, 10).map((h: any) => {
            const s = h._source;
            return `- ${s.entity_name}: 8-K filed ${s.file_date}${s.period_of_report ? `, period ending ${s.period_of_report}` : ''}`;
          }).join('\n')
        }`
      : '';

    // Trim RSS to stay within a safe context budget (~8 KB of raw XML is plenty)
    const newsSection = newsXml
      ? `GOOGLE NEWS RSS:\n${newsXml.slice(0, 8000)}`
      : '';

    const rawIntelligence = [newsSection, edgarSection].filter(Boolean).join('\n\n---\n\n');

    if (!rawIntelligence) {
      return NextResponse.json({ signals: [], summary: 'No news data could be retrieved.', count: 0 });
    }

    const prompt = `You are a business intelligence analyst at a senior leadership development consulting firm. Analyze recent news and SEC filings about a target company and identify signals that indicate specific leadership development needs.

COMPANY: ${company_name}

RECENT INTELLIGENCE:
${rawIntelligence}

Identify 2-5 specific, meaningful signals that indicate leadership development opportunities. Only include signals clearly evidenced in the data — do not invent signals.

Map each signal to a leadership development implication using this logic:
- New CEO / executive hire → leadership transition coaching, role clarity
- CFO/CHRO departure → succession gap, interim leadership stress
- Layoffs / restructuring → change leadership, manager resilience, workforce trust
- M&A announcement or close → culture integration, team alignment, dual-reporting complexity
- Rapid headcount growth → first-line manager pipeline, scaling leadership capability
- Earnings miss / guidance cut → C-suite alignment, performance under pressure
- Digital or AI initiative → AI leadership transformation, change management
- Board composition change → governance effectiveness, CEO succession planning
- Geographic expansion → global leadership, cross-cultural management

Respond ONLY with valid JSON (no markdown fences, no explanation):
{
  "signals": [
    {
      "headline": "What happened — specific and factual, max 15 words",
      "leadership_implication": "The specific leadership development challenge this creates and why it's urgent now. 1-2 sentences.",
      "event_type": "executive_move" | "organizational" | "ma" | "growth_signal" | "culture_signal" | "ai_signal" | "news_signal",
      "priority": "high" | "medium",
      "source_url": "the article URL from the RSS <link> tag if available, otherwise null"
    }
  ],
  "summary": "2-3 sentences: the overall leadership development situation at ${company_name} based on these signals, written as a briefing for a senior partner preparing for an outreach call."
}

If there are no meaningful signals, return: { "signals": [], "summary": "No significant leadership signals detected in the current news cycle." }`;

    const msg = await getAnthropic().messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 1500,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = msg.content[0].type === 'text' ? msg.content[0].text : '{}';
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) {
      return NextResponse.json({ signals: [], summary: 'Analysis returned no structured output.', count: 0 });
    }

    const result = JSON.parse(match[0]);
    const signals: any[] = result.signals ?? [];

    // Persist as trigger events — Supabase realtime will push them to the UI automatically
    if (signals.length > 0) {
      const supabase = createAdminClient();
      await supabase.from('leadforge_trigger_events').insert(
        signals.map(s => ({
          account_id,
          event_type: s.event_type ?? 'news_signal',
          description: `${s.headline} — ${s.leadership_implication}`,
          priority: s.priority ?? 'medium',
          source_url: s.source_url ?? null,
          detected_at: new Date().toISOString(),
          response_status: 'pending',
        }))
      );
    }

    return NextResponse.json({
      signals,
      summary: result.summary ?? '',
      count: signals.length,
    });

  } catch (err: any) {
    console.error('News enrich error:', err);
    return NextResponse.json({ error: err.message ?? 'News enrichment failed.' }, { status: 500 });
  }
}
