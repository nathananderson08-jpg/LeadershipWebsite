"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/Button"
import { MetricCounter } from "@/components/ui/MetricCounter"
import { SectionHeading } from "@/components/ui/SectionHeading"
import { AIBadge } from "@/components/ui/AIBadge"
import { CTABanner } from "@/components/sections/CTABanner"
import { METRICS, LIFECYCLE_PHASES, SOLUTIONS, SAMPLE_ARTICLES, MESSAGING, LIFECYCLE_FRAMEWORK_NAME } from "@/lib/constants"

// ── Hero Background — Light, airy with subtle depth ─────────────────────────
function HeroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* Base gradient — teal from logo */}
      <div
        className="absolute inset-0"
        style={{ 
          background: "linear-gradient(180deg, #134e4a 0%, #0f766e 50%, #0d9488 100%)" 
        }}
      />

      {/* Subtle organic shapes for growth feeling */}
      <motion.div
        className="absolute"
        style={{
          width: "60vw",
          height: "60vw",
          maxWidth: 800,
          maxHeight: 800,
          borderRadius: "50%",
          background: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.06) 0%, transparent 60%)",
          top: "-10%",
          right: "-15%",
        }}
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.5, 0.7, 0.5],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Orange accent glow from logo */}
      <motion.div
        className="absolute"
        style={{
          width: "40vw",
          height: "40vw",
          maxWidth: 500,
          maxHeight: 500,
          borderRadius: "50%",
          background: "radial-gradient(circle at 50% 50%, rgba(249, 115, 22, 0.08) 0%, transparent 60%)",
          bottom: "10%",
          left: "-10%",
        }}
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 3 }}
      />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
    </div>
  )
}

