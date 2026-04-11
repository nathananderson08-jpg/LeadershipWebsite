'use client';

import { useState } from 'react';
import { Users, Upload, Plus, Search, ChevronDown } from 'lucide-react';

const ICP_SCORE_OPTIONS = ['All', '80+', '60-79', 'Below 60'];
const STAGE_OPTIONS = ['All', 'Awareness', 'Value Delivery', 'Outreach', 'Conversion'];
const INDUSTRY_OPTIONS = [
  'All',
  'Financial Services',
  'Healthcare',
  'Technology',
  'Professional Services',
  'Manufacturing',
  'Education',
  'Government',
  'Non-Profit',
];

function SelectDropdown({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div style={{ position: 'relative' }}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          appearance: 'none',
          padding: '8px 32px 8px 12px',
          fontSize: '13px',
          color: 'var(--portal-text-secondary)',
          background: 'var(--portal-bg-secondary)',
          border: '1px solid var(--portal-border-default)',
          borderRadius: '10px',
          cursor: 'pointer',
          outline: 'none',
          minWidth: '140px',
        }}
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt === 'All' ? `${label}: All` : opt}
          </option>
        ))}
      </select>
      <ChevronDown
        size={14}
        style={{
          position: 'absolute',
          right: '10px',
          top: '50%',
          transform: 'translateY(-50%)',
          color: 'var(--portal-text-tertiary)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}

export default function ProspectsPage() {
  const [search, setSearch] = useState('');
  const [icpScore, setIcpScore] = useState('All');
  const [stage, setStage] = useState('All');
  const [industry, setIndustry] = useState('All');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--portal-text-primary)', margin: 0 }}>
            Prospect Intelligence
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--portal-text-tertiary)', margin: '4px 0 0' }}>
            Manage and score your prospect pipeline
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 16px',
              fontSize: '13px',
              fontWeight: '500',
              color: 'var(--portal-accent)',
              background: 'var(--portal-bg-secondary)',
              border: '1px solid var(--portal-border-accent)',
              borderRadius: '10px',
              cursor: 'pointer',
            }}
          >
            <Upload size={14} strokeWidth={2} />
            Import CSV
          </button>
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
            Add Manually
          </button>
        </div>
      </div>

      {/* Filter bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          flexWrap: 'wrap',
        }}
      >
        {/* Search */}
        <div style={{ position: 'relative', flex: '1', minWidth: '200px', maxWidth: '320px' }}>
          <Search
            size={14}
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--portal-text-tertiary)',
            }}
          />
          <input
            type="text"
            placeholder="Search prospects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px 8px 34px',
              fontSize: '13px',
              color: 'var(--portal-text-primary)',
              background: 'var(--portal-bg-secondary)',
              border: '1px solid var(--portal-border-default)',
              borderRadius: '10px',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <SelectDropdown label="ICP Score" options={ICP_SCORE_OPTIONS} value={icpScore} onChange={setIcpScore} />
        <SelectDropdown label="Stage" options={STAGE_OPTIONS} value={stage} onChange={setStage} />
        <SelectDropdown label="Industry" options={INDUSTRY_OPTIONS} value={industry} onChange={setIndustry} />
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
          <Users size={28} color="var(--portal-accent)" strokeWidth={1.5} />
        </div>
        <div>
          <p style={{ fontSize: '15px', fontWeight: '600', color: 'var(--portal-text-primary)', margin: '0 0 6px' }}>
            No prospects yet
          </p>
          <p style={{ fontSize: '13px', color: 'var(--portal-text-tertiary)', margin: 0, maxWidth: '320px' }}>
            Import a CSV or add prospects manually to build your pipeline.
          </p>
        </div>
        <button
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
          <Upload size={14} strokeWidth={2} />
          Import First Prospects
        </button>
      </div>

      {/* Prospect card spec (hidden — shown when data exists) */}
      {/* Each card: name, title, company, ICP score badge (green 80+, yellow 60-79, red <60),
          trigger event badge if active, stage pill, "View" button */}
    </div>
  );
}
