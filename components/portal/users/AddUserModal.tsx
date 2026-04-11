'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import type { CreateUserInput, UserRole, SeniorityLevel } from '@/lib/portal/types';

interface AddUserModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (input: CreateUserInput) => Promise<void>;
  canAssignAdmin: boolean;
}

export function AddUserModal({ open, onClose, onAdd, canAssignAdmin }: AddUserModalProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('practitioner');
  const [seniority, setSeniority] = useState<SeniorityLevel>('junior');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) return;

    setLoading(true);
    setError('');
    try {
      await onAdd({
        full_name: fullName.trim(),
        email: email.trim().toLowerCase(),
        role,
        seniority: role === 'practitioner' ? seniority : undefined,
        phone: phone.trim() || undefined,
        bio: bio.trim() || undefined,
      });
      setFullName(''); setEmail(''); setRole('practitioner');
      setSeniority('junior'); setPhone(''); setBio('');
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60" onClick={onClose}>
      <div className="w-full max-w-lg portal-glass-card rounded-2xl p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold" style={{ color: 'var(--portal-text-primary)', fontFamily: "'DM Serif Display', serif" }}>Add User</h2>
          <button onClick={onClose} className="p-1" style={{ color: 'var(--portal-text-tertiary)' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--portal-text-secondary)' }}>Full Name *</label>
              <input
                type="text" value={fullName} onChange={e => setFullName(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg text-sm focus:outline-none"
                style={{ background: 'var(--portal-bg-primary)', border: '1px solid var(--portal-border-default)', color: 'var(--portal-text-primary)' }}
                placeholder="Jane Smith" required
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--portal-text-secondary)' }}>Email *</label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg text-sm focus:outline-none"
                style={{ background: 'var(--portal-bg-primary)', border: '1px solid var(--portal-border-default)', color: 'var(--portal-text-primary)' }}
                placeholder="jane@company.com" required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--portal-text-secondary)' }}>Role</label>
              <select
                value={role} onChange={e => setRole(e.target.value as UserRole)}
                className="w-full px-3 py-2.5 rounded-lg text-sm focus:outline-none"
                style={{ background: 'var(--portal-bg-primary)', border: '1px solid var(--portal-border-default)', color: 'var(--portal-text-primary)' }}
              >
                <option value="practitioner">Practitioner</option>
                {canAssignAdmin && <option value="admin">Admin</option>}
              </select>
            </div>
            {role === 'practitioner' && (
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--portal-text-secondary)' }}>Seniority</label>
                <select
                  value={seniority} onChange={e => setSeniority(e.target.value as SeniorityLevel)}
                  className="w-full px-3 py-2.5 rounded-lg text-sm focus:outline-none"
                  style={{ background: 'var(--portal-bg-primary)', border: '1px solid var(--portal-border-default)', color: 'var(--portal-text-primary)' }}
                >
                  <option value="senior">Senior</option>
                  <option value="junior">Junior</option>
                </select>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--portal-text-secondary)' }}>Phone</label>
            <input
              type="tel" value={phone} onChange={e => setPhone(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg text-sm focus:outline-none"
              style={{ background: 'var(--portal-bg-primary)', border: '1px solid var(--portal-border-default)', color: 'var(--portal-text-primary)' }}
              placeholder="+1 (555) 123-4567"
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--portal-text-secondary)' }}>Bio</label>
            <textarea
              value={bio} onChange={e => setBio(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg text-sm focus:outline-none resize-none"
              style={{ background: 'var(--portal-bg-primary)', border: '1px solid var(--portal-border-default)', color: 'var(--portal-text-primary)' }}
              rows={2} placeholder="Brief bio..."
            />
          </div>

          {error && (
            <div className="px-3 py-2 rounded-lg text-sm" style={{ background: 'var(--portal-danger-subtle)', border: '1px solid var(--portal-danger)', color: 'var(--portal-danger)' }}>
              {error}
            </div>
          )}

          <p className="text-xs" style={{ color: 'var(--portal-text-tertiary)' }}>
            An account setup email will be sent to the user.
          </p>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm" style={{ color: 'var(--portal-text-secondary)' }}>Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-50 transition-colors"
              style={{ background: 'var(--portal-accent)' }}>
              {loading ? 'Creating...' : 'Add User & Send Invite'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
