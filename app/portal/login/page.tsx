'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createPortalClient } from '@/lib/portal/supabase';

export default function PortalLoginPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
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

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) { setError('Passwords do not match'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: fullName } },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    const isExistingUser = signUpData.user && (!signUpData.user.identities || signUpData.user.identities.length === 0);

    if (isExistingUser) {
      const res = await fetch('/portal/api/auth/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, full_name: fullName }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Setup failed' }));
        setError(err.error || 'Failed to set up account');
        setLoading(false);
        return;
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) {
        setError(signInError.message);
      } else {
        router.replace('/portal/dashboard/programs');
      }
      setLoading(false);
      return;
    }

    const { data: profileCheck } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email.toLowerCase().trim())
      .maybeSingle();

    if (!profileCheck) {
      setError('This email has not been invited to the Practitioner Portal. Please contact LeadershipCo if this is an error.');
      setLoading(false);
      return;
    }

    if (signUpData.session) {
      router.replace('/portal/dashboard/programs');
      return;
    }

    setSuccess(true);
    setLoading(false);
  };

  const switchMode = (newMode: 'login' | 'signup') => {
    setMode(newMode);
    setError('');
    setSuccess(false);
  };

  if (success) {
    return (
      <div className="flex min-h-screen p-5 gap-5" style={{ background: 'var(--portal-bg-secondary)' }}>
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden rounded-2xl portal-glass-card" style={{ padding: '24px' }}>
          <div className="absolute inset-0 pointer-events-none">
            <img src="/monet.jpg" alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(250,248,245,0.95) 0%, rgba(250,248,245,0.7) 40%, rgba(250,248,245,0.3) 70%, transparent 100%)' }} />
          </div>
          <div className="relative z-10 flex flex-col justify-center items-center w-full">
            <h2 className="text-5xl text-center leading-tight" style={{ fontFamily: "'DM Serif Display', serif", color: 'var(--portal-text-primary)' }}>LeadershipCo</h2>
            <p className="text-[20px] mt-4" style={{ fontFamily: "'DM Serif Display', serif", fontStyle: 'italic', color: 'var(--portal-text-secondary)' }}>Practitioner Portal</p>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center rounded-2xl portal-glass-card" style={{ padding: '48px 64px' }}>
          <div className="w-full max-w-lg text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-8" style={{ background: 'var(--portal-success-subtle)', border: '1px solid rgba(123,165,123,0.2)' }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--portal-success)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h1 className="text-4xl" style={{ fontFamily: "'DM Serif Display', serif", color: 'var(--portal-text-primary)' }}>Check your email</h1>
            <p className="text-[17px] mt-4" style={{ color: 'var(--portal-text-secondary)' }}>
              We sent a confirmation link to <strong style={{ color: 'var(--portal-text-primary)' }}>{email}</strong>.
            </p>
            <button onClick={() => switchMode('login')} className="text-[16px] font-medium hover:underline mt-8 inline-block" style={{ color: 'var(--portal-accent)' }}>
              Back to Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen p-5 gap-5" style={{ background: 'var(--portal-bg-secondary)' }}>
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden rounded-2xl portal-glass-card" style={{ padding: '24px' }}>
        <div className="absolute inset-0 pointer-events-none">
          <img src="/monet.jpg" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(to bottom, rgba(250,248,245,0.95) 0%, rgba(250,248,245,0.8) 25%, rgba(250,248,245,0.5) 50%, rgba(250,248,245,0.2) 75%, transparent 100%)',
          }} />
        </div>
        <div className="relative z-10 flex flex-col justify-center items-center w-full">
          <div style={{ marginBottom: '48px' }}>
            <svg width="300" height="300" viewBox="0 0 200 200" fill="none">
              <path d="M100 170 L100 90" stroke="var(--portal-accent)" strokeWidth="3.5" strokeLinecap="round" />
              <path d="M100 120 L72 88" stroke="var(--portal-accent)" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M100 120 L128 88" stroke="var(--portal-accent)" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M100 105 L78 75" stroke="var(--portal-accent-secondary)" strokeWidth="2" strokeLinecap="round" />
              <path d="M100 105 L122 75" stroke="var(--portal-accent-secondary)" strokeWidth="2" strokeLinecap="round" />
              <path d="M100 95 L85 65" stroke="var(--portal-accent)" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M100 95 L115 65" stroke="var(--portal-accent)" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M72 88 L58 72" stroke="var(--portal-accent-secondary)" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M128 88 L142 72" stroke="var(--portal-accent-secondary)" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="70" cy="84" r="14" fill="var(--portal-wc-sage)" opacity="0.45" />
              <circle cx="130" cy="84" r="14" fill="var(--portal-wc-blue)" opacity="0.45" />
              <circle cx="100" cy="62" r="18" fill="var(--portal-wc-lavender)" opacity="0.35" />
              <circle cx="78" cy="70" r="12" fill="var(--portal-wc-gold)" opacity="0.4" />
              <circle cx="122" cy="70" r="12" fill="var(--portal-wc-rose)" opacity="0.4" />
              <circle cx="100" cy="45" r="14" fill="var(--portal-wc-lavender)" opacity="0.3" />
              <path d="M100 170 L88 185" stroke="var(--portal-accent)" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
              <path d="M100 170 L112 185" stroke="var(--portal-accent)" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
            </svg>
          </div>
          <h2 className="text-center leading-tight" style={{ fontFamily: "'DM Serif Display', serif", fontSize: '48px', color: 'var(--portal-text-primary)' }}>
            LeadershipCo
          </h2>
          <p className="text-center" style={{ fontFamily: "'DM Serif Display', serif", fontStyle: 'italic', fontSize: '20px', marginTop: '16px', color: 'var(--portal-text-secondary)' }}>
            Practitioner Portal
          </p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center rounded-2xl portal-glass-card" style={{ padding: '48px 64px' }}>
        <div className="w-full max-w-lg">
          {/* Tab switcher */}
          <div className="flex rounded-2xl" style={{ background: 'var(--portal-bg-secondary)', border: '1px solid var(--portal-border-default)', padding: '6px', marginBottom: '40px' }}>
            <button
              onClick={() => switchMode('login')}
              className="flex-1 rounded-xl text-[16px] font-medium transition-all"
              style={{
                padding: '14px',
                background: mode === 'login' ? 'var(--portal-bg-elevated)' : 'transparent',
                color: mode === 'login' ? 'var(--portal-accent)' : 'var(--portal-text-tertiary)',
                boxShadow: mode === 'login' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
              }}
            >
              Sign In
            </button>
            <button
              onClick={() => switchMode('signup')}
              className="flex-1 rounded-xl text-[16px] font-medium transition-all"
              style={{
                padding: '14px',
                background: mode === 'signup' ? 'var(--portal-bg-elevated)' : 'transparent',
                color: mode === 'signup' ? 'var(--portal-accent)' : 'var(--portal-text-tertiary)',
                boxShadow: mode === 'signup' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
              }}
            >
              Create Account
            </button>
          </div>

          <div style={{ marginBottom: '40px' }}>
            <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '42px', color: 'var(--portal-text-primary)' }}>
              {mode === 'login' ? 'Welcome back' : 'Get started'}
            </h1>
            <p style={{ marginTop: '14px', fontSize: '18px', color: 'var(--portal-text-tertiary)' }}>
              {mode === 'login'
                ? 'Sign in to your account to continue'
                : 'Create your account to start managing programs'}
            </p>
          </div>

          <form onSubmit={mode === 'login' ? handleLogin : handleSignUp} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {mode === 'signup' && (
              <div className="portal-animate-fade-in">
                <label className="block text-[15px] font-medium" style={{ color: 'var(--portal-text-secondary)', marginBottom: '10px' }}>Full Name</label>
                <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-2xl text-[16px] focus:outline-none transition-all"
                  style={{ background: 'var(--portal-bg-secondary)', border: '1px solid var(--portal-border-default)', padding: '16px 20px', color: 'var(--portal-text-primary)' }}
                  placeholder="Your full name" required />
              </div>
            )}
            <div>
              <label className="block text-[15px] font-medium" style={{ color: 'var(--portal-text-secondary)', marginBottom: '10px' }}>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-2xl text-[16px] focus:outline-none transition-all"
                style={{ background: 'var(--portal-bg-secondary)', border: '1px solid var(--portal-border-default)', padding: '16px 20px', color: 'var(--portal-text-primary)' }}
                placeholder="you@company.com" required />
            </div>
            <div>
              <label className="block text-[15px] font-medium" style={{ color: 'var(--portal-text-secondary)', marginBottom: '10px' }}>Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-2xl text-[16px] focus:outline-none transition-all"
                style={{ background: 'var(--portal-bg-secondary)', border: '1px solid var(--portal-border-default)', padding: '16px 20px', color: 'var(--portal-text-primary)' }}
                placeholder={mode === 'signup' ? 'Min. 6 characters' : 'Your password'} required />
            </div>
            {mode === 'signup' && (
              <div className="portal-animate-fade-in">
                <label className="block text-[15px] font-medium" style={{ color: 'var(--portal-text-secondary)', marginBottom: '10px' }}>Confirm Password</label>
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-2xl text-[16px] focus:outline-none transition-all"
                  style={{ background: 'var(--portal-bg-secondary)', border: '1px solid var(--portal-border-default)', padding: '16px 20px', color: 'var(--portal-text-primary)' }}
                  placeholder="Confirm your password" required />
              </div>
            )}
            {error && (
              <div className="rounded-2xl text-[15px]" style={{ background: 'var(--portal-danger-subtle)', border: '1px solid rgba(196,114,114,0.2)', color: 'var(--portal-danger)', padding: '16px 20px' }}>
                {error}
              </div>
            )}
            <button
              type="submit" disabled={loading}
              className="w-full rounded-2xl font-semibold text-[17px] transition-all disabled:opacity-50 disabled:cursor-not-allowed portal-glow-accent text-white"
              style={{ background: 'var(--portal-gradient-accent)', padding: '18px', marginTop: '8px' }}
            >
              {loading
                ? (mode === 'login' ? 'Signing in...' : 'Creating account...')
                : (mode === 'login' ? 'Sign In' : 'Create Account')
              }
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
