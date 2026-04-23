'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { CheckCircle, ArrowRight, Loader2 } from 'lucide-react';

interface ProgramData {
  id: string;
  program_name: string;
  company_name: string;
  company_logo_url: string | null;
}

export default function ProgramRegistrationPage() {
  const params = useParams();
  const code = (params.code as string).toUpperCase();

  const [program, setProgram] = useState<ProgramData | null>(null);
  const [loadError, setLoadError] = useState('');
  const [loading, setLoading] = useState(true);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetch(`/api/programs/${code}`)
      .then(r => {
        if (r.status === 404) throw new Error('Program not found.');
        if (!r.ok) throw new Error('Could not load program.');
        return r.json();
      })
      .then(data => setProgram(data))
      .catch(err => setLoadError(err.message))
      .finally(() => setLoading(false));
  }, [code]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitting(true);
    try {
      const res = await fetch('/api/programs/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ program_code: code, full_name: fullName, email, title, company, phone }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Registration failed.' }));
        throw new Error(err.error ?? 'Registration failed.');
      }
      setSubmitted(true);
    } catch (err: any) {
      setSubmitError(err.message ?? 'Registration failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '13px 16px',
    fontSize: 15,
    color: '#1a3a2a',
    background: '#f5f9f7',
    border: '1px solid rgba(93,171,121,0.2)',
    borderRadius: 10,
    outline: 'none',
  };

  const focusHandler = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = 'rgba(184,145,59,0.5)';
    e.target.style.boxShadow = '0 0 0 3px rgba(184,145,59,0.08)';
  };
  const blurHandler = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = 'rgba(93,171,121,0.2)';
    e.target.style.boxShadow = 'none';
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#f5f9f7' }}>
        <Loader2 size={32} style={{ color: '#5dab79', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  // Error state
  if (loadError || !program) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8" style={{ background: '#f5f9f7' }}>
        <div className="text-center max-w-sm">
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1a3a2a', marginBottom: 8 }}>Program not found</h1>
          <p style={{ fontSize: 14, color: '#6b9a7d', marginBottom: 20 }}>{loadError || 'This program code is invalid or no longer active.'}</p>
          <a href="/programs" style={{ fontSize: 14, color: '#b8913b', fontWeight: 600 }}>← Try another code</a>
        </div>
      </div>
    );
  }

  // Success state
  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8" style={{ background: '#f5f9f7' }}>
        <div className="text-center max-w-md">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6"
            style={{ background: 'linear-gradient(135deg, rgba(93,171,121,0.15), rgba(93,171,121,0.06))', border: '1px solid rgba(93,171,121,0.25)' }}>
            <CheckCircle size={34} style={{ color: '#5dab79' }} />
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1a3a2a', fontFamily: "'DM Serif Display', serif", marginBottom: 12 }}>
            You&apos;re registered
          </h1>
          <p style={{ fontSize: 15, color: '#5a7a66', lineHeight: 1.6, marginBottom: 6 }}>
            Welcome to <strong style={{ color: '#1a3a2a' }}>{program.program_name}</strong>.
          </p>
          <p style={{ fontSize: 14, color: '#9ab5a3' }}>
            Your facilitator will be in touch with next steps.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#f5f9f7' }}>
      <div className="fixed inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse at 50% 0%, rgba(93,171,121,0.06) 0%, transparent 55%)',
      }} />

      <div className="relative flex-1 flex flex-col items-center justify-center px-6 py-16">
        <div className="w-full max-w-lg">

          {/* Company logo or A&O logo */}
          <div className="flex justify-center mb-10">
            {program.company_logo_url ? (
              <img
                src={program.company_logo_url}
                alt={program.company_name}
                style={{ maxHeight: 64, maxWidth: 240, objectFit: 'contain' }}
              />
            ) : (
              <Image src="/logo.png" alt="Apex & Origin" width={220} height={77} className="h-auto" priority />
            )}
          </div>

          {/* Program header */}
          <div className="text-center mb-10">
            <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#b8913b', marginBottom: 8 }}>
              {program.company_name}
            </p>
            <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1a3a2a', fontFamily: "'DM Serif Display', serif", lineHeight: 1.2, marginBottom: 10 }}>
              {program.program_name}
            </h1>
            <div className="flex items-center justify-center gap-3">
              <div className="h-px w-12" style={{ background: 'rgba(193,154,91,0.3)' }} />
              <span style={{ fontSize: 13, color: '#9ab5a3' }}>Participant Registration</span>
              <div className="h-px w-12" style={{ background: 'rgba(193,154,91,0.3)' }} />
            </div>
          </div>

          {/* Registration form */}
          <div className="rounded-2xl p-8" style={{
            background: '#ffffff',
            border: '1px solid rgba(93,171,121,0.18)',
            boxShadow: '0 4px 24px rgba(10,15,28,0.06)',
          }}>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#b8913b', marginBottom: 6 }}>
                    Full Name <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input type="text" value={fullName} onChange={e => setFullName(e.target.value)}
                    style={inputStyle} placeholder="Jane Smith" required
                    onFocus={focusHandler} onBlur={blurHandler} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#b8913b', marginBottom: 6 }}>
                    Email <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                    style={inputStyle} placeholder="jane@company.com" required
                    onFocus={focusHandler} onBlur={blurHandler} />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#b8913b', marginBottom: 6 }}>
                    Job Title
                  </label>
                  <input type="text" value={title} onChange={e => setTitle(e.target.value)}
                    style={inputStyle} placeholder="Director, People"
                    onFocus={focusHandler} onBlur={blurHandler} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#b8913b', marginBottom: 6 }}>
                    Company
                  </label>
                  <input type="text" value={company} onChange={e => setCompany(e.target.value)}
                    style={inputStyle} placeholder={program.company_name}
                    onFocus={focusHandler} onBlur={blurHandler} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#b8913b', marginBottom: 6 }}>
                  Phone
                </label>
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                  style={inputStyle} placeholder="+1 (555) 000-0000"
                  onFocus={focusHandler} onBlur={blurHandler} />
              </div>

              {submitError && (
                <div style={{ padding: '12px 16px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, fontSize: 13, color: '#ef4444' }}>
                  {submitError}
                </div>
              )}

              <button type="submit" disabled={submitting}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  padding: '14px 24px',
                  background: submitting ? 'rgba(93,171,121,0.4)' : 'linear-gradient(135deg, #5dab79, #4a9468)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: 12,
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                  marginTop: 4,
                }}>
                {submitting ? 'Submitting…' : 'Complete Registration'}
                {!submitting && <ArrowRight size={16} />}
              </button>
            </form>
          </div>

          <p className="text-center mt-6" style={{ fontSize: 12, color: '#9ab5a3' }}>
            Program code: <span style={{ fontWeight: 700, letterSpacing: '0.1em' }}>{code}</span>
          </p>
        </div>
      </div>

      <footer className="relative py-6 text-center" style={{ borderTop: '1px solid rgba(93,171,121,0.1)' }}>
        <p style={{ fontSize: 12, color: '#9ab5a3' }}>© {new Date().getFullYear()} Apex &amp; Origin</p>
      </footer>
    </div>
  );
}
