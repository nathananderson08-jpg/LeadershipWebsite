'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/portal/useAuth';
import { createPortalClient } from '@/lib/portal/supabase';
import { ROLE_LABELS, SENIORITY_LABELS, PROGRAM_TYPE_LABELS, PROGRAM_TYPE_COLORS, ALL_PROGRAM_TYPES } from '@/lib/portal/constants';
import type { Profile, UserRole, SeniorityLevel, ProgramType } from '@/lib/portal/types';
import {
  Users, Shield, ShieldOff, Trash2, ChevronDown, ChevronUp,
  Mail, UserPlus, ShieldCheck, UserCheck, Search, X, Check
} from 'lucide-react';

export default function ManageTeamPage() {
  const { isAdmin, isPrimaryAdmin, profile } = useAuth();
  const supabase = createPortalClient();

  const [practitioners, setPractitioners] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showInviteForm, setShowInviteForm] = useState(false);
  const initialized = useRef(false);

  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [inviteRole, setInviteRole] = useState<UserRole>('practitioner');
  const [inviteSeniority, setInviteSeniority] = useState<SeniorityLevel>('junior');
  const [inviteProgramTypes, setInviteProgramTypes] = useState<ProgramType[]>([]);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteError, setInviteError] = useState('');
  const [inviteSuccess, setInviteSuccess] = useState('');
  const [showResendPrompt, setShowResendPrompt] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    loadPractitioners();
  }, []);

  async function loadPractitioners() {
    setLoading(true);
    const { data } = await supabase.from('profiles').select('*').order('full_name');
    setPractitioners(data || []);
    setLoading(false);
  }

  const handleUpdateRole = async (userId: string, newRole: UserRole) => {
    await supabase.from('profiles').update({ role: newRole }).eq('id', userId);
    await loadPractitioners();
  };

  const handleUpdateSeniority = async (userId: string, newSeniority: SeniorityLevel) => {
    await supabase.from('profiles').update({ seniority: newSeniority }).eq('id', userId);
    await loadPractitioners();
  };

  const handleToggleProgramType = async (userId: string, currentTypes: ProgramType[], type: ProgramType) => {
    const newTypes = currentTypes.includes(type)
      ? currentTypes.filter(t => t !== type)
      : [...currentTypes, type];
    await supabase.from('profiles').update({ program_types: newTypes }).eq('id', userId);
    await loadPractitioners();
  };

  const handleRemoveUser = async (userId: string, name: string) => {
    if (!confirm(`Remove ${name}? This will delete their account and all associated data.`)) return;
    await fetch('/portal/api/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'remove_user', userId }),
    });
    await loadPractitioners();
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviteError('');
    setInviteSuccess('');
    setInviteLoading(true);

    try {
      const response = await fetch('/portal/api/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'create_user',
          email: inviteEmail,
          full_name: inviteName,
          role: inviteRole,
          seniority: inviteRole === 'practitioner' ? inviteSeniority : undefined,
          program_types: inviteRole === 'practitioner' ? inviteProgramTypes : undefined,
        }),
      });

      if (!response.ok) {
        if (response.status === 409) {
          setShowResendPrompt(true);
          setInviteLoading(false);
          return;
        }
        let errMsg = 'Failed to invite user';
        try { const err = await response.json(); errMsg = err.error || errMsg; } catch {}
        throw new Error(errMsg);
      }

      setInviteSuccess(`Invitation sent to ${inviteEmail}!`);
      setInviteEmail('');
      setInviteName('');
      setInviteRole('practitioner');
      setInviteSeniority('junior');
      setInviteProgramTypes([]);
      setShowResendPrompt(false);
      await loadPractitioners();
      setTimeout(() => { setInviteSuccess(''); setShowInviteForm(false); }, 2000);
    } catch (err: any) {
      setInviteError(err.message);
    } finally {
      setInviteLoading(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center h-full">
        <p style={{ color: 'var(--portal-text-tertiary)' }}>You do not have permission to view this page.</p>
      </div>
    );
  }

  const filtered = practitioners.filter(p =>
    p.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const adminCount = practitioners.filter(p => p.role !== 'practitioner').length;
  const practCount = practitioners.filter(p => p.role === 'practitioner').length;
  const seniorCount = practitioners.filter(p => p.seniority === 'senior').length;

  const inputBase = "w-full px-4 py-3 rounded-xl text-sm focus:outline-none transition-all";
  const inputStyle = { background: 'var(--portal-bg-elevated)', border: '1px solid var(--portal-border-default)', color: 'var(--portal-text-primary)' };

  return (
    <div className="flex flex-col h-full">
      <div className="px-24 pt-12 pb-14">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl" style={{ color: 'var(--portal-text-primary)' }}>Manage Team</h1>
            <p className="text-[16px] mt-2" style={{ color: 'var(--portal-text-tertiary)' }}>
              LeadershipCo practitioner roster — roles, seniority, and program capabilities
            </p>
          </div>
          <button onClick={() => setShowInviteForm(!showInviteForm)}
            className="flex items-center gap-2.5 px-6 py-3 rounded-2xl text-[15px] font-semibold transition-all portal-glow-accent text-white"
            style={{ background: 'var(--portal-gradient-accent)' }}>
            <UserPlus size={18} />
            Invite New Member
          </button>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {[
            { count: practitioners.length, label: 'Total Members', icon: <Users size={18} />, bg: 'var(--portal-accent-subtle)', color: 'var(--portal-accent)' },
            { count: adminCount, label: 'Admins', icon: <ShieldCheck size={18} />, bg: 'var(--portal-accent-secondary-subtle)', color: 'var(--portal-accent-secondary)' },
            { count: seniorCount, label: 'Senior', icon: <UserCheck size={18} />, bg: 'var(--portal-success-subtle)', color: 'var(--portal-success)' },
            { count: practCount, label: 'Practitioners', icon: <Users size={18} />, bg: 'var(--portal-warning-subtle)', color: 'var(--portal-warning)' },
          ].map((stat, i) => (
            <div key={i} className="portal-stat-card">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: stat.bg, color: stat.color }}>{stat.icon}</div>
                <div>
                  <p className="text-2xl font-bold" style={{ color: 'var(--portal-text-primary)' }}>{stat.count}</p>
                  <p className="text-xs" style={{ color: 'var(--portal-text-tertiary)' }}>{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showInviteForm && (
        <div className="px-24 pb-6 portal-animate-fade-in">
          <div className="portal-glass-card rounded-2xl" style={{ padding: '32px', borderColor: 'var(--portal-border-accent)' }}>
            <div className="flex items-center justify-between" style={{ marginBottom: '28px' }}>
              <h2 className="text-[16px] font-bold uppercase tracking-wider" style={{ color: 'var(--portal-text-primary)' }}>Invite New Member</h2>
              <button onClick={() => setShowInviteForm(false)} className="p-1.5 rounded-lg transition-all"
                style={{ color: 'var(--portal-text-tertiary)' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--portal-text-primary)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--portal-text-tertiary)')}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleInvite} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div className="grid grid-cols-2" style={{ gap: '20px' }}>
                <div>
                  <label className="block text-[14px] font-medium mb-2" style={{ color: 'var(--portal-text-secondary)' }}>Full Name *</label>
                  <input type="text" value={inviteName} onChange={e => setInviteName(e.target.value)}
                    className={inputBase} style={inputStyle}
                    onFocus={e => e.target.style.borderColor = 'var(--portal-accent)'}
                    onBlur={e => e.target.style.borderColor = 'var(--portal-border-default)'}
                    placeholder="Jane Smith" required />
                </div>
                <div>
                  <label className="block text-[14px] font-medium mb-2" style={{ color: 'var(--portal-text-secondary)' }}>Email *</label>
                  <input type="email" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)}
                    className={inputBase} style={inputStyle}
                    onFocus={e => e.target.style.borderColor = 'var(--portal-accent)'}
                    onBlur={e => e.target.style.borderColor = 'var(--portal-border-default)'}
                    placeholder="jane@company.com" required />
                </div>
              </div>

              <div className="grid grid-cols-2" style={{ gap: '20px' }}>
                <div>
                  <label className="block text-[14px] font-medium mb-2" style={{ color: 'var(--portal-text-secondary)' }}>Role</label>
                  <div className="flex p-1 rounded-xl" style={{ background: 'var(--portal-bg-primary)', border: '1px solid var(--portal-border-default)' }}>
                    {(['practitioner', 'admin'] as const).map(r => (
                      <button key={r} type="button" onClick={() => setInviteRole(r)}
                        className="flex-1 py-2 rounded-lg text-xs font-medium transition-all"
                        style={{
                          background: inviteRole === r ? 'var(--portal-gradient-gold)' : 'transparent',
                          color: inviteRole === r ? '#0c1222' : 'var(--portal-text-tertiary)',
                        }}>
                        {r === 'admin' ? 'Admin' : 'Practitioner'}
                      </button>
                    ))}
                  </div>
                </div>
                {inviteRole === 'practitioner' && (
                  <div>
                    <label className="block text-[14px] font-medium mb-2" style={{ color: 'var(--portal-text-secondary)' }}>Seniority</label>
                    <div className="flex p-1 rounded-xl" style={{ background: 'var(--portal-bg-primary)', border: '1px solid var(--portal-border-default)' }}>
                      {(['junior', 'senior'] as const).map(s => (
                        <button key={s} type="button" onClick={() => setInviteSeniority(s)}
                          className="flex-1 py-2 rounded-lg text-xs font-medium transition-all"
                          style={{
                            background: inviteSeniority === s ? 'var(--portal-gradient-gold)' : 'transparent',
                            color: inviteSeniority === s ? '#0c1222' : 'var(--portal-text-tertiary)',
                          }}>
                          {s === 'senior' ? 'Senior' : 'Junior'}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {inviteRole === 'practitioner' && (
                <div>
                  <label className="block text-xs font-medium mb-2" style={{ color: 'var(--portal-text-secondary)' }}>Program Capabilities</label>
                  <div className="flex gap-2 flex-wrap">
                    {ALL_PROGRAM_TYPES.map(type => {
                      const selected = inviteProgramTypes.includes(type);
                      const colors = PROGRAM_TYPE_COLORS[type];
                      return (
                        <button key={type} type="button"
                          onClick={() => setInviteProgramTypes(prev =>
                            prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
                          )}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all"
                          style={{
                            background: selected ? colors.bg : 'var(--portal-bg-primary)',
                            color: selected ? colors.text : 'var(--portal-text-tertiary)',
                            border: `1px solid ${selected ? colors.border : 'var(--portal-border-default)'}`,
                          }}>
                          {selected && <Check size={12} />}
                          {PROGRAM_TYPE_LABELS[type]}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {inviteError && <p className="text-sm" style={{ color: 'var(--portal-danger)' }}>{inviteError}</p>}
              {inviteSuccess && <p className="text-sm" style={{ color: 'var(--portal-success)' }}>{inviteSuccess}</p>}

              {showResendPrompt && (
                <div className="px-4 py-4 rounded-xl portal-animate-fade-in" style={{ background: 'var(--portal-warning-subtle)', border: '1px solid rgba(245,158,11,0.2)' }}>
                  <p className="text-sm font-medium" style={{ color: 'var(--portal-warning)' }}>
                    A user with this email already exists. Resend invite?
                  </p>
                  <div className="flex gap-2 mt-3">
                    <button type="button" disabled={resendLoading}
                      onClick={async () => {
                        setResendLoading(true);
                        setInviteError('');
                        try {
                          const res = await fetch('/portal/api/email', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ type: 'resend_invite', email: inviteEmail, full_name: inviteName }),
                          });
                          if (!res.ok) {
                            let errMsg = 'Failed to resend invite';
                            try { const e = await res.json(); errMsg = e.error || errMsg; } catch {}
                            throw new Error(errMsg);
                          }
                          setInviteSuccess(`Invite resent to ${inviteEmail}!`);
                          setShowResendPrompt(false);
                          setInviteEmail('');
                          setInviteName('');
                          setTimeout(() => { setInviteSuccess(''); setShowInviteForm(false); }, 2000);
                        } catch (err: any) {
                          setInviteError(err.message);
                          setShowResendPrompt(false);
                        } finally {
                          setResendLoading(false);
                        }
                      }}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all disabled:opacity-50 portal-glow-accent text-white"
                      style={{ background: 'var(--portal-gradient-accent)' }}>
                      <Mail size={12} />
                      {resendLoading ? 'Sending...' : 'Yes, Resend'}
                    </button>
                    <button type="button" onClick={() => setShowResendPrompt(false)}
                      className="px-4 py-2 rounded-xl text-xs font-medium portal-glass-card transition-all"
                      style={{ color: 'var(--portal-text-tertiary)' }}>
                      No, Cancel
                    </button>
                  </div>
                </div>
              )}

              {!showResendPrompt && (
                <button type="submit" disabled={inviteLoading}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 portal-glow-accent text-white w-fit"
                  style={{ background: 'var(--portal-gradient-accent)' }}>
                  <Mail size={14} />
                  {inviteLoading ? 'Sending...' : 'Send Invitation'}
                </button>
              )}
            </form>
          </div>
        </div>
      )}

      <div className="px-24 py-3 flex items-center gap-4" style={{ borderTop: '1px solid var(--portal-border-default)' }}>
        <div className="relative max-w-md flex-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--portal-text-tertiary)' }} />
          <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-xl text-sm focus:outline-none"
            style={{ background: 'var(--portal-bg-elevated)', border: '1px solid var(--portal-border-default)', color: 'var(--portal-text-primary)' }}
            onFocus={e => e.target.style.borderColor = 'var(--portal-accent)'}
            onBlur={e => e.target.style.borderColor = 'var(--portal-border-default)'}
            placeholder="Search by name or email..."
          />
        </div>
        <p className="text-[10px] flex items-center gap-1.5" style={{ color: 'var(--portal-text-tertiary)' }}>
          <ChevronDown size={12} />
          Click any member to edit their role, seniority, and capabilities
        </p>
      </div>

      <div className="flex-1 overflow-auto px-24 pb-8 pt-4">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 rounded-full border-2 portal-animate-spin"
              style={{ borderColor: 'var(--portal-accent)', borderTopColor: 'transparent' }} />
          </div>
        ) : (
          <div className="max-w-4xl space-y-4">
            {filtered.map((user, index) => {
              const isExpanded = expandedUser === user.id;
              const isSelf = user.id === profile?.id;
              const isProtected = user.role === 'primary_admin' && !isSelf;
              const programTypes: ProgramType[] = user.program_types || [];

              return (
                <div key={user.id} className="rounded-2xl transition-all portal-animate-fade-in portal-glass-card overflow-hidden"
                  style={{ animationDelay: `${index * 30}ms`, borderColor: isExpanded ? 'var(--portal-border-accent)' : undefined }}>
                  <button onClick={() => setExpandedUser(isExpanded ? null : user.id)}
                    className="flex items-center gap-4 w-full p-4 text-left transition-all"
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--portal-bg-hover)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold shrink-0"
                      style={user.role !== 'practitioner'
                        ? { background: 'var(--portal-gradient-gold)', color: '#0c1222' }
                        : { background: 'var(--portal-bg-hover)', color: 'var(--portal-text-secondary)' }}>
                      {user.full_name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium truncate" style={{ color: 'var(--portal-text-primary)' }}>{user.full_name}</p>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold" style={{
                          background: user.role === 'primary_admin' ? 'var(--portal-accent-subtle)' : user.role === 'admin' ? 'var(--portal-accent-secondary-subtle)' : 'var(--portal-bg-hover)',
                          color: user.role === 'primary_admin' ? 'var(--portal-accent)' : user.role === 'admin' ? 'var(--portal-accent-secondary)' : 'var(--portal-text-tertiary)',
                          border: user.role === 'primary_admin' ? '1px solid var(--portal-border-accent)' : '1px solid var(--portal-border-default)',
                        }}>
                          {ROLE_LABELS[user.role]}
                        </span>
                        {user.seniority && (
                          <span className="text-[10px]" style={{ color: 'var(--portal-text-tertiary)' }}>
                            {user.seniority === 'senior' ? 'Senior' : 'Junior'}
                          </span>
                        )}
                      </div>
                      <p className="text-xs truncate mt-0.5" style={{ color: 'var(--portal-text-tertiary)' }}>{user.email}</p>
                    </div>
                    <div className="flex gap-1.5 shrink-0">
                      {programTypes.map(type => (
                        <span key={type} className="px-2 py-0.5 rounded-full text-[9px] font-semibold" style={{
                          background: PROGRAM_TYPE_COLORS[type].bg,
                          color: PROGRAM_TYPE_COLORS[type].text,
                          border: `1px solid ${PROGRAM_TYPE_COLORS[type].border}`,
                        }}>
                          {PROGRAM_TYPE_LABELS[type]}
                        </span>
                      ))}
                    </div>
                    {isExpanded
                      ? <ChevronUp size={16} className="shrink-0" style={{ color: 'var(--portal-text-tertiary)' }} />
                      : <ChevronDown size={16} className="shrink-0" style={{ color: 'var(--portal-text-tertiary)' }} />}
                  </button>

                  {isExpanded && (
                    <div className="px-4 pb-5 pt-1 space-y-5 portal-animate-fade-in" style={{ borderTop: '1px solid var(--portal-border-default)' }}>
                      {isPrimaryAdmin && !isSelf && (
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--portal-text-tertiary)' }}>Role</label>
                          <div className="flex gap-2">
                            {(['practitioner', 'admin', 'primary_admin'] as UserRole[]).map(role => (
                              <button key={role} onClick={() => handleUpdateRole(user.id, role)}
                                className="px-4 py-2 rounded-xl text-xs font-medium transition-all"
                                style={{
                                  background: user.role === role ? 'var(--portal-gradient-gold)' : 'var(--portal-bg-elevated)',
                                  color: user.role === role ? '#0c1222' : 'var(--portal-text-tertiary)',
                                  border: user.role === role ? 'none' : '1px solid var(--portal-border-default)',
                                }}>
                                {ROLE_LABELS[role]}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {user.role === 'practitioner' && (
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--portal-text-tertiary)' }}>Seniority Level</label>
                          <div className="flex gap-2">
                            {(['junior', 'senior'] as SeniorityLevel[]).map(level => (
                              <button key={level} onClick={() => handleUpdateSeniority(user.id, level)}
                                className="px-4 py-2 rounded-xl text-xs font-medium transition-all"
                                style={{
                                  background: user.seniority === level ? 'var(--portal-gradient-gold)' : 'var(--portal-bg-elevated)',
                                  color: user.seniority === level ? '#0c1222' : 'var(--portal-text-tertiary)',
                                  border: user.seniority === level ? 'none' : '1px solid var(--portal-border-default)',
                                }}>
                                {SENIORITY_LABELS[level]}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {user.role === 'practitioner' && (
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--portal-text-tertiary)' }}>Program Capabilities</label>
                          <p className="text-[10px] mb-3" style={{ color: 'var(--portal-text-tertiary)' }}>Select which types of programs this practitioner can lead</p>
                          <div className="flex gap-2 flex-wrap">
                            {ALL_PROGRAM_TYPES.map(type => {
                              const selected = programTypes.includes(type);
                              const colors = PROGRAM_TYPE_COLORS[type];
                              return (
                                <button key={type} onClick={() => handleToggleProgramType(user.id, programTypes, type)}
                                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium transition-all"
                                  style={{
                                    background: selected ? colors.bg : 'var(--portal-bg-elevated)',
                                    color: selected ? colors.text : 'var(--portal-text-tertiary)',
                                    border: `1px solid ${selected ? colors.border : 'var(--portal-border-default)'}`,
                                  }}>
                                  <div className="w-4 h-4 rounded flex items-center justify-center" style={{
                                    background: selected ? colors.text : 'transparent',
                                    border: selected ? 'none' : '1.5px solid var(--portal-text-tertiary)',
                                  }}>
                                    {selected && <Check size={10} color="#0c1222" />}
                                  </div>
                                  {PROGRAM_TYPE_LABELS[type]}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {!isSelf && !isProtected && (
                        <div className="pt-3" style={{ borderTop: '1px solid var(--portal-border-default)' }}>
                          <button onClick={() => handleRemoveUser(user.id, user.full_name)}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all"
                            style={{ background: 'var(--portal-danger-subtle)', color: 'var(--portal-danger)', border: '1px solid rgba(196,114,114,0.2)' }}>
                            <Trash2 size={14} />
                            Remove from team
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
