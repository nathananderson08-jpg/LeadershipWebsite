"use client"

export function AIBadge({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-700 tracking-wider uppercase animate-pulse-glow ${className}`}
      style={{
        background: "linear-gradient(135deg, rgba(0,212,255,0.15) 0%, rgba(0,180,220,0.1) 100%)",
        border: "1px solid rgba(0,212,255,0.4)",
        color: "#00d4ff",
        fontWeight: 700,
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ background: "#00d4ff", boxShadow: "0 0 6px #00d4ff" }}
      />
      AI-Powered
    </span>
  )
}
