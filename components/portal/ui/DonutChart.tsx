'use client';

import { useEffect, useState } from 'react';

interface DonutChartProps {
  value: number;
  max: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  bgColor?: string;
  label?: string;
  delay?: number;
}

export function DonutChart({ value, max, size = 56, strokeWidth = 5, color = 'var(--portal-accent)', bgColor = 'var(--portal-bg-hover)', label, delay = 0 }: DonutChartProps) {
  const [animated, setAnimated] = useState(false);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = max > 0 ? Math.min(value / max, 1) : 0;
  const dashArray = animated ? `${percentage * circumference} ${circumference}` : `0 ${circumference}`;

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 100 + delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={bgColor}
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={dashArray}
          strokeLinecap="round"
          className="portal-donut-ring"
          style={{ opacity: percentage > 0 ? 1 : 0.2 }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[11px] font-semibold" style={{ color: 'var(--portal-text-secondary)' }}>
          {label || `${value}/${max}`}
        </span>
      </div>
    </div>
  );
}
