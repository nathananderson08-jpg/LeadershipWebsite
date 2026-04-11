'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/portal/useAuth';
import { usePractitioners } from '@/hooks/portal/usePractitioners';
import { AddUserModal } from '@/components/portal/users/AddUserModal';
import { ROLE_LABELS, SENIORITY_LABELS } from '@/lib/portal/constants';
import { Plus, Trash2, Shield, ShieldOff, Users, ShieldCheck, UserCheck } from 'lucide-react';

export default function PractitionersPage() {
  const { isAdmin, isPrimaryAdmin, profile } = useAuth();
  const { practitioners, loading, addUser, updateUser, removeUser } = usePractitioners();
  const [showAdd, setShowAdd] = useState(false);

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: 'var(--portal-danger-subtle)', border: '1px solid rgba(196,114,114,0.2)' }}>
            <ShieldOff size={28} style={{ color: 'var(--portal-danger)' }} />
          </div>
          <p className="font-medium" style={{ color: 'var(--portal-text-secondary)' }}>You do not have permission to view this page.</p>
        </div>
      </div>
    );
  }

  const handleToggleAdmin = async (userId: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'practitioner' : 'admin';
    await updateUser(userId, { role: newRole as any });
  };

  const handleRemove = async (userId: string, name: string) => {
    if (!confirm(`Remove ${name}? This will delete their account and all associated data.`)) return;
    await removeUser(userId);
  };

  const adminCount = practitioners.filter(p => p.role !== 'practitioner').length;
  const practCount = practitioners.filter(p => p.role === 'practitioner').length;

  return (
    <div className="flex flex-col h-full">
      <div className="px-8 pt-8 pb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--portal-text-primary)' }}>Practitioners</h1>
            <p className="text-sm mt-1" style={{ color: 'var(--portal-text-tertiary)' }}>LeadershipCo practitioner roster</p>
          </div>
          <button onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all portal-glow-accent text-white"
            style={{ background: 'var(--portal-gradient-accent)' }}>
            <Plus size={16} />
            Add User
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {[
            { count: practitioners.length, label: 'Total Members', icon: <Users size={18} />, bg: 'var(--portal-accent-subtle)', color: 'var(--portal-accent)' },
            { count: adminCount, label: 'Administrators', icon: <ShieldCheck size={18} />, bg: 'var(--portal-accent-secondary-subtle)', color: 'var(--portal-accent-secondary)' },
            { count: practCount, label: 'Practitioners', icon: <UserCheck size={18} />, bg: 'var(--portal-success-subtle)', color: 'var(--portal-success)' },
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

      <div className="flex-1 overflow-auto px-8 pb-8 pt-6" style={{ borderTop: '1px solid var(--portal-border-default)' }}>
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 rounded-full border-2 portal-animate-spin"
              style={{ borderColor: 'var(--portal-accent)', borderTopColor: 'transparent' }} />
          </div>
        ) : (
          <div className="max-w-4xl space-y-2">
            {practitioners.map((user, index) => (
              <div key={user.id}
                className="flex items-center gap-4 p-4 rounded-xl transition-all portal-animate-fade-in portal-glass-card"
                style={{ animationDelay: `${index * 50}ms` }}>
                <div className="flex items-center justify-center w-10 h-10 rounded-xl text-xs font-bold shrink-0"
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
                        {SENIORITY_LABELS[user.seniority]}
                      </span>
                    )}
                  </div>
                  <p className="text-xs truncate mt-0.5" style={{ color: 'var(--portal-text-tertiary)' }}>{user.email}</p>
                </div>
                <div className="flex items-center gap-1">
                  {isPrimaryAdmin && user.id !== profile?.id && user.role !== 'primary_admin' && (
                    <button onClick={() => handleToggleAdmin(user.id, user.role)}
                      className="p-2.5 rounded-xl transition-all"
                      style={{ color: 'var(--portal-text-tertiary)', border: '1px solid transparent' }}
                      onMouseEnter={e => { e.currentTarget.style.color = 'var(--portal-accent)'; e.currentTarget.style.borderColor = 'var(--portal-border-accent)'; e.currentTarget.style.background = 'var(--portal-accent-subtle)'; }}
                      onMouseLeave={e => { e.currentTarget.style.color = 'var(--portal-text-tertiary)'; e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.background = 'transparent'; }}
                      title={user.role === 'admin' ? 'Remove admin' : 'Make admin'}>
                      {user.role === 'admin' ? <ShieldOff size={15} /> : <Shield size={15} />}
                    </button>
                  )}
                  {user.id !== profile?.id && user.role !== 'primary_admin' && (
                    <button onClick={() => handleRemove(user.id, user.full_name)}
                      className="p-2.5 rounded-xl transition-all"
                      style={{ color: 'var(--portal-text-tertiary)', border: '1px solid transparent' }}
                      onMouseEnter={e => { e.currentTarget.style.color = 'var(--portal-danger)'; e.currentTarget.style.borderColor = 'rgba(196,114,114,0.2)'; e.currentTarget.style.background = 'var(--portal-danger-subtle)'; }}
                      onMouseLeave={e => { e.currentTarget.style.color = 'var(--portal-text-tertiary)'; e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.background = 'transparent'; }}
                      title="Remove user">
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AddUserModal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        onAdd={addUser}
        canAssignAdmin={isPrimaryAdmin}
      />
    </div>
  );
}
