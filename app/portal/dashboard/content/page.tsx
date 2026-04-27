'use client';

import { useState, useEffect } from 'react';
import { Plus, Eye, EyeOff, Trash2, Pencil, Loader2, X, ChevronLeft } from 'lucide-react';

interface Article {
  id: string;
  slug: string;
  title: string;
  category: string;
  type: string;
  date: string;
  author: string;
  is_published: boolean;
  created_at: string;
}

const CATEGORIES = ['AI & Leadership', 'Assessment', 'Coaching', 'Succession', 'Culture', 'Healthcare', 'Technology', 'Financial Services', 'Leadership Strategy'];
const TYPES = ['article', 'research'];

export default function ContentPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  // Form state
  const [form, setForm] = useState({
    slug: '', title: '', category: CATEGORIES[0], type: 'article',
    read_time: '6 min read', date: new Date().toISOString().slice(0, 10),
    excerpt: '', author: '', author_title: '', content_text: '', is_published: false,
  });

  useEffect(() => { loadArticles(); }, []);

  const loadArticles = async () => {
    setLoading(true);
    const res = await fetch('/portal/api/content');
    const data = await res.json();
    setArticles(data.articles ?? []);
    setLoading(false);
  };

  const openNew = () => {
    setForm({ slug: '', title: '', category: CATEGORIES[0], type: 'article', read_time: '6 min read', date: new Date().toISOString().slice(0, 10), excerpt: '', author: '', author_title: '', content_text: '', is_published: false });
    setEditing({ isNew: true });
    setSaveError('');
  };

  const openEdit = async (id: string) => {
    const res = await fetch(`/portal/api/content?id=${id}`);
    const data = await res.json();
    const a = data.article;
    setForm({
      slug: a.slug, title: a.title, category: a.category, type: a.type,
      read_time: a.read_time, date: a.date, excerpt: a.excerpt,
      author: a.author, author_title: a.author_title,
      content_text: (a.content_paragraphs ?? []).join('\n\n'),
      is_published: a.is_published,
    });
    setEditing({ id });
    setSaveError('');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError('');
    setSaving(true);
    try {
      const paragraphs = form.content_text.split(/\n{2,}/).map(p => p.trim()).filter(Boolean);
      const res = await fetch('/portal/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: editing?.isNew ? 'create' : 'update',
          id: editing?.id,
          ...form,
          content_paragraphs: paragraphs,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Save failed.');
      setEditing(null);
      await loadArticles();
    } catch (err: any) {
      setSaveError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const togglePublished = async (article: Article) => {
    await fetch('/portal/api/content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'toggle_published', id: article.id, is_published: !article.is_published }),
    });
    setArticles(prev => prev.map(a => a.id === article.id ? { ...a, is_published: !a.is_published } : a));
  };

  const deleteArticle = async (id: string) => {
    if (!confirm('Delete this article permanently?')) return;
    await fetch('/portal/api/content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete', id }),
    });
    setArticles(prev => prev.filter(a => a.id !== id));
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 14px', fontSize: 14, color: '#1a3a2a',
    background: '#f5f9f7', border: '1px solid rgba(93,171,121,0.2)', borderRadius: 10, outline: 'none',
  };
  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#b8913b', marginBottom: 6,
  };
  const cardStyle = {
    background: '#ffffff', border: '1px solid rgba(93,171,121,0.18)', borderRadius: 16, boxShadow: '0 2px 16px rgba(10,15,28,0.05)',
  };

  // Editor view
  if (editing) {
    return (
      <div style={{ padding: '32px 40px', maxWidth: 800, margin: '0 auto' }}>
        <button onClick={() => setEditing(null)} className="flex items-center gap-2 text-sm font-medium mb-6" style={{ color: '#6b9a7d', background: 'none', border: 'none', cursor: 'pointer' }}>
          <ChevronLeft size={16} /> Back to content
        </button>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1a3a2a', fontFamily: "'DM Serif Display', serif", marginBottom: 24 }}>
          {editing.isNew ? 'New Article' : 'Edit Article'}
        </h1>

        <form onSubmit={handleSave} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label style={labelStyle}>Title <span style={{ color: '#ef4444' }}>*</span></label>
              <input type="text" value={form.title} onChange={e => { setForm(f => ({ ...f, title: e.target.value, slug: f.slug || e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') })); }} style={inputStyle} required />
            </div>
            <div>
              <label style={labelStyle}>Slug <span style={{ color: '#ef4444' }}>*</span></label>
              <input type="text" value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} style={inputStyle} required />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label style={labelStyle}>Category</label>
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} style={inputStyle}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Type</label>
              <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} style={inputStyle}>
                {TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Date</label>
              <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} style={inputStyle} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label style={labelStyle}>Author</label>
              <input type="text" value={form.author} onChange={e => setForm(f => ({ ...f, author: e.target.value }))} style={inputStyle} placeholder="Dr. Jane Smith" />
            </div>
            <div>
              <label style={labelStyle}>Author Title</label>
              <input type="text" value={form.author_title} onChange={e => setForm(f => ({ ...f, author_title: e.target.value }))} style={inputStyle} placeholder="Head of Leadership Practice" />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Read Time</label>
            <input type="text" value={form.read_time} onChange={e => setForm(f => ({ ...f, read_time: e.target.value }))} style={{ ...inputStyle, maxWidth: 160 }} placeholder="6 min read" />
          </div>

          <div>
            <label style={labelStyle}>Excerpt</label>
            <textarea value={form.excerpt} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))} rows={3} style={{ ...inputStyle, resize: 'vertical' }} placeholder="2-3 sentence summary shown on the insights listing page" />
          </div>

          <div>
            <label style={labelStyle}>Article Content</label>
            <p style={{ fontSize: 11, color: '#9ab5a3', marginBottom: 6 }}>Separate paragraphs with a blank line.</p>
            <textarea value={form.content_text} onChange={e => setForm(f => ({ ...f, content_text: e.target.value }))} rows={16} style={{ ...inputStyle, resize: 'vertical', fontFamily: 'monospace', fontSize: 13 }} placeholder="First paragraph...&#10;&#10;Second paragraph..." />
          </div>

          <div className="flex items-center gap-3">
            <input type="checkbox" id="published" checked={form.is_published} onChange={e => setForm(f => ({ ...f, is_published: e.target.checked }))} />
            <label htmlFor="published" style={{ fontSize: 14, color: '#3d6b4f', cursor: 'pointer' }}>Publish immediately</label>
          </div>

          {saveError && (
            <div style={{ padding: '10px 14px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, fontSize: 13, color: '#ef4444' }}>
              {saveError}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setEditing(null)} style={{ padding: '11px 20px', fontSize: 14, color: '#6b9a7d', background: 'transparent', border: '1px solid rgba(93,171,121,0.2)', borderRadius: 10, cursor: 'pointer' }}>
              Cancel
            </button>
            <button type="submit" disabled={saving} style={{ padding: '11px 24px', fontSize: 14, fontWeight: 700, color: '#fff', background: saving ? 'rgba(93,171,121,0.4)' : 'linear-gradient(135deg, #5dab79, #4a9468)', border: 'none', borderRadius: 10, cursor: saving ? 'not-allowed' : 'pointer' }}>
              {saving ? 'Saving…' : 'Save Article'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  // List view
  return (
    <div style={{ padding: '32px 40px', maxWidth: 900, margin: '0 auto' }}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: '#1a3a2a', fontFamily: "'DM Serif Display', serif", marginBottom: 4 }}>Content Manager</h1>
          <p style={{ fontSize: 14, color: '#6b9a7d' }}>Add and manage articles for the Insights Hub</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 text-sm font-bold"
          style={{ padding: '10px 18px', background: 'linear-gradient(135deg, #5dab79, #4a9468)', color: '#fff', border: 'none', borderRadius: 12, cursor: 'pointer' }}>
          <Plus size={15} /> New Article
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 size={24} style={{ color: '#5dab79', animation: 'spin 1s linear infinite' }} /></div>
      ) : articles.length === 0 ? (
        <div style={{ ...cardStyle, padding: '60px 40px', textAlign: 'center' }}>
          <p style={{ fontSize: 14, color: '#9ab5a3', marginBottom: 16 }}>No custom articles yet. Static articles from the codebase are always shown.</p>
          <button onClick={openNew} className="flex items-center gap-2 text-sm font-bold mx-auto"
            style={{ padding: '10px 18px', background: 'linear-gradient(135deg, #5dab79, #4a9468)', color: '#fff', border: 'none', borderRadius: 12, cursor: 'pointer' }}>
            <Plus size={15} /> New Article
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {articles.map(article => (
            <div key={article.id} style={cardStyle} className="flex items-center gap-4 px-6 py-4">
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: article.is_published ? '#5dab79' : '#d1d5db', flexShrink: 0 }} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p style={{ fontSize: 15, fontWeight: 700, color: '#1a3a2a' }}>{article.title}</p>
                </div>
                <div className="flex items-center gap-3 mt-1 flex-wrap">
                  <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 20, background: 'rgba(184,145,59,0.1)', color: '#b8913b' }}>{article.category}</span>
                  <span style={{ fontSize: 12, color: '#9ab5a3' }}>{article.date}</span>
                  <span style={{ fontSize: 12, color: '#9ab5a3' }}>{article.author}</span>
                  {!article.is_published && <span style={{ fontSize: 11, color: '#9ab5a3' }}>Draft</span>}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => togglePublished(article)} title={article.is_published ? 'Unpublish' : 'Publish'}
                  style={{ padding: '6px', borderRadius: 8, color: article.is_published ? '#5dab79' : '#9ab5a3', background: 'transparent', border: '1px solid rgba(93,171,121,0.15)', cursor: 'pointer' }}>
                  {article.is_published ? <Eye size={15} /> : <EyeOff size={15} />}
                </button>
                <button onClick={() => openEdit(article.id)} style={{ padding: '6px', borderRadius: 8, color: '#b8913b', background: 'transparent', border: '1px solid rgba(184,145,59,0.2)', cursor: 'pointer' }}>
                  <Pencil size={15} />
                </button>
                <button onClick={() => deleteArticle(article.id)} style={{ padding: '6px', borderRadius: 8, color: '#ef4444', background: 'transparent', border: '1px solid rgba(239,68,68,0.15)', cursor: 'pointer' }}>
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
