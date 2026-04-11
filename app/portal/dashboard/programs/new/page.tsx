'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/portal/useAuth';
import { createPortalClient } from '@/lib/portal/supabase';
import { ArrowLeft, MapPin, Calendar, Users, Save } from 'lucide-react';

export default function CreateProgramPage() {
  const { isAdmin } = useAuth();
  const router = useRouter();
  const supabaseRef = useRef(createPortalClient());
  const supabase = supabaseRef.current;

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [location, setLocation] = useState('');
  const [seniorRequired, setSeniorRequired] = useState(0);
  const [juniorRequired, setJuniorRequired] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center h-full" style={{ color: 'var(--portal-text-tertiary)' }}>
        You do not have permission to create programs.
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !startDate || !endDate) return;

    setLoading(true);
    setError('');

    const { data, error: err } = await supabase
      .from('programs')
      .insert({
        name: name.trim(),
        description: description.trim() || null,
        start_date: startDate,
        end_date: endDate,
        location: location.trim() || null,
        senior_required: seniorRequired,
        junior_required: juniorRequired,
      })
      .select()
      .single();

    if (err) {
      setError(err.message);
      setLoading(false);
      return;
    }

    router.push(`/portal/dashboard/programs/${data.id}`);
  };

  const inputBase = "w-full px-5 py-4 rounded-2xl text-[15px] focus:outline-none transition-all";

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-24 pt-12 pb-14">
        <button
          onClick={() => router.push('/portal/dashboard/programs')}
          className="flex items-center gap-2 text-[14px] mb-5 transition-colors"
          style={{ color: 'var(--portal-text-secondary)' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--portal-accent)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--portal-text-secondary)')}
        >
          <ArrowLeft size={16} />
          Back to Programs
        </button>
        <h1 className="text-4xl" style={{ color: 'var(--portal-text-primary)' }}>Create New Program</h1>
        <p className="text-[16px] mt-2" style={{ color: 'var(--portal-text-tertiary)' }}>
          Define a new leadership development program and its staffing requirements
        </p>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-auto px-24 pb-10 pt-10" style={{ borderTop: '1px solid var(--portal-border-default)' }}>
        <form onSubmit={handleSubmit} className="max-w-2xl space-y-10">
          {/* Program Details */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--portal-accent-subtle)' }}>
                <Calendar size={16} style={{ color: 'var(--portal-accent)' }} />
              </div>
              <h2 className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--portal-text-primary)' }}>Program Details</h2>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--portal-text-secondary)' }}>Program Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputBase}
                style={{ background: 'var(--portal-bg-elevated)', border: '1px solid var(--portal-border-default)', color: 'var(--portal-text-primary)' }}
                onFocus={(e) => e.target.style.borderColor = 'var(--portal-accent)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--portal-border-default)'}
                placeholder="e.g., Leadership Development Cohort 4"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--portal-text-secondary)' }}>Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={inputBase + ' resize-none'}
                style={{ background: 'var(--portal-bg-elevated)', border: '1px solid var(--portal-border-default)', color: 'var(--portal-text-primary)' }}
                onFocus={(e) => e.target.style.borderColor = 'var(--portal-accent)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--portal-border-default)'}
                rows={3}
                placeholder="Describe the program objectives, audience, and key deliverables..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--portal-text-secondary)' }}>Start Date *</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className={inputBase}
                  style={{ background: 'var(--portal-bg-elevated)', border: '1px solid var(--portal-border-default)', color: 'var(--portal-text-primary)' }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--portal-accent)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--portal-border-default)'}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--portal-text-secondary)' }}>End Date *</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className={inputBase}
                  style={{ background: 'var(--portal-bg-elevated)', border: '1px solid var(--portal-border-default)', color: 'var(--portal-text-primary)' }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--portal-accent)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--portal-border-default)'}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--portal-text-secondary)' }}>Location</label>
              <div className="relative">
                <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--portal-text-tertiary)' }} />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className={inputBase + ' pl-11'}
                  style={{ background: 'var(--portal-bg-elevated)', border: '1px solid var(--portal-border-default)', color: 'var(--portal-text-primary)' }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--portal-accent)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--portal-border-default)'}
                  placeholder="e.g., New York, Virtual, London"
                />
              </div>
            </div>
          </div>

          {/* Staffing Requirements */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--portal-accent-secondary-subtle)' }}>
                <Users size={16} style={{ color: 'var(--portal-accent-secondary)' }} />
              </div>
              <h2 className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--portal-text-primary)' }}>Staffing Requirements</h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="portal-stat-card">
                <label className="block text-xs font-medium mb-3" style={{ color: 'var(--portal-text-secondary)' }}>Senior Practitioners</label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setSeniorRequired(Math.max(0, seniorRequired - 1))}
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold transition-all"
                    style={{ background: 'var(--portal-bg-hover)', color: 'var(--portal-text-secondary)', border: '1px solid var(--portal-border-default)' }}
                  >
                    -
                  </button>
                  <span className="text-3xl font-bold min-w-[3rem] text-center" style={{ color: 'var(--portal-text-primary)' }}>{seniorRequired}</span>
                  <button
                    type="button"
                    onClick={() => setSeniorRequired(seniorRequired + 1)}
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold transition-all"
                    style={{ background: 'var(--portal-accent-subtle)', color: 'var(--portal-accent)', border: '1px solid var(--portal-border-accent)' }}
                  >
                    +
                  </button>
                </div>
                <p className="text-[10px] mt-2" style={{ color: 'var(--portal-text-tertiary)' }}>Experienced practitioners who lead sessions</p>
              </div>

              <div className="portal-stat-card">
                <label className="block text-xs font-medium mb-3" style={{ color: 'var(--portal-text-secondary)' }}>Junior Practitioners</label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setJuniorRequired(Math.max(0, juniorRequired - 1))}
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold transition-all"
                    style={{ background: 'var(--portal-bg-hover)', color: 'var(--portal-text-secondary)', border: '1px solid var(--portal-border-default)' }}
                  >
                    -
                  </button>
                  <span className="text-3xl font-bold min-w-[3rem] text-center" style={{ color: 'var(--portal-text-primary)' }}>{juniorRequired}</span>
                  <button
                    type="button"
                    onClick={() => setJuniorRequired(juniorRequired + 1)}
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold transition-all"
                    style={{ background: 'var(--portal-accent-subtle)', color: 'var(--portal-accent)', border: '1px solid var(--portal-border-accent)' }}
                  >
                    +
                  </button>
                </div>
                <p className="text-[10px] mt-2" style={{ color: 'var(--portal-text-tertiary)' }}>Supporting practitioners in development</p>
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="px-4 py-3 rounded-xl text-sm" style={{ background: 'var(--portal-danger-subtle)', border: '1px solid rgba(196,114,114,0.2)', color: 'var(--portal-danger)' }}>
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-4 pt-2">
            <button
              type="submit"
              disabled={loading || !name.trim() || !startDate || !endDate}
              className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed portal-glow-accent text-white"
              style={{ background: 'var(--portal-gradient-accent)' }}
            >
              <Save size={16} />
              {loading ? 'Creating...' : 'Create Program'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/portal/dashboard/programs')}
              className="px-6 py-3 rounded-xl text-sm font-medium portal-glass-card transition-all"
              style={{ color: 'var(--portal-text-secondary)' }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
