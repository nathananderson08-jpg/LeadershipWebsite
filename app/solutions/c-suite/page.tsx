"use client"

import { motion } from "framer-motion"
import { SectionHeading } from "@/components/ui/SectionHeading"
import { Breadcrumbs } from "@/components/ui/Breadcrumbs"
import { Button } from "@/components/ui/Button"
import { CTABanner } from "@/components/sections/CTABanner"

export default function CSuitePage() {
  return (
    <>
      {/* Hero — premium, white-glove feel */}
      <section
        className="pt-40 pb-28 relative overflow-hidden"
        style={{ background: "linear-gradient(160deg, #05090f 0%, #0a0f1c 50%, #05090f 100%)" }}
      >
        <div
          className="absolute inset-0"
          style={{ backgroundImage: "radial-gradient(at 70% 30%, rgba(193,154,91,0.1) 0px, transparent 55%)" }}
        />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: "linear-gradient(rgba(193,154,91,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(193,154,91,0.5) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
        <div className="container-content relative z-10">
          <Breadcrumbs crumbs={[{ label: "Solutions", href: "/solutions" }, { label: "C-Suite & Board" }]} />
          <div className="max-w-3xl mt-8">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
              <p className="text-xs font-700 tracking-widest uppercase text-gold-400 mb-5" style={{ fontWeight: 700 }}>Audience — C-Suite & Board</p>
              <h1 className="display-lg text-white mb-6">
                Advisory at the level of{" "}
                <span style={{ color: "var(--color-gold-400)" }}>consequence.</span>
              </h1>
              <p className="text-xl leading-relaxed max-w-2xl" style={{ color: "rgba(255,255,255,0.55)" }}>
                At the C-suite and board level, the stakes are existential. We work with a select number of senior executives and directors — offering white-glove advisory, deep confidentiality, and the caliber of expertise the role demands.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="section-padding" style={{ background: "white" }}>
        <div className="container-content">
          <SectionHeading eyebrow="C-Suite & Board Services" title="The advisory that defines careers — and organizations." subtitle="We don't scale our C-suite practice to volume. We scale it to impact." className="mb-14" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: "CEO Advisory & Coaching",
                desc: "The CEO role is unlike any other — and the support required to perform it well is unlike any other coaching engagement. We work with a small number of CEOs at any one time, providing intensive advisory that spans the full scope of the role: strategic direction, organizational culture, board relationships, investor dynamics, AI transformation, and the personal leadership challenges that rarely surface in any formal setting. Our CEO engagements are built on uncompromising candor, deep confidentiality, and the kind of trusted partnership that allows a CEO to think out loud without consequence.",
                premium: true,
              },
              {
                title: "Board Effectiveness",
                desc: "Boards are asked to govern organizations through complexity they did not face when most governance frameworks were written — AI disruption, geopolitical volatility, ESG accountability, and an accelerating pace of strategic change. We work with individual board members on leadership development and contribution effectiveness, and with boards as a collective on team dynamics, governance practice, committee structure, and the interpersonal patterns that determine whether a board adds value or extracts it. Our board work is confidential, rigorous, and designed to produce measurable improvement in both individual contribution and collective performance.",
                premium: false,
              },
              {
                title: "C-Suite Team Alignment",
                desc: "The executive team is the most consequential team in any organization — and often the most dysfunctional. When C-suite leaders are misaligned on priorities, operating with unspoken tension, or avoiding the conversations that matter most, the dysfunction cascades through every layer below them. We facilitate deep C-suite alignment work that goes beyond the annual off-site: surfacing the real issues, building the psychological safety to address them, and creating the behavioral contracts and operating norms that allow the executive team to function as a genuine unit rather than a collection of functional leaders in the same room.",
                premium: false,
              },
              {
                title: "CEO & Board Succession",
                desc: "CEO succession is the highest-stakes decision a board makes — and the one most frequently handled with inadequate preparation, opaque criteria, and insufficient attention to internal candidate development. We work with boards and CHROs to design and manage end-to-end succession processes that are rigorous, transparent where appropriate, and structured to surface the right candidates rather than the most visible ones. Our succession engagements combine leadership assessment, structured development of internal finalists, external benchmarking, and board facilitation — carried out with the confidentiality and sensitivity the process demands.",
                premium: true,
              },
              {
                title: "Executive Transitions",
                desc: "The first ninety days of a new executive role are among the most consequential — and most poorly supported — in any leadership career. Research consistently shows that new executives who receive structured transition support outperform those who don't, yet most organizations rely on informal onboarding that leaves critical relationship-building, cultural navigation, and early priority-setting to chance. We provide intensive transition coaching for incoming CEOs, new C-suite executives, and board members assuming new responsibilities — accelerating time to effectiveness, reducing early missteps, and building the relational foundations that determine long-term success in the role.",
                premium: false,
              },
              {
                title: "AI Strategy for the Boardroom",
                desc: "Most boards are being asked to oversee AI transformation without the conceptual foundation to do it well — approving budgets, accepting risk frameworks, and engaging with management on AI strategy without the literacy to ask the right questions. We run board and C-suite AI programs that build genuine strategic fluency: not technical depth, but the judgment to evaluate AI investments, the governance frameworks to manage AI risk, and the strategic perspective to identify where AI creates durable competitive advantage versus where it creates expensive distraction. We also work directly with CEOs and CISOs on AI strategy advisory, providing an independent perspective on the opportunities and risks their organizations are navigating.",
                premium: false,
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="p-8 rounded-2xl"
                style={{
                  background: item.premium
                    ? "linear-gradient(135deg, var(--color-navy-950) 0%, var(--color-navy-900) 100%)"
                    : "var(--color-warm-50)",
                  border: item.premium
                    ? "1px solid rgba(193,154,91,0.2)"
                    : "1px solid var(--color-warm-100)",
                }}
              >
                {item.premium && (
                  <span
                    className="inline-block text-xs font-700 px-3 py-1 rounded-full mb-4 tracking-wider"
                    style={{ background: "rgba(193,154,91,0.15)", color: "var(--color-gold-400)", fontWeight: 700 }}
                  >
                    ◈ SIGNATURE SERVICE
                  </span>
                )}
                <h3 className={`font-700 text-xl mb-3 ${item.premium ? "text-white" : "text-navy-900"}`} style={{ fontWeight: 700 }}>
                  {item.title}
                </h3>
                <p className={`text-sm leading-relaxed ${item.premium ? "text-white/55" : "text-neutral-500"}`}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* White glove CTA */}
      <section className="py-20" style={{ background: "linear-gradient(135deg, var(--color-navy-900) 0%, var(--color-navy-950) 100%)" }}>
        <div className="container-content text-center max-w-2xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div
              className="w-16 h-px mx-auto mb-8"
              style={{ background: "linear-gradient(90deg, transparent, var(--color-gold-500), transparent)" }}
            />
            <h2 className="display-md text-white mb-5">The caliber of leadership at the top defines everything below it.</h2>
            <p className="text-lg mb-8" style={{ color: "rgba(255,255,255,0.5)" }}>
              We work with a limited number of C-suite clients at any time. Inquiries are treated with complete confidentiality.
            </p>
            <Button href="/consultation" variant="primary" size="lg">
              Request a Confidential Conversation
            </Button>
          </motion.div>
        </div>
      </section>
    </>
  )
}
