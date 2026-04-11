'use client';

import { Sidebar } from '@/components/portal/layout/Sidebar';
import { useAuth } from '@/hooks/portal/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function PortalDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAdmin, profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !profile) {
      router.replace('/portal/login');
    }
  }, [loading, profile, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen" style={{ background: 'var(--portal-bg-primary)' }}>
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent portal-animate-spin"
          style={{ borderColor: 'var(--portal-accent)', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="flex h-screen p-5 gap-5" style={{ background: 'var(--portal-bg-secondary)' }}>
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden rounded-2xl portal-glass-card"
        style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
        {/* Admin top banner */}
        {isAdmin && (
          <div style={{
            padding: '12px 40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(90deg, rgba(139,123,181,0.06) 0%, rgba(123,165,160,0.04) 100%)',
            borderBottom: '1px solid var(--portal-border-default)',
          }}>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full" style={{ background: 'var(--portal-accent)', opacity: 0.6 }} />
              <span className="text-[11px] font-semibold uppercase tracking-[0.15em]"
                style={{ fontFamily: "'Inter', sans-serif", color: 'var(--portal-accent)' }}>
                Admin Portal
              </span>
              <span style={{ color: 'var(--portal-text-tertiary)', fontSize: '10px' }}>|</span>
              <span className="text-[12px]" style={{ fontFamily: "'DM Serif Display', serif", color: 'var(--portal-text-tertiary)' }}>
                LeadershipCo
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px]" style={{ color: 'var(--portal-text-tertiary)' }}>Signed in as</span>
              <span className="text-[12px] font-medium" style={{ color: 'var(--portal-text-secondary)' }}>{profile?.full_name}</span>
            </div>
          </div>
        )}
        <div style={{ flex: 1, overflow: 'auto', padding: '24px' }}>
          {children}
        </div>
      </div>
    </div>
  );
}
