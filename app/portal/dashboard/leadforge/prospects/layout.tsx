'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const tabs = [
  { href: '/portal/dashboard/leadforge/prospects', label: 'All Prospects', exact: true },
  { href: '/portal/dashboard/leadforge/prospects/lookup', label: 'AI Lookup', exact: false },
];

export default function ProspectsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Sub-tabs */}
      <div style={{ display: 'flex', gap: 4, padding: '4px', background: 'var(--portal-bg-hover)', borderRadius: 12, width: 'fit-content' }}>
        {tabs.map(tab => {
          const active = tab.exact ? pathname === tab.href : pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              style={{
                padding: '7px 16px', fontSize: 13, fontWeight: active ? 600 : 500, borderRadius: 8,
                textDecoration: 'none',
                background: active ? 'var(--portal-accent-subtle)' : 'transparent',
                color: active ? 'var(--portal-accent)' : 'var(--portal-text-tertiary)',
                transition: 'all 0.15s',
              }}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
      {children}
    </div>
  );
}
