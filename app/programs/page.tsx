'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowRight, KeyRound } from 'lucide-react';

export default function ProgramsLandingPage() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) return;
    setChecking(true);
    setError('');

    try {
      const res = await fetch(`/api/programs/${trimmed}`);
      if (res.status === 404) {
        setError('Program code not found. Please check with your facilitator.');
        setChecking(false);
        return;
      }
      if (!res.ok) throw new Error('Something went wrong. Please try again.');
      router.push(`/programs/${trimmed}`);
    } catch (err: any) {
      setError(err.message ?? 'Something went wrong.');
      setChecking(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#f5f9f7' }}>
      {/* Subtle background texture */}
      <div className="fixed inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse at 60% 20%, rgba(93,171,121,0.06) 0%, transparent 55%), radial-gradient(ellipse at 20% 80%, rgba(193,154,91,0.04) 0%, transparent 50%)',
      }} />

      <div className="relative flex-1 flex flex-col items-center justify-center px-6 py-16">
        {/* Logo */}
        <div className="mb-12">
          <Image src="/logo.png" alt="Apex & Origin" width={280} height={98} className="h-auto" priority />
        </div>

        <div className="w-full max-w-md">
          {/* Eyebrow */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px flex-1" style={{ background: 'linear-gradient(to right, transparent, rgba(193,154,91,0.3))' }} />
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#b8913b' }}>
              Leadership Program Registration
            </span>
            <div className="h-px flex-1" style={{ background: 'linear-gradient(to left, transparent, rgba(193,154,91,0.3))' }} />
          </div>

          {/* Heading */}
          <h1 className="text-center mb-3" style={{
            fontSize: 32, fontWeight: 700, color: '#1a3a2a',
            fontFamily: "'DM Serif Display', serif", letterSpacing: '-0.02em', lineHeight: 1.2,
          }}>
            Welcome to your program
          </h1>
          <p className="text-center mb-10" style={{ fontSize: 15, color: '#5a7a66', lineHeight: 1.6 }}>
            Enter the program code your facilitator provided to get started.
          </p>

          {/* Code entry card */}
          <div className="rounded-2xl p-8" style={{
            background: '#ffffff',
            border: '1px solid rgba(93,171,121,0.18)',
            boxShadow: '0 4px 24px rgba(10,15,28,0.06)',
          }}>
            <form onSubmit={handleSubmit}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#b8913b', marginBottom: 8 }}>
                Program Code
              </label>
              <div style={{ position: 'relative', marginBottom: error ? 8 : 20 }}>
                <div style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                  <KeyRound size={16} color="#9ab5a3" />
                </div>
                <input
                  type="text"
                  value={code}
                  onChange={e => { setCode(e.target.value.toUpperCase()); setError(''); }}
                  placeholder="e.g. AX7K2P"
                  maxLength={8}
                  autoComplete="off"
                  autoCapitalize="characters"
                  style={{
                    width: '100%',
                    paddingLeft: 44,
                    paddingRight: 16,
                    paddingTop: 14,
                    paddingBottom: 14,
                    fontSize: 18,
                    fontWeight: 700,
                    letterSpacing: '0.2em',
                    color: '#1a3a2a',
                    background: '#f5f9f7',
                    border: `1px solid ${error ? 'rgba(239,68,68,0.4)' : 'rgba(93,171,121,0.2)'}`,
                    borderRadius: 12,
                    outline: 'none',
                  }}
                  onFocus={e => { e.target.style.borderColor = 'rgba(184,145,59,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(184,145,59,0.08)'; }}
                  onBlur={e => { e.target.style.borderColor = error ? 'rgba(239,68,68,0.4)' : 'rgba(93,171,121,0.2)'; e.target.style.boxShadow = 'none'; }}
                />
              </div>

              {error && (
                <p style={{ fontSize: 13, color: '#ef4444', marginBottom: 16 }}>{error}</p>
              )}

              <button
                type="submit"
                disabled={!code.trim() || checking}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  padding: '14px 24px',
                  background: !code.trim() || checking
                    ? 'rgba(93,171,121,0.3)'
                    : 'linear-gradient(135deg, #5dab79, #4a9468)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: 12,
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: !code.trim() || checking ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                }}>
                {checking ? 'Finding your program…' : 'Continue'}
                {!checking && <ArrowRight size={16} />}
              </button>
            </form>
          </div>

          <p className="text-center mt-6" style={{ fontSize: 12, color: '#9ab5a3' }}>
            Don&apos;t have a code? Contact your program facilitator.
          </p>
        </div>
      </div>

      <footer className="relative py-6 text-center" style={{ borderTop: '1px solid rgba(93,171,121,0.1)' }}>
        <p style={{ fontSize: 12, color: '#9ab5a3' }}>© {new Date().getFullYear()} Apex &amp; Origin</p>
      </footer>
    </div>
  );
}
