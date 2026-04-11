"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { SectionHeading } from "@/components/ui/SectionHeading"
import { AIBadge } from "@/components/ui/AIBadge"
import { Breadcrumbs } from "@/components/ui/Breadcrumbs"
import { CTABanner } from "@/components/sections/CTABanner"
import { AI_FRAMEWORK_NAME, AI_FRAMEWORK_PILLARS, MESSAGING } from "@/lib/constants"

const LIFECYCLE_AI = [
  {
    phase: "01 Assess",
    title: "AI Readiness Diagnostics",
    desc: "Evaluate where leaders stand on AI fluency, strategy awareness, and adoption mindset. Benchmark against AI-leading organizations.",
    href: "/solutions/assessment",
  },
  {
    phase: "02 Coach",
    title: "AI Strategy Coaching",
    desc: "1:1 and group coaching that builds AI literacy, navigates strategic AI decisions, and develops AI-augmented leadership presence.",
    href: "/solutions/coaching",
  },
  {
    phase: "03 Develop",
    title: "AI Fluency Programs",
    desc: "Structured curricula from AI foundations to advanced AI leadership — cohort-based, blended, and customized to your organization.",
    href: "/solutions/programs",
  },
  {
    phase: "04 Transform",
    title: "AI Adoption Change Management",
    desc: "Culture transformation, change management, and team alignment strategies that drive successful AI adoption at enterprise scale.",
    href: "/solutions/transformation",
  },
  {
    phase: "05 Sustain",
    title: "AI-Ready Succession",
    desc: "Identify and develop AI-native successors. Ensure your leadership pipeline is built for an AI-first future.",
    href: "/solutions/succession",
  },
]

const WHO_NEEDS_THIS = [
  {
    role: "CEOs",
    challenge: "Navigating competitive AI strategy while managing organizational anxiety and board expectations.",
  },
  {
    role: "CHROs",
    challenge: "Rethinking talent architecture, leadership competencies, and development investment for the AI era.",
  },
  {
    role: "Board Directors",
    challenge: "Evaluating AI risk, opportunity, and executive capability to lead AI transformation responsibly.",
  },
  {
    role: "VPs & Directors",
    challenge: "Leading teams through AI tool adoption, workflow disruption, and shifting role expectations.",
  },
]

const GAP_ITEMS = [
  {
    problem: "Built for stability",
    reality: "AI creates continuous disruption. Leaders need frameworks for adaptive decision-making, not just strategic planning.",
  },
  {
    problem: "Ignores AI literacy",
    reality: "You can't lead what you don't understand. Leaders without AI fluency defer to others on the most consequential decisions of their careers.",
  },
  {
    problem: "Treats humans as the unit",
    reality: "The future is human-AI teams. Leaders who can't orchestrate hybrid intelligence will be left behind by those who can.",
  },
]

const STATS = [
  { stat: "85%", label: "of executives say AI will fundamentally reshape their industry" },
  { stat: "72%", label: "of organizations lack AI-ready leadership" },
  { stat: "$4.4T", label: "in projected AI value creation requires AI-literate leaders" },
]

