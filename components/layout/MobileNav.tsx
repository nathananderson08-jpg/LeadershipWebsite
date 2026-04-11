"use client"

import { useEffect } from "react"
import Link from "next/link"
import { FIRM_NAME } from "@/lib/constants"
import { Button } from "@/components/ui/Button"

const MOBILE_SECTIONS = [
  { heading: "Company", links: [
    { label: "Our Story", href: "/about" },
    { label: "Leadership Team", href: "/about/team" },
    { label: "Our Methodology", href: "/about/methodology" },
    { label: "Careers", href: "/about/careers" },
  ]},
  { heading: "Solutions", links: [
    { label: "The Lifecycle", href: "/lifecycle" },
    { label: "Assessment & Diagnostics", href: "/solutions/assessment" },
    { label: "Executive Coaching", href: "/solutions/coaching" },
    { label: "Development Programs", href: "/solutions/programs" },
    { label: "Transformation", href: "/solutions/transformation" },
    { label: "Succession Planning", href: "/solutions/succession" },
    { label: "AI Transformation ✦", href: "/solutions/ai-transformation" },
  ]},
  { heading: "Audience", links: [
    { label: "Emerging Leaders", href: "/solutions/emerging-leaders" },
    { label: "Senior Leaders", href: "/solutions/senior-leaders" },
    { label: "C-Suite & Board", href: "/solutions/c-suite" },
  ]},
  { heading: "Resources", links: [
    { label: "Industries", href: "/industries" },
    { label: "Platform", href: "/platform" },
    { label: "Insights", href: "/insights" },
    { label: "Results", href: "/results" },
  ]},
]

interface MobileNavProps {
  isOpen: boolean
  onClose: () => void
  navItems: { label: string; href: string }[]
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => { document.body.style.overflow = "" }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[60] flex">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className="relative ml-auto w-full max-w-sm h-full flex flex-col overflow-y-auto"
        style={{ background: "var(--color-navy-900)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <span className="font-700 text-white text-base" style={{ fontWeight: 700 }}>
            {FIRM_NAME}
          </span>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-colors"
            aria-label="Close menu"
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 p-6 space-y-6">
          {MOBILE_SECTIONS.map((section) => (
            <div key={section.heading}>
              <p className="text-xs font-700 tracking-widest uppercase text-gold-600 mb-3" style={{ fontWeight: 700 }}>
                {section.heading}
              </p>
              <ul className="space-y-1">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={onClose}
                      className="block px-3 py-2.5 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="p-6 border-t border-white/10 space-y-3">
          <Button href="/contact" variant="primary" className="w-full justify-center" onClick={onClose}>
            Contact Us
          </Button>
        </div>
      </div>
    </div>
  )
}
