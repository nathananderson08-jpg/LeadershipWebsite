'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/portal/useAuth';
import { cn } from '@/lib/portal/utils';
import {
  Calendar,
  Settings,
  LogOut,
  Layers,
  Sparkles,
  Compass,
  Heart,
} from 'lucide-react';

const adminNavItems = [
  { href: '/portal/dashboard/programs', label: 'Active Programs', icon: Layers, description: 'Pipeline overview' },
  { href: '/portal/dashboard/programs/new', label: 'Create Program', icon: Sparkles, description: 'Design a new program' },
  { href: '/portal/dashboard/staffing', label: 'Program Staffing', icon: Compass, description: 'Invitations & confirmations' },
  { href: '/portal/dashboard/calendar', label: 'Program Calendar', icon: Calendar, description: 'Schedule at a glance' },
  { href: '/portal/dashboard/manage-team', label: 'Practitioner Network', icon: Heart, description: 'Roles & capabilities' },
];

const practitionerNavItems = [
  { href: '/portal/dashboard/programs', label: 'My Programs', icon: Layers, description: 'Invites & assignments' },
  { href: '/portal/dashboard/calendar', label: 'My Calendar', icon: Calendar, description: 'Your schedule' },
];

export function Sidebar() {
  const pathname = usePathname();
  const { profile, signOut, isAdmin } = useAuth();

  const navItems = isAdmin ? adminNavItems : practitionerNavItems;

  const isActive = (href: string) => {
    if (href === '/portal/dashboard/programs') {
      return pathname === '/portal/dashboard/programs' ||
        (pathname.startsWith('/portal/dashboard/programs/') && pathname !== '/portal/dashboard/programs/new');
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className="flex flex-col w-72 h-full rounded-2xl relative overflow-hidden portal-glass-card"
      style={{ padding: '12px' }}>
      {/* Monet Water Lilies background */}
      <div className="absolute inset-0 pointer-events-none">
        <img
          src="/monet.jpg"
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to bottom, var(--portal-bg-primary) 0%, rgba(250,248,245,0.92) 20%, rgba(250,248,245,0.7) 45%, rgba(250,248,245,0.3) 70%, transparent 100%)',
        }} />
      </div>

      {/* Logo */}
      <div className="flex items-center gap-4 px-7 py-7 relative z-10"
        style={{ borderBottom: '1px solid var(--portal-border-subtle)' }}>
        <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 relative overflow-hidden">
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(135deg, var(--portal-wc-lavender), var(--portal-wc-blue), var(--portal-wc-sage))',
            opacity: 0.7,
          }} />
          <div className="absolute inset-0" style={{
            background: 'radial-gradient(circle at 30% 40%, var(--portal-wc-gold) 0%, transparent 50%)',
            opacity: 0.5,
          }} />
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="relative z-10" style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.15))' }}>
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </div>
        <div>
          <h1 className="text-base tracking-tight" style={{ fontFamily: "'DM Serif Display', Georgia, serif", color: 'var(--portal-text-primary)' }}>
            {isAdmin ? 'LeadershipCo' : 'PractitionerHub'}
          </h1>
          <p className="text-[11px] font-medium tracking-wide" style={{ fontFamily: "'Inter', sans-serif", color: 'var(--portal-accent)' }}>
            {isAdmin ? 'Admin Portal' : 'Practitioner Portal'}
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 min-h-0 px-5 overflow-y-auto relative z-10"
        style={{ paddingTop: '24px', paddingBottom: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <p className="px-3 text-[10px] font-semibold uppercase tracking-[0.15em]"
          style={{ fontFamily: "'Inter', sans-serif", color: 'var(--portal-text-tertiary)', marginBottom: '8px' }}>
          Navigation
        </p>
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-4 px-4 py-4 rounded-2xl text-[15px] font-medium transition-all group',
                !active && 'hover:bg-[var(--portal-bg-hover)]'
              )}
              style={active ? {
                background: 'var(--portal-bg-elevated)',
                color: 'var(--portal-accent)',
                border: '1px solid var(--portal-border-accent)',
                boxShadow: '0 2px 8px rgba(139, 123, 181, 0.1)',
              } : {
                color: 'var(--portal-text-secondary)',
                border: '1px solid transparent',
              }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all"
                style={active ? { background: 'var(--portal-accent-subtle)' } : { background: 'var(--portal-bg-secondary)' }}>
                <item.icon size={20} strokeWidth={1.8} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate leading-tight">{item.label}</p>
                <p className="text-[11px] truncate mt-0.5" style={{
                  color: active ? 'var(--portal-accent)' : 'var(--portal-text-tertiary)',
                  opacity: 0.8,
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 400,
                }}>
                  {item.description}
                </p>
              </div>
            </Link>
          );
        })}

        <div className="my-4 mx-3" style={{ borderTop: '1px solid var(--portal-border-subtle)' }} />

        <Link
          href="/portal/dashboard/settings"
          className={cn(
            'flex items-center gap-4 px-4 py-4 rounded-2xl text-[15px] font-medium transition-all group',
            !isActive('/portal/dashboard/settings') && 'hover:bg-[var(--portal-bg-hover)]'
          )}
          style={isActive('/portal/dashboard/settings') ? {
            background: 'var(--portal-bg-elevated)',
            color: 'var(--portal-accent)',
            border: '1px solid var(--portal-border-accent)',
            boxShadow: '0 2px 8px rgba(139, 123, 181, 0.1)',
          } : {
            color: 'var(--portal-text-secondary)',
            border: '1px solid transparent',
          }}
        >
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all"
            style={isActive('/portal/dashboard/settings') ? { background: 'var(--portal-accent-subtle)' } : { background: 'var(--portal-bg-secondary)' }}>
            <Settings size={20} strokeWidth={1.8} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate leading-tight">Settings</p>
            <p className="text-[11px] truncate mt-0.5" style={{
              color: isActive('/portal/dashboard/settings') ? 'var(--portal-accent)' : 'var(--portal-text-tertiary)',
              opacity: 0.8,
              fontFamily: "'Inter', sans-serif",
              fontWeight: 400,
            }}>Account preferences</p>
          </div>
        </Link>

        <button
          onClick={signOut}
          className="flex items-center gap-4 w-full px-4 py-4 rounded-2xl text-[15px] font-medium border border-transparent transition-all group hover:bg-[var(--portal-bg-hover)]"
          style={{ color: 'var(--portal-text-secondary)' }}
        >
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all"
            style={{ background: 'var(--portal-bg-secondary)' }}>
            <LogOut size={20} strokeWidth={1.8} />
          </div>
          <div className="flex-1 min-w-0 text-left">
            <p className="truncate leading-tight">Sign Out</p>
            <p className="text-[11px] truncate mt-0.5" style={{ color: 'var(--portal-text-tertiary)', opacity: 0.8, fontFamily: "'Inter', sans-serif", fontWeight: 400 }}>
              Leave portal
            </p>
          </div>
        </button>
      </nav>

      {/* User card */}
      <div className="px-5 py-5 relative z-10" style={{ borderTop: '1px solid var(--portal-border-subtle)' }}>
        <div className="px-4 py-4 rounded-2xl portal-glass-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-semibold shrink-0 relative overflow-hidden">
              <div className="absolute inset-0" style={{
                background: 'linear-gradient(135deg, var(--portal-wc-lavender), var(--portal-wc-sage))',
                opacity: 0.6,
              }} />
              <span className="relative z-10" style={{ color: 'var(--portal-text-primary)' }}>
                {profile?.full_name?.charAt(0)?.toUpperCase() || '?'}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate" style={{ color: 'var(--portal-text-primary)' }}>
                {profile?.full_name}
              </p>
              <p className="text-[11px] truncate" style={{ color: 'var(--portal-text-tertiary)' }}>
                {profile?.email}
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
