'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/portal/useAuth';
import { createPortalClient } from '@/lib/portal/supabase';
import { ROLE_LABELS } from '@/lib/portal/constants';
import { Save, Lock, User } from 'lucide-react';

export default function SettingsPage() {
  const { profile, user } = useAuth();
  const supabaseRef = useRef(createPortalClient());
  const supabase = supabaseRef.current;
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSaved, setPasswordSaved] = useState(false);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name);
      setPhone(profile.phone || '');
      setBio(profile.bio || '');
    }
  }, [profile]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);

    await supabase.from('profiles').update({
      full_name: fullName.trim(),
      phone: phone.trim() || null,
      bio: bio.trim() || null,
    }).eq('id', profile!.id);

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSaved(false);

    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      setPasswordError(error.message);
      return;
    }

    setNewPassword('');
    setConfirmPassword('');
    setPasswordSaved(true);
    setTimeout(() => setPasswordSaved(false), 3000);
  };

  if (!profile) return null;

  const inputBase = "w-full px-5 py-4 rounded-2xl text-[15px] focus:outline-none transition-all";
  const inputStyle = { background: 'var(--portal-bg-elevated)', border: '1px solid var(--portal-border-default)', color: 'var(--portal-text-primary)' };

  return (
    <div className="flex flex-col h-full">
      <div className="px-24 pt-12 pb-14">
        <h1 className="text-4xl" style={{ color: 'var(--portal-text-primary)' }}>Settings</h1>
        <p className="text-[16px] mt-2" style={{ color: 'var(--portal-text-tertiary)' }}>Manage your account and preferences</p>
      </div>

      <div className="flex-1 overflow-auto px-24 pb-10 pt-10" style={{ borderTop: '1px solid var(--portal-border-default)' }}>
        <div className="max-w-xl space-y-12">
          {/* Profile section */}
          <form onSubmit={handleSaveProfile} className="space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--portal-accent-subtle)' }}>
                <User size={16} style={{ color: 'var(--portal-accent)' }} />
              </div>
              <h2 className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--portal-text-primary)' }}>Profile</h2>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-xl portal-glass-card">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold text-white"
                style={{ background: 'var(--portal-gradient-accent)' }}>
                {profile.full_name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--portal-text-primary)' }}>{profile.email}</p>
                <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold"
                  style={{ background: 'var(--portal-accent-subtle)', color: 'var(--portal-accent)', border: '1px solid var(--portal-border-accent)' }}>
                  {ROLE_LABELS[profile.role]}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--portal-text-secondary)' }}>Full Name</label>
              <input type="text" value={fullName} onChange={e => setFullName(e.target.value)}
                className={inputBase} style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'var(--portal-accent)'}
                onBlur={e => e.target.style.borderColor = 'var(--portal-border-default)'}
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--portal-text-secondary)' }}>Phone</label>
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                className={inputBase} style={inputStyle}
                placeholder="+1 (555) 123-4567"
                onFocus={e => e.target.style.borderColor = 'var(--portal-accent)'}
                onBlur={e => e.target.style.borderColor = 'var(--portal-border-default)'}
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--portal-text-secondary)' }}>Bio</label>
              <textarea value={bio} onChange={e => setBio(e.target.value)}
                className={inputBase + ' resize-none'} style={inputStyle} rows={3}
                onFocus={e => e.target.style.borderColor = 'var(--portal-accent)'}
                onBlur={e => e.target.style.borderColor = 'var(--portal-border-default)'}
              />
            </div>

            <button type="submit" disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 portal-glow-accent text-white"
              style={{ background: 'var(--portal-gradient-accent)' }}>
              <Save size={14} />
              {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Profile'}
            </button>
          </form>

          {/* Password section */}
          <form onSubmit={handleChangePassword} className="space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--portal-accent-secondary-subtle)' }}>
                <Lock size={16} style={{ color: 'var(--portal-accent-secondary)' }} />
              </div>
              <h2 className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--portal-text-primary)' }}>Change Password</h2>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--portal-text-secondary)' }}>New Password</label>
              <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)}
                className={inputBase} style={inputStyle}
                placeholder="At least 6 characters"
                onFocus={e => e.target.style.borderColor = 'var(--portal-accent)'}
                onBlur={e => e.target.style.borderColor = 'var(--portal-border-default)'}
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--portal-text-secondary)' }}>Confirm Password</label>
              <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                className={inputBase} style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'var(--portal-accent)'}
                onBlur={e => e.target.style.borderColor = 'var(--portal-border-default)'}
              />
            </div>

            {passwordError && (
              <p className="text-sm" style={{ color: 'var(--portal-danger)' }}>{passwordError}</p>
            )}

            <button type="submit"
              className="px-5 py-2.5 rounded-xl text-sm font-medium portal-glass-card transition-all"
              style={{ color: 'var(--portal-text-secondary)' }}>
              {passwordSaved ? 'Password Updated!' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
