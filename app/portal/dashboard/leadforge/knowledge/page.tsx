'use client';

import { useState } from 'react';
import { Plus, X, Edit2, Trash2, BookOpen, AlertCircle, Loader2, Tag, ChevronDown } from 'lucide-react';
import { useKnowledgeBase, type KnowledgeBaseItem, type CreateKBInput } from '@/hooks/portal/useLeadForge';

const CATEGORIES = ['Methodology', 'Case Study', 'Product/Service', 'Insight', 'General'] as const;
type Category = typeof CATEGORIES[number] | 'All';

const CATEGORY_COLORS: Record<string, { color: string; bg: string }> = {
  Methodology:      { color: '#6366f1', bg: 'rgba(99,102,241,0.1)'  },
  'Case Study':     { color: '#22c55e', bg: 'rgba(34,197,94,0.1)'   },
  'Product/Service':{ color: '#f59e0b', bg: 'rgba(245,158,11,0.1)'  },
  Insight:          { color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)'  },
  General:          { color: '#94a3b8', bg: 'rgba(148,163,184,0.1)' },
};

function CategoryBadge({ category }: { category: string }) {
  const s = CATEGORY_COLORS[category] ?? CATEGORY_COLORS.General;
  return (
    <span style={{ ...s, fontSize: 11, fontWeight: 700, padding: '2px 9px', borderRadius: 999 }}>
      {category}
    </span>
  );
}

// ── Setup Instructions Panel ────────────────────────────────────

