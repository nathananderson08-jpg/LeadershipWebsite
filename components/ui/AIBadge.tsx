"use client"

export function AIBadge({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-700 tracking-wider uppercase ${className}`}
      style={{
        background: "linear-gradient(135deg, rgba(93,171,121,0.15) 0%, rgba(93,171,121,0.08) 100%)",
        border: "1px solid rgba(93,171,121,0.4)",
        color: "#3d7a54",
        fontWeight: 700,
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ background: "#5dab79", boxShadow: "0 0 4px rgba(93,171,121,0.5)" }}
      />
      AI-Powered
    </span>
  )
}
