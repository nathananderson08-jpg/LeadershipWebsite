'use client';

import { useEffect, useState } from 'react';

interface ProgressBarProps {
  value: number;
  max: number;
  color?: string;
  height?: number;
  delay?: number;
  showLabel?: boolean;
}

export function ProgressBar({ value, max, color = 'var(--portal-accent)', height = 6, delay = 0, showLabel = false }: ProgressBarProps) {
  const [width, setWidth] = useState(0);
  const percentage = max > 0 ? Math.min((value / max) * 100, 100) : 0;

  useEffect(() => {
    const timer = setTimeout(() => setWidth(percentage), 100 + delay);
    return () => clearTimeout(timer);
  }, [percentage, delay]);

  return (
    <div>
      {showLabel && (
        <div className="flex items-center justify-between" style={{ marginBottom: '4px' }}>
          <span className="text-[11px] text-[var(--portal-text-tertiary)]">{value}/{max}</span>
          <span className="text-[11px] font-medium" style={{ color }}>{Math.round(percentage)}%</span>
        </div>
      )}
      <div className="portal-progress-bar" style={{ height }}>
        <div
          className="portal-progress-bar-fill"
          style={{ width: `${width}%`, background: color }}
        />
      </div>
    </div>
  );
}
