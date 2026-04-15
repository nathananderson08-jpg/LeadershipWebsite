'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createPortalClient } from '@/lib/portal/supabase';
import Image from 'next/image';
import { Shield } from 'lucide-react';

export default function InternalLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createPortalClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setError(error.message); setLoading(false); return; }
    router.replace('/portal/dashboard/programs');
  };

  const inputStyle = {
    background: 'rgba(255,255,255,0.07)',
    border: '1px solid rgba(255,255,255,0.15)',
    padding: '14px 18px',
    color: '#ffffff',
    borderRadius: '12px',
    fontSize: '15px',
    width: '100%',
  };

  const inputFocusStyle = {
    outline: 'none',
    borderColor: 'rgba(93,171,121,0.6)',
    boxShadow: '0 0 0 3px rgba(93,171,121,0.1)',
    background: 'rgba(255,255,255,0.1)',
  };

  return (
    <div className="flex min-h-screen">
      {/* Left panel — identity (dark forest) */}
      <div className="hidden lg:flex lg:w-[48%] relative overflow-hidden flex-col items-center justify-center p-16"
        style={{
          background: 'linear-gradient(160deg, #1a3a2a 0%, #0f2318 50%, #0c1c14 100%)',
        }}>
        {/* Subtle texture */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse at 50% 20%, rgba(93,171,121,0.12) 0%, transparent 60%)',
        }} />
        <div className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none" style={{
          background: 'radial-gradient(ellipse at 50% 100%, rgba(184,145,59,0.08) 0%, transparent 70%)',
        }} />

        <div className="relative z-10 flex flex-col items-center text-center">
          {/* Logo — light version on dark */}
          <div className="w-full max-w-xs mb-10" style={{ filter: 'brightness(0) invert(1) opacity(0.9)' }}>
            <Image
              src="/logo.png"
              alt="Apex & Origin"
              width={320}
              height={110}
              className="w-full h-auto object-contain"
              priority
            />
          </div>

          {/* Internal access badge */}
          <div className="flex items-center gap-2.5 px-5 py-2.5 rounded-full mb-10"
            style={{ background: 'rgba(93,171,121,0.15)', border: '1px solid rgba(93,171,121,0.3)' }}>
            <Shield size={14} style={{ color: '#5dab79' }} />
            <span className="text-[12px] font-semibold tracking-[0.12em] uppercase"
              style={{ color: '#5dab79' }}>
              Internal Access
            </span>
          </div>

          {/* Description */}
          <div style={{ maxWidth: '300px' }}>
            <h2 className="text-2xl mb-4" style={{ color: '#ffffff', fontFamily: "'DM Serif Display', serif", letterSpacing: '-0.01em' }}>
              Team Operations Portal
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Restricted to Apex & Origin staff. Access program management, staffing, and business development tools.
            </p>
          </div>

          {/* Feature bullets */}
          <div className="mt-10 flex flex-col gap-3 w-full max-w-xs text-left">
            {[
              'Program pipeline & staffing',
              'Practitioner network management',
              'LeadForge intelligence',
              'Calendar & scheduling',
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: '#5dab79' }} />
                <span className="text-[13px]" style={{ color: 'rgba(255,255,255,0.6)' }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form (dark) */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-16"
        style={{ background: '#111e17' }}>
        <div className="w-full max-w-md">
          <div className="mb-10">
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] mb-3"
              style={{ color: '#5dab79' }}>
              Internal Portal
            </p>
            <h2 className="text-3xl mb-2" style={{ color: '#ffffff', fontFamily: "'DM Serif Display', serif", letterSpacing: '-0.02em' }}>
              Staff sign in
            </h2>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Authorized Apex & Origin personnel only
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider mb-2"
                style={{ color: 'rgba(255,255,255,0.4)' }}>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                style={inputStyle} placeholder="you@apexandorigin.com" required
                onFocus={e => Object.assign(e.target.style, inputFocusStyle)}
                onBlur={e => {
                  e.target.style.borderColor = 'rgba(255,255,255,0.15)';
                  e.target.style.boxShadow = 'none';
                  e.target.style.background = 'rgba(255,255,255,0.07)';
                  e.target.style.outline = 'none';
                }}
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider mb-2"
                style={{ color: 'rgba(255,255,255,0.4)' }}>Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                style={inputStyle} placeholder="••••••••" required
                onFocus={e => Object.assign(e.target.style, inputFocusStyle)}
                onBlur={e => {
                  e.target.style.borderColor = 'rgba(255,255,255,0.15)';
                  e.target.style.boxShadow = 'none';
                  e.target.style.background = 'rgba(255,255,255,0.07)';
                  e.target.style.outline = 'none';
                }}
              />
            </div>
            {error && (
              <div className="rounded-xl text-sm px-4 py-3"
                style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}>
                {error}
              </div>
            )}
            <button type="submit" disabled={loading}
              className="w-full rounded-xl font-semibold text-sm py-4 transition-all disabled:opacity-50"
              style={{
                marginTop: '8px',
                background: 'linear-gradient(135deg, #4f9a6a 0%, #5dab79 100%)',
                color: '#ffffff',
                border: 'none',
                boxShadow: '0 4px 16px rgba(93,171,121,0.25)',
              }}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-8 pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <p className="text-[12px] text-center" style={{ color: 'rgba(255,255,255,0.25)' }}>
              Looking for the Practitioner Hub?{' '}
              <a href="/portal" className="hover:underline" style={{ color: 'rgba(255,255,255,0.45)' }}>
                Sign in here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
