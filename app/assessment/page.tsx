'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { FIRM_NAME } from '@/lib/constants';

// ── Types ─────────────────────────────────────────────────────────────────────

interface FormData {
  company_name: string;
  industry: string;
  headcount_range: string;
  challenge: string;
  focus_areas: string[];
  full_name: string;
  title: string;
  email: string;
  consent: boolean;
}

interface ReportSection {
  headline: string;
  executive_summary: string;
  leadership_profile: {
    industry_context: string;
    maturity_stage: string;
    maturity_description: string;
  };
  opportunity_areas: Array<{ title: string; description: string; urgency: string }>;
  recommended_focus: string;
  next_steps: Array<{ action: string; why: string }>;
  engagement_suggestion: string;
}

// ── Constants ─────────────────────────────────────────────────────────────────

const INDUSTRIES = [
  'Financial Services', 'Healthcare & Life Sciences', 'Technology', 'Manufacturing',
  'Consumer Goods & Retail', 'Energy & Utilities', 'Professional Services',
  'Government & Public Sector', 'Education', 'Media & Entertainment',
  'Real Estate', 'Transportation & Logistics', 'Other',
];

const HEADCOUNT_RANGES = [
  { value: '50-250',     label: '50–250 employees' },
  { value: '250-1000',   label: '250–1,000 employees' },
  { value: '1000-5000',  label: '1,000–5,000 employees' },
  { value: '5000-20000', label: '5,000–20,000 employees' },
  { value: '20000+',     label: '20,000+ employees' },
];

const CHALLENGES = [
  'Building a stronger leadership pipeline',
  'Post-merger or acquisition integration',
  'Accelerating digital or AI transformation',
  'Succession planning for senior roles',
  'Improving executive team alignment',
  'Culture change or organizational transformation',
  'Developing CHRO / People leader capability',
  'Other',
];

const FOCUS_AREAS = [
  'Executive Coaching', 'Leadership Assessment', 'Succession Planning',
  'Team Effectiveness', 'Culture & Transformation', 'AI Leadership Readiness',
  'Leadership Programs', 'CHRO Advisory',
];

const MATURITY_COLORS: Record<string, string> = {
  Foundational: '#f59e0b',
  Developing:   '#6366f1',
  Established:  '#22c55e',
  Leading:      '#5dab79',
};

// ── Sub-components ────────────────────────────────────────────────────────────

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: i < current ? 28 : i === current ? 28 : 8,
            height: 8,
            borderRadius: 999,
            background: i < current ? '#5dab79' : i === current ? '#5dab79' : 'rgba(255,255,255,0.15)',
            transition: 'all 0.4s ease',
            opacity: i < current ? 0.5 : 1,
          }} />
        </div>
      ))}
      <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginLeft: 6, fontWeight: 600 }}>
        Step {current + 1} of {total}
      </span>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '12px 16px',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: 10, fontSize: 14,
  color: 'rgba(255,255,255,0.9)',
  background: 'rgba(255,255,255,0.06)',
  outline: 'none', boxSizing: 'border-box',
  fontFamily: 'inherit',
  transition: 'border-color 0.2s',
};

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  cursor: 'pointer',
  appearance: 'none',
  backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L6 6L11 1' stroke='rgba(255,255,255,0.4)' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 14px center',
  paddingRight: 36,
};

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: 12, fontWeight: 700,
  color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase',
  letterSpacing: '0.08em', marginBottom: 7,
};

// ── Report display ────────────────────────────────────────────────────────────

