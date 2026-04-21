import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { unstable_cache } from 'next/cache';
import { createAdminClient } from '@/lib/portal/supabase-server';

let _anthropic: Anthropic | null = null;
function getAnthropic() {
  if (!_anthropic) _anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  return _anthropic;
}

const getCachedKBItems = unstable_cache(
  async () => {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from('leadforge_knowledge_base')
      .select('category, title, content')
      .order('updated_at', { ascending: false });
    return data ?? [];
  },
  ['leadforge-kb-items'],
  { revalidate: 60 }
);

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    if (!messages?.length) return NextResponse.json({ error: 'messages required' }, { status: 400 });

    const kbItems = await getCachedKBItems();

    const kbContext = kbItems.length > 0
      ? kbItems.map((item: any) => `[${item.category.toUpperCase()}] ${item.title}\n${item.content}`).join('\n\n---\n\n')
      : 'No knowledge base entries have been added yet.';

    const system = `You are a strategic leadership development advisor embedded within a senior consulting firm's internal knowledge platform. Your purpose is to help the firm deepen and develop their intellectual capital on leadership topics.

You have full access to the firm's current knowledge base:

===KNOWLEDGE BASE===
${kbContext}
===END KNOWLEDGE BASE===

Your role in this conversation:
- Help explore, challenge, and develop leadership frameworks and methodologies
- Identify gaps, inconsistencies, or areas underdeveloped in the knowledge base
- Synthesize ideas into structured insights that could become new KB entries
- Ask probing questions that surface tacit knowledge worth capturing
- Provide expert perspective grounded in the firm's existing IP
- Reference specific KB entries when relevant (cite them by name)

When you surface something worth adding to the knowledge base, flag it clearly with:
📌 KB SUGGESTION: [Title]
[Content ready to add]

Be direct, intellectually rigorous, and think like a senior advisor — not a chatbot. Challenge assumptions. Connect dots across entries. Surface what's missing.`;

    const msg = await getAnthropic().messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 2048,
      system,
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
    });

    const content = msg.content[0].type === 'text' ? msg.content[0].text : '';
    return NextResponse.json({ content });

  } catch (err: any) {
    console.error('KB chat error:', err);
    return NextResponse.json({ error: err.message ?? 'Chat failed.' }, { status: 500 });
  }
}
