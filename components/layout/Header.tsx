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
            ? "bg-white shadow-lg shadow-black/5"
            : "bg-white"
        }`}
        style={{ fontFamily: "var(--font-plus-jakarta)" }}
      >
        <div className="container-content">
          <div className="flex items-center h-28 lg:h-32" style={{ minHeight: "7rem" }}>
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 shrink-0 group" aria-label={`${FIRM_NAME} - Home`}>
              <Image
                src="/logo.png"
                alt={`${FIRM_NAME} - Leadership Development`}
                width={320}
                height={110}
                className="h-20 md:h-24 lg:h-28 w-auto object-contain transition-transform duration-200 group-hover:scale-[1.02]"
                priority
              />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center">
              {NAV_ITEMS.map((item) =>
                item.hasMega ? (
                  <button
                    key={item.label}
                    onMouseEnter={() => setMegaOpen(true)}
                    className="px-4 py-2 text-sm font-600 text-forest-800 hover:text-forest-950 transition-colors rounded-lg hover:bg-forest-50 relative"
                    style={{ fontWeight: 600 }}
                  >
                    {item.label}
                    <span className="ml-1 text-forest-400">▾</span>
                  </button>
                ) : (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="px-4 py-2 text-sm font-600 text-forest-800 hover:text-forest-950 transition-colors rounded-lg hover:bg-forest-50"
                    style={{ fontWeight: 600 }}
                  >
                    {item.label}
                  </Link>
                )
              )}
            </nav>

            {/* CTA + Mobile toggle */}
            <div className="flex items-center gap-2">
              <Link href="/portal" className="hidden md:inline-flex btn btn-primary btn-sm">
                Internal
              </Link>
              <Link href="/programs" className="hidden md:inline-flex btn btn-primary btn-sm">
                Client Portal
              </Link>
              <Button href="/contact" variant="primary" size="sm" className="hidden md:inline-flex">
                Contact Us
              </Button>

              {/* Mobile hamburger */}
              <button
                className="lg:hidden flex flex-col gap-1.5 p-2 rounded-lg text-forest-700 hover:text-forest-900 hover:bg-forest-50 transition-colors"
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