function ReportDisplay({ report, company_name, full_name }: {
  report: ReportSection;
  company_name: string;
  full_name: string;
}) {
  const maturityColor = MATURITY_COLORS[report.leadership_profile?.maturity_stage ?? ''] ?? '#5dab79';
  const firstName = full_name.split(' ')[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 36 }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#5dab79', margin: '0 0 8px' }}>
          {FIRM_NAME}
        </p>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: 'white', margin: '0 0 6px' }}>
          Leadership Readiness Report
        </h1>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', margin: 0 }}>
          {company_name} · {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
      </div>

      {/* Greeting */}
      <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '18px 22px', marginBottom: 16 }}>
        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, margin: 0, lineHeight: 1.6 }}>
          Hi {firstName} — here is your personalized assessment. We have analyzed your organization&apos;s leadership profile based on your responses and industry benchmarks.
        </p>
      </div>

      {/* Headline */}
      <div style={{ background: 'linear-gradient(135deg, rgba(93,171,121,0.18), rgba(93,171,121,0.06))', border: '1px solid rgba(93,171,121,0.35)', borderRadius: 14, padding: '20px 22px', marginBottom: 16 }}>
        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#5dab79', margin: '0 0 8px' }}>Key Finding</p>
        <p style={{ color: '#e8f5ed', fontSize: 16, fontWeight: 600, margin: 0, lineHeight: 1.5 }}>{report.headline}</p>
      </div>

      {/* Two-col: Summary + Maturity */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '18px 20px' }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', margin: '0 0 10px' }}>Executive Summary</p>
          <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: 13, margin: 0, lineHeight: 1.7 }}>{report.executive_summary}</p>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '18px 20px' }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', margin: '0 0 10px' }}>Leadership Maturity</p>
          <span style={{ display: 'inline-block', padding: '4px 14px', borderRadius: 999, background: `${maturityColor}22`, border: `1px solid ${maturityColor}66`, fontSize: 12, fontWeight: 700, color: maturityColor, marginBottom: 10 }}>
            {report.leadership_profile?.maturity_stage}
          </span>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 13, margin: '0 0 8px', lineHeight: 1.6 }}>{report.leadership_profile?.maturity_description}</p>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, margin: 0, lineHeight: 1.6 }}>{report.leadership_profile?.industry_context}</p>
        </div>
      </div>

      {/* Opportunity Areas */}
      <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, overflow: 'hidden', marginBottom: 16 }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', margin: 0 }}>Key Opportunity Areas</p>
        </div>
        {report.opportunity_areas?.map((area, i) => (
          <div key={i} style={{ padding: '16px 20px', borderBottom: i < report.opportunity_areas.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: area.urgency === 'high' ? '#ef4444' : '#f59e0b', flexShrink: 0, display: 'inline-block' }} />
              <p style={{ fontSize: 14, fontWeight: 700, color: '#e8f5ed', margin: 0 }}>{area.title}</p>
              <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 999, background: area.urgency === 'high' ? 'rgba(239,68,68,0.12)' : 'rgba(245,158,11,0.12)', color: area.urgency === 'high' ? '#f87171' : '#fbbf24', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {area.urgency}
              </span>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 13, margin: 0, lineHeight: 1.7, paddingLeft: 18 }}>{area.description}</p>
          </div>
        ))}
      </div>

      {/* Recommended Focus */}
      {report.recommended_focus && (
        <div style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.25)', borderRadius: 14, padding: '18px 22px', marginBottom: 16 }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#d4af37', margin: '0 0 10px' }}>Recommended Focus</p>
          <p style={{ color: 'rgba(255,255,255,0.82)', fontSize: 14, margin: 0, lineHeight: 1.7 }}>{report.recommended_focus}</p>
        </div>
      )}

      {/* Next Steps */}
      <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, overflow: 'hidden', marginBottom: 16 }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', margin: 0 }}>Suggested Next Steps</p>
        </div>
        {report.next_steps?.map((step, i) => (
          <div key={i} style={{ display: 'flex', gap: 14, padding: '14px 20px', borderBottom: i < report.next_steps.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none', alignItems: 'flex-start' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 24, borderRadius: '50%', background: '#5dab79', color: 'white', fontSize: 11, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>{i + 1}</span>
            <div>
              <p style={{ color: '#e8f5ed', fontSize: 14, fontWeight: 600, margin: '0 0 3px' }}>{step.action}</p>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, margin: 0, lineHeight: 1.5 }}>{step.why}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div style={{ textAlign: 'center', padding: '28px 24px', background: 'rgba(93,171,121,0.08)', border: '1px solid rgba(93,171,121,0.2)', borderRadius: 14, marginBottom: 16 }}>
        <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: 15, fontWeight: 700, margin: '0 0 6px' }}>Ready to act on these findings?</p>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, margin: '0 0 18px', lineHeight: 1.5 }}>{report.engagement_suggestion}</p>
        <Link
          href="/contact"
          style={{ display: 'inline-block', padding: '12px 28px', background: '#5dab79', color: 'white', textDecoration: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700 }}
        >
          Book a Conversation →
        </Link>
      </div>

      <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 11, textAlign: 'center', lineHeight: 1.6, margin: 0 }}>
        A copy of this report has been sent to your email. This assessment is based on your responses and industry benchmarks.<br />
        For a full diagnostic, speak with one of our senior advisors.
      </p>
    </motion.div>
  );
}