// ── Lifecycle Preview (homepage condensed) ───────────────────
function LifecyclePreview() {
  const [activePhase, setActivePhase] = useState<string | null>(null)

  return (
    <section className="section-padding bg-white">
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
                className={`w-full text-left p-5 rounded-xl border transition-all duration-300 ${
                  activePhase === phase.id
                    ? "bg-primary-800 border-primary-600 text-white shadow-lg"
                    : "bg-white border-neutral-200 text-neutral-900 hover:border-primary-300 hover:shadow-md"
                }`}
                onClick={() => setActivePhase(activePhase === phase.id ? null : phase.id)}
              >
                <span
                  className={`text-xs font-semibold tracking-widest uppercase block mb-2 ${
                    activePhase === phase.id ? "text-primary-300" : "text-primary-600"
                  }`}
                >
                  {phase.number}
                </span>
                <span className="font-semibold text-lg block">
                  {phase.title}
                </span>
                <span className={`text-xs mt-1 block ${activePhase === phase.id ? "text-white/70" : "text-neutral-500"}`}>
                  {phase.subtitle}
                </span>
              </button>

              {/* Connector arrow */}
              {i < LIFECYCLE_PHASES.length - 1 && (
                <div className="hidden md:flex absolute top-1/2 -right-2.5 z-10 transform -translate-y-1/2 items-center">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M4 10h12M12 5l5 5-5 5" stroke="currentColor" className="text-primary-400" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
                <div className="p-8 rounded-2xl border border-primary-100 bg-primary-50/50 flex flex-col md:flex-row gap-8">
                  <div className="flex-1">
                    <p className="text-xs font-semibold tracking-widest uppercase text-primary-600 mb-3">
                      Phase {phase.number} — {phase.title}
                    </p>
                    <p className="text-neutral-700 leading-relaxed mb-6">{phase.description}</p>
                    <Button href={phase.link} variant="primary" size="sm">
                      Explore {phase.title} Solutions
                    </Button>
                  </div>
                  <div className="md:w-64">
                    <p className="text-xs font-semibold tracking-widest uppercase text-neutral-400 mb-4">
                      What We Deliver
                    </p>
                    <ul className="space-y-2">
                      {phase.details.map((d) => (
                        <li key={d} className="flex items-start gap-2 text-sm text-neutral-600">
                          <svg className="w-4 h-4 text-primary-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
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
            See the Full Lifecycle
          </Button>
        </div>
      </div>
    </section>
  )
}

// ── AI Spotlight ─────────────────────────────────────────────
function AISpotlight() {
  return (
    <section className="py-20 lg:py-24 relative overflow-hidden bg-neutral-900">
      {/* Subtle background */}
      <div className="absolute inset-0 opacity-30">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(at 30% 30%, rgba(13, 148, 136, 0.15) 0px, transparent 50%), radial-gradient(at 70% 70%, rgba(13, 148, 136, 0.1) 0px, transparent 50%)",
          }}
        />
      </div>

      <div className="container-content relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <AIBadge className="mb-6" />
            <h2 className="display-lg text-white mb-6">
              AI Is Rewriting the Rules of Leadership
            </h2>
            <p className="text-lg text-neutral-300 leading-relaxed mb-10 max-w-2xl mx-auto">
              The leaders who will define the next decade aren&apos;t those who understand AI — they&apos;re those who
              can lead through it. We&apos;ve built the only end-to-end framework for developing AI-ready leadership at
              every level of your organization.
            </p>

            {/* Stats row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 max-w-2xl mx-auto">
              {[
                { stat: "85%", desc: "of executives say AI will fundamentally change their industry" },
                { stat: "72%", desc: "of organizations lack leaders prepared for AI-driven transformation" },
                { stat: "3x", desc: "faster adoption when AI change is led by AI-fluent leaders" },
              ].map((item) => (
                <div key={item.stat} className="text-center">
                  <div className="text-3xl font-semibold mb-2 text-accent-400">
                    {item.stat}
                  </div>
                  <p className="text-sm text-neutral-400 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

            <Button href="/solutions/ai-transformation" variant="ai" size="lg">
              Explore AI Leadership Solutions
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
    <section className="section-padding bg-primary-800">
      <div className="container-content">
        <SectionHeading
          eyebrow="Our Solutions"
          title="Solutions for every phase, every level, every scale"
          subtitle="Whether you need to diagnose, develop, or transform — we have a solution designed for your exact challenge."
          light
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
                    ? "border border-accent-500/30 hover:border-accent-500/60 bg-accent-500/5"
                    : "card-dark"
                }`}
              >
                {solution.featured && <AIBadge className="mb-4" />}
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center mb-5 ${
                    solution.featured ? "text-accent-400 bg-accent-500/10" : "text-primary-200 bg-primary-600/50"
                  }`}
                >
                  {icons[solution.icon]}
                </div>
                <h3 className="font-semibold text-white text-lg mb-2 group-hover:text-primary-200 transition-colors">
                  {solution.title}
                </h3>
                <p className="text-sm text-white/60 leading-relaxed mb-4">{solution.description}</p>
                <span
                  className={`text-sm font-medium ${solution.featured ? "text-accent-400" : "text-primary-200"} group-hover:gap-2 flex items-center gap-1 transition-all`}
                >
                  Learn more
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button href="/solutions" variant="outline-white" size="lg">
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
    <section className="section-padding bg-neutral-50">
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
                  <span className="text-xs font-medium px-3 py-1 rounded-full bg-primary-100 text-primary-700">
                    {article.category}
                  </span>
                  <span className="text-xs text-neutral-400">{article.readTime}</span>
                </div>
                <h3 className="font-semibold text-neutral-900 text-lg leading-snug mb-3 group-hover:text-primary-700 transition-colors">
                  {article.title}
                </h3>
                <p className="text-sm text-neutral-500 leading-relaxed mb-5">{article.excerpt}</p>
                <div className="flex items-center gap-3 mt-auto">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white bg-primary-700">
                    {article.author.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </div>
                  <div>
                    <p className="text-xs font-medium text-neutral-900">{article.author}</p>
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

// ── Client Logos / Trust Indicators ─────────────────────────
function TrustIndicators() {
  return (
    <section className="py-16 bg-white border-y border-neutral-100">
      <div className="container-content">
        <p className="text-center text-sm text-neutral-500 mb-8">
          Trusted by industry-leading organizations worldwide
        </p>
        <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6 opacity-50">
          {/* Placeholder for client logos - using text for now */}
          {["Fortune 500 Leaders", "Global Healthcare", "Tech Innovators", "Financial Services", "Government & Public Sector"].map((name) => (
            <span key={name} className="text-sm font-medium text-neutral-400 tracking-wide">
              {name}
            </span>
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
        <HeroBackground />

        <div className="container-content relative z-10 py-20 lg:py-24">
          <div className="max-w-3xl">
            {/* Eyebrow */}
            <motion.p
              className="text-sm font-medium tracking-[0.15em] uppercase mb-6 flex items-center gap-3 text-primary-100"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="inline-block w-8 h-px bg-accent-400" />
              Leadership Development
            </motion.p>

            {/* H1 */}
            <motion.h1
              className="display-xl text-white mb-6 text-balance"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              Grow leaders who transform{" "}
              <span className="text-accent-400">organizations</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              className="text-xl text-white/80 mb-4 max-w-2xl leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              {MESSAGING.primaryClaim}
            </motion.p>

            {/* Integration message */}
            <motion.p
              className="text-base text-white/60 mb-10 max-w-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {MESSAGING.lifecycleSpan} {MESSAGING.integrationMessage}
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
              <Button href="/consultation" variant="outline-white" size="lg">
                Schedule a Consultation
              </Button>
            </motion.div>

            {/* Lifecycle mini-preview */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="mt-14 flex items-center gap-3 flex-wrap"
            >
              {LIFECYCLE_PHASES.map((phase, i) => (
                <div key={phase.id} className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary-300/60" />
                    <span className="text-sm text-white/60">{phase.title}</span>
                  </div>
                  {i < LIFECYCLE_PHASES.length - 1 && (
                    <div className="w-4 h-px bg-white/20" />
                  )}
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-px h-8 bg-gradient-to-b from-transparent to-white/30" />
          <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
        </motion.div>
      </section>

      {/* ── METRICS BAR ───────────────────────────────────── */}
      <section className="bg-white border-b border-neutral-100">
        <div className="container-content py-12 lg:py-14">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
            {METRICS.map((metric, i) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="text-center"
              >
                <MetricCounter
                  value={metric.value}
                  suffix={metric.suffix}
                  label={metric.label}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRUST INDICATORS ──────────────────────────────── */}
      <TrustIndicators />

      {/* ── VALUE PILLARS ─────────────────────────────────── */}
      <section className="section-padding bg-neutral-50">
        <div className="container-content">
          <SectionHeading
            eyebrow="Why We&apos;re Different"
            title="One firm. Every phase. Every leader. Every scale."
            subtitle={MESSAGING.challenge}
            className="mb-16"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                number: "01",
                title: "Full Lifecycle Coverage",
                body: "We don&apos;t hand off between phases. One partner, one methodology, one seamless outcome — from the first assessment to the last succession plan.",
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077l1.41-.513m14.095-5.13l1.41-.513M5.106 17.785l1.15-.964m11.49-9.642l1.149-.964M7.501 19.795l.75-1.3m7.5-12.99l.75-1.3m-6.063 16.658l.26-1.477m2.605-14.772l.26-1.477m0 17.726l-.26-1.477M10.698 4.614l-.26-1.477M16.5 19.794l-.75-1.299M7.5 4.205L12 12m6.894 5.785l-1.149-.964M6.256 7.178l-1.15-.964m15.352 8.864l-1.41-.513M4.954 9.435l-1.41-.514M12.002 12l-3.75 6.495" />
                  </svg>
                ),
              },
              {
                number: "02",
                title: "Every Level of Leadership",
                body: "From emerging talent to the C-suite and board. Integrated programs that grow with your people and connect across levels.",
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                  </svg>
                ),
              },
              {
                number: "03",
                title: "Individual to Enterprise",
                body: "Whether it&apos;s one executive or an entire organization, we scale without losing depth. Our platform ensures consistency at any scope.",
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
                  </svg>
                ),
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
                  <div className="w-12 h-12 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center">
                    {pillar.icon}
                  </div>
                  <span className="text-xs font-semibold tracking-widest uppercase text-neutral-400">
                    {pillar.number}
                  </span>
                </div>
                <h3 className="font-semibold text-neutral-900 text-xl mb-3">
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

      {/* ── INSIGHTS ──────────────────────────────────────── */}
      <InsightsPreview />

      {/* ── CTA BANNER ────────────────────────────────────── */}
      <CTABanner />
    </>
  )
}
