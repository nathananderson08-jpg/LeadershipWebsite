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
            ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-neutral-100"
            : "bg-transparent"
        }`}
      >
        <div className="container-content">
          <div className="flex items-center justify-between h-[4.5rem]">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 shrink-0 group">
              <Image
                src="/logo.png"
                alt={FIRM_NAME}
                width={140}
                height={48}
                className={`h-9 w-auto object-contain transition-all duration-300 ${
                  scrolled ? "" : "brightness-0 invert"
                }`}
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
                    className={`px-4 py-2 text-sm font-medium transition-colors rounded-lg relative ${
                      scrolled
                        ? "text-neutral-600 hover:text-primary-700 hover:bg-primary-50"
                        : "text-white/90 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    {item.label}
                    <svg
                      className={`inline-block ml-1 w-3.5 h-3.5 transition-transform ${megaOpen ? "rotate-180" : ""}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                ) : (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`px-4 py-2 text-sm font-medium transition-colors rounded-lg ${
                      scrolled
                        ? "text-neutral-600 hover:text-primary-700 hover:bg-primary-50"
                        : "text-white/90 hover:text-white hover:bg-white/10"
                    }`}
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
                className={`hidden md:inline-flex items-center px-3.5 py-2 rounded-lg text-xs font-medium tracking-wide transition-colors ${
                  scrolled
                    ? "text-neutral-500 border border-neutral-200 hover:text-primary-700 hover:border-primary-300"
                    : "text-white/70 border border-white/20 hover:text-white hover:border-white/40"
                }`}
              >
                Practitioner Hub
              </Link>
              <Button 
                href="/contact" 
                variant={scrolled ? "primary" : "outline-white"} 
                size="sm" 
                className="hidden md:inline-flex"
              >
                Contact Us
              </Button>

              {/* Mobile hamburger */}
              <button
                className={`lg:hidden flex flex-col gap-1.5 p-2 rounded-lg transition-colors ${
                  scrolled
                    ? "text-neutral-600 hover:text-primary-700 hover:bg-primary-50"
                    : "text-white/90 hover:text-white hover:bg-white/10"
                }`}
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
              >
                <span className="block w-5 h-0.5 bg-current rounded-full" />
                <span className="block w-5 h-0.5 bg-current rounded-full" />
                <span className="block w-4 h-0.5 bg-current rounded-full" />
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
