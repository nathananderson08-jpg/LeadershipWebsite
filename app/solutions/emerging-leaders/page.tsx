"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/Button"
import { SectionHeading } from "@/components/ui/SectionHeading"
import { Breadcrumbs } from "@/components/ui/Breadcrumbs"
import { CTABanner } from "@/components/sections/CTABanner"

export default function EmergingLeadersPage() {
  return (
    <>
      <section className="pt-40 pb-24" style={{ background: "linear-gradient(160deg, var(--color-forest-50) 0%, var(--color-warm-50) 100%)" }}>
        <div className="container-content">
          <Breadcrumbs crumbs={[{ label: "Solutions", href: "/solutions" }, { label: "Emerging Leaders" }]} />
          <div className="max-w-3xl mt-8">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <p className="text-xs font-700 tracking-widest uppercase text-forest-600 mb-4" style={{ fontWeight: 700 }}>Audience — Emerging Leaders</p>
              <h1 className="display-lg text-forest-950 mb-5">Great leadership starts with a strong foundation.</h1>
              <p className="text-xl text-forest-800/70 leading-relaxed">First-time managers and high-potential contributors face a defining transition. We give them the skills, mindset, and support to navigate it successfully.</p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="section-padding" style={{ background: "var(--color-warm-white)" }}>
        <div className="container-content">
          <SectionHeading eyebrow="The First Leadership Transition" title="The leap from individual contributor to leader is the hardest one." subtitle="Research shows that 60% of new managers fail within the first two years — not because they lack technical skills, but because nobody invested in their leadership development." className="mb-14" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { title: "Assessment-Based Development", desc: "Every emerging leader starts with a rigorous diagnostic — a 360-degree leadership assessment, strengths profiling, and style inventory that reveals not just where they are today, but where the most important development opportunities lie. We use this data to personalize their journey from day one, ensuring every learning investment targets what will have the greatest impact on their effectiveness as a leader." },
              { title: "Cohort-Based Learning", desc: "Emerging leaders learn best alongside peers who are navigating the same challenges — the first difficult performance conversation, the shift from doing to directing, the discomfort of leading people who were once colleagues. Our cohort programs are designed to make these shared experiences explicit, creating the psychological safety for honest dialogue, peer accountability, and networks that last far beyond the program itself." },
              { title: "Manager Effectiveness", desc: "The transition from individual contributor to manager is one of the most misunderstood shifts in any career. The technical expertise that drove their promotion is often irrelevant to what they now need — and may even work against them. We build the foundational manager capabilities deliberately: giving feedback, holding people accountable, delegating effectively, having hard conversations, and creating clarity and direction for a team." },
              { title: "Coaching Integration", desc: "Group learning creates breadth; coaching creates depth. We embed individual and group coaching directly into our emerging leader programs, giving every participant dedicated reflection time with a qualified coach. These sessions address the personal blockers, identity shifts, and mindset challenges that no classroom curriculum can reach — ensuring that insight translates into sustained behavioral change on the job." },
              { title: "AI Fluency for the Next Generation", desc: "Tomorrow's managers will operate in an AI-augmented workplace that doesn't yet fully exist — and they need to be ready for it. Our AI fluency curriculum goes beyond basic tool literacy: we develop the judgment to evaluate AI outputs critically, the adaptability to evolve workflows as AI capabilities change, and the leadership skills to manage teams where AI is a genuine collaborator. These capabilities are no longer optional for the next generation of leaders." },
              { title: "Pipeline Connection", desc: "Emerging leader programs are most valuable when they're designed as the first step of a longer journey, not a standalone event. We build our programs with the full leadership lifecycle in mind — explicitly connecting emerging leader development to senior leader readiness, succession pipelines, and organizational capability strategy. Every program we deliver answers the question: what does this leader need to be ready for next?" },
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
