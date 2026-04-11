'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import type { CreateProgramInput } from '@/lib/portal/types';

interface CreateProgramModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (input: CreateProgramInput) => Promise<void>;
}

export function CreateProgramModal({ open, onClose, onCreate }: CreateProgramModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [location, setLocation] = useState('');
  const [seniorRequired, setSeniorRequired] = useState(0);
  const [juniorRequired, setJuniorRequired] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !startDate || !endDate) return;

    setLoading(true);
    setError('');
    try {
      await onCreate({
        name: name.trim(),
        description: description.trim() || undefined,
        start_date: startDate,
        end_date: endDate,
        location: location.trim() || undefined,
        senior_required: seniorRequired,
        junior_required: juniorRequired,
      });
      setName(''); setDescription(''); setStartDate(''); setEndDate('');
      setLocation(''); setSeniorRequired(0); setJuniorRequired(0);
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = { background: 'var(--portal-bg-primary)', border: '1px solid var(--portal-border-default)', color: 'var(--portal-text-primary)' };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center"
      style={{ background: 'rgba(12,18,34,0.8)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}>
      <div
        className="w-full max-w-lg rounded-2xl p-6 portal-animate-fade-in portal-glass-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold" style={{ color: 'var(--portal-text-primary)', fontFamily: "'DM Serif Display', serif" }}>Quick Create Program</h2>
          <button onClick={onClose} className="p-2 rounded-lg transition-all" style={{ color: 'var(--portal-text-tertiary)' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--portal-text-secondary)' }}>Program Name *</label>
            <input
              type="text" value={name} onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none transition-all"
              style={inputStyle}
              placeholder="e.g., Leadership Development Cohort 4" required
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--portal-text-secondary)' }}>Description</label>
            <textarea
              value={description} onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none transition-all resize-none"
              style={inputStyle} rows={2} placeholder="Brief program description..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--portal-text-secondary)' }}>Start Date *</label>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none" style={inputStyle} required />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--portal-text-secondary)' }}>End Date *</label>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none" style={inputStyle} required />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--portal-text-secondary)' }}>Location</label>
            <input type="text" value={location} onChange={(e) => setLocation(e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none" style={inputStyle}
              placeholder="e.g., New York, Virtual" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--portal-text-secondary)' }}>Senior Required</label>
              <input type="number" min={0} value={seniorRequired} onChange={(e) => setSeniorRequired(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none" style={inputStyle} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--portal-text-secondary)' }}>Junior Required</label>
              <input type="number" min={0} value={juniorRequired} onChange={(e) => setJuniorRequired(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none" style={inputStyle} />
            </div>
          </div>

          {error && (
            <div className="px-4 py-3 rounded-xl text-sm" style={{ background: 'var(--portal-danger-subtle)', border: '1px solid rgba(239,68,68,0.2)', color: 'var(--portal-danger)' }}>
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm font-medium portal-glass-card transition-all"
              style={{ color: 'var(--portal-text-secondary)' }}>
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-50 transition-all portal-glow-accent"
              style={{ background: 'var(--portal-gradient-accent)' }}>
              {loading ? 'Creating...' : 'Create Program'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
