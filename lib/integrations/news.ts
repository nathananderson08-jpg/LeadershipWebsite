// News signal scanner — uses Google News RSS + Claude to identify
// buying signals for leadership consulting (executive moves, reorgs, M&A, growth)

import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const GOOGLE_NEWS = 'https://news.google.com/rss/search';

async function fetchNewsItems(query: string): Promise<{ title: string; link: string; pubDate: string; snippet: string }[]> {
  try {
    const url = `${GOOGLE_NEWS}?q=${encodeURIComponent(query)}&hl=en&gl=US&ceid=US:en`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; LeadForge/1.0)' },
      next: { revalidate: 0 },
    });
    if (!res.ok) return [];
    const xml = await res.text();

    const items: { title: string; link: string; pubDate: string; snippet: string }[] = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;
    while ((match = itemRegex.exec(xml)) !== null && items.length < 8) {
      const block = match[1];
      const title = (block.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/) ?? block.match(/<title>(.*?)<\/title>/))?.[1] ?? '';
      const link = block.match(/<link>(.*?)<\/link>/)?.[1] ?? '';
      const pubDate = block.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] ?? '';
      const desc = (block.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/) ?? block.match(/<description>([\s\S]*?)<\/description>/))?.[1] ?? '';
      const snippet = desc.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 300);
      if (title.trim()) items.push({ title: title.trim(), link: link.trim(), pubDate: pubDate.trim(), snippet });
    }
    return items;
  } catch {
    return [];
  }
}

// ── Types ──────────────────────────────────────────────────────────────────

export type NewsSignalType = 'executive_move' | 'organizational' | 'ma' | 'growth_signal';
export type NewsSignalPriority = 'critical' | 'high' | 'medium';

export interface NewsSignal {
  type: NewsSignalType;
  priority: NewsSignalPriority;
  title: string;
  description: string;
  source_url: string;
  detected_at: string;
}

// ── Signal scanner ─────────────────────────────────────────────────────────

export async function scanCompanySignals(companyName: string): Promise<NewsSignal[]> {
  // Run 3 targeted searches in parallel
  const [hrItems, orgItems, growthItems] = await Promise.all([
    fetchNewsItems(`"${companyName}" CHRO OR "chief people officer" OR "VP people" OR "head of HR" OR "chief human resources"`),
    fetchNewsItems(`"${companyName}" restructuring OR reorg OR layoffs OR acquisition OR merger OR "spin-off"`),
    fetchNewsItems(`"${companyName}" funding OR IPO OR expansion OR "series" OR "strategic partnership"`),
  ]);

  // If we got meaningful news, use Claude to synthesize into signals
  const allItems = [...hrItems, ...orgItems, ...growthItems];
  if (allItems.length === 0) return [];

  const articleList = allItems
    .map((item, i) => `${i + 1}. "${item.title}" (${item.pubDate ? new Date(item.pubDate).toLocaleDateString() : 'recent'})\n   ${item.snippet}\n   URL: ${item.link}`)
    .join('\n\n');

  try {
    const msg = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1500,
      messages: [{
        role: 'user',
        content: `You are a B2B sales analyst for a senior leadership consulting firm (executive coaching, CHRO advisory, leadership development programs).

Review these recent news articles about ${companyName} and extract only the ones that represent genuine buying signals — events that create urgent need for leadership consulting, such as:
- New CHRO/CPO/CLO appointment or departure (CRITICAL)
- Major restructuring or reorg (HIGH)
- M&A activity — acquisition, merger (CRITICAL)
- Significant layoffs or workforce reduction (HIGH)
- Major funding, IPO, or rapid expansion (MEDIUM)

${articleList}

Respond ONLY with a JSON array. Only include items that are genuine signals. Skip irrelevant articles.
[
  {
    "type": "executive_move" | "organizational" | "ma" | "growth_signal",
    "priority": "critical" | "high" | "medium",
    "title": "concise signal title (max 80 chars)",
    "description": "1-2 sentences on why this matters for leadership consulting",
    "source_url": "exact URL from the article",
    "detected_at": "ISO date string"
  }
]`,
      }],
    });

    const text = msg.content[0].type === 'text' ? msg.content[0].text : '[]';
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) return [];

    const signals: NewsSignal[] = JSON.parse(jsonMatch[0]);
    return signals.filter(s => s.title && s.type && s.priority);
  } catch {
    // Fallback: convert top items directly without Claude synthesis
    return allItems.slice(0, 5).map(item => ({
      type: 'growth_signal' as NewsSignalType,
      priority: 'medium' as NewsSignalPriority,
      title: item.title.slice(0, 80),
      description: item.snippet || item.title,
      source_url: item.link,
      detected_at: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
    }));
  }
}