// ── Loading animation ─────────────────────────────────────────────────────────

function GeneratingState({ company_name }: { company_name: string }) {
  const steps = [
    'Analyzing industry leadership benchmarks…',
    'Mapping your organizational profile…',
    'Identifying key opportunity areas…',
    'Generating your personalized report…',
  ];
  const [step, setStep] = useState(0);

  useState(() => {
    const interval = setInterval(() => {
      setStep(s => Math.min(s + 1, steps.length - 1));
    }, 2200);
    return () => clearInterval(interval);
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ textAlign: 'center', padding: '60px 0' }}
    >
      <div style={{ width: 56, height: 56, borderRadius: '50%', border: '3px solid rgba(93,171,121,0.2)', borderTopColor: '#5dab79', animation: 'spin 1s linear infinite', margin: '0 auto 28px' }} />
      <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#5dab79', margin: '0 0 8px' }}>
        Building Your Report
      </p>
      <p style={{ fontSize: 22, fontWeight: 800, color: 'white', margin: '0 0 6px' }}>{company_name}</p>
      <AnimatePresence mode="wait">
        <motion.p
          key={step}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
          style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14, margin: 0 }}
        >
          {steps[step]}
        </motion.p>
      </AnimatePresence>
    </motion.div>
  );
}

// ── Main Form ─────────────────────────────────────────────────────────────────

const TOTAL_STEPS = 3;

