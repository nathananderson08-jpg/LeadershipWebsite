"use client"

import Image from "next/image"
import Link from "next/link"
import { FIRM_NAME, SOCIAL } from "@/lib/constants"

const FOOTER_COLUMNS = [
  {
    heading: "Company",
    links: [
      { label: "Our Story", href: "/about" },
      { label: "Leadership Team", href: "/about/team" },
      { label: "Our Methodology", href: "/about/methodology" },
      { label: "Careers", href: "/about/careers" },
      { label: "Partner With Us", href: "/partners" },
    ],
  },
  {
    heading: "Solutions",
    links: [
      { label: "The Lifecycle", href: "/lifecycle" },
      { label: "Assessment & Diagnostics", href: "/solutions/assessment" },
      { label: "Executive Coaching", href: "/solutions/coaching" },
      { label: "Development Programs", href: "/solutions/programs" },
      { label: "Transformation", href: "/solutions/transformation" },
      { label: "Succession Planning", href: "/solutions/succession" },
      { label: "AI Transformation", href: "/solutions/ai-transformation" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Insights Hub", href: "/insights" },
      { label: "Articles", href: "/insights/articles" },
      { label: "Research", href: "/insights/research" },
      { label: "Events", href: "/insights/events" },
      { label: "Our Platform", href: "/platform" },
      { label: "Impact & Results", href: "/results" },
    ],
  },
  {
    heading: "Connect",
    links: [
      { label: "Contact Us", href: "/contact" },
      { label: "Industries", href: "/industries" },
      { label: "Emerging Leaders", href: "/solutions/emerging-leaders" },
      { label: "Senior Leaders", href: "/solutions/senior-leaders" },
      { label: "C-Suite & Board", href: "/solutions/c-suite" },
    ],
  },
]

export function Footer() {
  return (
    <footer className="bg-neutral-900">
      {/* Main footer content */}
      <div className="container-content py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center mb-5 group">
              <Image
                src="/logo.png"
                alt={FIRM_NAME}
                width={130}
                height={48}
                className="h-9 w-auto object-contain brightness-0 invert opacity-90"
              />
            </Link>
            <p className="text-sm text-neutral-400 leading-relaxed mb-6">
              The only leadership company delivering end-to-end solutions across the entire development lifecycle.
            </p>
            {/* Trust signal */}
            <p className="text-xs text-primary-400 font-medium tracking-wide">
              Serving organizations across 6 continents
            </p>
          </div>

          {/* Link columns */}
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.heading}>
              <h3 className="text-xs font-semibold tracking-widest uppercase text-primary-400 mb-5">
                {col.heading}
              </h3>
              <ul className="space-y-3">
                {col.links.map((link, idx) => (
                  <li key={`${link.href}-${idx}`}>
                    <Link
                      href={link.href}
                      className="text-sm text-neutral-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="mt-14 pt-10 border-t border-neutral-800">
          <div className="flex flex-col lg:flex-row lg:items-end gap-8 justify-between">
            <div className="max-w-md">
              <h3 className="font-semibold text-white text-lg mb-2">
                Leadership Insights, Delivered
              </h3>
              <p className="text-sm text-neutral-400">
                Get our latest thinking on leadership development, AI transformation, and organizational excellence.
              </p>
            </div>
            <form
              className="flex gap-3 w-full max-w-md"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg text-sm bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                aria-label="Email address"
              />
              <button
                type="submit"
                className="btn btn-primary shrink-0"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-neutral-800">
        <div className="container-content py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-neutral-500">
              {new Date().getFullYear()} {FIRM_NAME} Leadership. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link href="/privacy" className="text-xs text-neutral-500 hover:text-neutral-300 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-xs text-neutral-500 hover:text-neutral-300 transition-colors">
                Terms of Service
              </Link>
              <Link href="/accessibility" className="text-xs text-neutral-500 hover:text-neutral-300 transition-colors">
                Accessibility
              </Link>
            </div>
            {/* Socials */}
            <div className="flex items-center gap-4">
              <a 
                href={SOCIAL.linkedin} 
                aria-label="LinkedIn" 
                className="text-neutral-500 hover:text-primary-400 transition-colors" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a 
                href={SOCIAL.twitter} 
                aria-label="X (Twitter)" 
                className="text-neutral-500 hover:text-primary-400 transition-colors" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a 
                href={SOCIAL.youtube} 
                aria-label="YouTube" 
                className="text-neutral-500 hover:text-primary-400 transition-colors" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
