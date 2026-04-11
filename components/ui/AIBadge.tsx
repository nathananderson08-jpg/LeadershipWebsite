"use client"

export function AIBadge({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-700 tracking-wider uppercase animate-pulse-glow ${className}`}
      style={{
        background: "linear-gradient(135deg, rgba(20,163,163,0.18) 0%, rgba(20,140,140,0.12) 100%)",
        border: "1px solid rgba(20,163,163,0.5)",
        color: "#14a3a3",
        fontWeight: 700,
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ background: "#14a3a3", boxShadow: "0 0 6px #14a3a3" }}
      />
      AI-Powered
    </span>
  )
}
