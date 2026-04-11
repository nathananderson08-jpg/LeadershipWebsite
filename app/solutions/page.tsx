"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { SectionHeading } from "@/components/ui/SectionHeading"
import { AIBadge } from "@/components/ui/AIBadge"
import { CTABanner } from "@/components/sections/CTABanner"
import { SOLUTIONS, AUDIENCE_LEVELS } from "@/lib/constants"

type FilterTab = "all" | "lifecycle" | "audience"

const LIFECYCLE_SOLUTIONS = [
  {
    title: "Assessment & Diagnostics",
    description: "360 reviews, leadership audits, and organizational diagnostics that feed directly into development plans.",
    href: "/solutions/assessment",
    phase: "01 Assess",
    featured: false,
  },
  {
    title: "Executive Coaching",
    description: "ICF-certified 1:1, group, and team coaching that transforms individual and collective leadership performance.",
    href: "/solutions/coaching",
    phase: "02 Coach",
    featured: false,
  },
  {
    title: "Development Programs",
    description: "Curriculum-based programs, cohort learning, and blended delivery for every level.",
    href: "/solutions/programs",
    phase: "03 Develop",
    featured: false,
  },
  {
    title: "Team & Org Transformation",
    description: "Culture change, team alignment, and organizational design delivered at enterprise scale.",
    href: "/solutions/transformation",
    phase: "04 Transform",
    featured: false,
  },
  {
    title: "Succession Planning",
    description: "Pipeline mapping, high-potential identification, and executive transition support.",
    href: "/solutions/succession",
    phase: "05 Sustain",
    featured: false,
  },
  {
    title: "AI Leadership Transformation",
    description: "Preparing leaders to lead effectively in an AI-driven world — strategy, fluency, governance, and adoption.",
    href: "/solutions/ai-transformation",
    phase: "All Phases",
    featured: true,
  },
]

export default function SolutionsPage() {
  const [activeTab, setActiveTab] = useState<FilterTab>("all")

  return (
    <>
      {/* Hero */}
      <section
        className="pt-40 pb-20 relative"
        style={{ background: "linear-gradient(160deg, var(--color-forest-50) 0%, var(--color-warm-50) 100%)" }}
      >
        <div
          className="absolute inset-0"
          style={{ backgroundImage: "radial-gradient(at 70% 30%, rgba(93,171,121,0.12) 0px, transparent 50%)" }}
        />
        <div className="container-content relative z-10 text-center max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <p className="text-sm font-700 tracking-[0.15em] uppercase text-forest-600 mb-5" style={{ fontWeight: 700 }}>
              Complete Solutions Suite
            </p>
            <h1 className="display-lg text-forest-950 mb-6">
              Solutions for every phase, every level, every scale
            </h1>
            <p className="text-xl text-forest-800/70 leading-relaxed max-w-2xl mx-auto">
              Browse our complete suite of leadership development solutions — organized by lifecycle phase, audience level, or both.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter tabs + grid */}
      <section className="section-padding" style={{ background: "var(--color-warm-white)" }}>
        <div className="container-content">
          {/* Tabs */}
          <div className="flex items-center gap-2 mb-14 justify-center flex-wrap">
            {(["all", "lifecycle", "audience"] as FilterTab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2.5 rounded-full text-sm font-600 transition-all ${
                  activeTab === tab
                    ? "text-navy-900"
                    : "text-neutral-500 hover:text-navy-900 bg-white border border-neutral-200"
                }`}
                style={{
                  fontWeight: 600,
                  background: activeTab === tab ? "var(--color-gold-500)" : undefined,
                }}
              >
                {tab === "all" ? "All Solutions" : tab === "lifecycle" ? "By Lifecycle Phase" : "By Audience Level"}
              </button>
            ))}
          </div>

          {/* Lifecycle phase solutions */}
          {(activeTab === "all" || activeTab === "lifecycle") && (
            <div className="mb-16">
              <h2 className="text-xs font-700 tracking-widest uppercase text-neutral-400 mb-8 text-center" style={{ fontWeight: 700 }}>
                By Lifecycle Phase
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {LIFECYCLE_SOLUTIONS.map((sol, i) => (
                  <motion.div
                    key={sol.href}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.07, duration: 0.5 }}
                  >
                    <Link
                      href={sol.href}
                      className="block h-full p-7 rounded-2xl border transition-all duration-300 hover:translate-y-[-3px] group"
                      style={
                        sol.featured
                          ? {
                              background: "linear-gradient(135deg, #020c1a 0%, #030f20 100%)",
                              border: "1px solid rgba(0,212,255,0.25)",
                              boxShadow: "0 0 30px rgba(0,212,255,0.06)",
                            }
                          : { background: "white", border: "1px solid var(--color-warm-100)" }
                      }
                    >
                      {sol.featured && <AIBadge className="mb-4" />}
                      <div className="flex items-center justify-between mb-5">
                        <span
                          className="text-xs font-700 px-3 py-1 rounded-full"
                          style={{
                            background: sol.featured ? "rgba(0,212,255,0.1)" : "var(--color-gold-100)",
                            color: sol.featured ? "#00d4ff" : "var(--color-gold-700)",
                            fontWeight: 700,
                          }}
                        >
                          {sol.phase}
                        </span>
                      </div>
                      <h3
                        className={`font-700 text-lg mb-3 transition-colors ${
                          sol.featured ? "text-white group-hover:text-ai-300" : "text-navy-900 group-hover:text-gold-700"
                        }`}
                        style={{ fontWeight: 700 }}
                      >
                        {sol.title}
                      </h3>
                      <p className={`text-sm leading-relaxed mb-5 ${sol.featured ? "text-white/50" : "text-neutral-500"}`}>
                        {sol.description}
                      </p>
                      <span
                        className={`text-sm font-600 flex items-center gap-1 ${sol.featured ? "text-ai-400" : "text-gold-600"}`}
                        style={{ fontWeight: 600 }}
                      >
                        Explore →
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Audience level solutions */}
          {(activeTab === "all" || activeTab === "audience") && (
            <div>
              <h2 className="text-xs font-700 tracking-widest uppercase text-neutral-400 mb-8 text-center" style={{ fontWeight: 700 }}>
                By Audience Level
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {AUDIENCE_LEVELS.map((level, i) => (
                  <motion.div
                    key={level.href}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                  >
                    <Link
                      href={level.href}
                      className="block h-full p-7 rounded-2xl border border-warm-100 bg-white hover:border-gold-300 hover:shadow-md transition-all duration-300 hover:translate-y-[-3px] group"
                    >
                      <h3 className="font-700 text-navy-900 text-xl mb-3 group-hover:text-gold-700 transition-colors" style={{ fontWeight: 700 }}>
                        {level.title}
                      </h3>
                      <p className="text-sm text-neutral-500 leading-relaxed mb-5">{level.description}</p>
                      <span className="text-sm font-600 text-gold-600 flex items-center gap-1" style={{ fontWeight: 600 }}>
                        Explore →
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Not sure CTA */}
          <div
            className="mt-16 p-8 rounded-2xl text-center"
            style={{ background: "var(--color-gold-50)", border: "1px solid var(--color-gold-200)" }}
          >
            <p className="font-700 text-navy-900 text-lg mb-2" style={{ fontWeight: 700 }}>
              Not sure where to start?
            </p>
            <p className="text-neutral-600 text-sm mb-5">
              Tell us about your organization and we&apos;ll recommend the right starting point.
            </p>
            <Button href="/consultation" variant="primary">
              Request a Consultation
            </Button>
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  )
}
