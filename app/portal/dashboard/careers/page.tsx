'use client';

import { useState, useEffect } from 'react';
import { Plus, Eye, EyeOff, Trash2, Pencil, Loader2, ChevronLeft } from 'lucide-react';

interface OpenRole {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

const ROLE_TYPES = ['Full-time', 'Part-time', 'Contractor', 'Fixed-term'];

export default function CareersAdminPage() {
  const [roles, setRoles] = useState<OpenRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const [form, setForm] = useState({
    title: '',
    department: '',
    location: '',
    type: 'Full-time',
    description: '',
    is_active: true,
    sort_order: 0,
  });

  useEffect(() => { loadRoles(); }, []);

  const loadRoles = async () => {
    setLoading(true);
    const res = await fetch('/portal/api/careers');
    const data = await res.json();
    setRoles(data.roles ?? []);
    setLoading(false);
  };

  const openNew = () => {
    setForm({ title: '', department: '', location: '', type: 'Full-time', description: '', is_active: true, sort_order: roles.length });
    setEditing({ isNew: true });
    setSaveError('');
  };

  const openEdit = (role: OpenRole) => {
    setForm({
      title: role.title,
      department: role.department,
      location: role.location,
      type: role.type,
      description: role.description,
      is_active: role.is_active,
      sort_order: role.sort_order,
    });
    setEditing({ id: role.id });
    setSaveError('');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError('');
    setSaving(true);
    try {
      const res = await fetch('/portal/api/careers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: editing?.isNew ? 'create' : 'update',
          id: editing?.id,
          ...form,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Save failed.');
      setEditing(null);
      await loadRoles();
    } catch (err: any) {
      setSaveError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (role: OpenRole) => {
    await fetch('/portal/api/careers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'toggle_active', id: role.id, is_active: !role.is_active }),
    });
    setRoles(prev => prev.map(r => r.id === role.id ? { ...r, is_active: !r.is_active } : r));
  };

  const deleteRole = async (id: string) => {
    if (!confirm('Delete this role permanently?')) return;
    await fetch('/portal/api/careers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete', id }),
    });
    setRoles(prev => prev.filter(r => r.id !== id));
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

  if (editing) {
    return (
      <div style={{ padding: '32px 40px', maxWidth: 720, margin: '0 auto' }}>
        <button onClick={() => setEditing(null)} className="flex items-center gap-2 text-sm font-medium mb-6" style={{ color: '#6b9a7d', background: 'none', border: 'none', cursor: 'pointer' }}>
          <ChevronLeft size={16} /> Back to open roles
        </button>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1a3a2a', fontFamily: "'DM Serif Display', serif", marginBottom: 24 }}>
          {editing.isNew ? 'New Role' : 'Edit Role'}
        </h1>

        <form onSubmit={handleSave} className="space-y-5">
          <div>
            <label style={labelStyle}>Role Title <span style={{ color: '#ef4444' }}>*</span></label>
            <input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} style={inputStyle} required placeholder="e.g. Executive Coach (ICF PCC or MCC)" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label style={labelStyle}>Department</label>
              <input type="text" value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))} style={inputStyle} placeholder="e.g. Coaching Practice" />
            </div>
            <div>
              <label style={labelStyle}>Location</label>
              <input type="text" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} style={inputStyle} placeholder="e.g. Remote — Global" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label style={labelStyle}>Employment Type</label>
              <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} style={inputStyle}>
                {ROLE_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Sort Order</label>
              <input type="number" value={form.sort_order} onChange={e => setForm(f => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))} style={{ ...inputStyle, maxWidth: 120 }} />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Description (optional)</label>
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={4} style={{ ...inputStyle, resize: 'vertical' }} placeholder="Brief role description shown on the careers page..." />
          </div>

          <div className="flex items-center gap-3">
            <input type="checkbox" id="active" checked={form.is_active} onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))} />
            <label htmlFor="active" style={{ fontSize: 14, color: '#3d6b4f', cursor: 'pointer' }}>Show on careers page</label>
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
              {saving ? 'Saving…' : 'Save Role'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div style={{ padding: '32px 40px', maxWidth: 900, margin: '0 auto' }}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: '#1a3a2a', fontFamily: "'DM Serif Display', serif", marginBottom: 4 }}>Open Roles</h1>
          <p style={{ fontSize: 14, color: '#6b9a7d' }}>Manage roles displayed on the public careers page</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 text-sm font-bold"
          style={{ padding: '10px 18px', background: 'linear-gradient(135deg, #5dab79, #4a9468)', color: '#fff', border: 'none', borderRadius: 12, cursor: 'pointer' }}>
          <Plus size={15} /> Add Role
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 size={24} style={{ color: '#5dab79', animation: 'spin 1s linear infinite' }} /></div>
      ) : roles.length === 0 ? (
        <div style={{ ...cardStyle, padding: '60px 40px', textAlign: 'center' }}>
          <p style={{ fontSize: 14, color: '#9ab5a3', marginBottom: 16 }}>No open roles yet. Add your first role to display it on the careers page.</p>
          <button onClick={openNew} className="flex items-center gap-2 text-sm font-bold mx-auto"
            style={{ padding: '10px 18px', background: 'linear-gradient(135deg, #5dab79, #4a9468)', color: '#fff', border: 'none', borderRadius: 12, cursor: 'pointer' }}>
            <Plus size={15} /> Add Role
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {roles.map(role => (
            <div key={role.id} style={cardStyle} className="flex items-center gap-4 px-6 py-4">
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: role.is_active ? '#5dab79' : '#d1d5db', flexShrink: 0 }} />
              <div className="flex-1 min-w-0">
                <p style={{ fontSize: 15, fontWeight: 700, color: '#1a3a2a' }}>{role.title}</p>
                <div className="flex items-center gap-3 mt-1 flex-wrap">
                  {role.department && <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 20, background: 'rgba(184,145,59,0.1)', color: '#b8913b' }}>{role.department}</span>}
                  {role.location && <span style={{ fontSize: 12, color: '#9ab5a3' }}>{role.location}</span>}
                  <span style={{ fontSize: 12, color: '#9ab5a3' }}>{role.type}</span>
                  {!role.is_active && <span style={{ fontSize: 11, color: '#9ab5a3' }}>Hidden</span>}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => toggleActive(role)} title={role.is_active ? 'Hide' : 'Show'}
                  style={{ padding: '6px', borderRadius: 8, color: role.is_active ? '#5dab79' : '#9ab5a3', background: 'transparent', border: '1px solid rgba(93,171,121,0.15)', cursor: 'pointer' }}>
                  {role.is_active ? <Eye size={15} /> : <EyeOff size={15} />}
                </button>
                <button onClick={() => openEdit(role)} style={{ padding: '6px', borderRadius: 8, color: '#b8913b', background: 'transparent', border: '1px solid rgba(184,145,59,0.2)', cursor: 'pointer' }}>
                  <Pencil size={15} />
                </button>
                <button onClick={() => deleteRole(role.id)} style={{ padding: '6px', borderRadius: 8, color: '#ef4444', background: 'transparent', border: '1px solid rgba(239,68,68,0.15)', cursor: 'pointer' }}>
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