export default function AssessmentPage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>({
    company_name: '', industry: '', headcount_range: '',
    challenge: '', focus_areas: [],
    full_name: '', title: '', email: '', consent: false,
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [report, setReport] = useState<ReportSection | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const set = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(f => ({ ...f, [field]: e.target.value }));
  };

  const toggleFocus = (area: string) => {
    setForm(f => ({
      ...f,
      focus_areas: f.focus_areas.includes(area)
        ? f.focus_areas.filter(a => a !== area)
        : [...f.focus_areas, area],
    }));
  };

  const canAdvanceStep1 = form.company_name.trim().length > 1 && form.headcount_range;
  const canAdvanceStep2 = form.challenge;
  const canSubmit = form.full_name.trim().length > 1 && form.email.includes('@') && form.consent;

  const handleSubmit = async () => {
    setStatus('loading');
    setErrorMsg('');
    try {
      const res = await fetch('/api/assessment/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Submission failed.');
      setReport(data.report);
      setStatus('done');
    } catch (err: any) {
      setErrorMsg(err.message ?? 'Something went wrong. Please try again.');
      setStatus('error');
    }
  };

  const cardStyle: React.CSSProperties = {
    maxWidth: 640,
    margin: '0 auto',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 20,
    padding: '36px 40px',
  };

  return (
    <>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input::placeholder, textarea::placeholder { color: rgba(255,255,255,0.2); }
        select option { background: #0c1222; color: white; }
        input:focus, select:focus { border-color: rgba(93,171,121,0.5) !important; }
      `}</style>

      <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #0a1c12 0%, #0c1222 50%, #0a1810 100%)', paddingTop: '5rem', paddingBottom: '6rem' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', padding: '48px 24px 40px', maxWidth: 680, margin: '0 auto' }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#5dab79', margin: '0 0 14px' }}>
            Free Assessment
          </p>
          <h1 style={{ fontSize: 34, fontWeight: 800, color: 'white', margin: '0 0 14px', lineHeight: 1.2 }}>
            How ready is your organization<br /> for the leadership challenges ahead?
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', margin: 0, lineHeight: 1.6, maxWidth: 520, marginLeft: 'auto', marginRight: 'auto' }}>
            Answer a few questions and receive a personalized Leadership Readiness Report — powered by AI, grounded in 15+ years of consulting expertise.
          </p>
        </div>

        <div style={{ padding: '0 24px' }}>
          <AnimatePresence mode="wait">

            {/* ── Loading ── */}
            {status === 'loading' && (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ maxWidth: 640, margin: '0 auto' }}>
                <GeneratingState company_name={form.company_name} />
              </motion.div>
            )}

            {/* ── Report ── */}
            {status === 'done' && report && (
              <motion.div key="report" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ maxWidth: 700, margin: '0 auto' }}>
                <ReportDisplay report={report} company_name={form.company_name} full_name={form.full_name} />
              </motion.div>
            )}

            {/* ── Form ── */}
            {(status === 'idle' || status === 'error') && (
              <motion.div key={`step-${step}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} style={cardStyle}>
                <StepIndicator current={step} total={TOTAL_STEPS} />

                {/* Step 1: Organization */}
                {step === 0 && (
                  <div>
                    <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#5dab79', margin: '0 0 10px' }}>Step 1</p>
                    <h2 style={{ fontSize: 22, fontWeight: 800, color: 'white', margin: '0 0 6px' }}>Your Organization</h2>
                    <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', margin: '0 0 28px' }}>Tell us about your company so we can benchmark your report accurately.</p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                      <div>
                        <label style={labelStyle}>Company Name *</label>
                        <input style={inputStyle} value={form.company_name} onChange={set('company_name')} placeholder="e.g. Acme Corporation" />
                      </div>
                      <div>
                        <label style={labelStyle}>Industry</label>
                        <select style={selectStyle} value={form.industry} onChange={set('industry')}>
                          <option value="">Select your industry…</option>
                          {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
                        </select>
                      </div>
                      <div>
                        <label style={labelStyle}>Company Size *</label>
                        <select style={selectStyle} value={form.headcount_range} onChange={set('headcount_range')}>
                          <option value="">Select employee range…</option>
                          {HEADCOUNT_RANGES.map(h => <option key={h.value} value={h.value}>{h.label}</option>)}
                        </select>
                      </div>
                    </div>

                    <div style={{ marginTop: 28, display: 'flex', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => canAdvanceStep1 && setStep(1)}
                        disabled={!canAdvanceStep1}
                        style={{ padding: '12px 28px', border: 'none', borderRadius: 10, background: canAdvanceStep1 ? '#5dab79' : 'rgba(255,255,255,0.08)', color: canAdvanceStep1 ? 'white' : 'rgba(255,255,255,0.25)', fontSize: 14, fontWeight: 700, cursor: canAdvanceStep1 ? 'pointer' : 'default', transition: 'all 0.2s' }}
                      >
                        Continue →
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 2: Leadership Challenge */}
                {step === 1 && (
                  <div>
                    <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#5dab79', margin: '0 0 10px' }}>Step 2</p>
                    <h2 style={{ fontSize: 22, fontWeight: 800, color: 'white', margin: '0 0 6px' }}>Your Leadership Challenge</h2>
                    <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', margin: '0 0 28px' }}>Help us focus your report on what matters most right now.</p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                      <div>
                        <label style={labelStyle}>Primary Challenge *</label>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                          {CHALLENGES.map(c => (
                            <button
                              key={c}
                              onClick={() => setForm(f => ({ ...f, challenge: c }))}
                              style={{
                                padding: '11px 16px', textAlign: 'left', border: `1px solid ${form.challenge === c ? 'rgba(93,171,121,0.6)' : 'rgba(255,255,255,0.1)'}`,
                                borderRadius: 10, background: form.challenge === c ? 'rgba(93,171,121,0.1)' : 'rgba(255,255,255,0.03)',
                                color: form.challenge === c ? '#e8f5ed' : 'rgba(255,255,255,0.6)',
                                fontSize: 13, fontWeight: form.challenge === c ? 600 : 400, cursor: 'pointer',
                                transition: 'all 0.15s',
                              }}
                            >
                              {c}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label style={labelStyle}>Areas of Interest <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0, color: 'rgba(255,255,255,0.25)' }}>— select all that apply</span></label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                          {FOCUS_AREAS.map(area => {
                            const active = form.focus_areas.includes(area);
                            return (
                              <button
                                key={area}
                                onClick={() => toggleFocus(area)}
                                style={{
                                  padding: '6px 14px', borderRadius: 999,
                                  border: `1px solid ${active ? 'rgba(93,171,121,0.6)' : 'rgba(255,255,255,0.12)'}`,
                                  background: active ? 'rgba(93,171,121,0.12)' : 'transparent',
                                  color: active ? '#86d4a3' : 'rgba(255,255,255,0.45)',
                                  fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
                                }}
                              >
                                {area}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    <div style={{ marginTop: 28, display: 'flex', gap: 10, justifyContent: 'space-between' }}>
                      <button onClick={() => setStep(0)} style={{ padding: '12px 20px', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, background: 'none', color: 'rgba(255,255,255,0.4)', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                        ← Back
                      </button>
                      <button
                        onClick={() => canAdvanceStep2 && setStep(2)}
                        disabled={!canAdvanceStep2}
                        style={{ padding: '12px 28px', border: 'none', borderRadius: 10, background: canAdvanceStep2 ? '#5dab79' : 'rgba(255,255,255,0.08)', color: canAdvanceStep2 ? 'white' : 'rgba(255,255,255,0.25)', fontSize: 14, fontWeight: 700, cursor: canAdvanceStep2 ? 'pointer' : 'default', transition: 'all 0.2s' }}
                      >
                        Continue →
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3: Contact */}
                {step === 2 && (
                  <div>
                    <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#5dab79', margin: '0 0 10px' }}>Step 3</p>
                    <h2 style={{ fontSize: 22, fontWeight: 800, color: 'white', margin: '0 0 6px' }}>Where to send your report</h2>
                    <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', margin: '0 0 28px' }}>We will email your personalized report immediately after submission.</p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <div>
                          <label style={labelStyle}>Full Name *</label>
                          <input style={inputStyle} value={form.full_name} onChange={set('full_name')} placeholder="Jane Smith" />
                        </div>
                        <div>
                          <label style={labelStyle}>Title</label>
                          <input style={inputStyle} value={form.title} onChange={set('title')} placeholder="Chief HR Officer" />
                        </div>
                      </div>
                      <div>
                        <label style={labelStyle}>Work Email *</label>
                        <input style={inputStyle} type="email" value={form.email} onChange={set('email')} placeholder="jane@company.com" />
                      </div>

                      <label style={{ display: 'flex', gap: 12, alignItems: 'flex-start', cursor: 'pointer', marginTop: 4 }}>
                        <input
                          type="checkbox"
                          checked={form.consent}
                          onChange={e => setForm(f => ({ ...f, consent: e.target.checked }))}
                          style={{ width: 16, height: 16, marginTop: 2, accentColor: '#5dab79', flexShrink: 0 }}
                        />
                        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>
                          I agree to receive my assessment report and occasional insights from {FIRM_NAME}. I understand I can unsubscribe at any time.
                        </span>
                      </label>

                      {status === 'error' && (
                        <p style={{ fontSize: 12, color: '#f87171', margin: 0, padding: '10px 14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8 }}>
                          {errorMsg}
                        </p>
                      )}
                    </div>

                    <div style={{ marginTop: 28, display: 'flex', gap: 10, justifyContent: 'space-between' }}>
                      <button onClick={() => setStep(1)} style={{ padding: '12px 20px', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, background: 'none', color: 'rgba(255,255,255,0.4)', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                        ← Back
                      </button>
                      <button
                        onClick={canSubmit ? handleSubmit : undefined}
                        disabled={!canSubmit}
                        style={{ padding: '12px 28px', border: 'none', borderRadius: 10, background: canSubmit ? '#5dab79' : 'rgba(255,255,255,0.08)', color: canSubmit ? 'white' : 'rgba(255,255,255,0.25)', fontSize: 14, fontWeight: 700, cursor: canSubmit ? 'pointer' : 'default', transition: 'all 0.2s' }}
                      >
                        Generate My Report →
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Trust bar */}
        {status !== 'done' && status !== 'loading' && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 32, marginTop: 36, flexWrap: 'wrap', padding: '0 24px' }}>
            {['Free, no obligation', 'AI-powered + expert-validated', 'Delivered to your inbox instantly'].map(item => (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, color: 'rgba(255,255,255,0.35)', fontWeight: 500 }}>
                <span style={{ color: '#5dab79', fontSize: 14 }}>✓</span> {item}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
