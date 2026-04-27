import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/portal/supabase-server';
import Anthropic from '@anthropic-ai/sdk';

let _anthropic: Anthropic | null = null;
function getAnthropic() {
  if (!_anthropic) _anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  return _anthropic;
}

export async function GET(req: NextRequest) {
  const supabase = createAdminClient();
  const { searchParams } = new URL(req.url);
  const action = searchParams.get('action') ?? 'list';

  if (action === 'list') {
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .select('id, email, name, source, status, subscribed_at, unsubscribed_at')
      .order('subscribed_at', { ascending: false });
    if (error) return NextResponse.json({ error: 'Failed to load.' }, { status: 500 });
    return NextResponse.json({ subscribers: data ?? [] });
  }

  if (action === 'drafts') {
    const { data, error } = await supabase
      .from('newsletter_drafts')
      .select('id, subject, preview_text, status, created_at, sent_at')
      .order('created_at', { ascending: false });
    if (error) return NextResponse.json({ error: 'Failed to load.' }, { status: 500 });
    return NextResponse.json({ drafts: data ?? [] });
  }

  if (action === 'draft') {
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'id required.' }, { status: 400 });
    const { data, error } = await supabase
      .from('newsletter_drafts')
      .select('*')
      .eq('id', id)
      .single();
    if (error) return NextResponse.json({ error: 'Not found.' }, { status: 404 });
    return NextResponse.json({ draft: data });
  }

  return NextResponse.json({ error: 'Unknown action.' }, { status: 400 });
}

export async function POST(req: NextRequest) {
  const supabase = createAdminClient();

  try {
    const body = await req.json();
    const { action } = body;

    // ── Subscriber management ──────────────────────────────────────────────

    if (action === 'add_subscriber') {
      const { email, name } = body;
      if (!email) return NextResponse.json({ error: 'Email required.' }, { status: 400 });
      const { error } = await supabase.from('newsletter_subscribers').upsert(
        { email: email.trim().toLowerCase(), name: name?.trim() || null, source: 'manual', status: 'active', subscribed_at: new Date().toISOString() },
        { onConflict: 'email' }
      );
      if (error) return NextResponse.json({ error: 'Failed to add.' }, { status: 500 });
      return NextResponse.json({ ok: true });
    }

    if (action === 'update_status') {
      const { id, status } = body;
      const update: any = { status };
      if (status === 'unsubscribed') update.unsubscribed_at = new Date().toISOString();
      const { error } = await supabase.from('newsletter_subscribers').update(update).eq('id', id);
      if (error) return NextResponse.json({ error: 'Update failed.' }, { status: 500 });
      return NextResponse.json({ ok: true });
    }

    if (action === 'delete_subscriber') {
      const { id } = body;
      await supabase.from('newsletter_subscribers').delete().eq('id', id);
      return NextResponse.json({ ok: true });
    }

    // ── Newsletter draft management ────────────────────────────────────────

    if (action === 'save_draft') {
      const { id, subject, preview_text, body_json } = body;
      if (id) {
        const { error } = await supabase.from('newsletter_drafts').update({ subject, preview_text, body_json, updated_at: new Date().toISOString() }).eq('id', id);
        if (error) return NextResponse.json({ error: 'Save failed.' }, { status: 500 });
        return NextResponse.json({ ok: true });
      } else {
        const { data, error } = await supabase.from('newsletter_drafts').insert({ subject, preview_text, body_json, status: 'draft' }).select('id').single();
        if (error) return NextResponse.json({ error: 'Save failed.' }, { status: 500 });
        return NextResponse.json({ id: data.id });
      }
    }

    if (action === 'delete_draft') {
      await supabase.from('newsletter_drafts').delete().eq('id', body.id);
      return NextResponse.json({ ok: true });
    }

    // ── Claude newsletter generation ───────────────────────────────────────

    if (action === 'compose') {
      const { topic, audience, tone, include_articles, commercial_message, additional_context } = body;

      // Fetch relevant KB items for context
      const { data: kbItems } = await supabase
        .from('leadforge_knowledge_base')
        .select('category, title, content')
        .limit(10);

      const kbSection = kbItems && kbItems.length > 0
        ? `FIRM KNOWLEDGE BASE (use this to ground the newsletter in our IP and positioning):\n${kbItems.map(k => `[${k.category}] ${k.title}: ${k.content?.slice(0, 400)}`).join('\n\n')}`
        : '';

      const articleSection = include_articles && include_articles.length > 0
        ? `FEATURED ARTICLES TO REFERENCE:\n${include_articles.map((a: any) => `- "${a.title}" (${a.category}): ${a.excerpt}`).join('\n')}`
        : '';

      const prompt = `You are a senior editor at Apex & Origin, a premier leadership development consultancy. Write a professional weekly newsletter email.

TOPIC / THEME: ${topic}
TARGET AUDIENCE: ${audience || 'Senior HR leaders, CHROs, and talent executives'}
TONE: ${tone || 'Authoritative, thought-provoking, and collegial — like a respected advisor writing to peers'}
${commercial_message ? `COMMERCIAL MESSAGE TO INCLUDE: ${commercial_message}` : ''}
${additional_context ? `ADDITIONAL CONTEXT: ${additional_context}` : ''}

${kbSection}

${articleSection}

Structure the newsletter as follows:

1. **Subject line** — compelling, specific, not clickbait (max 60 characters)
2. **Preview text** — the sentence shown in email clients below the subject (max 90 characters)
3. **Opening** — 2-3 sentences that hook the reader with a provocative observation or question related to the theme
4. **Main content section** — 300-400 words of original, substantive thinking on the topic. Draw on our firm's IP and positioning. Be specific, not generic. Take a clear point of view.
5. **Commercial section** — 2-3 sentences connecting the topic to a relevant Apex & Origin service or capability. Not salesy — position it as a natural extension of the thinking.
6. **Relevant links** — 2-3 bullet points referencing relevant Apex & Origin articles or resources (use the articles provided if available, otherwise suggest relevant topics)
7. **Closing** — 1-2 sentences. Warm but purposeful.

Respond in this exact JSON format:
{
  "subject": "...",
  "preview_text": "...",
  "sections": {
    "opening": "...",
    "main_content": "...",
    "commercial": "...",
    "links": ["...", "...", "..."],
    "closing": "..."
  }
}`;

      const msg = await getAnthropic().messages.create({
        model: 'claude-opus-4-6',
        max_tokens: 2000,
        messages: [{ role: 'user', content: prompt }],
      });

      const text = msg.content[0].type === 'text' ? msg.content[0].text : '{}';
      const match = text.match(/\{[\s\S]*\}/);
      if (!match) return NextResponse.json({ error: 'Generation failed.' }, { status: 500 });

      const result = JSON.parse(match[0]);
      return NextResponse.json({ newsletter: result });
    }

    return NextResponse.json({ error: 'Unknown action.' }, { status: 400 });
  } catch (err: any) {
    console.error('Newsletter API error:', err);
    return NextResponse.json({ error: err.message ?? 'Request failed.' }, { status: 500 });
  }
}
