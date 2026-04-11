"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/Button"
import { SectionHeading } from "@/components/ui/SectionHeading"
import { Breadcrumbs } from "@/components/ui/Breadcrumbs"
import { CTABanner } from "@/components/sections/CTABanner"

export default function SeniorLeadersPage() {
  return (
    <>
      <section className="pt-40 pb-24" style={{ background: "linear-gradient(160deg, var(--color-forest-50) 0%, var(--color-warm-50) 100%)" }}>
        <div className="container-content">
          <Breadcrumbs crumbs={[{ label: "Solutions", href: "/solutions" }, { label: "Senior Leaders" }]} />
          <div className="max-w-3xl mt-8">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <p className="text-xs font-700 tracking-widest uppercase text-forest-600 mb-4" style={{ fontWeight: 700 }}>Audience — Senior Leaders</p>
              <h1 className="display-lg text-forest-950 mb-5">Strategic leadership at the point where it matters most.</h1>
              <p className="text-xl text-forest-800/70 leading-relaxed">Senior leaders operate at the intersection of strategy and execution, influencing across functions and preparing for the C-suite. We develop the capabilities that separate the good from the exceptional.</p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="section-padding" style={{ background: "var(--color-warm-white)" }}>
        <div className="container-content">
          <SectionHeading eyebrow="The Senior Leadership Challenge" title="From managing people to shaping direction." subtitle="Senior leaders are expected to operate with executive presence, navigate ambiguity, influence without authority, and build the culture below them. Few organizations equip them to do all four." className="mb-14" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { title: "Executive Presence Development", desc: "Build the gravitas, communication mastery, and leadership brand that enables senior leaders to influence at the highest levels." },
              { title: "Strategic Thinking", desc: "Move beyond operational excellence to the strategic thinking required to shape direction, allocate resources, and lead through uncertainty." },
              { title: "Cross-Functional Leadership", desc: "The hardest skill at the senior level: leading people who don't report to you. We build influence, coalition-building, and systems thinking." },
              { title: "Coaching for Senior Leaders", desc: "Intensive 1:1 coaching engagements that address the complex, nuanced challenges that only senior leaders face — including the loneliness at the top." },
              { title: "AI Strategy Literacy", desc: "Senior leaders must be able to evaluate AI opportunities, challenge AI recommendations, and lead AI adoption in their functions." },
              { title: "C-Suite Preparation", desc: "For high-potentials with C-suite trajectories, we run targeted programs that build the specific capabilities — board relationships, enterprise thinking, stakeholder management — required at the next level." },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="card-base card-light">
                <h3 className="font-700 text-navy-900 text-lg mb-3" style={{ fontWeight: 700 }}>{item.title}</h3>
                <p className="text-sm text-neutral-500 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <CTABanner headline="Develop the senior leaders who will define your next chapter." primaryLabel="Discuss Senior Leader Programs" primaryHref="/consultation" secondaryLabel="Explore Coaching" secondaryHref="/solutions/coaching" />
    </>
  )
}
