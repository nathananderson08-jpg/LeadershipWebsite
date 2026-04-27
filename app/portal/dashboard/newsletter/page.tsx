'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Trash2, UserMinus, UserCheck, Loader2, Mail, PenLine, X } from 'lucide-react';

interface Subscriber {
  id: string;
  email: string;
  name: string | null;
  source: string;
  status: 'active' | 'unsubscribed';
  subscribed_at: string;
}

interface Draft {
  id: string;
  subject: string;
  preview_text: string | null;
  status: string;
  created_at: string;
}

export default function NewsletterPage() {
  const [tab, setTab] = useState<'subscribers' | 'drafts'>('subscribers');
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [addEmail, setAddEmail] = useState('');
  const [addName, setAddName] = useState('');
  const [adding, setAdding] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'unsubscribed'>('active');

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    const [subRes, draftRes] = await Promise.all([
      fetch('/portal/api/newsletter?action=list'),
      fetch('/portal/api/newsletter?action=drafts'),
    ]);
    const [subData, draftData] = await Promise.all([subRes.json(), draftRes.json()]);
    setSubscribers(subData.subscribers ?? []);
    setDrafts(draftData.drafts ?? []);
    setLoading(false);
  };

  const addSubscriber = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);
    await fetch('/portal/api/newsletter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'add_subscriber', email: addEmail, name: addName }),
    });
    setAddEmail(''); setAddName(''); setShowAdd(false); setAdding(false);
    await loadData();
  };

  const toggleStatus = async (sub: Subscriber) => {
    const newStatus = sub.status === 'active' ? 'unsubscribed' : 'active';
    await fetch('/portal/api/newsletter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'update_status', id: sub.id, status: newStatus }),
    });
    setSubscribers(prev => prev.map(s => s.id === sub.id ? { ...s, status: newStatus } : s));
  };

  const deleteSubscriber = async (id: string) => {
    if (!confirm('Delete this subscriber permanently?')) return;
    await fetch('/portal/api/newsletter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete_subscriber', id }),
    });
    setSubscribers(prev => prev.filter(s => s.id !== id));
  };

  const deleteDraft = async (id: string) => {
    if (!confirm('Delete this draft?')) return;
    await fetch('/portal/api/newsletter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete_draft', id }),
    });
    setDrafts(prev => prev.filter(d => d.id !== id));
  };

  const filteredSubs = subscribers.filter(s => filter === 'all' || s.status === filter);
  const activeCount = subscribers.filter(s => s.status === 'active').length;

  const cardStyle = {
    background: '#ffffff',
    border: '1px solid rgba(93,171,121,0.18)',
    borderRadius: 16,
    boxShadow: '0 2px 16px rgba(10,15,28,0.05)',
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 14px', fontSize: 14, color: '#1a3a2a',
    background: '#f5f9f7', border: '1px solid rgba(93,171,121,0.2)', borderRadius: 10, outline: 'none',
  };

  return (
    <div style={{ padding: '32px 40px', maxWidth: 960, margin: '0 auto' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: '#1a3a2a', fontFamily: "'DM Serif Display', serif", marginBottom: 4 }}>Newsletter</h1>
          <p style={{ fontSize: 14, color: '#6b9a7d' }}>{activeCount} active subscriber{activeCount !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 text-sm font-bold"
            style={{ padding: '9px 16px', background: 'rgba(93,171,121,0.1)', color: '#3d6b4f', border: '1px solid rgba(93,171,121,0.2)', borderRadius: 10, cursor: 'pointer' }}>
            <Plus size={14} /> Add Subscriber
          </button>
          <Link href="/portal/dashboard/newsletter/compose"
            className="flex items-center gap-2 text-sm font-bold"
            style={{ padding: '9px 16px', background: 'linear-gradient(135deg, #5dab79, #4a9468)', color: '#fff', borderRadius: 10 }}>
            <PenLine size={14} /> Compose Newsletter
          </Link>
        </div>
      </div>

      {/* Add subscriber modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6" style={{ background: 'rgba(10,15,28,0.4)', backdropFilter: 'blur(4px)' }}>
          <div style={{ ...cardStyle, padding: '28px', width: '100%', maxWidth: 420 }}>
            <div className="flex items-center justify-between mb-5">
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1a3a2a' }}>Add Subscriber</h2>
              <button onClick={() => setShowAdd(false)} style={{ color: '#9ab5a3' }}><X size={18} /></button>
            </div>
            <form onSubmit={addSubscriber} className="space-y-4">
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#b8913b', marginBottom: 6 }}>
                  Email <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input type="email" value={addEmail} onChange={e => setAddEmail(e.target.value)} style={inputStyle} placeholder="name@company.com" required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#b8913b', marginBottom: 6 }}>
                  Name (optional)
                </label>
                <input type="text" value={addName} onChange={e => setAddName(e.target.value)} style={inputStyle} placeholder="Jane Smith" />
              </div>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setShowAdd(false)} style={{ flex: 1, padding: '10px', fontSize: 14, color: '#6b9a7d', background: 'transparent', border: '1px solid rgba(93,171,121,0.2)', borderRadius: 10, cursor: 'pointer' }}>Cancel</button>
                <button type="submit" disabled={adding} style={{ flex: 1, padding: '10px', fontSize: 14, fontWeight: 700, color: '#fff', background: adding ? 'rgba(93,171,121,0.4)' : 'linear-gradient(135deg, #5dab79, #4a9468)', border: 'none', borderRadius: 10, cursor: adding ? 'not-allowed' : 'pointer' }}>
                  {adding ? 'Adding…' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 mb-6 p-1 rounded-xl" style={{ background: 'rgba(93,171,121,0.08)', width: 'fit-content' }}>
        {(['subscribers', 'drafts'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className="px-4 py-2 rounded-lg text-sm font-semibold transition-all capitalize"
            style={{ background: tab === t ? '#ffffff' : 'transparent', color: tab === t ? '#1a3a2a' : '#6b9a7d', boxShadow: tab === t ? '0 1px 4px rgba(10,15,28,0.08)' : 'none' }}>
            {t === 'subscribers' ? `Subscribers (${subscribers.length})` : `Drafts (${drafts.length})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 size={24} style={{ color: '#5dab79', animation: 'spin 1s linear infinite' }} /></div>
      ) : tab === 'subscribers' ? (
        <>
          {/* Status filter */}
          <div className="flex gap-2 mb-4">
            {(['active', 'unsubscribed', 'all'] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className="px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition-all"
                style={{ background: filter === f ? '#1a3a2a' : 'white', color: filter === f ? '#fff' : '#6b9a7d', border: '1px solid rgba(93,171,121,0.15)' }}>
                {f}
              </button>
            ))}
          </div>

          {filteredSubs.length === 0 ? (
            <div style={{ ...cardStyle, padding: '48px', textAlign: 'center' }}>
              <Mail size={28} style={{ margin: '0 auto 12px', color: '#9ab5a3' }} />
              <p style={{ fontSize: 14, color: '#9ab5a3' }}>No subscribers yet</p>
            </div>
          ) : (
            <div style={cardStyle}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(93,171,121,0.1)' }}>
                    {['Email', 'Name', 'Source', 'Status', 'Subscribed', ''].map(h => (
                      <th key={h} style={{ padding: '10px 20px', textAlign: 'left', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#b8913b' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredSubs.map(sub => (
                    <tr key={sub.id} style={{ borderBottom: '1px solid rgba(93,171,121,0.07)' }}>
                      <td style={{ padding: '12px 20px', fontSize: 14, color: '#1a3a2a', fontWeight: 500 }}>{sub.email}</td>
                      <td style={{ padding: '12px 20px', fontSize: 13, color: '#5a7a66' }}>{sub.name || '—'}</td>
                      <td style={{ padding: '12px 20px', fontSize: 12, color: '#9ab5a3' }}>{sub.source || '—'}</td>
                      <td style={{ padding: '12px 20px' }}>
                        <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 20, background: sub.status === 'active' ? 'rgba(93,171,121,0.12)' : 'rgba(156,163,175,0.15)', color: sub.status === 'active' ? '#3d6b4f' : '#6b7280' }}>
                          {sub.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px 20px', fontSize: 12, color: '#9ab5a3' }}>
                        {new Date(sub.subscribed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td style={{ padding: '12px 20px' }}>
                        <div className="flex items-center gap-2">
                          <button onClick={() => toggleStatus(sub)} title={sub.status === 'active' ? 'Unsubscribe' : 'Reactivate'} style={{ padding: '4px', color: sub.status === 'active' ? '#9ab5a3' : '#5dab79', cursor: 'pointer', background: 'none', border: 'none' }}>
                            {sub.status === 'active' ? <UserMinus size={15} /> : <UserCheck size={15} />}
                          </button>
                          <button onClick={() => deleteSubscriber(sub.id)} title="Delete" style={{ padding: '4px', color: '#ef4444', cursor: 'pointer', background: 'none', border: 'none' }}>
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      ) : (
        /* Drafts */
        drafts.length === 0 ? (
          <div style={{ ...cardStyle, padding: '48px', textAlign: 'center' }}>
            <PenLine size={28} style={{ margin: '0 auto 12px', color: '#9ab5a3' }} />
            <p style={{ fontSize: 14, color: '#9ab5a3', marginBottom: 16 }}>No newsletter drafts yet</p>
            <Link href="/portal/dashboard/newsletter/compose" style={{ fontSize: 13, fontWeight: 600, color: '#b8913b' }}>Create your first newsletter →</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {drafts.map(draft => (
              <div key={draft.id} style={{ ...cardStyle, padding: '16px 20px' }} className="flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <p style={{ fontSize: 15, fontWeight: 700, color: '#1a3a2a', marginBottom: 2 }}>{draft.subject || 'Untitled draft'}</p>
                  {draft.preview_text && <p style={{ fontSize: 12, color: '#9ab5a3' }}>{draft.preview_text}</p>}
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 20, background: 'rgba(184,145,59,0.1)', color: '#b8913b' }}>{draft.status}</span>
                <p style={{ fontSize: 12, color: '#9ab5a3' }}>{new Date(draft.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                <div className="flex gap-2">
                  <Link href={`/portal/dashboard/newsletter/compose?id=${draft.id}`} style={{ padding: '6px', color: '#b8913b', border: '1px solid rgba(184,145,59,0.2)', borderRadius: 8, display: 'flex' }}>
                    <PenLine size={14} />
                  </Link>
                  <button onClick={() => deleteDraft(draft.id)} style={{ padding: '6px', color: '#ef4444', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 8, cursor: 'pointer', background: 'none' }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}
