"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/Button"
import { SectionHeading } from "@/components/ui/SectionHeading"
import { Breadcrumbs } from "@/components/ui/Breadcrumbs"
import { CTABanner } from "@/components/sections/CTABanner"

export default function EmergingLeadersPage() {
  return (
    <>
      <section className="pt-40 pb-24" style={{ background: "linear-gradient(160deg, var(--color-navy-900) 0%, var(--color-navy-800) 100%)" }}>
        <div className="container-content">
          <Breadcrumbs crumbs={[{ label: "Solutions", href: "/solutions" }, { label: "Emerging Leaders" }]} />
          <div className="max-w-3xl mt-8">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <p className="text-xs font-700 tracking-widest uppercase text-gold-400 mb-4" style={{ fontWeight: 700 }}>Audience — Emerging Leaders</p>
              <h1 className="display-lg text-white mb-5">Great leadership starts with a strong foundation.</h1>
              <p className="text-xl text-white/60 leading-relaxed">First-time managers and high-potential contributors face a defining transition. We give them the skills, mindset, and support to navigate it successfully.</p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="section-padding" style={{ background: "var(--color-warm-white)" }}>
        <div className="container-content">
          <SectionHeading eyebrow="The First Leadership Transition" title="The leap from individual contributor to leader is the hardest one." subtitle="Research shows that 60% of new managers fail within the first two years — not because they lack technical skills, but because nobody invested in their leadership development." className="mb-14" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { title: "Assessment-Based Development", desc: "We start by understanding where each emerging leader is — their strengths, development edges, and leadership style — and design from there." },
              { title: "Cohort-Based Learning", desc: "Emerging leaders learn best with peers who share the same challenges. Our cohort programs build networks and accountability that outlast the program." },
              { title: "Manager Effectiveness", desc: "The skills that made them great individual contributors are not the skills that will make them great managers. We build the new skills deliberately." },
              { title: "Coaching Integration", desc: "Group coaching embedded in our programs gives every emerging leader individual attention alongside the cohort experience." },
              { title: "AI Fluency for the Next Generation", desc: "We prepare emerging leaders to thrive in an AI-augmented workplace — building the literacy and adaptability the future will demand." },
              { title: "Pipeline Connection", desc: "Our emerging leader programs are designed with the full leadership lifecycle in mind — preparing today's first-time managers to become tomorrow's senior leaders." },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="card-base card-light">
                <h3 className="font-700 text-navy-900 text-lg mb-3" style={{ fontWeight: 700 }}>{item.title}</h3>
                <p className="text-sm text-neutral-500 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <CTABanner headline="Invest in your emerging leaders before your competitors do." primaryLabel="Discuss Emerging Leader Programs" primaryHref="/consultation" secondaryLabel="Explore Development Programs" secondaryHref="/solutions/programs" />
    </>
  )
}
