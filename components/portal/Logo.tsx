export function Logo({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 240 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <text
        x="120"
        y="38"
        textAnchor="middle"
        fontFamily="'DM Serif Display', Georgia, serif"
        fontSize="28"
        fontWeight="400"
        fill="#1a3a2a"
        letterSpacing="-0.02em"
      >
        Apex &amp; Origin
      </text>
      <rect x="70" y="48" width="100" height="2" rx="1" fill="url(#goldGradient)" />
      <defs>
        <linearGradient id="goldGradient" x1="70" y1="49" x2="170" y2="49" gradientUnits="userSpaceOnUse">
          <stop stopColor="#b8913b" />
          <stop offset="1" stopColor="#d4b07a" />
        </linearGradient>
      </defs>
    </svg>
  );
}
