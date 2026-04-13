// GitHub Search API — scans public signals about target companies
// Detects executive moves, org changes, M&A, and growth signals
// Add GITHUB_TOKEN env var for higher rate limits (5000 req/hr vs 60/hr)

const BASE = 'https://api.github.com';

function headers(): Record<string, string> {
  const h: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
  if (process.env.GITHUB_TOKEN) {
    h['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  return h;
}

async function searchIssues(q: string): Promise<any[]> {
  try {
    const res = await fetch(
      `${BASE}/search/issues?q=${encodeURIComponent(q)}&per_page=5&sort=updated&order=desc`,
      { headers: headers() }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.items ?? [];
  } catch {
    return [];
  }
}

// ── Types ──────────────────────────────────────────────────────────────────

export type GitHubSignalType = 'executive_move' | 'organizational' | 'ma' | 'growth_signal';
export type GitHubSignalPriority = 'critical' | 'high' | 'medium';

export interface GitHubSignal {
  type: GitHubSignalType;
  priority: GitHubSignalPriority;
  title: string;
  description: string;
  source_url: string;
  detected_at: string;
}

// ── Signal detection ───────────────────────────────────────────────────────

function toDescription(item: any, context: string): string {
  const title = item.title ?? '';
  const snippet = (item.body ?? '').slice(0, 200).replace(/\n+/g, ' ').trim();
  return snippet ? `${title}. ${snippet}` : title || context;
}

/**
 * Scan GitHub's public issue/PR index for buying signals about a company.
 * Runs 4 targeted searches in parallel, deduplicates by URL.
 */
export async function scanCompanySignals(companyName: string): Promise<GitHubSignal[]> {
  const company = `"${companyName}"`;

  const [execItems, orgItems, maItems, growthItems] = await Promise.all([
    // Executive HR moves — highest intent signal
    searchIssues(`${company} CHRO OR "chief people officer" OR "VP people" OR "head of HR" OR "head of people"`),
    // Org restructuring — creates need for leadership consulting
    searchIssues(`${company} restructuring OR reorg OR layoffs OR "workforce reduction" OR "organizational change"`),
    // M&A — triggers integration/change leadership needs
    searchIssues(`${company} acquisition OR acquired OR merger OR "spin-off" OR spinoff`),
    // Growth — new investment = new programs budget
    searchIssues(`${company} funding OR "series A" OR "series B" OR "series C" OR IPO OR expansion`),
  ]);

  const seen = new Set<string>();
  const signals: GitHubSignal[] = [];

  for (const item of execItems) {
    if (seen.has(item.html_url)) continue;
    seen.add(item.html_url);
    signals.push({
      type: 'executive_move',
      priority: 'high',
      title: item.title ?? 'HR leadership signal',
      description: toDescription(item, `Possible HR leadership change detected for ${companyName}`),
      source_url: item.html_url,
      detected_at: item.updated_at ?? new Date().toISOString(),
    });
  }

  for (const item of orgItems) {
    if (seen.has(item.html_url)) continue;
    seen.add(item.html_url);
    signals.push({
      type: 'organizational',
      priority: 'high',
      title: item.title ?? 'Organizational change signal',
      description: toDescription(item, `Organizational change signal detected for ${companyName}`),
      source_url: item.html_url,
      detected_at: item.updated_at ?? new Date().toISOString(),
    });
  }

  for (const item of maItems) {
    if (seen.has(item.html_url)) continue;
    seen.add(item.html_url);
    signals.push({
      type: 'ma',
      priority: 'critical',
      title: item.title ?? 'M&A signal',
      description: toDescription(item, `M&A activity signal detected for ${companyName}`),
      source_url: item.html_url,
      detected_at: item.updated_at ?? new Date().toISOString(),
    });
  }

  for (const item of growthItems) {
    if (seen.has(item.html_url)) continue;
    seen.add(item.html_url);
    signals.push({
      type: 'growth_signal',
      priority: 'medium',
      title: item.title ?? 'Growth signal',
      description: toDescription(item, `Growth signal detected for ${companyName}`),
      source_url: item.html_url,
      detected_at: item.updated_at ?? new Date().toISOString(),
    });
  }

  return signals;
}
