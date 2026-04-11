'use client';

import Link from 'next/link';
import Image from 'next/image';
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
  ExternalLink,
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
    <aside
      className="flex flex-col w-72 h-full rounded-2xl relative overflow-hidden"
      style={{
        background: '#ffffff',
        border: '1px solid rgba(93,171,121,0.15)',
        padding: '12px',
      }}
    >
      {/* Subtle green radial glow at top */}
      <div className="absolute top-0 left-0 right-0 h-64 pointer-events-none" style={{
        background: 'radial-gradient(ellipse at 50% 0%, rgba(93,171,121,0.06) 0%, transparent 70%)',
      }} />

      {/* Logo */}
      <div className="flex flex-col items-center px-4 py-6 relative z-10"
        style={{ borderBottom: '1px solid rgba(93,171,121,0.12)' }}>
        <div className="w-full mb-3">
          <Image
            src="/logo.png"
            alt="Apex & Origin"
            width={240}
            height={80}
            className="w-full h-auto object-contain"
          />
        </div>
        <p className="text-[11px] font-medium tracking-wide" style={{ color: '#5dab79' }}>
          {isAdmin ? 'Admin Portal' : 'Practitioner Hub'}
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 min-h-0 px-3 relative z-10 overflow-y-auto"
        style={{ paddingTop: '20px', paddingBottom: '20px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <p className="px-3 text-[10px] font-semibold uppercase tracking-[0.18em] mb-3"
          style={{ color: '#6b9a7d' }}>
          Navigation
        </p>
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all group',
              )}
              style={active ? {
                background: 'rgba(93,171,121,0.12)',
                color: '#1a3a2a',
                border: '1px solid rgba(93,171,121,0.3)',
              } : {
                color: '#3d6b4f',
                border: '1px solid transparent',
              }}
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all"
                style={active
                  ? { background: '#1a3a2a', color: '#ffffff' }
                  : { background: 'rgba(93,171,121,0.1)', color: '#5dab79' }
                }>
                <item.icon size={16} strokeWidth={1.8} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate leading-tight text-[13px]">{item.label}</p>
                <p className="text-[11px] truncate mt-0.5" style={{
                  color: active ? '#5dab79' : '#6b9a7d',
                  fontWeight: 400,
                }}>
                  {item.description}
                </p>
              </div>
            </Link>
          );
        })}

        <div className="my-3 mx-2" style={{ borderTop: '1px solid rgba(93,171,121,0.12)' }} />

        <Link
          href="/portal/dashboard/settings"
          className={cn(
            'flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all group',
          )}
          style={isActive('/portal/dashboard/settings') ? {
            background: 'rgba(93,171,121,0.12)',
            color: '#1a3a2a',
            border: '1px solid rgba(93,171,121,0.3)',
          } : {
            color: '#3d6b4f',
            border: '1px solid transparent',
          }}
        >
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all"
            style={isActive('/portal/dashboard/settings')
              ? { background: '#1a3a2a', color: '#ffffff' }
              : { background: 'rgba(93,171,121,0.1)', color: '#5dab79' }
            }>
            <Settings size={16} strokeWidth={1.8} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate leading-tight text-[13px]">Settings</p>
            <p className="text-[11px] truncate mt-0.5" style={{ color: '#6b9a7d', fontWeight: 400 }}>
              Account preferences
            </p>
          </div>
        </Link>

        <button
          onClick={signOut}
          className="flex items-center gap-3 w-full px-3 py-3 rounded-xl text-sm font-medium border border-transparent transition-all group"
          style={{ color: '#6b9a7d' }}
        >
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: 'rgba(93,171,121,0.1)', color: '#5dab79' }}>
            <LogOut size={16} strokeWidth={1.8} />
          </div>
          <div className="flex-1 min-w-0 text-left">
            <p className="truncate leading-tight text-[13px]">Sign Out</p>
          </div>
        </button>
      </nav>

      {/* Back to main site */}
      <div className="px-3 pb-3 relative z-10">
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-[12px] transition-all"
          style={{ color: '#6b9a7d', border: '1px solid rgba(93,171,121,0.15)' }}
        >
          <ExternalLink size={12} />
          Back to main site
        </Link>
      </div>

      {/* User card */}
      <div className="px-3 py-3 relative z-10" style={{ borderTop: '1px solid rgba(93,171,121,0.12)' }}>
        <div className="px-4 py-3 rounded-xl" style={{ background: 'rgba(93,171,121,0.06)', border: '1px solid rgba(93,171,121,0.12)' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold shrink-0"
              style={{
                background: '#1a3a2a',
                color: '#ffffff',
              }}>
              {profile?.full_name?.charAt(0)?.toUpperCase() || '?'}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate" style={{ color: '#1a3a2a' }}>
                {profile?.full_name}
              </p>
              <p className="text-[11px] truncate" style={{ color: '#6b9a7d' }}>
                {profile?.email}
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
