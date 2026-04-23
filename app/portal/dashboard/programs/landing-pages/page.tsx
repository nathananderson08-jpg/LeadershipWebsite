'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, ExternalLink, Users, ToggleLeft, ToggleRight, Trash2, ChevronLeft, Copy, Check, Loader2, X } from 'lucide-react';

interface Program {
  id: string;
  code: string;
  program_name: string;
  company_name: string;
  company_logo_url: string | null;
  is_active: boolean;
  created_at: string;
  participant_count: number;
}

interface Participant {
  id: string;
  full_name: string;
  email: string;
  title: string | null;
  company: string | null;
  phone: string | null;
  created_at: string;
}

export default function ProgramLandingPagesPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [participantsLoading, setParticipantsLoading] = useState(false);

  // Create form state
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');
  const [newProgramName, setNewProgramName] = useState('');
  const [newCompanyName, setNewCompanyName] = useState('');
  const [newLogoUrl, setNewLogoUrl] = useState('');

  // Copy code feedback
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const loadPrograms = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/portal/api/programs/landing-pages');
      const data = await res.json();
      setPrograms(data.programs ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadPrograms(); }, [loadPrograms]);

  const openProgram = async (program: Program) => {
    setSelectedProgram(program);
    setParticipantsLoading(true);
    try {
      const res = await fetch(`/portal/api/programs/landing-pages?id=${program.id}`);
      const data = await res.json();
      setParticipants(data.participants ?? []);
    } finally {
      setParticipantsLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError('');
    setCreating(true);
    try {
      const res = await fetch('/portal/api/programs/landing-pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create',
          program_name: newProgramName,
          company_name: newCompanyName,
          company_logo_url: newLogoUrl || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Failed to create.');
      setShowCreateForm(false);
      setNewProgramName('');
      setNewCompanyName('');
      setNewLogoUrl('');
      await loadPrograms();
    } catch (err: any) {
      setCreateError(err.message);
    } finally {
      setCreating(false);
    }
  };

  const toggleActive = async (program: Program) => {
    await fetch('/portal/api/programs/landing-pages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'toggle_active', id: program.id, is_active: !program.is_active }),
    });
    setPrograms(prev => prev.map(p => p.id === program.id ? { ...p, is_active: !p.is_active } : p));
    if (selectedProgram?.id === program.id) {
      setSelectedProgram(prev => prev ? { ...prev, is_active: !prev.is_active } : null);
    }
  };

  const deleteProgram = async (program: Program) => {
    if (!confirm(`Delete "${program.program_name}"? This cannot be undone.`)) return;
    await fetch('/portal/api/programs/landing-pages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete', id: program.id }),
    });
    setPrograms(prev => prev.filter(p => p.id !== program.id));
    if (selectedProgram?.id === program.id) setSelectedProgram(null);
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const cardStyle = {
    background: '#ffffff',
    border: '1px solid rgba(93,171,121,0.18)',
    borderRadius: 16,
    boxShadow: '0 2px 16px rgba(10,15,28,0.05)',
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '11px 14px',
    fontSize: 14,
    color: '#1a3a2a',
    background: '#f5f9f7',
    border: '1px solid rgba(93,171,121,0.2)',
    borderRadius: 10,
    outline: 'none',
  };

  // Detail view
  if (selectedProgram) {
    const registrationUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/programs/${selectedProgram.code}`;
    return (
      <div style={{ padding: '32px 40px', maxWidth: 900, margin: '0 auto' }}>
        <button
          onClick={() => { setSelectedProgram(null); setParticipants([]); }}
          className="flex items-center gap-2 text-sm font-medium mb-6"
          style={{ color: '#6b9a7d' }}
        >
          <ChevronLeft size={16} /> Back to all programs
        </button>

        <div style={{ ...cardStyle, padding: '28px 32px', marginBottom: 24 }}>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#b8913b', marginBottom: 4 }}>
                {selectedProgram.company_name}
              </p>
              <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1a3a2a', fontFamily: "'DM Serif Display', serif", marginBottom: 8 }}>
                {selectedProgram.program_name}
              </h1>
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  <span style={{ fontSize: 13, color: '#6b9a7d' }}>Code:</span>
                  <span style={{ fontSize: 15, fontWeight: 700, letterSpacing: '0.15em', color: '#1a3a2a' }}>{selectedProgram.code}</span>
                  <button onClick={() => copyCode(selectedProgram.code)} style={{ color: '#b8913b', padding: '2px 4px' }}>
                    {copiedCode === selectedProgram.code ? <Check size={14} /> : <Copy size={14} />}
                  </button>
                </div>
                <span style={{
                  fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20,
                  background: selectedProgram.is_active ? 'rgba(93,171,121,0.12)' : 'rgba(156,163,175,0.15)',
                  color: selectedProgram.is_active ? '#3d6b4f' : '#6b7280',
                }}>
                  {selectedProgram.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <a
                href={registrationUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-sm font-semibold"
                style={{ color: '#b8913b', padding: '8px 14px', border: '1px solid rgba(184,145,59,0.3)', borderRadius: 10 }}
              >
                <ExternalLink size={14} /> View page
              </a>
              <button
                onClick={() => toggleActive(selectedProgram)}
                className="flex items-center gap-2 text-sm font-semibold"
                style={{ color: '#6b9a7d', padding: '8px 14px', border: '1px solid rgba(93,171,121,0.2)', borderRadius: 10 }}
              >
                {selectedProgram.is_active ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
                {selectedProgram.is_active ? 'Deactivate' : 'Activate'}
              </button>
            </div>
          </div>

          <div className="mt-4 pt-4" style={{ borderTop: '1px solid rgba(93,171,121,0.12)' }}>
            <p style={{ fontSize: 12, color: '#9ab5a3' }}>
              Registration URL: <span style={{ fontWeight: 600, color: '#6b9a7d' }}>{registrationUrl}</span>
              <button onClick={() => copyCode(registrationUrl)} style={{ marginLeft: 8, color: '#b8913b', verticalAlign: 'middle' }}>
                {copiedCode === registrationUrl ? <Check size={12} /> : <Copy size={12} />}
              </button>
            </p>
          </div>
        </div>

        {/* Participants table */}
        <div style={cardStyle}>
          <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid rgba(93,171,121,0.1)' }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1a3a2a' }}>
              Participants
              <span style={{ fontSize: 13, fontWeight: 500, color: '#9ab5a3', marginLeft: 8 }}>
                {participantsLoading ? '…' : participants.length}
              </span>
            </h2>
          </div>
          {participantsLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 size={24} style={{ color: '#5dab79', animation: 'spin 1s linear infinite' }} />
            </div>
          ) : participants.length === 0 ? (
            <div className="text-center py-12" style={{ color: '#9ab5a3' }}>
              <Users size={28} style={{ margin: '0 auto 8px', opacity: 0.4 }} />
              <p style={{ fontSize: 14 }}>No participants yet</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(93,171,121,0.1)' }}>
                    {['Name', 'Email', 'Title', 'Company', 'Phone', 'Registered'].map(col => (
                      <th key={col} style={{ padding: '10px 20px', textAlign: 'left', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#b8913b' }}>
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {participants.map(p => (
                    <tr key={p.id} style={{ borderBottom: '1px solid rgba(93,171,121,0.07)' }}>
                      <td style={{ padding: '12px 20px', fontSize: 14, fontWeight: 600, color: '#1a3a2a' }}>{p.full_name}</td>
                      <td style={{ padding: '12px 20px', fontSize: 13, color: '#5a7a66' }}>{p.email}</td>
                      <td style={{ padding: '12px 20px', fontSize: 13, color: '#6b9a7d' }}>{p.title || '—'}</td>
                      <td style={{ padding: '12px 20px', fontSize: 13, color: '#6b9a7d' }}>{p.company || '—'}</td>
                      <td style={{ padding: '12px 20px', fontSize: 13, color: '#6b9a7d' }}>{p.phone || '—'}</td>
                      <td style={{ padding: '12px 20px', fontSize: 12, color: '#9ab5a3' }}>
                        {new Date(p.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  }

  // List view
  return (
    <div style={{ padding: '32px 40px', maxWidth: 900, margin: '0 auto' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: '#1a3a2a', fontFamily: "'DM Serif Display', serif", marginBottom: 4 }}>
            Program Landing Pages
          </h1>
          <p style={{ fontSize: 14, color: '#6b9a7d' }}>Create unique registration pages for each client program</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2 text-sm font-bold"
          style={{
            padding: '10px 18px',
            background: 'linear-gradient(135deg, #5dab79, #4a9468)',
            color: '#fff',
            border: 'none',
            borderRadius: 12,
            cursor: 'pointer',
          }}
        >
          <Plus size={16} /> New Program
        </button>
      </div>

      {/* Create form modal */}
      {showCreateForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6" style={{ background: 'rgba(10,15,28,0.4)', backdropFilter: 'blur(4px)' }}>
          <div style={{ ...cardStyle, padding: '32px', width: '100%', maxWidth: 480 }}>
            <div className="flex items-center justify-between mb-6">
              <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1a3a2a', fontFamily: "'DM Serif Display', serif" }}>
                Create Program
              </h2>
              <button onClick={() => { setShowCreateForm(false); setCreateError(''); }} style={{ color: '#9ab5a3' }}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#b8913b', marginBottom: 6 }}>
                  Program Name <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input type="text" value={newProgramName} onChange={e => setNewProgramName(e.target.value)}
                  style={inputStyle} placeholder="Senior Leadership Accelerator" required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#b8913b', marginBottom: 6 }}>
                  Company Name <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input type="text" value={newCompanyName} onChange={e => setNewCompanyName(e.target.value)}
                  style={inputStyle} placeholder="Acme Corporation" required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#b8913b', marginBottom: 6 }}>
                  Company Logo URL
                </label>
                <input type="url" value={newLogoUrl} onChange={e => setNewLogoUrl(e.target.value)}
                  style={inputStyle} placeholder="https://example.com/logo.png" />
                <p style={{ fontSize: 11, color: '#9ab5a3', marginTop: 4 }}>Leave blank to use the Apex &amp; Origin logo</p>
              </div>
              {createError && (
                <div style={{ padding: '10px 14px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, fontSize: 13, color: '#ef4444' }}>
                  {createError}
                </div>
              )}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => { setShowCreateForm(false); setCreateError(''); }}
                  style={{ flex: 1, padding: '11px', fontSize: 14, fontWeight: 600, color: '#6b9a7d', background: 'transparent', border: '1px solid rgba(93,171,121,0.2)', borderRadius: 10, cursor: 'pointer' }}>
                  Cancel
                </button>
                <button type="submit" disabled={creating}
                  style={{ flex: 1, padding: '11px', fontSize: 14, fontWeight: 700, color: '#fff', background: creating ? 'rgba(93,171,121,0.4)' : 'linear-gradient(135deg, #5dab79, #4a9468)', border: 'none', borderRadius: 10, cursor: creating ? 'not-allowed' : 'pointer' }}>
                  {creating ? 'Creating…' : 'Create & Generate Code'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Programs list */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={28} style={{ color: '#5dab79', animation: 'spin 1s linear infinite' }} />
        </div>
      ) : programs.length === 0 ? (
        <div style={{ ...cardStyle, padding: '60px 40px', textAlign: 'center' }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(93,171,121,0.1)', border: '1px solid rgba(93,171,121,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <Users size={24} style={{ color: '#5dab79' }} />
          </div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1a3a2a', marginBottom: 8 }}>No programs yet</h2>
          <p style={{ fontSize: 14, color: '#6b9a7d', marginBottom: 20 }}>Create your first program landing page to get started.</p>
          <button onClick={() => setShowCreateForm(true)}
            className="flex items-center gap-2 text-sm font-bold mx-auto"
            style={{ padding: '10px 18px', background: 'linear-gradient(135deg, #5dab79, #4a9468)', color: '#fff', border: 'none', borderRadius: 12, cursor: 'pointer' }}>
            <Plus size={15} /> New Program
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {programs.map(program => (
            <div key={program.id} style={cardStyle} className="flex items-center gap-4 px-6 py-4">
              {/* Status dot */}
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: program.is_active ? '#5dab79' : '#d1d5db', flexShrink: 0 }} />

              {/* Info */}
              <div className="flex-1 min-w-0 cursor-pointer" onClick={() => openProgram(program)}>
                <div className="flex items-center gap-2 flex-wrap">
                  <p style={{ fontSize: 15, fontWeight: 700, color: '#1a3a2a' }}>{program.program_name}</p>
                  <span style={{ fontSize: 11, color: '#9ab5a3' }}>·</span>
                  <p style={{ fontSize: 13, color: '#6b9a7d' }}>{program.company_name}</p>
                </div>
                <div className="flex items-center gap-4 mt-1 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', color: '#b8913b' }}>{program.code}</span>
                    <button onClick={e => { e.stopPropagation(); copyCode(program.code); }} style={{ color: '#b8913b', opacity: 0.7 }}>
                      {copiedCode === program.code ? <Check size={11} /> : <Copy size={11} />}
                    </button>
                  </div>
                  <span style={{ fontSize: 12, color: '#9ab5a3' }}>
                    <Users size={11} style={{ display: 'inline', marginRight: 3, verticalAlign: 'middle' }} />
                    {program.participant_count} participant{program.participant_count !== 1 ? 's' : ''}
                  </span>
                  <span style={{ fontSize: 12, color: '#9ab5a3' }}>
                    {new Date(program.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => toggleActive(program)}
                  title={program.is_active ? 'Deactivate' : 'Activate'}
                  style={{ padding: '6px', borderRadius: 8, color: program.is_active ? '#5dab79' : '#9ab5a3', background: 'transparent', border: '1px solid rgba(93,171,121,0.15)', cursor: 'pointer' }}>
                  {program.is_active ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                </button>
                <a href={`/programs/${program.code}`} target="_blank" rel="noreferrer"
                  style={{ padding: '6px', borderRadius: 8, color: '#b8913b', background: 'transparent', border: '1px solid rgba(184,145,59,0.2)', display: 'flex' }}>
                  <ExternalLink size={16} />
                </a>
                <button
                  onClick={() => deleteProgram(program)}
                  title="Delete"
                  style={{ padding: '6px', borderRadius: 8, color: '#ef4444', background: 'transparent', border: '1px solid rgba(239,68,68,0.15)', cursor: 'pointer' }}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
