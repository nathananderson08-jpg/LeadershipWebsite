"use client"

import { motion } from "framer-motion"
import { SectionHeading } from "@/components/ui/SectionHeading"
import { Button } from "@/components/ui/Button"
import { CTABanner } from "@/components/sections/CTABanner"
import { AIBadge } from "@/components/ui/AIBadge"
import { PLATFORM_NAME } from "@/lib/constants"

const PLATFORM_FEATURES = [
  {
    icon: "🔬",
    title: "Assessment Engine",
    desc: "Proprietary diagnostic tools that administer, score, and interpret psychometric instruments — then automatically generate development recommendations and coaching briefs.",
    techDetail: "360 reviews · Readiness evaluations · Psychometric scoring · Development plan generation",
  },
  {
    icon: "📚",
    title: "Learning Management",
    desc: "Program delivery, content distribution, cohort management, and progress tracking — with native support for blended, virtual, and in-person delivery.",
    techDetail: "Cohort management · Content delivery · Completion tracking · Facilitator tools",
  },
  {
    icon: "📊",
    title: "Analytics Dashboard",
    desc: "Real-time leadership development metrics for HR, L&D, and executive teams — from individual progress to enterprise-wide capability trends.",
    techDetail: "Real-time dashboards · Cohort analytics · ROI tracking · Executive reporting",
  },
  {
    icon: "🗺️",
    title: "Succession Mapping",
    desc: "Visual pipeline mapping, readiness tracking, succession scenario planning, and high-potential monitoring — with role-based access for HR and board use.",
    techDetail: "Pipeline visualization · Readiness ratings · Succession scenarios · Board reporting",
  },
  {
    icon: "🤖",
    title: "AI-Powered Insights",
    desc: "Predictive analytics that identify emerging leaders, flag retention risks, and surface capability gaps before they become organizational problems.",
    techDetail: "Predictive potential modeling · Retention risk signals · Capability gap analysis",
    featured: true,
  },
]

const INTEGRATIONS = [
  "Workday", "SAP SuccessFactors", "Oracle HCM", "Microsoft Teams", "Slack",
  "Cornerstone", "Degreed", "LinkedIn Learning", "Zoom", "Calendly",
]

