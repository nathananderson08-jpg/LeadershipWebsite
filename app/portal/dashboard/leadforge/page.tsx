'use client';

import Link from 'next/link';
import { Target, Plus, Upload, Zap, FileText, ChevronRight } from 'lucide-react';

const statCards = [
  { label: 'Prospects in Pipeline', value: '0', action: { label: '+ Add', href: '/portal/dashboard/leadforge/prospects' } },
  { label: 'Trigger Events This Week', value: '0', action: null },
  { label: 'Active Campaigns', value: '0', action: null },
  { label: 'Discovery Calls Booked', value: '0', action: null },
];

const quickActions = [
  {
    label: 'Import Prospects',
    description: 'Upload a CSV to bulk-add prospects to your pipeline.',
    icon: Upload,
    href: '/portal/dashboard/leadforge/prospects',
  },
  {
    label: 'Generate Content',
    description: 'Create micro-research briefs, email sequences, and LinkedIn posts.',
    icon: FileText,
    href: '/portal/dashboard/leadforge/content',
  },
  {
    label: 'View Campaigns',
    description: 'Track prospects across Awareness, Value Delivery, Outreach, and Conversion.',
    icon: Zap,
    href: '/portal/dashboard/leadforge/campaigns',
  },
];

export default function LeadForgePage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Page header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'var(--portal-accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Target size={20} color="white" strokeWidth={1.8} />
        </div>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--portal-text-primary)', margin: 0 }}>
            LeadForge
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--portal-text-tertiary)', margin: 0 }}>
            Prospect intelligence &amp; outreach automation
          </p>
        </div>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        {statCards.map((card) => (
          <div
            key={card.label}
            style={{
              background: 'var(--portal-bg-secondary)',
              border: '1px solid var(--portal-border-default)',
              borderRadius: '16px',
              padding: '20px 24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            <p style={{ fontSize: '12px', color: 'var(--portal-text-tertiary)', fontWeight: '500', margin: 0 }}>
              {card.label}
            </p>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '32px', fontWeight: '700', color: 'var(--portal-text-primary)', lineHeight: 1 }}>
                {card.value}
              </span>
              {card.action && (
                <Link
                  href={card.action.href}
                  style={{
                    fontSize: '12px',
                    fontWeight: '600',
                    color: 'var(--portal-accent)',
                    textDecoration: 'none',
                    padding: '4px 10px',
                    borderRadius: '8px',
                    border: '1px solid var(--portal-border-accent)',
                  }}
                >
                  {card.action.label}
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Two-column content */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Recent Trigger Events */}
        <div
          style={{
            background: 'var(--portal-bg-secondary)',
            border: '1px solid var(--portal-border-default)',
            borderRadius: '16px',
            padding: '24px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--portal-text-primary)', margin: 0 }}>
              Recent Trigger Events
            </h2>
            <Link
              href="/portal/dashboard/leadforge/triggers"
              style={{ fontSize: '12px', color: 'var(--portal-accent)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '2px' }}
            >
              View all <ChevronRight size={12} />
            </Link>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '40px 20px',
              gap: '12px',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                background: 'var(--portal-accent-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Zap size={22} color="var(--portal-accent)" strokeWidth={1.6} />
            </div>
            <p style={{ fontSize: '13px', color: 'var(--portal-text-tertiary)', margin: 0, maxWidth: '240px' }}>
              No trigger events detected yet. Connect your data sources in Settings.
            </p>
          </div>
        </div>

        {/* Top Prospects by ICP Score */}
        <div
          style={{
            background: 'var(--portal-bg-secondary)',
            border: '1px solid var(--portal-border-default)',
            borderRadius: '16px',
            padding: '24px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--portal-text-primary)', margin: 0 }}>
              Top Prospects by ICP Score
            </h2>
            <Link
              href="/portal/dashboard/leadforge/prospects"
              style={{ fontSize: '12px', color: 'var(--portal-accent)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '2px' }}
            >
              View all <ChevronRight size={12} />
            </Link>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '40px 20px',
              gap: '12px',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                background: 'var(--portal-accent-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Target size={22} color="var(--portal-accent)" strokeWidth={1.6} />
            </div>
            <p style={{ fontSize: '13px', color: 'var(--portal-text-tertiary)', margin: 0, maxWidth: '240px' }}>
              No prospects loaded yet. Import your first prospects to get started.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--portal-text-primary)', marginBottom: '16px', marginTop: 0 }}>
          Quick Actions
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {quickActions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              style={{ textDecoration: 'none' }}
            >
              <div
                style={{
                  background: 'var(--portal-bg-secondary)',
                  border: '1px solid var(--portal-border-default)',
                  borderRadius: '16px',
                  padding: '20px 24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  cursor: 'pointer',
                  transition: 'border-color 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--portal-border-accent)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--portal-border-default)';
                }}
              >
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '12px',
                    background: 'var(--portal-accent-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <action.icon size={18} color="var(--portal-accent)" strokeWidth={1.8} />
                </div>
                <div>
                  <p style={{ fontSize: '14px', fontWeight: '600', color: 'var(--portal-text-primary)', margin: '0 0 4px' }}>
                    {action.label}
                  </p>
                  <p style={{ fontSize: '12px', color: 'var(--portal-text-tertiary)', margin: 0 }}>
                    {action.description}
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--portal-accent)' }}>Open</span>
                  <ChevronRight size={12} color="var(--portal-accent)" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
