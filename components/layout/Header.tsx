"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { FIRM_NAME } from "@/lib/constants"
import { MegaMenu } from "./MegaMenu"
import { MobileNav } from "./MobileNav"
import { Button } from "@/components/ui/Button"

const NAV_ITEMS = [
  { label: "About", href: "/about", hasMega: false },
  { label: "Lifecycle", href: "/lifecycle", hasMega: false },
  { label: "Solutions", href: "/solutions", hasMega: true },
  { label: "Industries", href: "/industries", hasMega: false },
  { label: "Platform", href: "/platform", hasMega: false },
  { label: "Insights", href: "/insights", hasMega: false },
  { label: "Results", href: "/results", hasMega: false },
]

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [megaOpen, setMegaOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-navy-900/95 backdrop-blur-md shadow-lg shadow-black/20"
            : "bg-transparent"
        }`}
        style={{ fontFamily: "var(--font-plus-jakarta)" }}
      >
        <div className="container-content">
          <div className="flex items-center justify-between h-18" style={{ height: "4.5rem" }}>
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 shrink-0 group">
              <Image
                src="/logo.png"
                alt={FIRM_NAME}
                width={120}
                height={44}
                className="h-10 w-auto object-contain"
                style={{ filter: "brightness(0) invert(1)" }}
                priority
              />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {NAV_ITEMS.map((item) =>
                item.hasMega ? (
                  <button
                    key={item.label}
                    onMouseEnter={() => setMegaOpen(true)}
                    onMouseLeave={() => setMegaOpen(false)}
                    className="px-4 py-2 text-sm font-600 text-white/80 hover:text-white transition-colors rounded-lg hover:bg-white/5 relative"
                    style={{ fontWeight: 600 }}
                  >
                    {item.label}
                    <span className="ml-1 text-white/40">▾</span>
                  </button>
                ) : (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="px-4 py-2 text-sm font-600 text-white/80 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                    style={{ fontWeight: 600 }}
                  >
                    {item.label}
                  </Link>
                )
              )}
            </nav>

            {/* CTA + Mobile toggle */}
            <div className="flex items-center gap-3">
              <Link
                href="/portal"
                className="hidden md:inline-flex items-center px-4 py-2 rounded-lg text-xs font-600 transition-colors"
                style={{
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.55)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  letterSpacing: "0.04em",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.85)"
                  ;(e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(193,154,91,0.4)"
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.55)"
                  ;(e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.12)"
                }}
              >
                Practitioner Hub
              </Link>
              <Button href="/contact" variant="primary" size="sm" className="hidden md:inline-flex">
                Contact Us
              </Button>

              {/* Mobile hamburger */}
              <button
                className="lg:hidden flex flex-col gap-1.5 p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/5 transition-colors"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
              >
                <span className="block w-5 h-0.5 bg-current" />
                <span className="block w-5 h-0.5 bg-current" />
                <span className="block w-4 h-0.5 bg-current" />
              </button>
            </div>
          </div>
        </div>

        {/* Mega Menu */}
        {megaOpen && (
          <div
            onMouseEnter={() => setMegaOpen(true)}
            onMouseLeave={() => setMegaOpen(false)}
          >
            <MegaMenu onClose={() => setMegaOpen(false)} />
          </div>
        )}
      </header>

      {/* Mobile Nav */}
      <MobileNav isOpen={mobileOpen} onClose={() => setMobileOpen(false)} navItems={NAV_ITEMS} />
    </>
  )
}