export default function AITransformationPage() {
  return (
    <>
      {/* ── HERO ───────────────────────────────────────────── */}
      <section
        className="pt-40 pb-24 relative"
        style={{ background: "linear-gradient(160deg, var(--color-forest-50) 0%, var(--color-warm-50) 100%)" }}
      >
        <div className="container-content relative z-10">
          <Breadcrumbs crumbs={[{ label: "Solutions", href: "/solutions" }, { label: "AI Transformation" }]} />
          <div className="max-w-3xl mt-8">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <div className="mb-4">
                <AIBadge />
              </div>
              <h1 className="display-lg text-forest-950 mb-5">
                AI Isn&apos;t Just Changing Business. It&apos;s Rewriting What Leadership Means.
              </h1>
              <p className="text-xl text-forest-800/70 leading-relaxed mb-4">
                {MESSAGING.aiUrgency}
              </p>
              <p className="text-lg text-forest-700/60 leading-relaxed">
                The AI era demands a fundamentally different kind of leader — one who can navigate ambiguity, make AI-augmented decisions, lead through disruption, and inspire confidence in the face of unprecedented change. We build that leader.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 mt-8"
            >
              <Button href="/consultation" variant="primary" size="lg">
                Lead the AI Era
              </Button>
              <Button href="#framework" variant="secondary" size="lg">
                See Our Framework
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── STATS ───────────────────────────────────────────── */}
      <section className="py-12" style={{ background: "var(--color-forest-100)" }}>
        <div className="container-content">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STATS.map((item, i) => (
              <motion.div
                key={item.stat}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-6 rounded-2xl bg-white"
                style={{ border: "1px solid var(--color-forest-200)" }}
              >
                <div className="text-3xl font-800 text-forest-700 mb-2" style={{ fontWeight: 800 }}>
                  {item.stat}
                </div>
                <p className="text-sm text-forest-600/70 leading-relaxed">{item.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── THE AI LEADERSHIP GAP ─────────────────────────── */}
      <section className="section-padding" style={{ background: "var(--color-warm-white)" }}>
        <div className="container-content">
          <SectionHeading
            eyebrow="The Gap"
            title="Why traditional leadership development fails in the AI era."
            subtitle="Most leadership development programs were designed for a world that no longer exists. They ignore AI fluency, don't address AI strategy, and have no framework for leading through continuous technological disruption."
            className="mb-14"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {GAP_ITEMS.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card-base card-light"
              >
                <span
                  className="inline-block text-xs font-700 px-3 py-1 rounded-full mb-4"
                  style={{ background: "var(--color-red-50)", color: "var(--color-red-600)", fontWeight: 700 }}
                >
                  {item.problem}
                </span>
                <p className="text-sm text-neutral-600 leading-relaxed">{item.reality}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── THE FRAMEWORK ─────────────────────────────────── */}
      <section id="framework" className="section-padding" style={{ background: "var(--color-forest-100)" }}>
        <div className="container-content">
          <SectionHeading
            eyebrow="Proprietary Framework"
            title={AI_FRAMEWORK_NAME}
            subtitle="Built on 3 years of research into how leaders actually succeed — and fail — in AI-driven environments. Five integrated capabilities that define AI-era leadership."
            className="mb-14"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {AI_FRAMEWORK_PILLARS.map((pillar, i) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className={`p-7 rounded-2xl bg-white group cursor-default ${i === 4 ? "md:col-span-2 lg:col-span-1" : ""}`}
                style={{ border: "1px solid var(--color-forest-200)" }}
              >
                <div className="flex items-start justify-between mb-5">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
                    style={{ background: "var(--color-forest-100)" }}
                  >
                    {pillar.icon}
                  </div>
                  <span
                    className="text-xs font-700 tracking-widest text-forest-400"
                    style={{ fontWeight: 700 }}
                  >
                    {pillar.number}
                  </span>
                </div>

                <h3 className="font-700 text-forest-900 text-lg mb-3 group-hover:text-forest-600 transition-colors" style={{ fontWeight: 700 }}>
                  {pillar.title}
                </h3>
                <p className="text-sm text-neutral-500 leading-relaxed mb-4">
                  {pillar.description}
                </p>

                <div className="pt-4" style={{ borderTop: "1px solid var(--color-forest-100)" }}>
                  <p className="text-xs text-forest-600/70 leading-relaxed">
                    {pillar.detail}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LIFECYCLE INTEGRATION ─────────────────────────── */}
      <section className="section-padding" style={{ background: "var(--color-warm-white)" }}>
        <div className="container-content">
          <SectionHeading
            eyebrow="AI Across the Lifecycle"
            title="AI transformation woven through every phase."
            subtitle="We don't bolt AI onto existing programs. We integrate AI readiness as a core dimension at every phase of the leadership development lifecycle."
            className="mb-14"
          />
          <div className="space-y-4">
            {LIFECYCLE_AI.map((item, i) => (
              <motion.div
                key={item.phase}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  href={item.href}
                  className="flex flex-col md:flex-row md:items-center gap-5 p-6 rounded-2xl bg-white transition-all duration-300 group hover:translate-y-[-2px] hover:shadow-md"
                  style={{ border: "1px solid var(--color-forest-200)" }}
                >
                  <span
                    className="text-xs font-700 px-4 py-1.5 rounded-full shrink-0 tracking-wider"
                    style={{ background: "var(--color-forest-100)", color: "var(--color-forest-700)", fontWeight: 700 }}
                  >
                    {item.phase}
                  </span>
                  <div className="flex-1">
                    <h3 className="font-700 text-forest-900 mb-1 group-hover:text-forest-600 transition-colors" style={{ fontWeight: 700 }}>
                      {item.title}
                    </h3>
                    <p className="text-sm text-neutral-500 leading-relaxed">{item.desc}</p>
                  </div>
                  <span className="text-forest-500 text-lg group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </motion.div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Button href="/lifecycle" variant="primary">
              Explore the Full Lifecycle
            </Button>
          </div>
        </div>
      </section>

      {/* ── WHO NEEDS THIS ────────────────────────────────── */}
      <section className="section-padding" style={{ background: "var(--color-forest-100)" }}>
        <div className="container-content">
          <SectionHeading
            eyebrow="Who It's For"
            title="Leaders facing the AI imperative."
            className="mb-14"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {WHO_NEEDS_THIS.map((person, i) => (
              <motion.div
                key={person.role}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-7 rounded-2xl bg-white"
                style={{ border: "1px solid var(--color-forest-200)" }}
              >
                <h3 className="font-700 text-forest-900 text-lg mb-3" style={{ fontWeight: 700 }}>
                  {person.role}
                </h3>
                <p className="text-sm text-neutral-500 leading-relaxed">{person.challenge}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────── */}
      <CTABanner
        headline="Ready to lead in the AI era?"
        primaryLabel="Request a Consultation"
        primaryHref="/consultation"
        secondaryLabel="Explore Solutions"
        secondaryHref="/solutions"
      />
    </>
  )
}
