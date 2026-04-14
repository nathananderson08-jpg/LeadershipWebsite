'use client';

import { useState, useRef, useEffect, useCallback, DragEvent } from 'react';
import {
  Plus, X, Edit2, Trash2, BookOpen, AlertCircle, Loader2,
  Tag, ChevronDown, Link2, Send, Save, MessageSquare, Upload,
} from 'lucide-react';
import { useKnowledgeBase, type KnowledgeBaseItem, type CreateKBInput } from '@/hooks/portal/useLeadForge';

// ── Constants ─────────────────────────────────────────────────────────────────

const CONTENT_CATEGORIES = ['Methodology', 'Case Study', 'Product/Service', 'Insight', 'General'] as const;
const ALL_CATEGORIES = [...CONTENT_CATEGORIES, 'Chat'] as const;
type Category = typeof ALL_CATEGORIES[number] | 'All';

const CATEGORY_COLORS: Record<string, { color: string; bg: string }> = {
  Methodology:       { color: '#6366f1', bg: 'rgba(99,102,241,0.1)'   },
  'Case Study':      { color: '#22c55e', bg: 'rgba(34,197,94,0.1)'    },
  'Product/Service': { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)'   },
  Insight:           { color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)'   },
  General:           { color: '#94a3b8', bg: 'rgba(148,163,184,0.1)'  },
  Chat:              { color: '#0ea5e9', bg: 'rgba(14,165,233,0.1)'   },
};

// ── Chat types ────────────────────────────────────────────────────────────────

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function CategoryBadge({ category }: { category: string }) {
  const s = CATEGORY_COLORS[category] ?? CATEGORY_COLORS.General;
  return (
    <span style={{ ...s, fontSize: 11, fontWeight: 700, padding: '2px 9px', borderRadius: 999, whiteSpace: 'nowrap' as const }}>
      {category}
    </span>
  );
}

function getChatPreview(content: string): string {
  try {
    const msgs: ChatMessage[] = JSON.parse(content);
    const first = msgs.find(m => m.role === 'user');
    return first?.content.slice(0, 120) ?? '…';
  } catch {
    return content.slice(0, 120);
  }
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 14px',
  border: '1px solid var(--portal-border-default)', borderRadius: 10,
  fontSize: 13, color: 'var(--portal-text-primary)',
  background: 'var(--portal-bg-hover)', outline: 'none',
  boxSizing: 'border-box',
};

const labelStyle: React.CSSProperties = {
  fontSize: 12, fontWeight: 600, color: 'var(--portal-text-secondary)',
  display: 'block', marginBottom: 6,
};

// ── Setup panel ───────────────────────────────────────────────────────────────

