'use client';

import { useAuth } from '@/hooks/portal/useAuth';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

const subNavTabs = [
  { href: '/portal/dashboard/leadforge',           label: 'Overview',      exact: true  },
  { href: '/portal/dashboard/leadforge/prospects', label: 'Prospects',     exact: false },
  { href: '/portal/dashboard/leadforge/accounts',  label: 'Accounts',      exact: false },
  { href: '/portal/dashboard/leadforge/actions',   label: 'Next Actions',  exact: false },
  { href: '/portal/dashboard/leadforge/triggers',  label: 'Trigger Events',exact: false },
  { href: '/portal/dashboard/leadforge/campaigns', label: 'Pipeline',      exact: false },
  { href: '/portal/dashboard/leadforge/content',   label: 'Content',       exact: false },
  { href: '/portal/dashboard/leadforge/knowledge', label: 'Knowledge Base', exact: false },
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
        <div className="w-7 h-7 rounded-full border-2"
          style={{ borderColor: 'var(--portal-accent)', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
      </div>
    );
  }

  if (!isAdmin) return null;

  const isTabActive = (href: string, exact: boolean) => {
    if (exact) return pathname === href;
    // Prospects tab should not match sub-routes like /prospects/lookup or /prospects/import
    if (href === '/portal/dashboard/leadforge/prospects') {
      return pathname === href || (pathname.startsWith(href) && !pathname.includes('/lookup') && !pathname.includes('/import'));
    }
    return pathname.startsWith(href);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Sub-navigation bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '2px', marginBottom: '28px', borderBottom: '1px solid var(--portal-border-default)', overflowX: 'auto' }}>
        {subNavTabs.map((tab) => {
          const active = isTabActive(tab.href, tab.exact);
          return (
            <Link key={tab.href} href={tab.href} style={{
              padding: '10px 14px', fontSize: '13px',
              fontWeight: active ? '600' : '500',
              color: active ? 'var(--portal-accent)' : 'var(--portal-text-tertiary)',
              borderBottom: active ? '2px solid var(--portal-accent)' : '2px solid transparent',
              marginBottom: '-1px', textDecoration: 'none',
              transition: 'all 0.15s ease', whiteSpace: 'nowrap',
            }}>
              {tab.label}
            </Link>
          );
        })}
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        {children}
      </div>
    </div>
  );
}
