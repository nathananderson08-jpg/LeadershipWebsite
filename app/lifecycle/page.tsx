"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import type { Metadata } from "next"
import { Button } from "@/components/ui/Button"
import { SectionHeading } from "@/components/ui/SectionHeading"
import { AIBadge } from "@/components/ui/AIBadge"
import { CTABanner } from "@/components/sections/CTABanner"
import { LIFECYCLE_PHASES, FIRM_NAME, LIFECYCLE_FRAMEWORK_NAME, MESSAGING } from "@/lib/constants"

// Note: metadata must be in a separate server component for App Router
// We export it here for documentation purposes
export const pageMetadata = {
  title: `The Leadership Development Lifecycle — End-to-End Solutions | ${FIRM_NAME}`,
  description:
    "Explore the only end-to-end leadership development lifecycle: from assessment and coaching to development, transformation, and succession.",
}


const AUDIENCE_MATRIX = [
  { level: "Emerging Leaders", color: "rgba(93,171,121,0.12)", textColor: "#5dab79" },
  { level: "Senior Leaders", color: "rgba(93,171,121,0.08)", textColor: "#5dab79" },
  { level: "C-Suite & Board", color: "rgba(93,171,121,0.05)", textColor: "#5dab79" },
]

const AI_PHASE_INTEGRATION = [
  { phase: "Assess", detail: "AI readiness diagnostics & leadership potential modeling" },
  { phase: "Coach", detail: "AI strategy coaching & AI-augmented development insights" },
  { phase: "Develop", detail: "AI fluency curriculum & human-AI collaboration programs" },
  { phase: "Transform", detail: "AI adoption change management & culture transformation" },
  { phase: "Sustain", detail: "Identifying AI-ready successors & future-proof pipelines" },
]

