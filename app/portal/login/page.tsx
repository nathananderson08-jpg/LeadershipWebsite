'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createPortalClient } from '@/lib/portal/supabase';
import { CheckCircle } from 'lucide-react';
import Image from 'next/image';

type AuthMode = 'login' | 'signup';

export default function PortalLoginPage() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const supabase = createPortalClient();

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    setError('');
    setSuccess(false);
    setFullName('');
    setPassword('');
    setConfirmPassword('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) { setError(signInError.message); setLoading(false); return; }

    // Determine redirect based on profile role
    const userId = data.user?.id;
    if (userId) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .maybeSingle();

      const isAdmin = profile?.role === 'admin' || profile?.role === 'primary_admin';
      router.replace(isAdmin ? '/portal/dashboard/programs' : '/portal/dashboard/practitioners/dashboard');
    } else {
      router.replace('/portal/dashboard/practitioners/dashboard');
    }
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

    if (signUpError) { setError(signUpError.message); setLoading(false); return; }

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
      if (signInError) { setError(signInError.message); } else { router.replace('/portal/dashboard/practitioners/dashboard'); }
      setLoading(false);
      return;
    }

    const { data: profileCheck } = await supabase
      .from('profiles').select('id').eq('email', email.toLowerCase().trim()).maybeSingle();

    if (!profileCheck) {
      setError('This email has not been invited to the portal. Please contact your administrator.');
      setLoading(false);
      return;
    }

    if (signUpData.session) { router.replace('/portal/dashboard/practitioners/dashboard'); return; }
    setSuccess(true);
    setLoading(false);
  };

  const inputStyle = {
    background: '#ffffff',
    border: '1px solid rgba(184,145,59,0.2)',
    padding: '14px 18px',
    color: '#1a3a2a',
    borderRadius: '12px',
    fontSize: '15px',
    width: '100%',
    outline: 'none',
  };

  const focusProps = {
    onFocus: (e: React.FocusEvent<HTMLInputElement>) => {
      e.target.style.borderColor = 'rgba(184,145,59,0.5)';
      e.target.style.boxShadow = '0 0 0 3px rgba(184,145,59,0.08)';
    },
    onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
      e.target.style.borderColor = 'rgba(184,145,59,0.2)';
      e.target.style.boxShadow = 'none';
    },
  };

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6" style={{ background: '#f5f9f7' }}>
        <div className="text-center max-w-md">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6"
            style={{ background: 'linear-gradient(135deg, rgba(193,154,91,0.15), rgba(93,171,121,0.1))', border: '1px solid rgba(193,154,91,0.2)' }}>
            <CheckCircle size={32} style={{ color: 'var(--portal-gold-600)' }} />
          </div>
          <h1 className="text-3xl mb-3" style={{ color: '#1a3a2a', fontFamily: "'DM Serif Display', serif" }}>Check your email</h1>
          <p className="text-base mb-6" style={{ color: '#6b9a7d' }}>
            We sent a confirmation link to <strong style={{ color: 'var(--portal-gold-600)' }}>{email}</strong>.
          </p>
          <button onClick={() => switchMode('login')} className="text-sm font-medium hover:underline"
            style={{ color: 'var(--portal-gold-600)' }}>Back to Sign In</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-[48%] relative overflow-hidden flex-col items-center justify-center p-16"
        style={{ background: '#ffffff', borderRight: '1px solid rgba(93,171,121,0.12)' }}>
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse at 50% 40%, rgba(193,154,91,0.06) 0%, transparent 65%)',
        }} />
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="w-full max-w-lg mb-14">
            <Image src="/logo.png" alt="Apex & Origin" width={560} height={196} className="w-full h-auto object-contain" priority />
          </div>
          <div className="flex items-center gap-4">
            <div className="h-px w-14" style={{ background: 'var(--portal-gold-400)' }} />
            <p className="text-3xl font-semibold uppercase"
              style={{ color: 'var(--portal-gold-600)', fontFamily: "'DM Serif Display', serif", letterSpacing: '0.08em' }}>
              Staff Portal
            </p>
            <div className="h-px w-14" style={{ background: 'var(--portal-gold-400)' }} />
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-16" style={{ background: '#f5f9f7' }}>
        <div className="w-full max-w-md portal-animate-fade-in">

          <div className="mb-8">
            <h2 className="text-3xl mb-2" style={{ color: '#1a3a2a', fontFamily: "'DM Serif Display', serif", letterSpacing: '-0.02em' }}>
              {mode === 'login' ? 'Welcome back' : 'Create your account'}
            </h2>
            <p className="text-sm" style={{ color: '#6b9a7d' }}>
              {mode === 'login' ? 'Sign in to continue to your portal' : 'Set up your practitioner account'}
            </p>
          </div>

          <form onSubmit={mode === 'login' ? handleLogin : handleSignUp} className="space-y-5">
            {mode === 'signup' && (
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--portal-gold-600)' }}>Full Name</label>
                <input type="text" value={fullName} onChange={e => setFullName(e.target.value)}
                  style={inputStyle} placeholder="Your full name" required {...focusProps} />
              </div>
            )}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--portal-gold-600)' }}>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                style={inputStyle} placeholder="you@company.com" required {...focusProps} />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--portal-gold-600)' }}>Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                style={inputStyle} placeholder={mode === 'signup' ? 'Min. 6 characters' : '••••••••'} required {...focusProps} />
            </div>
            {mode === 'signup' && (
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--portal-gold-600)' }}>Confirm Password</label>
                <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                  style={inputStyle} placeholder="Confirm your password" required {...focusProps} />
              </div>
            )}
            {error && (
              <div className="rounded-xl text-sm px-4 py-3"
                style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444' }}>
                {error}
              </div>
            )}
            <button type="submit" disabled={loading}
              className="w-full portal-btn portal-btn-gold disabled:opacity-50"
              style={{ marginTop: '8px', width: '100%', justifyContent: 'center', padding: '1rem', fontSize: '0.9375rem' }}>
              {loading ? (mode === 'login' ? 'Signing in…' : 'Creating account…') : (mode === 'login' ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          <div className="mt-8 pt-6 space-y-3" style={{ borderTop: '1px solid rgba(93,171,121,0.15)' }}>
            {mode === 'login' ? (
              <p className="text-[12px] text-center" style={{ color: '#6b9a7d' }}>
                New practitioner?{' '}
                <button onClick={() => switchMode('signup')} className="hover:underline font-medium" style={{ color: 'var(--portal-gold-600)' }}>
                  Create an account
                </button>
              </p>
            ) : (
              <p className="text-[12px] text-center" style={{ color: '#6b9a7d' }}>
                Already have an account?{' '}
                <button onClick={() => switchMode('login')} className="hover:underline font-medium" style={{ color: 'var(--portal-gold-600)' }}>
                  Sign in
                </button>
              </p>
            )}
            <p className="text-[12px] text-center" style={{ color: '#6b9a7d' }}>
              Here for a leadership program?{' '}
              <a href="/programs" className="hover:underline font-medium" style={{ color: 'var(--portal-gold-600)' }}>
                Register here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
