'use client';

import { Plus, Layers } from 'lucide-react';

const PIPELINE_COLUMNS = [
  {
    id: 'awareness',
    label: 'Awareness',
    description: 'Building brand familiarity',
    color: '#5dab79',
  },
  {
    id: 'value-delivery',
    label: 'Value Delivery',
    description: 'Demonstrating expertise',
    color: '#7fb093',
  },
  {
    id: 'outreach',
    label: 'Outreach',
    description: 'Direct contact initiated',
    color: '#c9a86c',
  },
  {
    id: 'conversion',
    label: 'Conversion',
    description: 'Discovery call or proposal',
    color: '#4a9668',
  },
];

export default function CampaignsPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--portal-text-primary)', margin: 0 }}>
            Campaign Dashboard
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--portal-text-tertiary)', margin: '4px 0 0' }}>
            Track prospects through your outreach pipeline
          </p>
        </div>
        <button
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
          New Campaign
        </button>
      </div>

      {/* Pipeline board */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '16px',
          flex: 1,
          minHeight: 0,
        }}
      >
        {PIPELINE_COLUMNS.map((col) => (
          <div
            key={col.id}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            {/* Column header */}
            <div
              style={{
                background: 'var(--portal-bg-secondary)',
                border: '1px solid var(--portal-border-default)',
                borderRadius: '12px',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <p style={{ fontSize: '13px', fontWeight: '600', color: 'var(--portal-text-primary)', margin: 0 }}>
                  {col.label}
                </p>
                <p style={{ fontSize: '11px', color: 'var(--portal-text-tertiary)', margin: '2px 0 0' }}>
                  {col.description}
                </p>
              </div>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '22px',
                  height: '22px',
                  borderRadius: '6px',
                  background: 'var(--portal-accent-subtle)',
                  fontSize: '11px',
                  fontWeight: '700',
                  color: col.color,
                }}
              >
                0
              </span>
            </div>

            {/* Column body — empty state */}
            <div
              style={{
                flex: 1,
                minHeight: '200px',
                background: 'var(--portal-bg-primary)',
                border: '1px dashed var(--portal-border-default)',
                borderRadius: '12px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                padding: '24px 16px',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'var(--portal-accent-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Layers size={16} color="var(--portal-accent)" strokeWidth={1.8} />
              </div>
              <p style={{ fontSize: '12px', color: 'var(--portal-text-tertiary)', margin: 0 }}>
                No accounts in this phase
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Account card spec (for when data exists):
          - Company name (bold)
          - ICP score badge
          - Days in phase
          - Last activity label
          - Next action label
      */}
    </div>
  );
}
