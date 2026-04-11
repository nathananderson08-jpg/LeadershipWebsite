'use client';

import { useState } from 'react';
import { Activity } from 'lucide-react';

const CATEGORY_TABS = [
  'All',
  'Executive Move',
  'Organizational',
  'M&A',
  'Culture Signal',
  'Growth Signal',
];

const statPills = [
  { label: 'Monitored Accounts', value: '0' },
  { label: 'Events This Week', value: '0' },
  { label: 'Avg Response Time', value: '—' },
];

export default function TriggersPage() {
  const [activeCategory, setActiveCategory] = useState('All');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--portal-text-primary)', margin: 0 }}>
          Trigger Event Monitor
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--portal-text-tertiary)', margin: '4px 0 0' }}>
          Real-time signals indicating prospect readiness
        </p>
      </div>

      {/* Stats row */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        {statPills.map((pill) => (
          <div
            key={pill.label}
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
              {pill.value}
            </span>
            <span style={{ fontSize: '12px', color: 'var(--portal-text-tertiary)', fontWeight: '500' }}>
              {pill.label}
            </span>
          </div>
        ))}
      </div>

      {/* Category filter tabs */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          borderBottom: '1px solid var(--portal-border-default)',
        }}
      >
        {CATEGORY_TABS.map((tab) => {
          const active = activeCategory === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveCategory(tab)}
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
          <Activity size={28} color="var(--portal-accent)" strokeWidth={1.5} />
        </div>
        <div>
          <p style={{ fontSize: '15px', fontWeight: '600', color: 'var(--portal-text-primary)', margin: '0 0 6px' }}>
            No trigger events detected
          </p>
          <p style={{ fontSize: '13px', color: 'var(--portal-text-tertiary)', margin: 0, maxWidth: '300px' }}>
            Add prospects to begin monitoring for executive moves, organizational changes, and growth signals.
          </p>
        </div>
      </div>

      {/* Trigger event card spec (for when data exists):
          - Company name
          - Event type badge (color by priority: Critical=red, High=orange, Medium=yellow)
          - Description text
          - Detected date
          - Response window
          - "View Account" button (secondary)
          - "Create Action" button (primary)
      */}
    </div>
  );
}
