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
                desc: "Intensive, confidential advisory for CEOs navigating the loneliest job in business. Strategy, culture, board relationships, AI transformation, and personal leadership — addressed with uncompromising candor.",
                premium: true,
              },
              {
                title: "Board Effectiveness",
                desc: "Individual board member leadership development, board team effectiveness, committee governance, and board succession planning — delivering both individual and collective improvement.",
                premium: false,
              },
              {
                title: "C-Suite Team Alignment",
                desc: "When the executive team is misaligned, the organization follows. We facilitate deep alignment work — not just off-sites, but systemic behavioral change at the team level.",
                premium: false,
              },
              {
                title: "CEO & Board Succession",
                desc: "The highest-stakes succession in any organization. We manage end-to-end CEO and C-suite succession planning with the confidentiality, rigor, and board-level sensitivity required.",
                premium: true,
              },
              {
                title: "Executive Transitions",
                desc: "Intensive onboarding and first-90-days coaching for new CEOs, incoming C-suite executives, and board members stepping into new responsibilities.",
                premium: false,
              },
              {
                title: "AI Strategy for the Boardroom",
                desc: "Board and C-suite AI literacy programs, governance frameworks, and strategy advisory — equipping the boardroom to oversee AI transformation with informed confidence.",
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
