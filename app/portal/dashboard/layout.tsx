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
    if (loading) return;
    if (!profile) {
      router.replace('/portal/login');
    }
  }, [loading, profile, isAdmin, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen" style={{ background: 'var(--portal-bg-primary)' }}>
        <div className="w-8 h-8 rounded-full border-2 portal-animate-spin"
          style={{ borderColor: 'var(--portal-accent)', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="flex h-screen p-4 gap-4" style={{ background: '#f8faf9' }}>
      <Sidebar />
      <div
        className="flex-1 flex flex-col overflow-hidden rounded-2xl"
        style={{
          background: 'var(--portal-bg-secondary)',
          border: '1px solid rgba(93,171,121,0.18)',
          boxShadow: '0 4px 24px rgba(10,15,28,0.06)',
        }}
      >
        {/* Admin top banner */}
        {isAdmin && (
          <div style={{
            padding: '10px 32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(93,171,121,0.06)',
            borderBottom: '1px solid rgba(93,171,121,0.12)',
          }}>
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#5dab79' }} />
              <span className="text-[11px] font-semibold uppercase tracking-[0.15em]"
                style={{ color: '#5dab79' }}>
                Admin Portal
              </span>
              <span style={{ color: 'rgba(93,171,121,0.3)', fontSize: '10px' }}>|</span>
              <span className="text-[12px]" style={{ color: '#6b9a7d' }}>
                Apex &amp; Origin
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px]" style={{ color: '#6b9a7d' }}>Signed in as</span>
              <span className="text-[12px] font-medium" style={{ color: '#3d6b4f' }}>{profile?.full_name}</span>
            </div>
          </div>
        )}
        <div style={{ flex: 1, overflow: 'auto', padding: '28px 32px' }}>
          {children}
        </div>
      </div>
    </div>
  );
}
