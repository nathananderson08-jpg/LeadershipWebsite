"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { SectionHeading } from "@/components/ui/SectionHeading"
import { AIBadge } from "@/components/ui/AIBadge"
import { Breadcrumbs } from "@/components/ui/Breadcrumbs"
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
    icon: "◈",
  },
  {
    role: "CHROs",
    challenge: "Rethinking talent architecture, leadership competencies, and development investment for the AI era.",
    icon: "◇",
  },
  {
    role: "Board Directors",
    challenge: "Evaluating AI risk, opportunity, and executive capability to lead AI transformation responsibly.",
    icon: "◉",
  },
  {
    role: "VPs & Directors",
    challenge: "Leading teams through AI tool adoption, workflow disruption, and shifting role expectations.",
    icon: "◐",
  },
]

// Deterministic particle seed data (avoids hydration mismatch from Math.random())
const PARTICLE_DATA = [
  { id: 0, x: 8, y: 12, size: 2, duration: 10, delay: 0 },
  { id: 1, x: 22, y: 38, size: 1.5, duration: 13, delay: 1.2 },
  { id: 2, x: 45, y: 7, size: 3, duration: 9, delay: 0.5 },
  { id: 3, x: 67, y: 25, size: 1, duration: 14, delay: 2.1 },
  { id: 4, x: 83, y: 60, size: 2.5, duration: 11, delay: 0.8 },
  { id: 5, x: 15, y: 72, size: 1.5, duration: 8, delay: 3 },
  { id: 6, x: 55, y: 85, size: 2, duration: 12, delay: 1.7 },
  { id: 7, x: 92, y: 18, size: 1, duration: 7, delay: 2.5 },
  { id: 8, x: 35, y: 55, size: 2, duration: 15, delay: 0.3 },
  { id: 9, x: 76, y: 88, size: 1.5, duration: 9, delay: 1.9 },
  { id: 10, x: 12, y: 90, size: 3, duration: 11, delay: 0.7 },
  { id: 11, x: 49, y: 42, size: 1, duration: 13, delay: 2.8 },
  { id: 12, x: 88, y: 44, size: 2, duration: 10, delay: 1.4 },
  { id: 13, x: 60, y: 14, size: 1.5, duration: 8, delay: 3.2 },
  { id: 14, x: 28, y: 78, size: 2.5, duration: 14, delay: 0.1 },
  { id: 15, x: 71, y: 70, size: 1, duration: 12, delay: 2.3 },
  { id: 16, x: 40, y: 20, size: 2, duration: 9, delay: 1.6 },
  { id: 17, x: 96, y: 82, size: 1.5, duration: 10, delay: 0.9 },
  { id: 18, x: 5, y: 50, size: 3, duration: 13, delay: 2 },
  { id: 19, x: 62, y: 98, size: 1, duration: 11, delay: 1.1 },
]

