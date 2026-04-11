'use client';

import { useState } from 'react';
import { FileText, Plus, X, ChevronDown, Loader2 } from 'lucide-react';

const CONTENT_TYPES = [
  'All',
  'Micro-Research Brief',
  'Email Sequence',
  'LinkedIn Post',
  'Comment Draft',
];

const GENERATE_CONTENT_TYPES = [
  'Micro-Research Brief',
  'Email Sequence',
  'LinkedIn Post',
  'Comment Draft',
];

const MOCK_PROSPECTS = [
  'Select a prospect...',
];

const statsRow = [
  { label: 'Generated This Month', value: '0' },
  { label: 'Pending Review', value: '0' },
  { label: 'Approved', value: '0' },
];

function GenerateModal({ onClose }: { onClose: () => void }) {
  const [prospect, setProspect] = useState('');
  const [contentType, setContentType] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = () => {
    if (!prospect || !contentType) return;
    setLoading(true);
    // Mock loading state — no actual fetch
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(26,58,42,0.35)',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'var(--portal-bg-secondary)',
          border: '1px solid var(--portal-border-default)',
          borderRadius: '20px',
          padding: '32px',
          width: '100%',
          maxWidth: '460px',
          boxShadow: '0 20px 60px rgba(26,58,42,0.15)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <h2 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--portal-text-primary)', margin: 0 }}>
              Generate New Content
            </h2>
            <p style={{ fontSize: '12px', color: 'var(--portal-text-tertiary)', margin: '4px 0 0' }}>
              Select a prospect and content type to generate
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'var(--portal-accent-subtle)',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--portal-accent)',
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Select prospect */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--portal-text-secondary)', marginBottom: '6px' }}>
            Prospect
          </label>
          <div style={{ position: 'relative' }}>
            <select
              value={prospect}
              onChange={(e) => setProspect(e.target.value)}
              style={{
                width: '100%',
                appearance: 'none',
                padding: '10px 36px 10px 14px',
                fontSize: '13px',
                color: prospect ? 'var(--portal-text-primary)' : 'var(--portal-text-tertiary)',
                background: 'var(--portal-bg-primary)',
                border: '1px solid var(--portal-border-default)',
                borderRadius: '10px',
                outline: 'none',
                cursor: 'pointer',
                boxSizing: 'border-box',
              }}
            >
              <option value="">Select a prospect...</option>
              {MOCK_PROSPECTS.filter((p) => p !== 'Select a prospect...').map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            <ChevronDown
              size={14}
              style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--portal-text-tertiary)', pointerEvents: 'none' }}
            />
          </div>
        </div>

        {/* Select content type */}
        <div style={{ marginBottom: '28px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--portal-text-secondary)', marginBottom: '6px' }}>
            Content Type
          </label>
          <div style={{ position: 'relative' }}>
            <select
              value={contentType}
              onChange={(e) => setContentType(e.target.value)}
              style={{
                width: '100%',
                appearance: 'none',
                padding: '10px 36px 10px 14px',
                fontSize: '13px',
                color: contentType ? 'var(--portal-text-primary)' : 'var(--portal-text-tertiary)',
                background: 'var(--portal-bg-primary)',
                border: '1px solid var(--portal-border-default)',
                borderRadius: '10px',
                outline: 'none',
                cursor: 'pointer',
                boxSizing: 'border-box',
              }}
            >
              <option value="">Select content type...</option>
              {GENERATE_CONTENT_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <ChevronDown
              size={14}
              style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--portal-text-tertiary)', pointerEvents: 'none' }}
            />
          </div>
        </div>

        {/* Generate button */}
        <button
          onClick={handleGenerate}
          disabled={!prospect || !contentType || loading}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '11px 20px',
            fontSize: '14px',
            fontWeight: '600',
            color: 'white',
            background: (!prospect || !contentType) ? 'rgba(93,171,121,0.4)' : 'var(--portal-accent)',
            border: 'none',
            borderRadius: '10px',
            cursor: (!prospect || !contentType) ? 'not-allowed' : 'pointer',
            transition: 'background 0.15s ease',
          }}
        >
          {loading ? (
            <>
              <Loader2 size={15} style={{ animation: 'spin 0.8s linear infinite' }} />
              Generating...
            </>
          ) : (
            'Generate Content'
          )}
        </button>
      </div>
    </div>
  );
}

export default function ContentPage() {
  const [activeTab, setActiveTab] = useState('All');
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--portal-text-primary)', margin: 0 }}>
              Content &amp; IP Generator
            </h1>
            <p style={{ fontSize: '13px', color: 'var(--portal-text-tertiary)', margin: '4px 0 0' }}>
              Create tailored content for each prospect
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 16px',
              fontSize: '13px',
              fontWeight: '600',
              color: 'white',
              background: 'var(--portal-accent)',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
            }}
          >
            <Plus size={14} strokeWidth={2.5} />
            Generate New
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {statsRow.map((stat) => (
            <div
              key={stat.label}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 18px',
                background: 'var(--portal-bg-secondary)',
                border: '1px solid var(--portal-border-default)',
                borderRadius: '12px',
              }}
            >
              <span style={{ fontSize: '18px', fontWeight: '700', color: 'var(--portal-text-primary)' }}>
                {stat.value}
              </span>
              <span style={{ fontSize: '12px', color: 'var(--portal-text-tertiary)', fontWeight: '500' }}>
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            borderBottom: '1px solid var(--portal-border-default)',
          }}
        >
          {CONTENT_TYPES.map((tab) => {
            const active = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '8px 14px',
                  fontSize: '13px',
                  fontWeight: active ? '600' : '500',
                  color: active ? 'var(--portal-accent)' : 'var(--portal-text-tertiary)',
                  background: 'none',
                  border: 'none',
                  borderBottom: active ? '2px solid var(--portal-accent)' : '2px solid transparent',
                  marginBottom: '-1px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease',
                }}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Empty state */}
        <div
          style={{
            background: 'var(--portal-bg-secondary)',
            border: '1px solid var(--portal-border-default)',
            borderRadius: '16px',
            padding: '72px 40px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '18px',
              background: 'var(--portal-accent-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <FileText size={28} color="var(--portal-accent)" strokeWidth={1.5} />
          </div>
          <div>
            <p style={{ fontSize: '15px', fontWeight: '600', color: 'var(--portal-text-primary)', margin: '0 0 6px' }}>
              No content generated yet
            </p>
            <p style={{ fontSize: '13px', color: 'var(--portal-text-tertiary)', margin: 0, maxWidth: '320px' }}>
              Select a prospect and generate your first piece of tailored content.
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            style={{
              marginTop: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '7px',
              padding: '10px 20px',
              fontSize: '13px',
              fontWeight: '600',
              color: 'white',
              background: 'var(--portal-accent)',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
            }}
          >
            <Plus size={14} strokeWidth={2.5} />
            Generate First Content
          </button>
        </div>
      </div>

      {showModal && <GenerateModal onClose={() => setShowModal(false)} />}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}
