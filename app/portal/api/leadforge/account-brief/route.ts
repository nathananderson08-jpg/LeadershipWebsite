// Generates a synthesised intelligence brief for an account by looking at the full
// history of trigger events (last 180 days) and applying time-weighted analysis.
// Recent events (< 30 days) carry high weight; 30-90 days medium; 90-180 days background.
// Designed to be called on-demand from the account detail page, not on every load.

import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { createAdminClient } from '@/lib/portal/supabase-server';

let _anthropic: Anthropic | null = null;
function getAnthropic() {
  if (!_anthropic) _anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  return _anthropic;
}

function ageLabel(detectedAt: string): string {
  const days = (Date.now() - new Date(detectedAt).getTime()) / (1000 * 60 * 60 * 24);
  if (days <= 30) return 'RECENT (< 30 days) — high weight';
  if (days <= 90) return 'RECENT (30-90 days) — medium weight';
  return 'BACKGROUND (90-180 days) — context only';
}

export async function POST(req: NextRequest) {
  try {
    const { account_id } = await req.json();
    if (!account_id) {
      return NextResponse.json({ error: 'account_id is required.' }, { status: 400 });
    }

    const supabase = createAdminClient();
    const cutoff = new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString();

    // Load account metadata + all signals in parallel
    const [accountResult, eventsResult] = await Promise.all([
      supabase
        .from('leadforge_accounts')
        .select('company_name, industry, headcount, hq_location, icp_fit, key_challenges')
        .eq('id', account_id)
        .single(),
      supabase
        .from('leadforge_trigger_events')
        .select('event_type, description, priority, source_url, detected_at')
        .eq('account_id', account_id)
        .gte('detected_at', cutoff)
        .order('detected_at', { ascending: false }),
    ]);

    const account = accountResult.data;
    const events = eventsResult.data ?? [];

    if (!account) {
      return NextResponse.json({ error: 'Account not found.' }, { status: 404 });
    }

    if (events.length === 0) {
      return NextResponse.json({
        brief: null,
        message: 'No signal history yet. Run a news scan first.',
      });
    }

    // Format events with explicit time-weight labels
    const eventLines = events.map(e =>
      `[${ageLabel(e.detected_at)}] ${e.priority?.toUpperCase() ?? 'MEDIUM'} | ${e.event_type ?? 'signal'} — ${e.description}`
    ).join('\n');

    const accountContext = [
      account.industry && `Industry: ${account.industry}`,
      account.headcount && `Size: ${account.headcount.toLocaleString()} employees`,
      account.hq_location && `HQ: ${account.hq_location}`,
      account.key_challenges && `Known challenges: ${account.key_challenges}`,
    ].filter(Boolean).join(' | ');

    const prompt = `You are a senior partner at a leadership development consulting firm preparing a one-page briefing on a target account before an outreach call. You have access to a time-stamped signal history. Weight your analysis accordingly — recent signals shape the current situation, older signals provide context.

ACCOUNT: ${account.company_name}
${accountContext}

SIGNAL HISTORY (${events.length} signals, last 180 days):
${eventLines}

Write a structured partner brief. Be specific, grounded in the signals, and commercially intelligent. Do not be generic.

Respond ONLY with valid JSON (no markdown):
{
  "situation": "2-3 sentences: what is happening at this company right now that creates leadership development urgency. Lead with the most recent high-weight signals.",
  "leadership_thesis": "2-3 sentences: what specific leadership development challenge is at the centre of their situation. Name the type of work (e.g. C-suite alignment, change leadership, succession architecture) and why this company specifically needs it now.",
  "entry_point": "1-2 sentences: the most credible first conversation to initiate — what to lead with, who to address it to, and why now is the right moment.",
  "watch_outs": "1-2 sentences: what could slow this deal or make the conversation harder — internal politics, budget cycles, competing priorities indicated by the signals.",
  "signal_recency": "high" | "medium" | "low"
}

signal_recency reflects how fresh the underlying intelligence is: high = majority of signals < 30 days, medium = mix of recent and older, low = mostly background signals.`;

    const msg = await getAnthropic().messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = msg.content[0].type === 'text' ? msg.content[0].text : '{}';
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) {
      return NextResponse.json({ error: 'Brief generation failed.' }, { status: 500 });
    }

    const brief = JSON.parse(match[0]);
    return NextResponse.json({ brief, signal_count: events.length, generated_at: new Date().toISOString() });

  } catch (err: any) {
    console.error('Account brief error:', err);
    return NextResponse.json({ error: err.message ?? 'Brief generation failed.' }, { status: 500 });
  }
}
