'use client';

import { useEffect, useState } from 'react';

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function AnimatedNumber({ value, duration = 800, delay = 0, className = '', style }: AnimatedNumberProps) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (value === 0) {
        setDisplay(0);
        return;
      }
      const startTime = Date.now();
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplay(Math.round(eased * value));
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }, delay);
    return () => clearTimeout(timer);
  }, [value, duration, delay]);

  return (
    <span className={`portal-animate-count-up ${className}`} style={{ animationDelay: `${delay}ms`, ...style }}>
      {display}
    </span>
  );
}
