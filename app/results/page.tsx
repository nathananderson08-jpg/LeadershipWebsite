"use client"

import { motion } from "framer-motion"
import { SectionHeading } from "@/components/ui/SectionHeading"
import { MetricCounter } from "@/components/ui/MetricCounter"
import { Button } from "@/components/ui/Button"
import { CTABanner } from "@/components/sections/CTABanner"
import { IMPACT_METRICS, DETAILED_METRICS, MESSAGING } from "@/lib/constants"

const OUR_METRICS = [
  { value: DETAILED_METRICS.coachReturnRate, label: "of coaching clients re-engage", subLabel: "Coach Return Rate" },
  { value: DETAILED_METRICS.programCompletionRate, label: "average program completion rate", subLabel: "vs. industry average of 68%" },
  { value: DETAILED_METRICS.netPromoterScore, label: "Net Promoter Score", subLabel: "Industry benchmark: 38" },
  { value: DETAILED_METRICS.assessmentInstruments, label: "proprietary assessment instruments", subLabel: "Covering all development dimensions" },
]

const COMMITMENTS = [
  {
    title: "We measure before we develop.",
    body: "Every engagement starts with assessment — because development without diagnosis is just training. We establish baseline capability data that makes measurement possible.",
  },
  {
    title: "We define success before we start.",
    body: "Before any engagement begins, we align with you on what outcomes look like. This gives us shared accountability for results — not just deliverables.",
  },
  {
    title: "We report on impact, not activity.",
    body: "Our engagement reports don't tell you how many sessions were completed. They tell you what changed — in capability, in behavior, and wherever possible, in business outcomes.",
  },
  {
    title: "We follow through past the program.",
    body: "Standard engagements include 90-day post-program review. We track whether development transferred to the workplace — not just whether participants passed a satisfaction survey.",
  },
]

const MEASUREMENT_APPROACH = [
  { title: "Before & After Assessment", desc: "We assess leadership capability at program start and end — measuring real behavioral shift, not just satisfaction scores." },
  { title: "90-Day Post-Program Review", desc: "Our standard engagement includes a 90-day follow-up assessment to measure whether development has transferred to the workplace." },
  { title: "Manager Observation Frameworks", desc: "We equip managers to observe and report on behavioral change — adding organizational validation to self-reported improvement." },
  { title: "Business Outcome Linkage", desc: "Where possible, we work with clients to link leadership development investment to business outcomes: retention, engagement, promotion rates, and performance metrics." },
]

const RESEARCH_ROI = [
  { stat: "$7.40", per: "returned for every $1 invested in leadership development", source: "McKinsey Global Institute" },
  { stat: "25%", per: "higher performance in organizations with strong leadership pipelines", source: "DDI Global Leadership Forecast" },
  { stat: "3x", per: "higher revenue growth in companies with mature leadership development", source: "Deloitte Human Capital Report" },
  { stat: "41%", per: "reduction in turnover when employees feel their manager is a good leader", source: "Gallup State of the Workplace" },
]

export default function ResultsPage() {
  return (
    <>
      <section
        className="pt-40 pb-24"
        style={{ background: "linear-gradient(160deg, var(--color-navy-900) 0%, var(--color-navy-800) 100%)" }}
      >
        <div className="container-content">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-3xl">
            <p className="text-xs font-700 tracking-widest uppercase text-gold-400 mb-5" style={{ fontWeight: 700 }}>Impact & Results</p>
            <h1 className="display-lg text-white mb-5">Measurable Impact Across the Leadership Lifecycle.</h1>
            <p className="text-xl text-white/60 leading-relaxed">We don&apos;t ask you to take the impact of leadership development on faith. We measure it — at every phase, through every engagement — and we show you the data.</p>
          </motion.div>
        </div>
      </section>

      {/* Impact metrics */}
      <section className="section-padding" style={{ background: "var(--color-navy-900)" }}>
        <div className="container-content">
          <SectionHeading eyebrow="Our Scale" title="Across the lifecycle. Across the globe." light className="mb-14" />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-10">
            {IMPACT_METRICS.map((metric, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                <MetricCounter value={metric.value} suffix={metric.suffix} label={metric.label} light />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our own performance metrics */}
      <section className="section-padding" style={{ background: "var(--color-warm-white)" }}>
        <div className="container-content">
          <SectionHeading
            eyebrow="Our Performance"
            title="How we perform — by the numbers."
            subtitle="We hold ourselves to the same measurement standard we apply to our clients. These are our own performance metrics, updated regularly."
            className="mb-14"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {OUR_METRICS.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-7 rounded-2xl text-center card-base card-light"
              >
                <div
                  className="text-4xl font-800 mb-2"
                  style={{ fontWeight: 800, color: "var(--color-navy-900)" }}
                >
                  {item.value}
                </div>
                <p className="text-sm text-neutral-600 leading-snug mb-2">{item.label}</p>
                <p className="text-xs text-gold-600 font-600" style={{ fontWeight: 600 }}>{item.subLabel}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How we measure */}
      <section className="section-padding" style={{ background: "white" }}>
        <div className="container-content">
          <SectionHeading eyebrow="Our Approach to Measurement" title="How we know the work is working." subtitle="Every engagement includes a measurement architecture — because ROI claims without data are just marketing." className="mb-14" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {MEASUREMENT_APPROACH.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-7 rounded-2xl"
                style={{ background: "var(--color-warm-50)", border: "1px solid var(--color-warm-100)" }}
              >
                <h3 className="font-700 text-navy-900 text-lg mb-3" style={{ fontWeight: 700 }}>{item.title}</h3>
                <p className="text-neutral-500 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Research-backed ROI */}
      <section className="section-padding" style={{ background: "var(--color-warm-50)" }}>
        <div className="container-content">
          <SectionHeading eyebrow="The Business Case" title="What the research says about leadership development ROI." subtitle="When leadership development is done right, the financial case is overwhelming. Here's what the leading research shows." className="mb-14" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {RESEARCH_ROI.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-7 rounded-2xl text-center bg-white"
                style={{ border: "1px solid var(--color-warm-100)" }}
              >
                <div className="text-4xl font-800 text-navy-900 mb-3" style={{ fontWeight: 800 }}>{item.stat}</div>
                <p className="text-sm text-neutral-500 leading-relaxed mb-4">{item.per}</p>
                <p className="text-xs text-gold-600 font-600" style={{ fontWeight: 600 }}>{item.source}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our commitments */}
      <section className="section-padding" style={{ background: "var(--color-navy-900)" }}>
        <div className="container-content">
          <SectionHeading
            eyebrow="Our Commitments"
            title="How we hold ourselves accountable."
            subtitle={MESSAGING.philosophy}
            light
            className="mb-14"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {COMMITMENTS.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-7 rounded-2xl"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <div
                  className="w-2 h-2 rounded-full mb-4"
                  style={{ background: "var(--color-gold-500)" }}
                />
                <h3 className="font-700 text-white text-lg mb-3" style={{ fontWeight: 700 }}>{item.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{item.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <CTABanner headline="See what&apos;s possible for your organization." primaryLabel="Request a Consultation" primaryHref="/consultation" secondaryLabel="Explore the Lifecycle" secondaryHref="/lifecycle" />
    </>
  )
}