export default function PlatformPage() {
  return (
    <>
      <section
        className="pt-40 pb-24 relative"
        style={{ background: "linear-gradient(160deg, var(--color-navy-900) 0%, var(--color-navy-800) 100%)" }}
      >
        <div
          className="absolute inset-0 opacity-30"
          style={{ backgroundImage: "radial-gradient(at 70% 30%, rgba(0,212,255,0.06) 0px, transparent 50%)" }}
        />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)", backgroundSize: "50px 50px" }}
        />
        <div className="container-content relative z-10">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-3xl">
            <p className="text-xs font-700 tracking-widest uppercase text-gold-400 mb-5" style={{ fontWeight: 700 }}>Our Platform</p>
            <h1 className="display-lg text-white mb-5">{PLATFORM_NAME}</h1>
            <p className="text-xl text-white/60 leading-relaxed">We&apos;re not just a consultancy. Our proprietary platform connects every phase of the leadership development lifecycle — from assessment to succession — in a single integrated system that no combination of vendors can replicate.</p>
          </motion.div>
        </div>
      </section>

      {/* Platform overview */}
      <section className="section-padding" style={{ background: "var(--color-warm-white)" }}>
        <div className="container-content">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <SectionHeading eyebrow="Why Technology Matters" title="The infrastructure that makes end-to-end possible." subtitle="Without technology, end-to-end leadership development is just a promise. Our platform is what turns the promise into reality — connecting data across phases, enabling scale, and surfacing insights that no human alone could find." align="left" />
              <div className="mt-8 space-y-4">
                {["Assessment data flows directly into coaching briefs — no manual handoff", "Development program progress updates succession readiness scores automatically", "AI surfaces potential signals before they become visible to human reviewers", "Analytics give HR and executives a single view of leadership capability across the organization"].map((point, i) => (
                  <div key={i} className="flex items-start gap-3 text-neutral-700">
                    <span className="text-gold-500 shrink-0 mt-0.5">✓</span>
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Mock platform UI */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="rounded-2xl overflow-hidden shadow-2xl"
              style={{ border: "1px solid rgba(255,255,255,0.1)" }}
            >
              <div className="p-3 flex items-center gap-2" style={{ background: "var(--color-navy-800)" }}>
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
                <span className="text-xs text-white/30 ml-2 font-mono">Leadership Intelligence Platform — Dashboard</span>
              </div>
              <div className="p-6" style={{ background: "var(--color-navy-950)" }}>
                {/* Mock metrics */}
                <div className="grid grid-cols-3 gap-3 mb-5">
                  {[{ v: "94%", l: "Engagement" }, { v: "87%", l: "Readiness" }, { v: "12", l: "Programs Active" }].map((m) => (
                    <div key={m.l} className="p-3 rounded-xl text-center" style={{ background: "rgba(255,255,255,0.04)" }}>
                      <div className="text-xl font-700 text-gold-400" style={{ fontWeight: 700 }}>{m.v}</div>
                      <div className="text-xs text-white/30">{m.l}</div>
                    </div>
                  ))}
                </div>
                {/* Mock pipeline visualization */}
                <div className="p-4 rounded-xl mb-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <p className="text-xs text-white/30 mb-3 font-mono">SUCCESSION PIPELINE — VP Engineering</p>
                  <div className="space-y-2">
                    {[{ name: "J.K.", ready: 90 }, { name: "A.M.", ready: 72 }, { name: "S.P.", ready: 58 }].map((p) => (
                      <div key={p.name} className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-navy-700 flex items-center justify-center text-xs text-white">{p.name}</div>
                        <div className="flex-1 h-1.5 rounded-full bg-white/5">
                          <div className="h-full rounded-full" style={{ width: `${p.ready}%`, background: p.ready > 80 ? "#00d4ff" : "var(--color-gold-500)" }} />
                        </div>
                        <span className="text-xs text-white/40">{p.ready}%</span>
                      </div>
                    ))}
                  </div>
                </div>
                {/* AI insight */}
                <div className="p-3 rounded-xl flex items-start gap-3" style={{ background: "rgba(0,212,255,0.05)", border: "1px solid rgba(0,212,255,0.1)" }}>
                  <AIBadge />
                  <p className="text-xs text-white/50">AI insight: J.K. is trending +15% readiness in 90 days. Consider acceleration.</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section-padding" style={{ background: "var(--color-navy-900)" }}>
        <div className="container-content">
          <SectionHeading eyebrow="Platform Features" title="Five integrated capabilities. One complete system." light className="mb-14" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {PLATFORM_FEATURES.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-7 rounded-2xl"
                style={
                  feature.featured
                    ? { background: "linear-gradient(135deg, rgba(0,212,255,0.07) 0%, rgba(0,212,255,0.03) 100%)", border: "1px solid rgba(0,212,255,0.18)" }
                    : { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }
                }
              >
                {feature.featured && <AIBadge className="mb-4" />}
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="font-700 text-white text-lg mb-3" style={{ fontWeight: 700 }}>{feature.title}</h3>
                <p className="text-sm text-white/55 leading-relaxed mb-4">{feature.desc}</p>
                <p className="text-xs font-mono" style={{ color: feature.featured ? "rgba(0,212,255,0.5)" : "rgba(255,255,255,0.2)" }}>
                  {feature.techDetail}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section className="py-16" style={{ background: "var(--color-warm-50)" }}>
        <div className="container-content">
          <p className="text-xs font-700 tracking-widest uppercase text-neutral-400 mb-8 text-center" style={{ fontWeight: 700 }}>Integrations</p>
          <div className="flex flex-wrap justify-center gap-3">
            {INTEGRATIONS.map((name) => (
              <span key={name} className="px-4 py-2 rounded-full bg-white border border-neutral-200 text-sm text-neutral-600 font-500" style={{ fontWeight: 500 }}>
                {name}
              </span>
            ))}
            <span className="px-4 py-2 rounded-full text-sm font-600 text-gold-600" style={{ fontWeight: 600 }}>+ API for custom integrations</span>
          </div>
        </div>
      </section>

      <CTABanner headline="See the platform in action." primaryLabel="Request a Demo" primaryHref="/consultation" secondaryLabel="Explore Solutions" secondaryHref="/solutions" />
    </>
  )
}
