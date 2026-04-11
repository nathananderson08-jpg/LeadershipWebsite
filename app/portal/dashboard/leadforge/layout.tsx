'use client';

import { useAuth } from '@/hooks/portal/useAuth';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

const subNavTabs = [
  { href: '/portal/dashboard/leadforge', label: 'Overview' },
  { href: '/portal/dashboard/leadforge/prospects', label: 'Prospects' },
  { href: '/portal/dashboard/leadforge/triggers', label: 'Trigger Events' },
  { href: '/portal/dashboard/leadforge/campaigns', label: 'Campaigns' },
  { href: '/portal/dashboard/leadforge/content', label: 'Content' },
];

export default function LeadForgeLayout({ children }: { children: React.ReactNode }) {
  const { isAdmin, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.replace('/portal/dashboard/programs');
    }
  }, [loading, isAdmin, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div
          className="w-7 h-7 rounded-full border-2"
          style={{
            borderColor: 'var(--portal-accent)',
            borderTopColor: 'transparent',
            animation: 'spin 0.8s linear infinite',
          }}
        />
      </div>
    );
  }

  if (!isAdmin) return null;

  const isTabActive = (href: string) => {
    if (href === '/portal/dashboard/leadforge') {
      return pathname === '/portal/dashboard/leadforge';
    }
    return pathname.startsWith(href);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Sub-navigation bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          marginBottom: '28px',
          borderBottom: '1px solid var(--portal-border-default)',
          paddingBottom: '0',
        }}
      >
        {subNavTabs.map((tab) => {
          const active = isTabActive(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              style={{
                padding: '10px 16px',
                fontSize: '13px',
                fontWeight: active ? '600' : '500',
                color: active ? 'var(--portal-accent)' : 'var(--portal-text-tertiary)',
                borderBottom: active ? '2px solid var(--portal-accent)' : '2px solid transparent',
                marginBottom: '-1px',
                textDecoration: 'none',
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap',
              }}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      {/* Page content */}
      <div style={{ flex: 1, minHeight: 0 }}>
        {children}
      </div>
    </div>
  );
}