// Particle system component
function AIParticles() {
  const particles = PARTICLE_DATA

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: "var(--color-ai-400)",
            boxShadow: `0 0 ${p.size * 4}px var(--color-ai-400)`,
          }}
          animate={{
            opacity: [0, 0.6, 0],
            scale: [0, 1, 0],
            y: [0, -30, -60],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}

export default function AITransformationPage() {
  return (
    <>
      {/* ── HERO — DARK + FUTURISTIC ───────────────────────── */}
      <section
        className="relative min-h-screen flex items-center overflow-hidden bg-gradient-ai"
      >
        <AIParticles />

        {/* Glow orbs */}
        <motion.div
          className="absolute pointer-events-none"
          style={{
            width: "80vw",
            height: "80vw",
            maxWidth: 1000,
            maxHeight: 1000,
            borderRadius: "50%",
            background: "radial-gradient(circle, var(--color-ai-glow) 0%, transparent 60%)",
            top: "-30%",
            right: "-20%",
          }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute pointer-events-none"
          style={{
            width: "60vw",
            height: "60vw",
            maxWidth: 800,
            maxHeight: 800,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(20, 163, 163, 0.1) 0%, transparent 60%)",
            bottom: "-20%",
            left: "-10%",
          }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        />

        {/* Scan line overlay */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(20,163,163,0.8) 3px, rgba(20,163,163,0.8) 4px)",
            backgroundSize: "100% 60px",
          }}
        />

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(20,163,163,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(20,163,163,0.4) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />

        <div className="container-content relative z-10 py-40">
          <div className="pt-20 pb-4">
            <Breadcrumbs crumbs={[{ label: "Solutions", href: "/solutions" }, { label: "AI Transformation" }]} />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-4xl"
          >
            <AIBadge className="mb-6" />

            <h1
              className="display-xl text-white mb-6"
              style={{
                lineHeight: 1.05,
                textShadow: "0 0 80px var(--color-ai-glow)",
              }}
            >
              AI Isn&apos;t Just Changing Business.{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, var(--color-ai-400) 0%, var(--color-ai-500) 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                It&apos;s Rewriting What Leadership Means.
              </span>
            </h1>

            <p
              className="text-lg leading-relaxed mb-3 max-w-2xl font-500"
              style={{ color: "var(--color-ai-400)", fontWeight: 500 }}
            >
              {MESSAGING.aiUrgency}
            </p>
            <p
              className="text-xl leading-relaxed mb-10 max-w-2xl"
              style={{ color: "rgba(255,255,255,0.55)" }}
            >
              The AI era demands a fundamentally different kind of leader — one who can navigate ambiguity, make AI-augmented decisions, lead through disruption, and inspire confidence in the face of unprecedented change. We build that leader.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button href="/consultation" variant="ai" size="lg">
                Lead the AI Era →
              </Button>
              <Button href="#framework" variant="outline-white" size="lg">
                See Our Framework
              </Button>
            </div>

            {/* Stats */}
            <div
              className="mt-16 grid grid-cols-3 gap-6 p-6 rounded-2xl"
              style={{
                background: "var(--color-ai-glow)",
                border: "1px solid rgba(20,163,163,0.25)",
              }}
            >
              {[
                { stat: "85%", label: "of executives say AI will fundamentally reshape their industry" },
                { stat: "72%", label: "of organizations lack AI-ready leadership" },
                { stat: "$4.4T", label: "in projected AI value creation requires AI-literate leaders" },
              ].map((item) => (
                <div key={item.stat} className="text-center">
                  <div
                    className="text-2xl font-800 mb-1"
                    style={{ color: "var(--color-ai-400)", fontWeight: 800 }}
                  >
                    {item.stat}
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── THE AI LEADERSHIP GAP ─────────────────────────── */}
      <section
        className="section-padding"
        style={{ background: "linear-gradient(180deg, var(--color-forest-950) 0%, var(--color-navy-900) 100%)" }}
      >
        <div className="container-content">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-xs font-700 tracking-widest uppercase mb-4" style={{ color: "var(--color-ai-400)", fontWeight: 700 }}>
                The Gap
              </p>
              <h2 className="display-md text-white mb-6">
                Why traditional leadership development fails in the AI era
              </h2>
              <p className="text-lg leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
                Most leadership development programs were designed for a world that no longer exists. They ignore AI fluency, don&apos;t address AI strategy, and have no framework for leading through continuous technological disruption.
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
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
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="p-7 rounded-2xl"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <div
                  className="text-xs font-700 tracking-wider uppercase px-3 py-1 rounded-full inline-block mb-4"
                  style={{
                    background: "rgba(239,68,68,0.1)",
                    color: "#ef4444",
                    fontWeight: 700,
                  }}
                >
                  ✗ {item.problem}
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
                  {item.reality}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── THE FRAMEWORK ─────────────────────────────────── */}
      <section
        id="framework"
        className="section-padding"
        style={{ background: "var(--color-forest-950)" }}
      >
        <div className="container-content">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-xs font-700 tracking-widest uppercase mb-4" style={{ color: "var(--color-ai-400)", fontWeight: 700 }}>
                Proprietary Framework
              </p>
              <h2 className="display-md text-white mb-6">
                {AI_FRAMEWORK_NAME}
              </h2>
              <p className="text-lg leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
                Built on 3 years of research into how leaders actually succeed — and fail — in AI-driven environments. Five integrated capabilities that define AI-era leadership.
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {AI_FRAMEWORK_PILLARS.map((pillar, i) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className={`p-7 rounded-2xl group cursor-default ${i === 4 ? "md:col-span-2 lg:col-span-1" : ""}`}
                style={{
                  background: "linear-gradient(135deg, var(--color-ai-glow) 0%, rgba(20,163,163,0.05) 100%)",
                  border: "1px solid rgba(20,163,163,0.2)",
                  transition: "border-color 0.3s",
                }}
              >
                {/* Header row */}
                <div className="flex items-start justify-between mb-5">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
                    style={{ background: "var(--color-ai-glow)" }}
                  >
                    {pillar.icon}
                  </div>
                  <span
                    className="text-xs font-700 tracking-widest"
                    style={{ color: "var(--color-ai-400)", fontWeight: 700, opacity: 0.5 }}
                  >
                    {pillar.number}
                  </span>
                </div>

                <h3 className="font-700 text-white text-lg mb-3 group-hover:text-ai-300 transition-colors" style={{ fontWeight: 700 }}>
                  {pillar.title}
                </h3>
                <p className="text-sm leading-relaxed mb-4" style={{ color: "rgba(255,255,255,0.6)" }}>
                  {pillar.description}
                </p>

                {/* Detail — secondary text with top border */}
                <div
                  className="pt-4 mt-auto"
                  style={{ borderTop: "1px solid rgba(20,163,163,0.15)" }}
                >
                  <p className="text-xs leading-relaxed" style={{ color: "var(--color-ai-400)", opacity: 0.7 }}>
                    {pillar.detail}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LIFECYCLE INTEGRATION ─────────────────────────── */}
      <section
        className="section-padding"
        style={{ background: "linear-gradient(180deg, var(--color-forest-950) 0%, var(--color-navy-950) 100%)" }}
      >
        <div className="container-content">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-xs font-700 tracking-widest uppercase mb-4" style={{ color: "var(--color-ai-400)", fontWeight: 700 }}>
                AI Across the Lifecycle
              </p>
              <h2 className="display-md text-white mb-5">
                AI transformation woven through every phase
              </h2>
              <p className="text-lg leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
                We don&apos;t bolt AI onto existing programs. We integrate AI readiness as a core dimension at every phase of the leadership development lifecycle.
              </p>
            </motion.div>
          </div>

          <div className="space-y-4">
            {LIFECYCLE_AI.map((item, i) => (
              <motion.div
                key={item.phase}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <Link
                  href={item.href}
                  className="flex flex-col md:flex-row md:items-center gap-5 p-6 rounded-2xl transition-all duration-300 group hover:translate-y-[-2px]"
                  style={{
                    background: "var(--color-ai-glow)",
                    border: "1px solid rgba(20,163,163,0.2)",
                  }}
                >
                  <span
                    className="text-xs font-700 px-4 py-1.5 rounded-full shrink-0 tracking-wider"
                    style={{
                      background: "rgba(20,163,163,0.15)",
                      color: "var(--color-ai-400)",
                      fontWeight: 700,
                      border: "1px solid rgba(20,163,163,0.3)",
                    }}
                  >
                    {item.phase}
                  </span>
                  <div className="flex-1">
                    <h3
                      className="font-700 text-white mb-1 group-hover:text-ai-300 transition-colors"
                      style={{ fontWeight: 700 }}
                    >
                      {item.title}
                    </h3>
                    <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
                      {item.desc}
                    </p>
                  </div>
                  <span className="text-ai-500 text-lg group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHO NEEDS THIS ────────────────────────────────── */}
      <section
        className="section-padding"
        style={{ background: "var(--color-navy-950)" }}
      >
        <div className="container-content">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-xs font-700 tracking-widest uppercase mb-4" style={{ color: "var(--color-ai-400)", fontWeight: 700 }}>
              Who It&apos;s For
            </p>
            <h2 className="display-md text-white">
              AI leadership transformation is for every leader — but it starts at the top.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {WHO_NEEDS_THIS.map((person, i) => (
              <motion.div
                key={person.role}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-7 rounded-2xl"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-2xl" style={{ color: "var(--color-ai-400)" }}>{person.icon}</span>
                  <h3 className="font-700 text-white text-xl" style={{ fontWeight: 700 }}>
                    {person.role}
                  </h3>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
                  {person.challenge}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────── */}
      <section
        className="py-24 relative overflow-hidden bg-gradient-ai"
      >
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(at 50% 50%, var(--color-ai-glow) 0px, transparent 60%)",
          }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <div className="container-content relative z-10 text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <AIBadge className="mb-6" />
            <h2 className="display-md text-white mb-6">
              The AI era won&apos;t wait. Neither should you.
            </h2>
            <p className="text-lg mb-10" style={{ color: "rgba(255,255,255,0.5)" }}>
              The organizations that develop AI-ready leaders now will define their industries for the next decade. Let&apos;s start building your AI leadership capability today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button href="/consultation" variant="ai" size="lg">
                Lead the AI Era →
              </Button>
              <Button href="/lifecycle" variant="outline-white" size="lg">
                Explore the Full Lifecycle
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
