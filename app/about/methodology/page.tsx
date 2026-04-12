"use client"

import { motion } from "framer-motion"
import { SectionHeading } from "@/components/ui/SectionHeading"
import { Breadcrumbs } from "@/components/ui/Breadcrumbs"
import { Button } from "@/components/ui/Button"
import { CTABanner } from "@/components/sections/CTABanner"

const METHODOLOGY_PILLARS = [
  {
    number: "01",
    title: "Evidence-Based Design",
    desc: "Every element of our methodology is grounded in peer-reviewed research, validated frameworks, and decades of practitioner evidence — not trend-following or proprietary mythology.",
  },
  {
    number: "02",
    title: "Systems Integration",
    desc: "We design from the whole, not the parts. Each solution connects to the next — assessment feeds coaching, coaching informs leadership development, leadership development enables transformation.",
  },
  {
    number: "03",
    title: "Behavioral Change Architecture",
    desc: "Real change happens at the behavioral level, not the knowledge level. We design deliberately for behavior change — with accountability mechanisms, practice structures, and environmental support.",
  },
  {
    number: "04",
    title: "Measurement & Iteration",
    desc: "We measure at every stage and use the data to continuously improve. Our impact tracking is not a compliance exercise — it is how we get better.",
  },
  {
    number: "05",
    title: "Contextual Relevance",
    desc: "There is no universal leadership. Our methodology adapts to industry context, organizational culture, and individual starting points — because what works depends on where you are.",
  },
]

const RESEARCH_FOUNDATIONS = [
  "Positive Organizational Psychology (University of Michigan, Ross School of Business)",
  "Adult Development Theory (Harvard Graduate School of Education)",
  "Leadership Pipeline Research (Ram Charan, Larry Bossidy)",
  "Psychological Safety Research (Amy Edmondson, Harvard Business School)",
  "AI & Future of Work Research (MIT Sloan School of Management)",
  "Executive Function and Decision-Making Neuroscience",
]

export default function MethodologyPage() {
  return (
    <>
      <section
        className="pt-40 pb-24 relative"
        style={{ background: "linear-gradient(160deg, var(--color-forest-50) 0%, var(--color-warm-50) 100%)" }}
      >
        <div className="container-content relative z-10">
          <Breadcrumbs crumbs={[{ label: "About", href: "/about" }, { label: "Our Methodology" }]} />
          <div className="max-w-3xl mt-8">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <p className="text-xs font-700 tracking-widest uppercase text-forest-600 mb-4" style={{ fontWeight: 700 }}>Our Methodology</p>
              <h1 className="display-lg text-forest-950 mb-5">A Research-Backed Methodology for Complete Leadership Development.</h1>
              <p className="text-xl text-forest-800/70 leading-relaxed">We don&apos;t develop leaders through instinct or intuition. Every program, assessment, and coaching engagement is grounded in validated evidence about how adults develop, how behavior changes, and how organizations transform.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Framework overview */}
      <section className="section-padding" style={{ background: "white" }}>
        <div className="container-content">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <SectionHeading eyebrow="The Framework" title="The Integrated Leadership Development System" subtitle="Our methodology is built on five integrated principles that work together to produce sustained leadership change — not just knowledge transfer." align="left" />
              <div className="mt-10 space-y-5">
                {METHODOLOGY_PILLARS.map((pillar, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex gap-5 p-5 rounded-xl"
                    style={{ background: "var(--color-warm-50)", border: "1px solid var(--color-warm-100)" }}
                  >
                    <span className="text-xs font-800 text-gold-600 shrink-0 mt-1 w-8" style={{ fontWeight: 800 }}>{pillar.number}</span>
                    <div>
                      <h3 className="font-700 text-navy-900 mb-2" style={{ fontWeight: 700 }}>{pillar.title}</h3>
                      <p className="text-sm text-neutral-500 leading-relaxed">{pillar.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="lg:sticky lg:top-28">
              <div className="p-8 rounded-2xl" style={{ background: "var(--color-forest-100)", border: "1px solid var(--color-forest-200)" }}>
                <p className="text-xs font-700 tracking-widest uppercase text-forest-600 mb-6" style={{ fontWeight: 700 }}>Research Foundations</p>
                <p className="text-forest-700 text-sm mb-6 leading-relaxed">Our methodology draws from the leading research programs in leadership, organizational psychology, adult development, and AI strategy.</p>
                <ul className="space-y-3">
                  {RESEARCH_FOUNDATIONS.map((ref) => (
                    <li key={ref} className="flex items-start gap-3 text-sm text-forest-700">
                      <span className="text-forest-500 shrink-0 mt-0.5">◈</span>
                      {ref}
                    </li>
                  ))}
                </ul>
                <div className="mt-8 pt-6 border-t border-forest-200">
                  <Button href="/lifecycle" variant="primary" className="w-full justify-center">
                    See It in Action →
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How methodology connects to lifecycle */}
      <section className="section-padding" style={{ background: "var(--color-warm-50)" }}>
        <div className="container-content">
          <SectionHeading eyebrow="Methodology in Practice" title="How our methodology spans the full lifecycle" subtitle="The same evidence-based principles that guide our coaching also guide our assessments, our programs, our transformation work, and our succession planning. That consistency is what produces integrated results." className="mb-14" />
          <div className="flex flex-col items-center gap-4 max-w-3xl mx-auto">
            {["Assessment grounded in validated psychometrics", "Coaching built on adult leadership development theory", "Programs designed for behavioral transfer", "Transformation using organizational change science", "Succession driven by evidence-based potential assessment"].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="w-full flex items-center gap-5 p-5 rounded-xl bg-white"
                style={{ border: "1px solid var(--color-warm-100)" }}
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-700 text-white shrink-0" style={{ background: "var(--color-gold-500)", fontWeight: 700 }}>
                  {String(i + 1).padStart(2, "0")}
                </div>
                <span className="font-600 text-navy-900" style={{ fontWeight: 600 }}>{step}</span>
                {i < 4 && <div className="absolute left-1/2 translate-x-[-50%]" />}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <CTABanner headline="See our methodology at work." primaryLabel="Explore the Lifecycle" primaryHref="/lifecycle" secondaryLabel="Request a Consultation" secondaryHref="/consultation" />
    </>
  )
}