function SetupPanel() {
  return (
    <div style={{ padding: 32, background: 'var(--portal-bg-secondary)', border: '1px solid var(--portal-border-default)', borderRadius: 16, maxWidth: 620, marginInline: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(245,158,11,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <AlertCircle size={20} color="#f59e0b" />
        </div>
        <div>
          <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--portal-text-primary)', margin: 0 }}>Database table not found</p>
          <p style={{ fontSize: 12, color: 'var(--portal-text-tertiary)', margin: '2px 0 0' }}>Run the migration to enable the Knowledge Base</p>
        </div>
      </div>
      <p style={{ fontSize: 13, color: 'var(--portal-text-secondary)', margin: '0 0 16px', lineHeight: 1.6 }}>
        The <code style={{ background: 'var(--portal-bg-hover)', padding: '1px 6px', borderRadius: 4, fontFamily: 'monospace' }}>leadforge_knowledge_base</code> table doesn&apos;t exist yet. Run <code style={{ background: 'var(--portal-bg-hover)', padding: '1px 6px', borderRadius: 4, fontFamily: 'monospace' }}>supabase-kb-migration.sql</code> in your Supabase SQL editor.
      </p>
    </div>
  );
}

// ── Add / Edit Modal ──────────────────────────────────────────────────────────

interface ModalProps {
  initial?: KnowledgeBaseItem;
  prefill?: Partial<CreateKBInput>;
  onClose: () => void;
  onSave: (input: CreateKBInput) => Promise<void>;
}

function KBModal({ initial, prefill, onClose, onSave }: ModalProps) {
  const [form, setForm] = useState<CreateKBInput>({
    title:    initial?.title    ?? prefill?.title    ?? '',
    category: initial?.category ?? prefill?.category ?? 'General',
    content:  initial?.content  ?? prefill?.content  ?? '',
    tags:     initial?.tags     ?? prefill?.tags     ?? [],
  });
  const [tagsInput, setTagsInput] = useState((initial?.tags ?? prefill?.tags ?? []).join(', '));
  const [urlInput, setUrlInput] = useState('');
  const [fetchingUrl, setFetchingUrl] = useState(false);
  const [fetchError, setFetchError] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleFetchUrl = async () => {
    if (!urlInput.trim()) return;
    setFetchingUrl(true);
    setFetchError('');
    try {
      const res = await fetch('/portal/api/leadforge/kb-fetch-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: urlInput.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Fetch failed.');
      setForm(f => ({
        ...f,
        title: f.title || data.title,
        content: data.content,
      }));
      // store the URL in a tag
      const urlTag = urlInput.trim();
      if (!tagsInput.includes(urlTag)) {
        setTagsInput(t => t ? `${t}, ${urlTag}` : urlTag);
      }
    } catch (e: any) {
      setFetchError(e.message ?? 'Could not fetch URL.');
    } finally {
      setFetchingUrl(false);
    }
  };

  const handleSave = async () => {
    if (!form.title.trim()) { setError('Title is required.'); return; }
    if (!form.content.trim()) { setError('Content is required.'); return; }
    setSaving(true);
    setError('');
    try {
      const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);
      await onSave({ ...form, tags });
      onClose();
    } catch (e: any) {
      setError(e.message ?? 'Failed to save.');
      setSaving(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ background: 'var(--portal-bg-secondary)', borderRadius: 20, padding: 32, width: '100%', maxWidth: 600, maxHeight: '92vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ fontSize: 17, fontWeight: 700, color: 'var(--portal-text-primary)', margin: 0 }}>
            {initial ? 'Edit Entry' : 'Add Knowledge Base Entry'}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--portal-text-tertiary)', padding: 4 }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* URL fetch */}
          <div>
            <label style={labelStyle}>Import from URL <span style={{ fontWeight: 400, color: 'var(--portal-text-tertiary)' }}>— optional</span></label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                style={{ ...inputStyle, flex: 1 }}
                value={urlInput}
                onChange={e => setUrlInput(e.target.value)}
                placeholder="https://example.com/article"
                onKeyDown={e => e.key === 'Enter' && handleFetchUrl()}
              />
              <button
                onClick={handleFetchUrl}
                disabled={!urlInput.trim() || fetchingUrl}
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 16px', border: '1px solid var(--portal-border-default)', borderRadius: 10, background: 'var(--portal-bg-hover)', fontSize: 12, fontWeight: 600, color: 'var(--portal-text-secondary)', cursor: urlInput.trim() && !fetchingUrl ? 'pointer' : 'default', flexShrink: 0, opacity: fetchingUrl ? 0.6 : 1 }}
              >
                {fetchingUrl ? <Loader2 size={12} style={{ animation: 'spin 0.8s linear infinite' }} /> : <Link2 size={12} />}
                {fetchingUrl ? 'Fetching…' : 'Fetch'}
              </button>
            </div>
            {fetchError && <p style={{ fontSize: 11, color: '#ef4444', margin: '4px 0 0' }}>{fetchError}</p>}
          </div>

          <div>
            <label style={labelStyle}>Title *</label>
            <input style={inputStyle} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Leadership Acceleration Framework" />
          </div>

          <div>
            <label style={labelStyle}>Category</label>
            <div style={{ position: 'relative' }}>
              <select
                style={{ ...inputStyle, cursor: 'pointer', appearance: 'none', paddingRight: 36 }}
                value={form.category}
                onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
              >
                {CONTENT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <ChevronDown size={14} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--portal-text-tertiary)', pointerEvents: 'none' }} />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Content *</label>
            <textarea
              style={{ ...inputStyle, resize: 'vertical', minHeight: 160, lineHeight: 1.6 }}
              value={form.content}
              onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
              placeholder="Describe the methodology, case study, service offering, or insight in detail. This content is injected into AI prompts to ground outputs in your firm's actual IP."
            />
          </div>

          <div>
            <label style={labelStyle}>Tags <span style={{ fontWeight: 400, color: 'var(--portal-text-tertiary)' }}>— comma-separated</span></label>
            <input style={inputStyle} value={tagsInput} onChange={e => setTagsInput(e.target.value)} placeholder="e.g. CHRO, succession, change management" />
          </div>

          {error && <p style={{ fontSize: 12, color: '#ef4444', margin: 0 }}>{error}</p>}

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
            <button onClick={onClose} style={{ padding: '10px 20px', border: '1px solid var(--portal-border-default)', borderRadius: 10, background: 'none', fontSize: 13, fontWeight: 600, color: 'var(--portal-text-secondary)', cursor: 'pointer' }}>
              Cancel
            </button>
            <button onClick={handleSave} disabled={saving} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 20px', border: 'none', borderRadius: 10, background: 'var(--portal-accent)', color: 'white', fontSize: 13, fontWeight: 600, cursor: saving ? 'default' : 'pointer', opacity: saving ? 0.7 : 1 }}>
              {saving && <Loader2 size={13} style={{ animation: 'spin 0.8s linear infinite' }} />}
              {saving ? 'Saving…' : 'Save Entry'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── KB Table ──────────────────────────────────────────────────────────────────

function KBTable({ items, onEdit, onDelete }: {
  items: KnowledgeBaseItem[];
  onEdit: (item: KnowledgeBaseItem) => void;
  onDelete: (item: KnowledgeBaseItem) => void;
}) {
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = async (item: KnowledgeBaseItem) => {
    setDeleting(item.id);
    try {
      await onDelete(item);
    } finally {
      setDeleting(null);
      setConfirmId(null);
    }
  };

  if (items.length === 0) return null;

  const thStyle: React.CSSProperties = {
    padding: '10px 14px', fontSize: 11, fontWeight: 700,
    color: 'var(--portal-text-tertiary)', textTransform: 'uppercase',
    letterSpacing: '0.07em', textAlign: 'left', whiteSpace: 'nowrap',
    borderBottom: '1px solid var(--portal-border-default)',
    background: 'var(--portal-bg-hover)',
  };

  return (
    <div style={{ background: 'var(--portal-bg-secondary)', border: '1px solid var(--portal-border-default)', borderRadius: 14, overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={thStyle}>Name</th>
            <th style={{ ...thStyle, display: 'none' } as React.CSSProperties}>Category</th>
            <th style={thStyle}>Preview</th>
            <th style={thStyle}>Tags</th>
            <th style={thStyle}>Added</th>
            <th style={{ ...thStyle, textAlign: 'right' as const }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => {
            const preview = item.category === 'Chat'
              ? getChatPreview(item.content)
              : item.content.slice(0, 110) + (item.content.length > 110 ? '…' : '');

            return (
              <tr key={item.id} style={{ borderTop: i > 0 ? '1px solid var(--portal-border-default)' : 'none' }}>
                {/* Name */}
                <td style={{ padding: '13px 14px', minWidth: 180, maxWidth: 240, verticalAlign: 'top' }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--portal-text-primary)', margin: '0 0 5px', lineHeight: 1.3 }}>{item.title}</p>
                  <CategoryBadge category={item.category} />
                </td>

                {/* Preview */}
                <td style={{ padding: '13px 14px', verticalAlign: 'top' }}>
                  <p style={{ fontSize: 12, color: 'var(--portal-text-secondary)', margin: 0, lineHeight: 1.6 }}>{preview}</p>
                </td>

                {/* Tags */}
                <td style={{ padding: '13px 14px', verticalAlign: 'top', minWidth: 120 }}>
                  {item.tags.length > 0 ? (
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                      {item.tags.slice(0, 3).map(tag => (
                        <span key={tag} style={{ fontSize: 10, fontWeight: 600, padding: '1px 7px', borderRadius: 999, background: 'var(--portal-bg-hover)', color: 'var(--portal-text-tertiary)', whiteSpace: 'nowrap' }}>
                          {tag}
                        </span>
                      ))}
                      {item.tags.length > 3 && <span style={{ fontSize: 10, color: 'var(--portal-text-tertiary)' }}>+{item.tags.length - 3}</span>}
                    </div>
                  ) : <span style={{ fontSize: 11, color: 'var(--portal-text-tertiary)' }}>—</span>}
                </td>

                {/* Date */}
                <td style={{ padding: '13px 14px', verticalAlign: 'top', whiteSpace: 'nowrap' as const }}>
                  <p style={{ fontSize: 12, color: 'var(--portal-text-tertiary)', margin: 0 }}>
                    {new Date(item.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </td>

                {/* Actions */}
                <td style={{ padding: '13px 14px', verticalAlign: 'top', textAlign: 'right' as const, whiteSpace: 'nowrap' as const }}>
                  {confirmId === item.id ? (
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 11, fontWeight: 600, color: '#ef4444' }}>Delete?</span>
                      <button
                        onClick={() => handleDelete(item)}
                        disabled={deleting === item.id}
                        style={{ padding: '3px 10px', border: 'none', borderRadius: 6, background: '#ef4444', color: 'white', fontSize: 11, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                      >
                        {deleting === item.id ? <Loader2 size={10} style={{ animation: 'spin 0.8s linear infinite' }} /> : null}
                        Yes, delete
                      </button>
                      <button
                        onClick={() => setConfirmId(null)}
                        style={{ padding: '3px 10px', border: '1px solid var(--portal-border-default)', borderRadius: 6, background: 'none', fontSize: 11, fontWeight: 600, color: 'var(--portal-text-secondary)', cursor: 'pointer' }}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: 'inline-flex', gap: 6 }}>
                      {item.category !== 'Chat' && (
                        <button
                          onClick={() => onEdit(item)}
                          style={{ width: 28, height: 28, borderRadius: 7, border: '1px solid var(--portal-border-default)', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--portal-text-tertiary)' }}
                          title="Edit"
                        >
                          <Edit2 size={12} />
                        </button>
                      )}
                      <button
                        onClick={() => setConfirmId(item.id)}
                        style={{ width: 28, height: 28, borderRadius: 7, border: '1px solid rgba(239,68,68,0.25)', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444' }}
                        title="Delete"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ── KB Chat Window ────────────────────────────────────────────────────────────

function KBChatWindow({ onSaveToKB }: { onSaveToKB: (messages: ChatMessage[]) => void }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [collapsed, setCollapsed] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');
    setError('');
    const updated: ChatMessage[] = [...messages, { role: 'user', content: text }];
    setMessages(updated);
    setLoading(true);
    try {
      const res = await fetch('/portal/api/leadforge/kb-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updated }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Chat failed.');
      setMessages(prev => [...prev, { role: 'assistant', content: data.content }]);
    } catch (e: any) {
      setError(e.message ?? 'Something went wrong.');
      setMessages(prev => prev.slice(0, -1)); // remove the user message on error
      setInput(text);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const formattedContent = (text: string) => {
    // Basic formatting: bold, KB suggestions highlighted
    return text.split('\n').map((line, i) => {
      if (line.startsWith('📌 KB SUGGESTION:')) {
        return (
          <div key={i} style={{ margin: '8px 0', padding: '8px 12px', background: 'rgba(14,165,233,0.08)', border: '1px solid rgba(14,165,233,0.2)', borderRadius: 8 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#0ea5e9', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 3px' }}>📌 KB Suggestion</p>
            <p style={{ fontSize: 12, color: 'var(--portal-text-secondary)', margin: 0 }}>{line.replace('📌 KB SUGGESTION:', '').trim()}</p>
          </div>
        );
      }
      return line ? <p key={i} style={{ margin: '0 0 6px', fontSize: 13, color: 'var(--portal-text-secondary)', lineHeight: 1.65 }}>{line}</p> : <br key={i} />;
    });
  };

  return (
    <div style={{ border: '1px solid var(--portal-border-default)', borderRadius: 16, overflow: 'hidden', background: 'var(--portal-bg-secondary)' }}>
      {/* Header */}
      <div
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: collapsed ? 'none' : '1px solid var(--portal-border-default)', cursor: 'pointer', background: 'var(--portal-bg-hover)' }}
        onClick={() => setCollapsed(c => !c)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(14,165,233,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MessageSquare size={14} color="#0ea5e9" />
          </div>
          <div>
            <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--portal-text-primary)', margin: 0 }}>Knowledge Assistant</p>
            <p style={{ fontSize: 11, color: 'var(--portal-text-tertiary)', margin: 0 }}>Chat with Claude — full KB context loaded · Shift+Enter for new line</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {messages.length >= 2 && !collapsed && (
            <button
              onClick={e => { e.stopPropagation(); onSaveToKB(messages); }}
              style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 12px', border: '1px solid rgba(14,165,233,0.3)', borderRadius: 7, background: 'rgba(14,165,233,0.08)', fontSize: 11, fontWeight: 700, color: '#0ea5e9', cursor: 'pointer' }}
            >
              <Save size={11} /> Save to KB
            </button>
          )}
          <span style={{ fontSize: 11, color: 'var(--portal-text-tertiary)', fontWeight: 600 }}>{collapsed ? '▲ Expand' : '▼ Collapse'}</span>
        </div>
      </div>

      {!collapsed && (
        <>
          {/* Messages */}
          <div style={{ height: 380, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {messages.length === 0 && (
              <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--portal-text-tertiary)' }}>
                <MessageSquare size={28} style={{ marginBottom: 10, opacity: 0.3 }} />
                <p style={{ fontSize: 13, fontWeight: 600, margin: '0 0 6px', color: 'var(--portal-text-secondary)' }}>Ask anything about your knowledge base</p>
                <p style={{ fontSize: 12, margin: 0, maxWidth: 380, marginInline: 'auto', lineHeight: 1.6 }}>
                  Claude has full context of all your KB entries. Ask it to identify gaps, challenge assumptions, develop frameworks, or surface inconsistencies.
                </p>
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row' }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: msg.role === 'user' ? 'var(--portal-accent)' : 'rgba(14,165,233,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 11, fontWeight: 700, color: msg.role === 'user' ? 'white' : '#0ea5e9' }}>
                  {msg.role === 'user' ? 'Y' : 'C'}
                </div>
                <div style={{ maxWidth: '80%', padding: '10px 14px', borderRadius: 12, background: msg.role === 'user' ? 'var(--portal-accent)' : 'var(--portal-bg-hover)', border: msg.role === 'user' ? 'none' : '1px solid var(--portal-border-default)' }}>
                  {msg.role === 'user' ? (
                    <p style={{ fontSize: 13, color: 'white', margin: 0, lineHeight: 1.6 }}>{msg.content}</p>
                  ) : (
                    <div>{formattedContent(msg.content)}</div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(14,165,233,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 11, fontWeight: 700, color: '#0ea5e9' }}>C</div>
                <div style={{ padding: '12px 16px', borderRadius: 12, background: 'var(--portal-bg-hover)', border: '1px solid var(--portal-border-default)' }}>
                  <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                    {[0, 1, 2].map(i => (
                      <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: '#0ea5e9', animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
            {error && (
              <p style={{ fontSize: 12, color: '#ef4444', padding: '8px 12px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 8, margin: 0 }}>{error}</p>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={{ borderTop: '1px solid var(--portal-border-default)', padding: '12px 16px', display: 'flex', gap: 10, alignItems: 'flex-end' }}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Claude about your knowledge base…"
              rows={2}
              style={{ flex: 1, padding: '10px 14px', border: '1px solid var(--portal-border-default)', borderRadius: 10, fontSize: 13, color: 'var(--portal-text-primary)', background: 'var(--portal-bg-hover)', outline: 'none', resize: 'none', lineHeight: 1.5, fontFamily: 'inherit' }}
            />
            <button
              onClick={send}
              disabled={!input.trim() || loading}
              style={{ width: 40, height: 40, borderRadius: 10, border: 'none', background: input.trim() && !loading ? 'var(--portal-accent)' : 'var(--portal-bg-hover)', color: input.trim() && !loading ? 'white' : 'var(--portal-text-tertiary)', cursor: input.trim() && !loading ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.15s' }}
            >
              <Send size={15} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function KnowledgeBasePage() {
  const { items, loading, tableExists, createItem, updateItem, deleteItem } = useKnowledgeBase();
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<KnowledgeBaseItem | null>(null);
  const [prefill, setPrefill] = useState<Partial<CreateKBInput> | undefined>();
  const [isDragOver, setIsDragOver] = useState(false);
  const dragCounter = useRef(0);

  // Drag and drop handlers
  const handleDragEnter = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    dragCounter.current++;
    if (e.dataTransfer.types.includes('Files') || e.dataTransfer.types.includes('text/plain')) {
      setIsDragOver(true);
    }
  }, []);

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    dragCounter.current--;
    if (dragCounter.current === 0) setIsDragOver(false);
  }, []);

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback(async (e: DragEvent<HTMLDivElement>, category?: string) => {
    e.preventDefault();
    dragCounter.current = 0;
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    const text = e.dataTransfer.getData('text/plain');

    if (files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = ev => {
        const content = (ev.target?.result as string) ?? '';
        setPrefill({
          title: file.name.replace(/\.[^.]+$/, ''),
          content,
          category: category as any ?? 'General',
        });
        setEditItem(null);
        setShowModal(true);
      };
      reader.readAsText(file);
    } else if (text) {
      setPrefill({
        content: text,
        category: category as any ?? 'General',
      });
      setEditItem(null);
      setShowModal(true);
    }
  }, []);

  const filtered = activeCategory === 'All'
    ? items
    : items.filter(i => i.category === activeCategory);

  const handleSaveChat = async (messages: ChatMessage[]) => {
    const firstMsg = messages.find(m => m.role === 'user')?.content.slice(0, 60) ?? 'Chat';
    await createItem({
      title: `Chat: ${firstMsg}${firstMsg.length >= 60 ? '…' : ''}`,
      category: 'Chat',
      content: JSON.stringify(messages),
      tags: ['chat', new Date().toISOString().slice(0, 10)],
    });
  };

  const tabStyle = (active: boolean): React.CSSProperties => ({
    padding: '7px 14px', border: 'none', borderRadius: 8,
    background: active ? 'var(--portal-bg-secondary)' : 'none',
    color: active ? 'var(--portal-text-primary)' : 'var(--portal-text-tertiary)',
    fontSize: 12, fontWeight: active ? 700 : 500, cursor: 'pointer',
    boxShadow: active ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
    transition: 'all 0.15s', whiteSpace: 'nowrap' as const,
  });

  return (
    <>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes bounce { 0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; } 40% { transform: scale(1); opacity: 1; } }
      `}</style>

      <div
        style={{ display: 'flex', flexDirection: 'column', gap: 24, position: 'relative' }}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={e => handleDrop(e)}
      >
        {/* Drag overlay */}
        {isDragOver && (
          <div style={{
            position: 'fixed', inset: 0, zIndex: 60,
            background: 'rgba(var(--portal-accent-rgb, 93,171,121), 0.08)',
            border: '3px dashed var(--portal-accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            pointerEvents: 'none',
          }}>
            <div style={{ textAlign: 'center' }}>
              <Upload size={36} color="var(--portal-accent)" style={{ marginBottom: 12 }} />
              <p style={{ fontSize: 18, fontWeight: 700, color: 'var(--portal-text-primary)', margin: '0 0 4px' }}>Drop to add to Knowledge Base</p>
              <p style={{ fontSize: 13, color: 'var(--portal-text-tertiary)', margin: 0 }}>Text files will be imported and the entry form will open for you to complete</p>
            </div>
          </div>
        )}

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--portal-text-primary)', margin: 0 }}>Knowledge Base</h2>
            <p style={{ fontSize: 13, color: 'var(--portal-text-tertiary)', margin: '4px 0 0' }}>
              Firm IP injected into every AI content generation · Drag a file anywhere to import · {items.filter(i => i.category !== 'Chat').length} entries
            </p>
          </div>
          <button
            onClick={() => { setEditItem(null); setPrefill(undefined); setShowModal(true); }}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px', border: 'none', borderRadius: 10, background: 'var(--portal-accent)', color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer', flexShrink: 0 }}
          >
            <Plus size={14} strokeWidth={2} /> Add Entry
          </button>
        </div>

        {/* Setup warning */}
        {!loading && !tableExists && <SetupPanel />}

        {/* Category tabs */}
        {tableExists && (
          <div style={{ display: 'flex', gap: 4, padding: 4, background: 'var(--portal-bg-hover)', borderRadius: 12, width: 'fit-content', flexWrap: 'wrap' }}>
            {(['All', ...ALL_CATEGORIES] as Category[]).map(cat => {
              const count = cat === 'All' ? items.length : items.filter(i => i.category === cat).length;
              return (
                <button
                  key={cat}
                  style={tabStyle(activeCategory === cat)}
                  onClick={() => setActiveCategory(cat)}
                  onDragOver={e => e.preventDefault()}
                  onDrop={e => { e.stopPropagation(); handleDrop(e as unknown as DragEvent<HTMLDivElement>, cat === 'All' ? undefined : cat); }}
                >
                  {cat}{count > 0 ? ` (${count})` : ''}
                </button>
              );
            })}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', border: '2px solid var(--portal-accent)', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
          </div>
        )}

        {/* Table */}
        {!loading && tableExists && filtered.length > 0 && (
          <KBTable
            items={filtered}
            onEdit={item => { setEditItem(item); setPrefill(undefined); setShowModal(true); }}
            onDelete={item => deleteItem(item.id)}
          />
        )}

        {/* Empty state */}
        {!loading && tableExists && items.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 0', background: 'var(--portal-bg-secondary)', border: '2px dashed var(--portal-border-default)', borderRadius: 16 }}>
            <BookOpen size={28} strokeWidth={1.5} color="var(--portal-accent)" style={{ marginBottom: 12, opacity: 0.6 }} />
            <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--portal-text-primary)', margin: '0 0 6px' }}>No knowledge base entries yet</p>
            <p style={{ fontSize: 13, color: 'var(--portal-text-tertiary)', margin: '0 0 20px', maxWidth: 400, marginInline: 'auto', lineHeight: 1.6 }}>
              Add your firm&apos;s methodologies, case studies, and service offerings — or drag a file anywhere on this page to import.
            </p>
            <button
              onClick={() => { setEditItem(null); setPrefill(undefined); setShowModal(true); }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 20px', border: 'none', borderRadius: 10, background: 'var(--portal-accent)', color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
            >
              <Plus size={14} /> Add First Entry
            </button>
          </div>
        )}

        {/* Empty filtered state */}
        {!loading && tableExists && items.length > 0 && filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 0', background: 'var(--portal-bg-secondary)', border: '2px dashed var(--portal-border-default)', borderRadius: 16 }}>
            <p style={{ fontSize: 13, color: 'var(--portal-text-tertiary)', margin: '0 0 8px' }}>No entries in <strong>{activeCategory}</strong> yet.</p>
            <p style={{ fontSize: 12, color: 'var(--portal-text-tertiary)', margin: 0 }}>Drop a file onto this tab to import one.</p>
          </div>
        )}

        {/* Chat Window */}
        {tableExists && !loading && (
          <div style={{ marginTop: 8 }}>
            <KBChatWindow onSaveToKB={handleSaveChat} />
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <KBModal
            initial={editItem ?? undefined}
            prefill={prefill}
            onClose={() => { setShowModal(false); setEditItem(null); setPrefill(undefined); }}
            onSave={async input => {
              if (editItem) {
                await updateItem(editItem.id, input);
              } else {
                await createItem(input);
              }
            }}
          />
        )}
      </div>
    </>
  );
}
