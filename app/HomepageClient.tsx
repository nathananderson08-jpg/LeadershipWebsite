"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/Button"
import { MetricCounter } from "@/components/ui/MetricCounter"
import { SectionHeading } from "@/components/ui/SectionHeading"
import { AIBadge } from "@/components/ui/AIBadge"
import { CTABanner } from "@/components/sections/CTABanner"
import { VideoBackground } from "@/components/ui/VideoBackground"
import { ParticleField } from "@/components/ui/ParticleField"
import { METRICS, LIFECYCLE_PHASES, SOLUTIONS, SAMPLE_ARTICLES, MESSAGING, LIFECYCLE_FRAMEWORK_NAME } from "@/lib/constants"

// ── Living gradient mesh background ─────────────────────────
function HeroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* Base layer - Light, airy gradient */}
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(160deg, #f3faf5 0%, #e3f2e8 55%, #f8f8f6 100%)" }}
      />

      {/* Mesh orb 1 — Soft sage green top-right, slow drift */}
      <motion.div
        className="absolute"
        style={{
          width: "80vw",
          height: "80vw",
          maxWidth: 1000,
          maxHeight: 1000,
          borderRadius: "50%",
          background: "radial-gradient(circle at 50% 50%, rgba(93,171,121,0.15) 0%, rgba(93,171,121,0.05) 35%, transparent 65%)",
          top: "-25%",
          right: "-20%",
          willChange: "transform",
        }}
        animate={{
          x: [0, 40, -20, 0],
          y: [0, -30, 20, 0],
          scale: [1, 1.06, 0.97, 1],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Mesh orb 2 — Warm earth tone bottom-left, counter-drift */}
      <motion.div
        className="absolute"
        style={{
          width: "60vw",
          height: "60vw",
          maxWidth: 800,
          maxHeight: 800,
          borderRadius: "50%",
          background: "radial-gradient(circle at 50% 50%, rgba(201,168,138,0.12) 0%, rgba(201,168,138,0.04) 40%, transparent 65%)",
          bottom: "-20%",
          left: "-15%",
          willChange: "transform",
        }}
        animate={{
          x: [0, -35, 25, 0],
          y: [0, 25, -15, 0],
          scale: [1, 1.1, 0.95, 1],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 3 }}
      />

      {/* Mesh orb 3 — Light green mid-center, subtle pulse */}
      <motion.div
        className="absolute"
        style={{
          width: "45vw",
          height: "45vw",
          maxWidth: 600,
          maxHeight: 600,
          borderRadius: "50%",
          background: "radial-gradient(circle at 50% 50%, rgba(122,184,146,0.1) 0%, transparent 60%)",
          top: "30%",
          left: "30%",
          willChange: "transform",
        }}
        animate={{
          x: [0, 20, -30, 10, 0],
          y: [0, -20, 10, 30, 0],
          scale: [1, 1.04, 1.08, 1.02, 1],
          opacity: [0.5, 0.7, 0.5, 0.8, 0.5],
        }}
        transition={{ duration: 28, repeat: Infinity, ease: "easeInOut", delay: 7 }}
      />

      {/* Subtle texture for organic feel */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E\")",
          opacity: 0.3,
        }}
      />

      {/* Subtle soft vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 80% 70% at 50% 50%, transparent 50%, rgba(243,250,245,0.5) 100%)",
        }}
      />
    </div>
  )
}

// ── Lifecycle Preview (homepage condensed) ───────────────────
function LifecyclePreview() {
  const [activePhase, setActivePhase] = useState<string | null>(null)

  return (
    <section className="section-padding" style={{ background: "var(--color-warm-white)" }}>
      <div className="container-content">
        <SectionHeading
          eyebrow="The Lifecycle"
          title="Every phase. One partner. One outcome."
          subtitle={`${LIFECYCLE_FRAMEWORK_NAME} delivers integrated solutions across every stage of leadership development — with no handoffs, no gaps, no fragmentation.`}
          className="mb-16"
        />

        {/* Phase steps */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-12">
          {LIFECYCLE_PHASES.map((phase, i) => (
            <motion.div
              key={phase.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="relative"
            >
              <button
                className={`w-full h-full text-left p-5 rounded-xl border transition-all duration-300 ${
                  activePhase === phase.id
                    ? "bg-forest-900 border-forest-500 text-white shadow-xl"
                    : "bg-white border-warm-100 text-forest-900 hover:border-forest-300 hover:shadow-md"
                }`}
                style={{ borderColor: activePhase === phase.id ? "var(--color-forest-500)" : undefined }}
                onClick={() => setActivePhase(activePhase === phase.id ? null : phase.id)}
              >
                <span
                  className={`text-xs font-700 tracking-widest uppercase block mb-2 ${
                    activePhase === phase.id ? "text-forest-300" : "text-forest-600"
                  }`}
                  style={{ fontWeight: 700 }}
                >
                  {phase.number}
                </span>
                <span className="font-700 text-lg block" style={{ fontWeight: 700 }}>
                  {phase.title}
                </span>
                <span className={`text-xs mt-1 block ${activePhase === phase.id ? "text-white/60" : "text-neutral-500"}`}>
                  {phase.subtitle}
                </span>
              </button>

              {/* Connector arrow */}
              {i < LIFECYCLE_PHASES.length - 1 && (
                <div className="hidden md:flex absolute top-1/2 -right-2.5 z-10 transform -translate-y-1/2 items-center">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M4 10h12M12 5l5 5-5 5" stroke="var(--color-forest-500)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Expanded phase detail */}
        <AnimatePresence mode="wait">
          {activePhase && (() => {
            const phase = LIFECYCLE_PHASES.find((p) => p.id === activePhase)!
            return (
              <motion.div
                key={activePhase}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div
                  className="p-8 rounded-2xl border border-forest-200 flex flex-col md:flex-row gap-8"
                  style={{ background: "white" }}
                >
                  <div className="flex-1">
                    <p className="text-xs font-700 tracking-widest uppercase text-forest-600 mb-3" style={{ fontWeight: 700 }}>
                      Phase {phase.number} — {phase.title}
                    </p>
                    <p className="text-neutral-700 leading-relaxed mb-6">{phase.description}</p>
                    <Button href={phase.link} variant="primary" size="sm">
                      Explore {phase.title} Solutions →
                    </Button>
                  </div>
                  <div className="md:w-64">
                    <p className="text-xs font-700 tracking-widest uppercase text-neutral-400 mb-4" style={{ fontWeight: 700 }}>
                      What We Deliver
                    </p>
                    <ul className="space-y-2">
                      {phase.details.map((d) => (
                        <li key={d} className="flex items-start gap-2 text-sm text-neutral-600">
                          <span className="text-forest-500 mt-0.5">✓</span>
                          {d}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            )
          })()}
        </AnimatePresence>

        <div className="text-center mt-10">
          <Button href="/lifecycle" variant="secondary" size="lg">
            See the Full Lifecycle →
          </Button>
        </div>
      </div>
    </section>
  )
}

// ── AI Spotlight ─────────────────────────────────────────────
function AISpotlight() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(135deg, #e3f2e8 0%, #c5e0cf 40%, #e3f2e8 100%)",
        }}
      />
      {/* Particle network animation */}
      <ParticleField 
        particleCount={60}
        particleColor="rgba(93, 171, 121, 0.5)"
        lineColor="rgba(93, 171, 121, 0.12)"
        maxDistance={150}
        speed={0.25}
      />
      {/* Animated AI background */}
      <motion.div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: "radial-gradient(at 40% 40%, rgba(93,171,121,0.2) 0px, transparent 50%), radial-gradient(at 70% 70%, rgba(93,171,121,0.15) 0px, transparent 50%)",
        }}
        animate={{ opacity: [0.2, 0.35, 0.2] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Subtle pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(93,171,121,0.4) 2px, rgba(93,171,121,0.4) 3px)",
          backgroundSize: "100% 40px",
        }}
      />

      <div className="container-content relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <AIBadge className="mb-6" />
            <h2
              className="display-lg text-forest-950 mb-6"
            >
              AI Is Rewriting the Rules of Leadership
            </h2>
            <p className="text-lg text-forest-800/70 leading-relaxed mb-10 max-w-2xl mx-auto">
              The leaders who will define the next decade aren&apos;t those who understand AI — they&apos;re those who
              can lead through it. We&apos;ve built the only end-to-end framework for developing AI-ready leadership at
              every level of your organization.
            </p>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-6 mb-12 max-w-2xl mx-auto">
              {[
                { stat: "85%", desc: "of executives say AI will fundamentally change their industry" },
                { stat: "72%", desc: "of organizations lack leaders prepared for AI-driven transformation" },
                { stat: "3x", desc: "faster adoption when AI change is led by AI-fluent leaders" },
              ].map((item) => (
                <div key={item.stat} className="text-center">
                  <div
                    className="text-3xl font-800 mb-2 text-forest-700"
                    style={{ fontWeight: 800 }}
                  >
                    {item.stat}
                  </div>
                  <p className="text-xs text-forest-700/60 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

            <Button href="/solutions/ai-transformation" variant="ai" size="lg">
              Explore AI Leadership Solutions →
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// ── Solutions Grid ───────────────────────────────────────────
function SolutionsGrid() {
  const icons: Record<string, React.ReactNode> = {
    search: (
      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
      </svg>
    ),
    users: (
      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    "graduation-cap": (
      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" />
      </svg>
    ),
    building: (
      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 9h1M9 13h1M9 17h1M14 9h1M14 13h1M14 17h1" strokeLinecap="round" />
      </svg>
    ),
    "trending-up": (
      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
      </svg>
    ),
    zap: (
      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
  }

  return (
    <section className="section-padding" style={{ background: "var(--color-forest-50)" }}>
      <div className="container-content">
        <SectionHeading
          eyebrow="Our Solutions"
          title="Solutions for every phase, every level, every scale"
          subtitle="Whether you need to diagnose, develop, or transform — we have a solution designed for your exact challenge."
          className="mb-16"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {SOLUTIONS.map((solution, i) => (
            <motion.div
              key={solution.href}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.5 }}
            >
              <Link
                href={solution.href}
                className={`block h-full p-7 rounded-2xl transition-all duration-300 group ${
                  solution.featured
                    ? "border border-forest-300 hover:border-forest-400 bg-white"
                    : "card-light"
                }`}
                style={
                  solution.featured
                    ? {
                        boxShadow: "0 4px 24px rgba(93,171,121,0.12)",
                      }
                    : undefined
                }
              >
                {solution.featured && <AIBadge className="mb-4" />}
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center mb-5 ${
                    solution.featured ? "text-forest-600" : "text-forest-600"
                  }`}
                  style={{
                    background: solution.featured
                      ? "rgba(93,171,121,0.15)"
                      : "rgba(93,171,121,0.1)",
                  }}
                >
                  {icons[solution.icon]}
                </div>
                <h3 className="font-700 text-forest-900 text-lg mb-2 group-hover:text-forest-700 transition-colors" style={{ fontWeight: 700 }}>
                  {solution.title}
                </h3>
                <p className="text-sm text-neutral-600 leading-relaxed mb-4">{solution.description}</p>
                <span
                  className={`text-sm font-600 ${solution.featured ? "text-forest-600" : "text-forest-600"} group-hover:gap-2 flex items-center gap-1 transition-all`}
                  style={{ fontWeight: 600 }}
                >
                  Learn more →
                </span>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button href="/solutions" variant="secondary" size="lg">
            View All Solutions
          </Button>
        </div>
      </div>
    </section>
  )
}

// ── Insights Preview ─────────────────────────────────────────
function InsightsPreview() {
  return (
    <section className="section-padding" style={{ background: "var(--color-warm-white)" }}>
      <div className="container-content">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <SectionHeading
            eyebrow="Thought Leadership"
            title="Insights from the frontier of leadership"
            align="left"
            className="md:max-w-lg"
          />
          <Button href="/insights" variant="secondary">
            View All Insights
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SAMPLE_ARTICLES.map((article, i) => (
            <motion.article
              key={article.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <Link href={`/insights/${article.slug}`} className="block h-full card-base card-light group">
                <div className="flex items-center gap-3 mb-4">
                  <span
                    className="text-xs font-700 px-3 py-1 rounded-full"
                    style={{
                      background: "var(--color-forest-100)",
                      color: "var(--color-forest-700)",
                      fontWeight: 700,
                    }}
                  >
                    {article.category}
                  </span>
                  <span className="text-xs text-neutral-400">{article.readTime}</span>
                </div>
                <h3 className="font-700 text-forest-900 text-lg leading-snug mb-3 group-hover:text-forest-600 transition-colors" style={{ fontWeight: 700 }}>
                  {article.title}
                </h3>
                <p className="text-sm text-neutral-500 leading-relaxed mb-5">{article.excerpt}</p>
                <div className="flex items-center gap-3 mt-auto">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-700 text-white"
                    style={{ background: "var(--color-forest-700)", fontWeight: 700 }}
                  >
                    {article.author.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </div>
                  <div>
                    <p className="text-xs font-600 text-forest-900" style={{ fontWeight: 600 }}>{article.author}</p>
                    <p className="text-xs text-neutral-400">{article.authorTitle}</p>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Main Export ──────────────────────────────────────────────
export function HomepageClient() {
  return (
    <>
      {/* ── HERO ──────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center" style={{ paddingTop: "5rem" }}>
        <VideoBackground 
          videoSrc="https://cdn.pixabay.com/video/2019/06/07/24224-341708498_large.mp4"
          overlayOpacity={0.45}
        />

        <div className="container-content relative z-10 py-24">
          <div className="max-w-4xl">
            <div>
              {/* Eyebrow */}
              <motion.p
                className="text-sm font-700 tracking-[0.18em] uppercase mb-6 flex items-center gap-3"
                style={{ fontWeight: 700, color: "var(--color-forest-600)" }}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <span
                  className="inline-block w-6 h-px"
                  style={{ background: "var(--color-forest-500)" }}
                />
                {LIFECYCLE_FRAMEWORK_NAME}
              </motion.p>

              {/* H1 */}
              <motion.h1
                className="display-xl text-forest-950 mb-6"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                The only leadership company{" "}
                delivering{" "}
                <span
                  className="relative inline-block"
                  style={{ color: "var(--color-forest-600)" }}
                >
                  end-to-end solutions
                  <motion.svg
                    className="absolute left-0 right-0 w-full"
                    style={{ bottom: "-4px" }}
                    height="4"
                    viewBox="0 0 100 4"
                    preserveAspectRatio="none"
                    fill="none"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 1.2, delay: 0.9, ease: "easeOut" }}
                  >
                    <motion.path
                      d="M0 2 Q25 0 50 2 Q75 4 100 2"
                      stroke="var(--color-forest-500)"
                      strokeWidth="2"
                      fill="none"
                    />
                  </motion.svg>
                </span>{" "}
                across the entire development lifecycle.
              </motion.h1>

              {/* Subheadline */}
              <motion.p
                className="text-xl text-forest-800/70 mb-4 max-w-2xl leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
              >
                {MESSAGING.lifecycleSpan} {MESSAGING.integrationMessage}
              </motion.p>

              {/* Integration message */}
              <motion.p
                className="text-sm text-forest-700/50 mb-10 max-w-xl tracking-wide"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                {MESSAGING.audienceSpan} {MESSAGING.scaleSpan}
              </motion.p>

              {/* CTAs */}
              <motion.div
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <Button href="/lifecycle" variant="primary" size="lg">
                  Explore the Lifecycle
                </Button>
                <Button href="/contact" variant="secondary" size="lg">
                  Contact Us
                </Button>
              </motion.div>
            </div>

            {/* Lifecycle mini-preview dots — staggered reveal */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="mt-16 flex items-center gap-4 flex-wrap"
            >
              {LIFECYCLE_PHASES.map((phase, i) => (
                <motion.div
                  key={phase.id}
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.75 + i * 0.08, duration: 0.4 }}
                >
                  <div className="flex items-center gap-2">
                    <motion.div
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: "var(--color-forest-500)" }}
                      animate={{ scale: [1, 1.4, 1], opacity: [0.7, 1, 0.7] }}
                      transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
                    />
                    <span className="text-sm text-forest-700/60 font-500" style={{ fontWeight: 500 }}>{phase.title}</span>
                  </div>
                  {i < LIFECYCLE_PHASES.length - 1 && (
                    <div className="w-6 h-px" style={{ background: "rgba(93,171,121,0.3)" }} />
                  )}
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-px h-10 bg-gradient-to-b from-transparent to-forest-500/40" />
          <div className="w-1 h-1 rounded-full bg-forest-500/40" />
        </motion.div>
      </section>

      {/* ── METRICS BAR ───────────────────────────────────── */}
      <section style={{ background: "var(--color-forest-100)", borderBottom: "1px solid var(--color-forest-200)" }}>
        <div className="container-content py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {METRICS.map((metric, i) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <MetricCounter
                  value={metric.value}
                  suffix={metric.suffix}
                  label={metric.label}
                  light
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VALUE PILLARS ─────────────────────────────────── */}
      <section className="section-padding" style={{ background: "var(--color-warm-white)" }}>
        <div className="container-content">
          <SectionHeading
            eyebrow="Why We're Different"
            title="One firm. Every phase. Every leader. Every scale."
            subtitle={MESSAGING.challenge}
            className="mb-16"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  number: "01",
                  title: "Full Lifecycle Coverage",
                  body: "We don't hand off between phases. One partner, one methodology, one seamless outcome — from the first assessment to the last succession plan.",
                  icon: "◈",
                },
                {
                  number: "02",
                  title: "Every Level of Leadership",
                  body: "From emerging talent to the C-suite and board. Integrated programs that grow with your people and connect across levels.",
                  icon: "◇",
                },
                {
                  number: "03",
                  title: "Individual to Enterprise",
                  body: "Whether it's one executive or an entire organization, we scale without losing depth. Our platform ensures consistency at any scope.",
                  icon: "◉",
                },
              ].map((pillar, i) => (
                <motion.div
                  key={pillar.number}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.6 }}
                  className="card-base card-light"
                >
                  <div className="flex items-center gap-4 mb-5">
                    <span
                      className="text-3xl"
                      style={{ color: "var(--color-forest-500)" }}
                    >
                      {pillar.icon}
                    </span>
                    <span className="text-xs font-700 tracking-widest uppercase text-neutral-400" style={{ fontWeight: 700 }}>
                      {pillar.number}
                    </span>
                  </div>
                  <h3 className="font-700 text-forest-900 text-xl mb-3" style={{ fontWeight: 700 }}>
                    {pillar.title}
                  </h3>
                  <p className="text-neutral-600 leading-relaxed">{pillar.body}</p>
                </motion.div>
              ))}
          </div>
        </div>
      </section>

      {/* ── LIFECYCLE PREVIEW ─────────────────────────────── */}
      <LifecyclePreview />

      {/* ── AI SPOTLIGHT ──────────────────────────────────── */}
      <AISpotlight />

      {/* ── SOLUTIONS GRID ────────────────────────────────── */}
      <SolutionsGrid />

      {/* ── INSIGHTS ─────────────────────────────���────────── */}
      <InsightsPreview />

      {/* ── CTA BANNER ────────────────────────────────────── */}
      <CTABanner />
    </>
  )
}
