"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
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
  const pathname = usePathname()
  const isHomepage = pathname === "/"
  const isTransparent = isHomepage && !scrolled

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
            ? "bg-white/95 backdrop-blur-md shadow-lg shadow-black/5"
            : isHomepage
            ? "bg-transparent"
            : "bg-white/80 backdrop-blur-sm"
        }`}
        style={{ fontFamily: "var(--font-plus-jakarta)" }}
      >
        <div className="container-content">
          <div className="flex items-center justify-between h-24 lg:h-28" style={{ minHeight: "6rem" }}>
            {/* Logo - Made prominent */}
            <Link href="/" className="flex items-center gap-3 shrink-0 group" aria-label={`${FIRM_NAME} - Home`}>
              <Image
                src="/logo.png"
                alt={`${FIRM_NAME} - Leadership Development`}
                width={280}
                height={90}
                className="h-16 md:h-20 lg:h-24 w-auto object-contain transition-transform duration-200 group-hover:scale-[1.02]"
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
                    className={`px-4 py-2 text-sm transition-colors rounded-lg relative ${
                      isTransparent
                        ? "text-white/90 hover:text-white hover:bg-white/10"
                        : "text-forest-800 hover:text-forest-950 hover:bg-forest-50"
                    }`}
                    style={{ fontWeight: 600 }}
                  >
                    {item.label}
                    <span className={`ml-1 ${isTransparent ? "text-white/60" : "text-forest-400"}`}>▾</span>
                  </button>
                ) : (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`px-4 py-2 text-sm transition-colors rounded-lg ${
                      isTransparent
                        ? "text-white/90 hover:text-white hover:bg-white/10"
                        : "text-forest-800 hover:text-forest-950 hover:bg-forest-50"
                    }`}
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
                className={`hidden md:inline-flex items-center px-4 py-2 rounded-lg text-xs transition-colors ${
                  isTransparent
                    ? "text-white/80 border border-white/30 hover:border-white/60 hover:text-white hover:bg-white/10"
                    : "text-forest-700 border border-forest-200 hover:border-forest-400 hover:text-forest-900 hover:bg-forest-50"
                }`}
                style={{
                  fontWeight: 600,
                  letterSpacing: "0.04em",
                }}
              >
                Practitioner Hub
              </Link>
              {isTransparent ? (
                <Link
                  href="/contact"
                  className="hidden md:inline-flex items-center px-4 py-2 rounded-lg text-sm border border-white/40 text-white hover:bg-white/15 hover:border-white/70 transition-colors"
                  style={{ fontWeight: 600 }}
                >
                  Contact Us
                </Link>
              ) : (
                <Button href="/contact" variant="primary" size="sm" className="hidden md:inline-flex">
                  Contact Us
                </Button>
              )}

              {/* Mobile hamburger */}
              <button
                className={`lg:hidden flex flex-col gap-1.5 p-2 rounded-lg transition-colors ${
                  isTransparent
                    ? "text-white hover:bg-white/10"
                    : "text-forest-700 hover:text-forest-900 hover:bg-forest-50"
                }`}
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

        {/* Mega Menu with hover zone */}
        <div
          className={`absolute left-0 right-0 transition-all duration-200 ${megaOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}
          style={{ top: 'calc(100% - 12px)', paddingTop: '12px' }}
          onMouseEnter={() => setMegaOpen(true)}
          onMouseLeave={() => setMegaOpen(false)}
        >
          <MegaMenu onClose={() => setMegaOpen(false)} />
        </div>
      </header>

      {/* Mobile Nav */}
      <MobileNav isOpen={mobileOpen} onClose={() => setMobileOpen(false)} navItems={NAV_ITEMS} />
    </>
  )
}