function InteractiveLifecycle() {
  const [activePhase, setActivePhase] = useState<number | null>(null)

  return (
    <div className="relative">
      {/* Connection line */}
      <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 -translate-y-8 z-0"
        style={{ background: "linear-gradient(90deg, transparent 2%, rgba(93,171,121,0.4) 15%, rgba(93,171,121,0.4) 85%, transparent 98%)" }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 relative z-10">
        {LIFECYCLE_PHASES.map((phase, i) => (
          <motion.div
            key={phase.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <button
              onClick={() => setActivePhase(activePhase === i ? null : i)}
              className={`w-full relative text-left p-6 rounded-2xl border transition-all duration-400 group ${
                activePhase === i
                  ? "border-forest-500 shadow-2xl scale-[1.02]"
                  : "border-forest-200 hover:border-forest-400"
              }`}
              style={{
                background:
                  activePhase === i
                    ? "linear-gradient(135deg, rgba(93,171,121,0.15) 0%, rgba(93,171,121,0.08) 100%)"
                    : "white",
              }}
            >
              {/* Phase number */}
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-800 mb-5"
                style={{
                  background: activePhase === i ? "var(--color-forest-600)" : "var(--color-forest-100)",
                  color: activePhase === i ? "white" : "var(--color-forest-700)",
                  fontWeight: 800,
                }}
              >
                {phase.number}
              </div>

              <h3 className="font-700 text-forest-900 text-xl mb-1" style={{ fontWeight: 700 }}>
                {phase.title}
              </h3>
              <p className="text-sm text-forest-600/70 mb-4">{phase.subtitle}</p>
              <p className="text-sm text-forest-800/60 leading-relaxed">
                {phase.description.substring(0, 90)}...
              </p>

              {/* Expand indicator */}
              <div
                className={`mt-4 text-xs font-600 transition-colors ${
                  activePhase === i ? "text-forest-600" : "text-forest-400 group-hover:text-forest-600"
                }`}
                style={{ fontWeight: 600 }}
              >
                {activePhase === i ? "▴ Less detail" : "▾ More detail"}
              </div>
            </button>
          </motion.div>
        ))}
      </div>

      {/* Expanded detail panel */}
      <AnimatePresence mode="wait">
        {activePhase !== null && (
          <motion.div
            key={activePhase}
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: "1.5rem" }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            {(() => {
              const phase = LIFECYCLE_PHASES[activePhase]
              return (
                <div
                  className="p-8 rounded-2xl border border-forest-300 flex flex-col md:flex-row gap-8"
                  style={{ background: "white" }}
                >
                  <div className="flex-1">
                    <p
                      className="text-xs font-700 tracking-widest uppercase text-forest-600 mb-3"
                      style={{ fontWeight: 700 }}
                    >
                      Phase {phase.number} — {phase.title}: {phase.subtitle}
                    </p>
                    <p className="text-forest-800/80 leading-relaxed mb-6 text-base">{phase.description}</p>
                    <Link href={phase.link}>
                      <Button variant="primary" size="sm">
                        Explore {phase.title} Solutions →
                      </Button>
                    </Link>
                  </div>
                  <div className="md:w-72">
                    <p
                      className="text-xs font-700 tracking-widest uppercase text-forest-500 mb-4"
                      style={{ fontWeight: 700 }}
                    >
                      What We Deliver
                    </p>
                    <ul className="space-y-2.5">
                      {phase.details.map((detail) => (
                        <li key={detail} className="flex items-start gap-3 text-sm text-forest-700">
                          <span className="text-forest-500 shrink-0 mt-0.5">✓</span>
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )
            })()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function LifecyclePage() {
  return (
    <>
      {/* ── HERO ──────────────────────────────────────────── */}
      <section
        className="relative pt-40 pb-24"
        style={{ background: "linear-gradient(160deg, var(--color-forest-50) 0%, var(--color-warm-50) 100%)" }}
      >
        <div className="absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(at 70% 30%, rgba(93,171,121,0.12) 0px, transparent 60%)",
          }}
        />
        <div className="container-content relative z-10 text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-sm font-700 tracking-[0.15em] uppercase text-forest-600 mb-5" style={{ fontWeight: 700 }}>
              {LIFECYCLE_FRAMEWORK_NAME}
            </p>
            <h1 className="display-lg text-forest-950 mb-6">
              One Partner. Every Phase.{" "}
              <span style={{ color: "var(--color-forest-600)" }}>Complete</span> Leadership Development.
            </h1>
            <p className="text-xl text-forest-800/70 leading-relaxed max-w-2xl mx-auto">
              We are the only firm that delivers integrated solutions across the entire leadership development lifecycle — with no handoffs, no gaps, and no compromises.
            </p>
            <p className="text-sm text-forest-700/50 mt-5 max-w-2xl mx-auto leading-relaxed">
              {MESSAGING.connectionChain}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── INTERACTIVE LIFECYCLE ─────────────────────────── */}
      <section
        className="section-padding"
        style={{ background: "var(--color-forest-100)" }}
      >
        <div className="container-content">
          <SectionHeading
            eyebrow="Five Phases. One System."
            title="The complete leadership development lifecycle"
            subtitle="Click any phase to explore what we deliver — and how each phase connects seamlessly to the next."
            className="mb-14"
          />
          <InteractiveLifecycle />
        </div>
      </section>

      {/* ── WHY INTEGRATED ───────────────────────────────── */}
      <section className="section-padding" style={{ background: "var(--color-warm-white)" }}>
        <div className="container-content">
          <SectionHeading
            eyebrow="The Integrated Difference"
            title="Most firms do one thing. We do everything — and connect it all."
            subtitle="The leadership development industry is built on specialization. Assessment firms don't coach. Coaching firms don't build programs. Training providers don't plan succession. The result is a patchwork of disconnected interventions that produces inconsistent, hard-to-measure outcomes."
            className="mb-14"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {[
              {
                title: "The fragmented model fails leaders.",
                body: "When a leader works with three different vendors across three years, there's no common language, no shared data, and no one holding the thread. Every engagement starts from scratch. The insights from an assessment never inform the coaching. The coaching never reinforces the development program. Leaders feel it — they describe it as 'a lot of activity with not enough impact.'",
              },
              {
                title: "Integration is what makes development stick.",
                body: "Our lifecycle methodology creates a continuous through-line from first assessment to last succession plan. The data from Phase 1 informs Phase 2. Coaching insights shape Phase 3 curriculum. Phase 4 transformation outcomes define Phase 5 pipeline priorities. Because one team holds the whole picture, nothing gets lost between handoffs — because there are none.",
              },
              {
                title: "One partner means one standard of excellence.",
                body: "Every firm we've seen struggle with leadership development has the same root problem: too many vendors, too little coordination. When you work with us, you have one relationship, one methodology, and one accountable partner — at every phase, for every leader level, at any organizational scale.",
              },
              {
                title: "The outcome is a leadership system, not a program.",
                body: "Our clients don't just run better leadership programs — they build a self-reinforcing leadership system. Assessment feeds coaching, which informs development, which enables transformation, which sustains through succession. That system outlasts any individual program, coach, or initiative. It becomes part of how the organization develops people, permanently.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="p-8 rounded-2xl bg-white"
                style={{ border: "1px solid var(--color-warm-100)" }}
              >
                <h3 className="font-700 text-navy-900 text-lg mb-3" style={{ fontWeight: 700 }}>
                  {item.title}
                </h3>
                <p className="text-neutral-600 leading-relaxed text-sm">{item.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DIFFERENTIATOR PULL QUOTE ─────────────────────── */}
      <section className="py-14" style={{ background: "var(--color-warm-white)", borderTop: "1px solid var(--color-warm-100)" }}>
        <div className="container-content max-w-3xl mx-auto text-center">
          <motion.p
            className="text-2xl font-600 text-navy-900 leading-relaxed"
            style={{ fontWeight: 600 }}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span style={{ color: "var(--color-gold-600)" }}>"</span>
            {MESSAGING.differentiator}
            <span style={{ color: "var(--color-gold-600)" }}>"</span>
          </motion.p>
        </div>
      </section>

      {/* ── AUDIENCE × LIFECYCLE MATRIX ───────────────────── */}
      <section className="section-padding" style={{ background: "var(--color-warm-white)" }}>
        <div className="container-content">
          <SectionHeading
            eyebrow="Lifecycle × Audience"
            title="The same lifecycle. Every level."
            subtitle="Our lifecycle isn't a one-size-fits-all framework — it's calibrated to the specific challenges, context, and needs of leaders at every stage of their career."
            className="mb-14"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {AUDIENCE_MATRIX.map((audience, i) => (
              <motion.div
                key={audience.level}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
                className="p-7 rounded-2xl border border-forest-200 bg-white"
                style={{ background: audience.color }}
              >
                <h3 className="font-700 text-forest-900 text-xl mb-5" style={{ fontWeight: 700 }}>
                  {audience.level}
                </h3>
                <div className="space-y-3">
                  {LIFECYCLE_PHASES.map((phase) => (
                    <div key={phase.id} className="flex items-center gap-3">
                      <div
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ background: audience.textColor }}
                      />
                      <span className="text-sm text-forest-700">
                        <span className="text-forest-900 font-600" style={{ fontWeight: 600 }}>{phase.title}:</span>{" "}
                        {phase.subtitle}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-5 border-t border-forest-200">
                  <Link
                    href={
                      i === 0
                        ? "/solutions/emerging-leaders"
                        : i === 1
                        ? "/solutions/senior-leaders"
                        : "/solutions/c-suite"
                    }
                    className="text-sm font-600 text-forest-600 hover:text-forest-800 transition-colors"
                    style={{ fontWeight: 600 }}
                  >
                    Explore {audience.level} solutions →
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI CALLOUT ────────────────────────────────────── */}
      <section className="py-20" style={{ background: "linear-gradient(135deg, #020817 0%, #040e1a 100%)" }}>
        <div className="container-content">
          <div className="max-w-4xl mx-auto">
            <div
              className="p-10 rounded-2xl border border-ai-500/20"
              style={{
                background: "linear-gradient(135deg, rgba(0,212,255,0.06) 0%, rgba(0,212,255,0.02) 100%)",
              }}
            >
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="flex-1">
                  <AIBadge className="mb-4" />
                  <h2 className="display-md text-white mb-4">
                    AI transformation cuts across every phase
                  </h2>
                  <p className="text-white/60 leading-relaxed mb-6">
                    AI isn&apos;t a standalone initiative — it&apos;s a cross-cutting capability that reshapes what great leadership looks like at every phase of the lifecycle.
                  </p>
                  <Button href="/solutions/ai-transformation" variant="ai" size="lg">
                    Explore AI Leadership Transformation
                  </Button>
                </div>
                <div className="md:w-80">
                  <div className="space-y-3">
                    {AI_PHASE_INTEGRATION.map((item, i) => (
                      <motion.div
                        key={item.phase}
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-start gap-3 p-3 rounded-xl"
                        style={{ background: "rgba(0,212,255,0.04)", border: "1px solid rgba(0,212,255,0.1)" }}
                      >
                        <span className="text-xs font-700 px-2 py-1 rounded" style={{ background: "rgba(0,212,255,0.12)", color: "#00d4ff", fontWeight: 700 }}>
                          {item.phase}
                        </span>
                        <span className="text-xs text-white/50 leading-relaxed">{item.detail}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ────────────────────────────────────── */}
      <CTABanner
        headline="Let's map your leadership lifecycle."
        subtext="Every organization is at a different stage. We'll help you understand where you are, where you need to go, and how to get there."
        primaryLabel="Start the Conversation"
        primaryHref="/consultation"
        secondaryLabel="View All Solutions"
        secondaryHref="/solutions"
      />
    </>
  )
}