function SetupPanel() {
  return (
    <div style={{
      padding: '32px',
      background: 'var(--portal-bg-secondary)',
      border: '1px solid var(--portal-border-default)',
      borderRadius: 16,
      maxWidth: 620,
      marginInline: 'auto',
    }}>
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
        The <code style={{ background: 'var(--portal-bg-hover)', padding: '1px 6px', borderRadius: 4, fontFamily: 'monospace' }}>leadforge_knowledge_base</code> table doesn't exist yet. To enable this feature:
      </p>

      <ol style={{ paddingLeft: 20, margin: '0 0 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <li style={{ fontSize: 13, color: 'var(--portal-text-secondary)', lineHeight: 1.6 }}>
          Open your <strong style={{ color: 'var(--portal-text-primary)' }}>Supabase dashboard</strong>
        </li>
        <li style={{ fontSize: 13, color: 'var(--portal-text-secondary)', lineHeight: 1.6 }}>
          Go to <strong style={{ color: 'var(--portal-text-primary)' }}>SQL Editor → New Query</strong>
        </li>
        <li style={{ fontSize: 13, color: 'var(--portal-text-secondary)', lineHeight: 1.6 }}>
          Open <code style={{ background: 'var(--portal-bg-hover)', padding: '1px 6px', borderRadius: 4, fontFamily: 'monospace' }}>supabase-kb-migration.sql</code> from the project root and paste its contents
        </li>
        <li style={{ fontSize: 13, color: 'var(--portal-text-secondary)', lineHeight: 1.6 }}>
          Click <strong style={{ color: 'var(--portal-text-primary)' }}>Run</strong>, then refresh this page
        </li>
      </ol>
    </div>
  );
}

// ── Add / Edit Modal ────────────────────────────────────────────

interface ModalProps {
  initial?: KnowledgeBaseItem;
  onClose: () => void;
  onSave: (input: CreateKBInput) => Promise<void>;
}

function KBModal({ initial, onClose, onSave }: ModalProps) {
  const [form, setForm] = useState<CreateKBInput>({
    title: initial?.title ?? '',
    category: initial?.category ?? 'General',
    content: initial?.content ?? '',
    tags: initial?.tags ?? [],
  });
  const [tagsInput, setTagsInput] = useState((initial?.tags ?? []).join(', '));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    border: '1px solid var(--portal-border-default)',
    borderRadius: 10,
    fontSize: 13,
    color: 'var(--portal-text-primary)',
    background: 'var(--portal-bg-hover)',
    outline: 'none',
    boxSizing: 'border-box' as const,
  };
  const labelStyle: React.CSSProperties = {
    fontSize: '12px',
    fontWeight: 600,
    color: 'var(--portal-text-secondary)',
    display: 'block',
    marginBottom: 6,
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
      <div style={{ background: 'var(--portal-bg-secondary)', borderRadius: 20, padding: 32, width: '100%', maxWidth: 580, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ fontSize: 17, fontWeight: 700, color: 'var(--portal-text-primary)', margin: 0 }}>
            {initial ? 'Edit Entry' : 'Add Knowledge Base Entry'}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--portal-text-tertiary)', padding: 4 }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={labelStyle}>Title</label>
            <input
              style={inputStyle}
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="e.g. Leadership Acceleration Framework"
            />
          </div>

          <div>
            <label style={labelStyle}>Category</label>
            <div style={{ position: 'relative' }}>
              <select
                style={{ ...inputStyle, cursor: 'pointer', appearance: 'none', paddingRight: 36 }}
                value={form.category}
                onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <ChevronDown size={14} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--portal-text-tertiary)', pointerEvents: 'none' }} />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Content</label>
            <textarea
              style={{ ...inputStyle, resize: 'vertical', minHeight: 160, lineHeight: 1.6 }}
              value={form.content}
              onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
              placeholder="Describe the methodology, case study, service offering, or insight in detail. This content will be injected into AI generation prompts to ground outputs in your firm's actual IP."
            />
          </div>

          <div>
            <label style={labelStyle}>Tags (comma-separated)</label>
            <input
              style={inputStyle}
              value={tagsInput}
              onChange={e => setTagsInput(e.target.value)}
              placeholder="e.g. CHRO, leadership development, change management"
            />
          </div>

          {error && (
            <p style={{ fontSize: 12, color: '#ef4444', margin: 0 }}>{error}</p>
          )}

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
            <button
              onClick={onClose}
              style={{ padding: '10px 20px', border: '1px solid var(--portal-border-default)', borderRadius: 10, background: 'none', fontSize: 13, fontWeight: 600, color: 'var(--portal-text-secondary)', cursor: 'pointer' }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 20px', border: 'none', borderRadius: 10, background: 'var(--portal-accent)', color: 'white', fontSize: 13, fontWeight: 600, cursor: saving ? 'default' : 'pointer', opacity: saving ? 0.7 : 1 }}
            >
              {saving ? <Loader2 size={13} style={{ animation: 'spin 0.8s linear infinite' }} /> : null}
              {saving ? 'Saving…' : 'Save Entry'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Knowledge Card ──────────────────────────────────────────────

function KBCard({ item, onEdit, onDelete }: { item: KnowledgeBaseItem; onEdit: () => void; onDelete: () => void }) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Delete "${item.title}"?`)) return;
    setDeleting(true);
    try {
      await onDelete();
    } catch {
      setDeleting(false);
    }
  };

  const preview = item.content.slice(0, 150) + (item.content.length > 150 ? '…' : '');

  return (
    <div style={{
      background: 'var(--portal-bg-secondary)',
      border: '1px solid var(--portal-border-default)',
      borderRadius: 14,
      padding: '18px 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      transition: 'border-color 0.15s',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--portal-text-primary)', margin: '0 0 6px', lineHeight: 1.3 }}>
            {item.title}
          </p>
          <CategoryBadge category={item.category} />
        </div>
        <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
          <button
            onClick={onEdit}
            style={{ width: 30, height: 30, borderRadius: 8, border: '1px solid var(--portal-border-default)', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--portal-text-tertiary)' }}
            title="Edit"
          >
            <Edit2 size={13} />
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            style={{ width: 30, height: 30, borderRadius: 8, border: '1px solid rgba(239,68,68,0.2)', background: 'none', cursor: deleting ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444', opacity: deleting ? 0.5 : 1 }}
            title="Delete"
          >
            {deleting ? <Loader2 size={13} style={{ animation: 'spin 0.8s linear infinite' }} /> : <Trash2 size={13} />}
          </button>
        </div>
      </div>

      <p style={{ fontSize: 12, color: 'var(--portal-text-secondary)', margin: 0, lineHeight: 1.6 }}>
        {preview}
      </p>

      {item.tags.length > 0 && (
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', alignItems: 'center' }}>
          <Tag size={10} color="var(--portal-text-tertiary)" />
          {item.tags.map(tag => (
            <span key={tag} style={{ fontSize: 10, fontWeight: 600, padding: '1px 7px', borderRadius: 999, background: 'var(--portal-bg-hover)', color: 'var(--portal-text-tertiary)' }}>
              {tag}
            </span>
          ))}
        </div>
      )}

      <p style={{ fontSize: 10, color: 'var(--portal-text-tertiary)', margin: '4px 0 0' }}>
        Updated {new Date(item.updated_at).toLocaleDateString()}
      </p>
    </div>
  );
}

// ── Page ────────────────────────────────────────────────────────

export default function KnowledgeBasePage() {
  const { items, loading, tableExists, createItem, updateItem, deleteItem } = useKnowledgeBase();
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<KnowledgeBaseItem | null>(null);

  const filtered = activeCategory === 'All'
    ? items
    : items.filter(i => i.category === activeCategory);

  const tabStyle = (active: boolean): React.CSSProperties => ({
    padding: '7px 14px',
    border: 'none',
    borderRadius: 8,
    background: active ? 'var(--portal-bg-secondary)' : 'none',
    color: active ? 'var(--portal-text-primary)' : 'var(--portal-text-tertiary)',
    fontSize: 12,
    fontWeight: active ? 700 : 500,
    cursor: 'pointer',
    boxShadow: active ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
    transition: 'all 0.15s',
    whiteSpace: 'nowrap' as const,
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--portal-text-primary)', margin: 0 }}>
            Knowledge Base
          </h2>
          <p style={{ fontSize: 13, color: 'var(--portal-text-tertiary)', margin: '4px 0 0' }}>
            Firm methodologies, case studies, and IP — injected into AI content generation to ground outputs in your firm&apos;s actual expertise.
          </p>
        </div>
        <button
          onClick={() => { setEditItem(null); setShowModal(true); }}
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px', border: 'none', borderRadius: 10, background: 'var(--portal-accent)', color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer', flexShrink: 0 }}
        >
          <Plus size={14} strokeWidth={2} /> Add Entry
        </button>
      </div>

      {/* Setup warning */}
      {!loading && !tableExists && <SetupPanel />}

      {/* Category filter tabs */}
      {tableExists && (
        <div style={{ display: 'flex', gap: 4, padding: '4px', background: 'var(--portal-bg-hover)', borderRadius: 12, width: 'fit-content', flexWrap: 'wrap' }}>
          {(['All', ...CATEGORIES] as Category[]).map(cat => {
            const count = cat === 'All' ? items.length : items.filter(i => i.category === cat).length;
            return (
              <button key={cat} style={tabStyle(activeCategory === cat)} onClick={() => setActiveCategory(cat)}>
                {cat} {count > 0 ? `(${count})` : ''}
              </button>
            );
          })}
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', border: '2px solid var(--portal-accent)', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
        </div>
      )}

      {/* Grid */}
      {!loading && tableExists && filtered.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {filtered.map(item => (
            <KBCard
              key={item.id}
              item={item}
              onEdit={() => { setEditItem(item); setShowModal(true); }}
              onDelete={() => deleteItem(item.id)}
            />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && tableExists && items.length === 0 && (
        <div style={{ textAlign: 'center', padding: '80px 0', background: 'var(--portal-bg-secondary)', border: '1px solid var(--portal-border-default)', borderRadius: 16 }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: 'var(--portal-accent-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <BookOpen size={24} strokeWidth={1.5} color="var(--portal-accent)" />
          </div>
          <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--portal-text-primary)', margin: '0 0 6px' }}>
            No knowledge base entries yet
          </p>
          <p style={{ fontSize: 13, color: 'var(--portal-text-tertiary)', margin: '0 0 20px', maxWidth: 360, marginInline: 'auto' }}>
            Add your firm&apos;s methodologies, case studies, and service offerings to ground AI-generated content in your actual IP.
          </p>
          <button
            onClick={() => { setEditItem(null); setShowModal(true); }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 20px', border: 'none', borderRadius: 10, background: 'var(--portal-accent)', color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
          >
            <Plus size={14} /> Add First Entry
          </button>
        </div>
      )}

      {/* Empty filtered state */}
      {!loading && tableExists && items.length > 0 && filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 0', background: 'var(--portal-bg-secondary)', border: '1px solid var(--portal-border-default)', borderRadius: 16 }}>
          <p style={{ fontSize: 14, color: 'var(--portal-text-tertiary)', margin: 0 }}>
            No entries in the <strong>{activeCategory}</strong> category yet.
          </p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <KBModal
          initial={editItem ?? undefined}
          onClose={() => { setShowModal(false); setEditItem(null); }}
          onSave={async (input) => {
            if (editItem) {
              await updateItem(editItem.id, input);
            } else {
              await createItem(input);
            }
          }}
        />
      )}
    </div>
  );
}
