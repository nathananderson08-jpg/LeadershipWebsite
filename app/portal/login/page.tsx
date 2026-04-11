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
      setError('This email has not been invited to the Practitioner Portal. Please contact your administrator if this is an error.');
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

  const inputStyle = {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    padding: '14px 18px',
    color: '#ffffff',
    borderRadius: '12px',
    fontSize: '15px',
    width: '100%',
  };

  const inputFocusStyle = {
    outline: 'none',
    borderColor: 'rgba(193,154,91,0.5)',
  };

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6" style={{ background: '#05090f' }}>
        <div className="text-center max-w-md">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6"
            style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-3" style={{ color: '#ffffff' }}>Check your email</h1>
          <p className="text-base mb-6" style={{ color: 'rgba(255,255,255,0.5)' }}>
            We sent a confirmation link to <strong style={{ color: 'rgba(255,255,255,0.8)' }}>{email}</strong>.
          </p>
          <button onClick={() => switchMode('login')} className="text-sm font-medium hover:underline"
            style={{ color: '#c19a5b' }}>
            Back to Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen" style={{ background: '#05090f' }}>
      {/* Left panel — brand */}
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden flex-col items-center justify-center p-12"
        style={{ borderRight: '1px solid rgba(255,255,255,0.06)' }}>
        {/* Background radial glow */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse at 50% 40%, rgba(193,154,91,0.12) 0%, transparent 65%)',
        }} />
        {/* Grid pattern */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }} />
        <div className="relative z-10 text-center">
          {/* Logo mark */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-8 font-bold text-xl"
            style={{
              background: 'linear-gradient(135deg, #c19a5b 0%, #d4b07a 100%)',
              color: '#0a0f1c',
              fontWeight: 800,
            }}>
            A&amp;O
          </div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#ffffff', letterSpacing: '-0.02em' }}>
            Apex &amp; Origin
          </h1>
          <p className="text-base mb-16" style={{ color: 'rgba(193,154,91,0.7)' }}>Practitioner Hub</p>

          {/* Lifecycle phases visual */}
          <div className="flex flex-col gap-3 text-left max-w-xs mx-auto">
            {['Assess', 'Coach', 'Develop', 'Transform', 'Sustain'].map((phase, i) => (
              <div key={phase} className="flex items-center gap-3 px-4 py-3 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold shrink-0"
                  style={{ background: 'rgba(193,154,91,0.15)', color: '#c19a5b' }}>
                  {String(i + 1).padStart(2, '0')}
                </div>
                <span className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.6)' }}>{phase}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-16">
        <div className="w-full max-w-md">
          {/* Mode tabs */}
          <div className="flex rounded-xl mb-10 p-1"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            {(['login', 'signup'] as const).map((m) => (
              <button key={m} onClick={() => switchMode(m)}
                className="flex-1 rounded-lg text-sm font-semibold py-2.5 transition-all"
                style={{
                  background: mode === m ? 'rgba(193,154,91,0.15)' : 'transparent',
                  color: mode === m ? '#c19a5b' : 'rgba(255,255,255,0.35)',
                  border: mode === m ? '1px solid rgba(193,154,91,0.25)' : '1px solid transparent',
                }}>
                {m === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2" style={{ color: '#ffffff', letterSpacing: '-0.02em' }}>
              {mode === 'login' ? 'Welcome back' : 'Get started'}
            </h2>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
              {mode === 'login'
                ? 'Sign in to your Apex & Origin practitioner account'
                : 'Create your account to manage programs'}
            </p>
          </div>

          <form onSubmit={mode === 'login' ? handleLogin : handleSignUp} className="space-y-4">
            {mode === 'signup' && (
              <div className="portal-animate-fade-in">
                <label className="block text-xs font-semibold uppercase tracking-wider mb-2"
                  style={{ color: 'rgba(255,255,255,0.4)' }}>Full Name</label>
                <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)}
                  style={inputStyle} placeholder="Your full name" required
                  onFocus={e => Object.assign(e.target.style, inputFocusStyle)}
                  onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.outline = 'none'; }}
                />
              </div>
            )}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-2"
                style={{ color: 'rgba(255,255,255,0.4)' }}>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                style={inputStyle} placeholder="you@company.com" required
                onFocus={e => Object.assign(e.target.style, inputFocusStyle)}
                onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.outline = 'none'; }}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-2"
                style={{ color: 'rgba(255,255,255,0.4)' }}>Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                style={inputStyle} placeholder={mode === 'signup' ? 'Min. 6 characters' : '••••••••'} required
                onFocus={e => Object.assign(e.target.style, inputFocusStyle)}
                onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.outline = 'none'; }}
              />
            </div>
            {mode === 'signup' && (
              <div className="portal-animate-fade-in">
                <label className="block text-xs font-semibold uppercase tracking-wider mb-2"
                  style={{ color: 'rgba(255,255,255,0.4)' }}>Confirm Password</label>
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                  style={inputStyle} placeholder="Confirm your password" required
                  onFocus={e => Object.assign(e.target.style, inputFocusStyle)}
                  onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.outline = 'none'; }}
                />
              </div>
            )}
            {error && (
              <div className="rounded-xl text-sm px-4 py-3"
                style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.2)', color: '#f87171' }}>
                {error}
              </div>
            )}
            <button type="submit" disabled={loading}
              className="w-full rounded-xl font-semibold text-sm py-3.5 transition-all disabled:opacity-50 mt-2"
              style={{
                background: 'linear-gradient(135deg, #c19a5b 0%, #d4b07a 100%)',
                color: '#0a0f1c',
                marginTop: '8px',
              }}>
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
