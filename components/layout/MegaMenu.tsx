"use client"

import Link from "next/link"
import { AIBadge } from "@/components/ui/AIBadge"

const LIFECYCLE_SOLUTIONS = [
  { title: "Assessment & Diagnostics", href: "/solutions/assessment", phase: "01 Assess" },
  { title: "Executive Coaching", href: "/solutions/coaching", phase: "02 Coach" },
  { title: "Development Programs", href: "/solutions/programs", phase: "03 Develop" },
  { title: "Team & Org Transformation", href: "/solutions/transformation", phase: "04 Transform" },
  { title: "Succession Planning", href: "/solutions/succession", phase: "05 Sustain" },
]

const AUDIENCE_SOLUTIONS = [
  { title: "Emerging Leaders", href: "/solutions/emerging-leaders", desc: "First-time managers & high-potentials" },
  { title: "Senior Leaders", href: "/solutions/senior-leaders", desc: "Directors, VPs & executive teams" },
  { title: "C-Suite & Board", href: "/solutions/c-suite", desc: "CEO advisory & board effectiveness" },
]

export function MegaMenu({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="absolute top-full left-0 right-0 border-t border-white/10"
      style={{ background: "rgba(19,36,25,0.98)", backdropFilter: "blur(16px)" }}
    >
      <div className="container-content py-8">
        <div className="grid grid-cols-3 gap-8">
          {/* Lifecycle Phases */}
          <div>
            <p className="text-xs font-700 tracking-widest uppercase text-forest-400 mb-4" style={{ fontWeight: 700 }}>
              By Lifecycle Phase
            </p>
            <ul className="space-y-1">
              {LIFECYCLE_SOLUTIONS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 group transition-colors"
                  >
                    <span className="text-xs text-forest-500 font-600 w-16 shrink-0" style={{ fontWeight: 600 }}>
                      {item.phase}
                    </span>
                    <span className="text-sm text-white/80 group-hover:text-white transition-colors">
                      {item.title}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Audience Levels */}
          <div>
            <p className="text-xs font-700 tracking-widest uppercase text-forest-400 mb-4" style={{ fontWeight: 700 }}>
              By Audience Level
            </p>
            <ul className="space-y-1">
              {AUDIENCE_SOLUTIONS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className="flex flex-col gap-0.5 px-3 py-2.5 rounded-lg hover:bg-white/5 group transition-colors"
                  >
                    <span className="text-sm text-white/80 group-hover:text-white transition-colors font-600" style={{ fontWeight: 600 }}>
                      {item.title}
                    </span>
                    <span className="text-xs text-white/40">{item.desc}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-4 pt-4 border-t border-white/10">
              <Link
                href="/solutions"
                onClick={onClose}
                className="text-sm text-forest-300 hover:text-forest-200 transition-colors font-600"
                style={{ fontWeight: 600 }}
              >
                View all solutions →
              </Link>
            </div>
          </div>

          {/* AI Featured */}
          <div>
            <p className="text-xs font-700 tracking-widest uppercase text-forest-400 mb-4" style={{ fontWeight: 700 }}>
              Featured
            </p>
            <Link
              href="/solutions/ai-transformation"
              onClick={onClose}
              className="block p-4 rounded-xl transition-all group"
              style={{
                background: "linear-gradient(135deg, rgba(20,163,163,0.1) 0%, rgba(20,163,163,0.04) 100%)",
                border: "1px solid rgba(20,163,163,0.25)",
              }}
            >
              <AIBadge className="mb-3" />
              <h3 className="text-white font-700 mb-2" style={{ fontWeight: 700 }}>
                AI Leadership Transformation
              </h3>
              <p className="text-sm text-white/60 leading-relaxed">
                Equip your leaders to lead effectively in an AI-driven world.
              </p>
              <span
                className="inline-block mt-3 text-xs font-700 tracking-wide"
                style={{ color: "#14a3a3", fontWeight: 700 }}
              >
                Explore →
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
