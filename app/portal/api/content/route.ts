import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/portal/supabase-server';

export async function GET(req: NextRequest) {
  const supabase = createAdminClient();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (id) {
    const { data, error } = await supabase.from('insights_articles').select('*').eq('id', id).single();
    if (error) return NextResponse.json({ error: 'Not found.' }, { status: 404 });
    return NextResponse.json({ article: data });
  }

  const { data, error } = await supabase
    .from('insights_articles')
    .select('id, slug, title, category, type, date, author, is_published, created_at')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: 'Failed to load.' }, { status: 500 });
  return NextResponse.json({ articles: data ?? [] });
}

export async function POST(req: NextRequest) {
  const supabase = createAdminClient();

  try {
    const body = await req.json();
    const { action } = body;

    if (action === 'create' || action === 'update') {
      const { id, slug, title, category, type, read_time, date, excerpt, author, author_title, content_paragraphs, is_published } = body;

      if (!title || !category || !slug) {
        return NextResponse.json({ error: 'title, category, and slug are required.' }, { status: 400 });
      }

      const payload = {
        slug: slug.trim().toLowerCase().replace(/\s+/g, '-'),
        title: title.trim(),
        category,
        type: type ?? 'article',
        read_time: read_time || '5 min read',
        date: date || new Date().toISOString().slice(0, 10),
        excerpt: excerpt?.trim() || '',
        author: author?.trim() || '',
        author_title: author_title?.trim() || '',
        content_paragraphs: content_paragraphs || [],
        is_published: is_published ?? false,
        updated_at: new Date().toISOString(),
      };

      if (action === 'update' && id) {
        const { error } = await supabase.from('insights_articles').update(payload).eq('id', id);
        if (error) return NextResponse.json({ error: 'Update failed.' }, { status: 500 });
        return NextResponse.json({ ok: true });
      } else {
        const { data, error } = await supabase.from('insights_articles').insert({ ...payload, created_at: new Date().toISOString() }).select('id').single();
        if (error) return NextResponse.json({ error: 'Create failed.' }, { status: 500 });
        return NextResponse.json({ id: data.id });
      }
    }

    if (action === 'toggle_published') {
      const { id, is_published } = body;
      const { error } = await supabase.from('insights_articles').update({ is_published }).eq('id', id);
      if (error) return NextResponse.json({ error: 'Update failed.' }, { status: 500 });
      return NextResponse.json({ ok: true });
    }

    if (action === 'delete') {
      await supabase.from('insights_articles').delete().eq('id', body.id);
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: 'Unknown action.' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? 'Request failed.' }, { status: 500 });
  }
}
