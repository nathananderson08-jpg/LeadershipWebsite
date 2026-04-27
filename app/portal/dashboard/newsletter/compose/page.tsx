'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Sparkles, Save, Copy, Check, Loader2, RefreshCw } from 'lucide-react';
import { ALL_ARTICLES } from '@/lib/insights-data';

interface NewsletterSections {
  opening: string;
  main_content: string;
  commercial: string;
  links: string[];
  closing: string;
}

interface GeneratedNewsletter {
  subject: string;
  preview_text: string;
  sections: NewsletterSections;
}

const TONES = ['Authoritative & thought-provoking', 'Warm & collegial', 'Direct & challenging', 'Analytical & evidence-based'];
const AUDIENCES = ['CHROs & senior HR leaders', 'C-suite executives', 'Talent development leaders', 'Boards & governance', 'General leadership audience'];

export default function ComposePage() {
  const searchParams = useSearchParams();
  const draftId = searchParams.get('id');

  // Compose form
  const [topic, setTopic] = useState('');
  const [audience, setAudience] = useState(AUDIENCES[0]);
  const [tone, setTone] = useState(TONES[0]);
  const [commercialMessage, setCommercialMessage] = useState('');
  const [additionalContext, setAdditionalContext] = useState('');
  const [selectedArticles, setSelectedArticles] = useState<string[]>([]);

  // Generated content
  const [newsletter, setNewsletter] = useState<GeneratedNewsletter | null>(null);
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState('');

  // Draft saving
  const [currentDraftId, setCurrentDraftId] = useState<string | null>(draftId);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  // Edit mode for sections
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState('');

  useEffect(() => {
    if (draftId) loadDraft(draftId);
  }, [draftId]);

  const loadDraft = async (id: string) => {
    const res = await fetch(`/portal/api/newsletter?action=draft&id=${id}`);
    const data = await res.json();
    if (data.draft) {
      const d = data.draft;
      if (d.body_json) {
        const parsed = typeof d.body_json === 'string' ? JSON.parse(d.body_json) : d.body_json;
        setNewsletter(parsed.newsletter ?? null);
        setTopic(parsed.topic ?? '');
        setAudience(parsed.audience ?? AUDIENCES[0]);
        setTone(parsed.tone ?? TONES[0]);
        setCommercialMessage(parsed.commercial_message ?? '');
      }
    }
  };

  const generate = async () => {
    if (!topic.trim()) return;
    setGenerating(true);
    setGenError('');
    try {
      const includedArticles = ALL_ARTICLES
        .filter(a => selectedArticles.includes(a.slug))
        .map(a => ({ title: a.title, category: a.category, excerpt: a.excerpt }));

      const res = await fetch('/portal/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'compose',
          topic, audience, tone,
          commercial_message: commercialMessage,
          additional_context: additionalContext,
          include_articles: includedArticles,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Generation failed.');
      setNewsletter(data.newsletter);
    } catch (err: any) {
      setGenError(err.message);
    } finally {
      setGenerating(false);
    }
  };

  const saveDraft = async () => {
    if (!newsletter) return;
    setSaving(true);
    try {
      const body_json = JSON.stringify({ newsletter, topic, audience, tone, commercial_message: commercialMessage });
      const res = await fetch('/portal/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save_draft',
          id: currentDraftId,
          subject: newsletter.subject,
          preview_text: newsletter.preview_text,
          body_json,
        }),
      });
      const data = await res.json();
      if (data.id) setCurrentDraftId(data.id);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  const copyToClipboard = () => {
    if (!newsletter) return;
    const { sections } = newsletter;
    const text = [
      `SUBJECT: ${newsletter.subject}`,
      `PREVIEW: ${newsletter.preview_text}`,
      '',
      sections.opening,
      '',
      sections.main_content,
      '',
      sections.commercial,
      '',
      'RESOURCES:',
      ...sections.links.map(l => `• ${l}`),
      '',
      sections.closing,
    ].join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const updateSection = (key: string, value: string) => {
    if (!newsletter) return;
    if (key === 'subject') setNewsletter({ ...newsletter, subject: value });
    else if (key === 'preview_text') setNewsletter({ ...newsletter, preview_text: value });
    else setNewsletter({ ...newsletter, sections: { ...newsletter.sections, [key]: value } });
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 14px', fontSize: 14, color: '#1a3a2a',
    background: '#f5f9f7', border: '1px solid rgba(93,171,121,0.2)', borderRadius: 10, outline: 'none',
  };

  const sectionStyle: React.CSSProperties = {
    background: '#ffffff', border: '1px solid rgba(93,171,121,0.15)', borderRadius: 12, padding: '20px 24px', marginBottom: 16,
  };

  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#b8913b', marginBottom: 6,
  };

  return (
    <div style={{ padding: '32px 40px', maxWidth: 1100, margin: '0 auto' }}>
      <Link href="/portal/dashboard/newsletter" className="flex items-center gap-2 text-sm font-medium mb-6" style={{ color: '#6b9a7d' }}>
        <ChevronLeft size={16} /> Back to Newsletter
      </Link>

      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <h1 style={{ fontSize: 26, fontWeight: 700, color: '#1a3a2a', fontFamily: "'DM Serif Display', serif" }}>
          {draftId ? 'Edit Newsletter' : 'Compose Newsletter'}
        </h1>
        {newsletter && (
          <div className="flex gap-3">
            <button onClick={copyToClipboard} className="flex items-center gap-2 text-sm font-semibold"
              style={{ padding: '8px 14px', border: '1px solid rgba(93,171,121,0.2)', borderRadius: 10, color: '#3d6b4f', cursor: 'pointer', background: 'transparent' }}>
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? 'Copied' : 'Copy'}
            </button>
            <button onClick={saveDraft} disabled={saving} className="flex items-center gap-2 text-sm font-semibold"
              style={{ padding: '8px 14px', background: saved ? 'rgba(93,171,121,0.15)' : 'linear-gradient(135deg, #5dab79, #4a9468)', color: saved ? '#3d6b4f' : '#fff', border: 'none', borderRadius: 10, cursor: saving ? 'not-allowed' : 'pointer' }}>
              <Save size={14} />
              {saving ? 'Saving…' : saved ? 'Saved' : 'Save Draft'}
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left: compose form */}
        <div className="lg:col-span-2 space-y-5">
          <div style={{ background: '#ffffff', border: '1px solid rgba(93,171,121,0.18)', borderRadius: 16, padding: '24px' }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: '#1a3a2a', marginBottom: 20 }}>Newsletter Brief</h2>

            <div className="space-y-4">
              <div>
                <label style={labelStyle}>Topic / Theme <span style={{ color: '#ef4444' }}>*</span></label>
                <textarea value={topic} onChange={e => setTopic(e.target.value)} rows={3}
                  style={{ ...inputStyle, resize: 'vertical' }}
                  placeholder="e.g. Why most AI transformation programs fail at the leadership layer" />
              </div>

              <div>
                <label style={labelStyle}>Target Audience</label>
                <select value={audience} onChange={e => setAudience(e.target.value)} style={inputStyle}>
                  {AUDIENCES.map(a => <option key={a}>{a}</option>)}
                </select>
              </div>

              <div>
                <label style={labelStyle}>Tone</label>
                <select value={tone} onChange={e => setTone(e.target.value)} style={inputStyle}>
                  {TONES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>

              <div>
                <label style={labelStyle}>Commercial Message (optional)</label>
                <textarea value={commercialMessage} onChange={e => setCommercialMessage(e.target.value)} rows={2}
                  style={{ ...inputStyle, resize: 'vertical' }}
                  placeholder="e.g. Reference our AI Leadership Assessment program" />
              </div>

              <div>
                <label style={labelStyle}>Additional Context (optional)</label>
                <textarea value={additionalContext} onChange={e => setAdditionalContext(e.target.value)} rows={2}
                  style={{ ...inputStyle, resize: 'vertical' }}
                  placeholder="e.g. Include reference to recent McKinsey report on AI adoption" />
              </div>

              <div>
                <label style={labelStyle}>Include Articles (optional)</label>
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  {ALL_ARTICLES.slice(0, 20).map(a => (
                    <label key={a.slug} className="flex items-start gap-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50">
                      <input type="checkbox" checked={selectedArticles.includes(a.slug)}
                        onChange={e => setSelectedArticles(prev => e.target.checked ? [...prev, a.slug] : prev.filter(s => s !== a.slug))}
                        style={{ marginTop: 2, flexShrink: 0 }} />
                      <span style={{ fontSize: 12, color: '#3d6b4f', lineHeight: 1.4 }}>{a.title}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {genError && (
              <div style={{ marginTop: 12, padding: '10px 14px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, fontSize: 13, color: '#ef4444' }}>
                {genError}
              </div>
            )}

            <button onClick={generate} disabled={generating || !topic.trim()}
              className="flex items-center justify-center gap-2 w-full mt-5 text-sm font-bold"
              style={{ padding: '12px', background: generating || !topic.trim() ? 'rgba(93,171,121,0.3)' : 'linear-gradient(135deg, #b8913b, #a07830)', color: '#fff', border: 'none', borderRadius: 12, cursor: generating || !topic.trim() ? 'not-allowed' : 'pointer' }}>
              {generating ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Sparkles size={16} />}
              {generating ? 'Generating…' : newsletter ? 'Regenerate' : 'Generate Newsletter'}
            </button>
          </div>
        </div>

        {/* Right: preview */}
        <div className="lg:col-span-3">
          {!newsletter ? (
            <div style={{ background: '#ffffff', border: '1px solid rgba(93,171,121,0.18)', borderRadius: 16, padding: '60px 40px', textAlign: 'center' }}>
              <Sparkles size={28} style={{ margin: '0 auto 12px', color: '#b8913b', opacity: 0.5 }} />
              <p style={{ fontSize: 14, color: '#9ab5a3' }}>Fill in the brief and click Generate to create your newsletter draft.</p>
            </div>
          ) : (
            <div>
              <div style={{ marginBottom: 12, padding: '12px 16px', background: 'rgba(184,145,59,0.08)', border: '1px solid rgba(184,145,59,0.2)', borderRadius: 12 }}>
                <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#b8913b', marginBottom: 4 }}>Subject Line</p>
                <input value={newsletter.subject} onChange={e => updateSection('subject', e.target.value)}
                  style={{ width: '100%', fontSize: 15, fontWeight: 700, color: '#1a3a2a', background: 'transparent', border: 'none', outline: 'none' }} />
                <p style={{ fontSize: 11, color: '#9ab5a3', marginTop: 4 }}>Preview: {newsletter.preview_text}</p>
              </div>

              {[
                { key: 'opening', label: 'Opening', isText: true },
                { key: 'main_content', label: 'Main Content', isText: true },
                { key: 'commercial', label: 'Commercial Message', isText: true },
                { key: 'closing', label: 'Closing', isText: true },
              ].map(({ key, label, isText }) => (
                <div key={key} style={sectionStyle}>
                  <div className="flex items-center justify-between mb-3">
                    <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#b8913b' }}>{label}</p>
                    <button onClick={() => { setEditingSection(editingSection === key ? null : key); setEditedContent((newsletter.sections as any)[key]); }}
                      style={{ fontSize: 11, color: '#6b9a7d', background: 'none', border: 'none', cursor: 'pointer' }}>
                      {editingSection === key ? 'Done' : 'Edit'}
                    </button>
                  </div>
                  {editingSection === key ? (
                    <textarea
                      value={(newsletter.sections as any)[key]}
                      onChange={e => updateSection(key, e.target.value)}
                      rows={6}
                      style={{ ...inputStyle, resize: 'vertical', fontSize: 14 }}
                    />
                  ) : (
                    <p style={{ fontSize: 14, color: '#3d6b4f', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{(newsletter.sections as any)[key]}</p>
                  )}
                </div>
              ))}

              <div style={sectionStyle}>
                <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#b8913b', marginBottom: 12 }}>Links & Resources</p>
                <ul className="space-y-2">
                  {newsletter.sections.links.map((link, i) => (
                    <li key={i} style={{ fontSize: 14, color: '#3d6b4f', display: 'flex', gap: 8 }}>
                      <span style={{ color: '#b8913b', fontWeight: 700 }}>→</span>
                      <input value={link}
                        onChange={e => {
                          const newLinks = [...newsletter.sections.links];
                          newLinks[i] = e.target.value;
                          updateSection('links', newLinks as any);
                        }}
                        style={{ flex: 1, fontSize: 14, color: '#3d6b4f', background: 'transparent', border: 'none', outline: 'none' }} />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
