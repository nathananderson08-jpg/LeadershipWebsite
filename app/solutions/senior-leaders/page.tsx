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
              { title: "Executive Presence Development", desc: "Presence at the senior level is not about polish — it's about conviction, clarity, and the ability to command a room without dominating it. We work with senior leaders on the full presence portfolio: the way they communicate under pressure, how they show up in the boardroom, the narrative they've built around their leadership brand, and the gravitas that makes others want to follow. This is a deeply personal and often confronting piece of work — and one of the highest-leverage investments a senior leader can make." },
              { title: "Strategic Thinking", desc: "Most senior leaders got to their level by executing well. The next level requires something different: the ability to zoom out, see across the full system, identify where the real leverage is, and make consequential decisions with incomplete information. We develop strategic thinking through a combination of frameworks, case-based learning, and direct application to the challenges each leader is actually facing — building the mental models that separate operators from strategists." },
              { title: "Cross-Functional Leadership", desc: "At the senior level, the most important work happens across boundaries — between functions, business units, geographies, and stakeholder groups where you have influence but no direct authority. We develop the coalition-building skills, the systems thinking, the stakeholder management, and the political intelligence that make senior leaders effective across the full enterprise. This is consistently rated as the highest-priority development area by our senior leader clients." },
              { title: "Coaching for Senior Leaders", desc: "Senior leaders face challenges that cannot be addressed in group settings — the relationship with a peer that's deteriorated, the direct report who is underperforming in ways that implicate the leader, the board dynamic that's creating anxiety, the question of whether this is still the right role. Our coaching engagements for senior leaders are intensive, deeply confidential, and built around the actual complexity of their situations — not a generic leadership framework applied from a distance." },
              { title: "AI Strategy Literacy", desc: "Senior leaders are being asked to sponsor AI initiatives they don't fully understand, evaluate AI-driven recommendations they can't interrogate, and lead organizations through a transformation that is moving faster than any training catalog can track. We build the strategic AI literacy that senior leaders actually need: the ability to ask the right questions, identify where AI creates genuine organizational leverage, manage the change that AI adoption requires, and lead with informed confidence rather than delegated anxiety." },
              { title: "C-Suite Preparation", desc: "The gap between senior leader and C-suite executive is wider than most organizations acknowledge — and fewer leaders cross it successfully than the pipeline would suggest. For high-potentials with a credible C-suite trajectory, we run targeted preparation programs that build the specific capabilities the next level demands: enterprise-wide thinking, board and investor relationships, stakeholder management at scale, and the personal resilience required to operate at the top of an organization under sustained scrutiny." },
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
