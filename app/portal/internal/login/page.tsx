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
    background: '#ffffff',
    border: '1px solid rgba(184,145,59,0.2)',
    padding: '14px 18px',
    color: '#1a3a2a',
    borderRadius: '12px',
    fontSize: '15px',
    width: '100%',
  };

  const inputFocusStyle = {
    outline: 'none',
    borderColor: 'rgba(184,145,59,0.5)',
    boxShadow: '0 0 0 3px rgba(184,145,59,0.08)',
  };

  return (
    <div className="flex min-h-screen">
      {/* Left panel — white with logo */}
      <div className="hidden lg:flex lg:w-[48%] relative overflow-hidden flex-col items-center justify-center p-16"
        style={{ background: '#ffffff', borderRight: '1px solid rgba(93,171,121,0.12)' }}>
        {/* Subtle gold radial glow */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse at 50% 40%, rgba(193,154,91,0.06) 0%, transparent 65%)',
        }} />

        <div className="relative z-10 flex flex-col items-center text-center">
          {/* Logo — extra large */}
          <div className="w-full max-w-lg mb-14">
            <Image
              src="/logo.png"
              alt="Apex & Origin"
              width={560}
              height={196}
              className="w-full h-auto object-contain"
              priority
            />
          </div>

          {/* Internal access label — large */}
          <div className="flex items-center gap-4">
            <div className="h-px w-14" style={{ background: 'var(--portal-gold-400)' }} />
            <div className="flex items-center gap-2.5">
              <Shield size={20} style={{ color: 'var(--portal-gold-600)' }} />
              <p className="text-3xl font-semibold uppercase"
                style={{ color: 'var(--portal-gold-600)', fontFamily: "'DM Serif Display', serif", letterSpacing: '0.08em' }}>
                Internal Portal
              </p>
            </div>
            <div className="h-px w-14" style={{ background: 'var(--portal-gold-400)' }} />
          </div>
        </div>
      </div>

      {/* Right panel — soft grey form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-16"
        style={{ background: '#f5f9f7' }}>
        <div className="w-full max-w-md portal-animate-fade-in">
          <div className="mb-8">
            <h2 className="text-3xl mb-2" style={{ color: '#1a3a2a', fontFamily: "'DM Serif Display', serif", letterSpacing: '-0.02em' }}>
              Staff sign in
            </h2>
            <p className="text-sm" style={{ color: '#6b9a7d' }}>
              Authorized Apex & Origin personnel only
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider mb-2"
                style={{ color: 'var(--portal-gold-600)' }}>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                style={inputStyle} placeholder="you@apexandorigin.com" required
                onFocus={e => Object.assign(e.target.style, inputFocusStyle)}
                onBlur={e => { e.target.style.borderColor = 'rgba(184,145,59,0.2)'; e.target.style.boxShadow = 'none'; e.target.style.outline = 'none'; }}
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider mb-2"
                style={{ color: 'var(--portal-gold-600)' }}>Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                style={inputStyle} placeholder="••••••••" required
                onFocus={e => Object.assign(e.target.style, inputFocusStyle)}
                onBlur={e => { e.target.style.borderColor = 'rgba(184,145,59,0.2)'; e.target.style.boxShadow = 'none'; e.target.style.outline = 'none'; }}
              />
            </div>
            {error && (
              <div className="rounded-xl text-sm px-4 py-3"
                style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444' }}>
                {error}
              </div>
            )}
            <button type="submit" disabled={loading}
              className="w-full portal-btn portal-btn-gold disabled:opacity-50"
              style={{ marginTop: '8px', width: '100%', justifyContent: 'center', padding: '1rem', fontSize: '0.9375rem' }}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-8 pt-6" style={{ borderTop: '1px solid rgba(93,171,121,0.15)' }}>
            <p className="text-[12px] text-center" style={{ color: '#6b9a7d' }}>
              Looking for the Practitioner Hub?{' '}
              <a href="/portal" className="hover:underline font-medium" style={{ color: 'var(--portal-gold-600)' }}>
                Sign in here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
