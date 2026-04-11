"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/Button"
import { SectionHeading } from "@/components/ui/SectionHeading"
import { MetricCounter } from "@/components/ui/MetricCounter"
import { CTABanner } from "@/components/sections/CTABanner"
import { FIRM_NAME } from "@/lib/constants"

const TIMELINE = [
  { year: "Year 1", title: "Founded with a Clear Mission", desc: "Built from the ground up to solve the leadership fragmentation problem — one partner, one methodology, complete lifecycle coverage." },
  { year: "Year 2", title: "Methodology & Platform Development", desc: "Invested in building our proprietary assessment engine, the ALIGN™ AI framework, and the technology infrastructure to deliver at scale." },
  { year: "Year 3", title: "Global Practice Expansion", desc: "Grew our coaching network, expanded to multiple continents, and launched our AI Leadership Transformation practice ahead of market demand." },
  { year: "Today", title: "The Only End-to-End Firm", desc: "Serving organizations across 6 continents, with an integrated platform and a team of world-class practitioners who cover the entire leadership development lifecycle." },
]

const SCALE_METRICS = [
  { value: 10000, suffix: "+", label: "Leaders Developed" },
  { value: 200, suffix: "+", label: "Organizations Served" },
  { value: 35, suffix: "+", label: "Countries" },
  { value: 50, suffix: "+", label: "Expert Practitioners" },
  { value: 12, suffix: "+", label: "Languages" },
  { value: 40, suffix: "+", label: "Certifications Held" },
]

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section
        className="pt-40 pb-24 relative"
        style={{ background: "linear-gradient(160deg, var(--color-navy-900) 0%, var(--color-navy-800) 100%)" }}
      >
        <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(at 60% 30%, rgba(193,154,91,0.07) 0px, transparent 50%)" }} />
        <div className="container-content relative z-10 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <p className="text-xs font-700 tracking-widest uppercase text-gold-400 mb-5" style={{ fontWeight: 700 }}>Our Story</p>
            <h1 className="display-lg text-white mb-6">
              Built to Solve Leadership&apos;s Biggest Problem:{" "}
              <span style={{ color: "var(--color-gold-400)" }}>Fragmentation.</span>
            </h1>
            <p className="text-xl text-white/60 leading-relaxed max-w-2xl">
              Every great organization needs leadership that works at every level. We built the firm that makes that possible.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Origin Story */}
      <section className="section-padding" style={{ background: "white" }}>
        <div className="container-content">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
            <div className="lg:col-span-3">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <p className="text-xs font-700 tracking-widest uppercase text-gold-600 mb-5" style={{ fontWeight: 700 }}>Why We Exist</p>
                <div className="space-y-5 text-neutral-700 leading-relaxed text-lg">
                  <p>
                    We founded this firm because we watched organizations waste millions on leadership development that didn&apos;t work — not because the individual vendors were bad, but because the ecosystem was broken.
                  </p>
                  <p>
                    A coaching firm here. An assessment company there. A training provider somewhere else. A succession consultant who&apos;d never met the coach. No common language, no integrated data, no continuous thread from one phase to the next. The result was leaders who were assessed but not coached, trained but not assessed, and organizations that built succession plans with no pipeline behind them.
                  </p>
                  <p>
                    The insight was simple: <strong className="text-navy-900">leadership development only works as a system.</strong> Assessment feeds coaching. Coaching informs development. Development enables transformation. Transformation creates the culture that sustains succession. Remove any link, and the chain breaks.
                  </p>
                  <p>
                    We built the only firm where all five phases of the leadership development lifecycle live under one roof — connected by a single methodology, powered by integrated technology, and delivered by a team that sees the whole picture.
                  </p>
                </div>
              </motion.div>
            </div>
            <div className="lg:col-span-2">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
                <div className="space-y-4">
                  <div className="p-6 rounded-2xl" style={{ background: "var(--color-warm-50)", border: "1px solid var(--color-warm-100)" }}>
                    <p className="text-3xl font-800 text-navy-900 mb-2" style={{ fontWeight: 800 }}>Our Mission</p>
                    <p className="text-neutral-600 leading-relaxed">To develop leaders who can navigate complexity, inspire performance, and build organizations that last — at every level, across the entire leadership lifecycle.</p>
                  </div>
                  <div className="p-6 rounded-2xl" style={{ background: "var(--color-navy-900)", border: "1px solid rgba(193,154,91,0.15)" }}>
                    <p className="text-3xl font-800 text-white mb-2" style={{ fontWeight: 800 }}>Our Vision</p>
                    <p className="leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>A world where every organization has access to the complete leadership development infrastructure it needs to build lasting capability.</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-padding" style={{ background: "var(--color-warm-50)" }}>
        <div className="container-content">
          <SectionHeading eyebrow="Our Journey" title="From founding insight to global practice." className="mb-14" />
          <div className="relative">
            {/* Vertical line */}
            <div
              className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2"
              style={{ background: "linear-gradient(180deg, var(--color-gold-300) 0%, var(--color-gold-500) 50%, var(--color-gold-300) 100%)" }}
            />
            <div className="space-y-10">
              {TIMELINE.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12 }}
                  className={`relative flex items-start gap-8 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
                >
                  {/* Dot */}
                  <div
                    className="absolute left-8 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 z-10 mt-1"
                    style={{ background: "var(--color-gold-500)", borderColor: "var(--color-warm-50)" }}
                  />
                  {/* Content */}
                  <div className={`ml-16 md:ml-0 md:w-1/2 ${i % 2 === 0 ? "md:pr-12" : "md:pl-12"}`}>
                    <div className="p-6 rounded-2xl bg-white" style={{ border: "1px solid var(--color-warm-100)" }}>
                      <span className="text-xs font-700 tracking-widest uppercase text-gold-600 mb-2 block" style={{ fontWeight: 700 }}>{item.year}</span>
                      <h3 className="font-700 text-navy-900 text-xl mb-2" style={{ fontWeight: 700 }}>{item.title}</h3>
                      <p className="text-sm text-neutral-500 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                  <div className="hidden md:block md:w-1/2" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Scale metrics */}
      <section className="section-padding" style={{ background: "var(--color-navy-900)" }}>
        <div className="container-content">
          <SectionHeading eyebrow="Our Scale" title="Built to serve the most demanding organizations." light className="mb-14" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {SCALE_METRICS.map((metric, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                <MetricCounter value={metric.value} suffix={metric.suffix} label={metric.label} light />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <CTABanner headline="Want to understand our approach in depth?" primaryLabel="Explore Our Methodology" primaryHref="/about/methodology" secondaryLabel="Request a Consultation" secondaryHref="/consultation" />
    </>
  )
}
