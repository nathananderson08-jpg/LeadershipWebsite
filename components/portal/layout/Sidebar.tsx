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
        background: 'linear-gradient(180deg, #1a3a2a 0%, #0f2318 100%)',
        border: '1px solid rgba(93,171,121,0.2)',
        padding: '12px',
      }}
    >
      {/* Subtle green radial glow at top */}
      <div className="absolute top-0 left-0 right-0 h-64 pointer-events-none" style={{
        background: 'radial-gradient(ellipse at 50% 0%, rgba(93,171,121,0.15) 0%, transparent 70%)',
      }} />

      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-6 relative z-10"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 overflow-hidden"
          style={{
            background: '#ffffff',
          }}>
          <Image
            src="/logo.png"
            alt="Apex & Origin"
            width={32}
            height={32}
            className="object-contain"
          />
        </div>
        <div>
          <h1 className="text-sm font-semibold tracking-tight" style={{ color: '#ffffff' }}>
            Apex &amp; Origin
          </h1>
          <p className="text-[11px] font-medium tracking-wide" style={{ color: '#7fb093' }}>
            {isAdmin ? 'Admin Portal' : 'Practitioner Hub'}
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 min-h-0 px-3 relative z-10 overflow-y-auto"
        style={{ paddingTop: '20px', paddingBottom: '20px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <p className="px-3 text-[10px] font-semibold uppercase tracking-[0.18em] mb-3"
          style={{ color: 'rgba(255,255,255,0.4)' }}>
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
                background: 'rgba(93,171,121,0.2)',
                color: '#7fb093',
                border: '1px solid rgba(93,171,121,0.3)',
              } : {
                color: 'rgba(255,255,255,0.7)',
                border: '1px solid transparent',
              }}
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all"
                style={active
                  ? { background: 'rgba(93,171,121,0.25)', color: '#7fb093' }
                  : { background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)' }
                }>
                <item.icon size={16} strokeWidth={1.8} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate leading-tight text-[13px]">{item.label}</p>
                <p className="text-[11px] truncate mt-0.5" style={{
                  color: active ? 'rgba(127,176,147,0.8)' : 'rgba(255,255,255,0.35)',
                  fontWeight: 400,
                }}>
                  {item.description}
                </p>
              </div>
            </Link>
          );
        })}

        <div className="my-3 mx-2" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }} />

        <Link
          href="/portal/dashboard/settings"
          className={cn(
            'flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all group',
          )}
          style={isActive('/portal/dashboard/settings') ? {
            background: 'rgba(93,171,121,0.2)',
            color: '#7fb093',
            border: '1px solid rgba(93,171,121,0.3)',
          } : {
            color: 'rgba(255,255,255,0.7)',
            border: '1px solid transparent',
          }}
        >
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all"
            style={isActive('/portal/dashboard/settings')
              ? { background: 'rgba(93,171,121,0.25)', color: '#7fb093' }
              : { background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)' }
            }>
            <Settings size={16} strokeWidth={1.8} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate leading-tight text-[13px]">Settings</p>
            <p className="text-[11px] truncate mt-0.5" style={{ color: 'rgba(255,255,255,0.35)', fontWeight: 400 }}>
              Account preferences
            </p>
          </div>
        </Link>

        <button
          onClick={signOut}
          className="flex items-center gap-3 w-full px-3 py-3 rounded-xl text-sm font-medium border border-transparent transition-all group"
          style={{ color: 'rgba(255,255,255,0.5)' }}
        >
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)' }}>
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
          style={{ color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          <ExternalLink size={12} />
          Back to main site
        </Link>
      </div>

      {/* User card */}
      <div className="px-3 py-3 relative z-10" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="px-4 py-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold shrink-0"
              style={{
                background: 'linear-gradient(135deg, #5dab79 0%, #7fb093 100%)',
                color: '#ffffff',
              }}>
              {profile?.full_name?.charAt(0)?.toUpperCase() || '?'}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate" style={{ color: 'rgba(255,255,255,0.9)' }}>
                {profile?.full_name}
              </p>
              <p className="text-[11px] truncate" style={{ color: 'rgba(255,255,255,0.4)' }}>
                {profile?.email}
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
