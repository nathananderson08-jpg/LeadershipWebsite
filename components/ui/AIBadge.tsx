"use client"

export function AIBadge({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium tracking-wider uppercase ${className}`}
      style={{
        background: "linear-gradient(135deg, rgba(249,115,22,0.15) 0%, rgba(249,115,22,0.08) 100%)",
        border: "1px solid rgba(249,115,22,0.3)",
        color: "rgb(249,115,22)",
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full animate-pulse"
        style={{ background: "rgb(249,115,22)" }}
      />
      AI-Powered
    </span>
  )
}
