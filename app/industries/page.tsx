"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { SectionHeading } from "@/components/ui/SectionHeading"
import { CTABanner } from "@/components/sections/CTABanner"
import { INDUSTRIES } from "@/lib/constants"

const INDUSTRY_DETAILS = [
  { href: "/industries/financial-services", description: "Regulatory complexity, talent competition, and AI disruption demand leaders who can navigate risk while driving transformation." },
  { href: "/industries/technology", description: "Fast-paced product cycles, distributed teams, and AI-native business models require leaders built for constant change." },
  { href: "/industries/healthcare", description: "Mission-critical decisions, burnout crisis, and digital health transformation demand exceptional leadership at every level." },
  { href: "/industries/manufacturing", description: "Operational excellence, workforce transformation, and Industry 4.0 require leaders who can lead both machines and people." },
  { href: "/industries/energy", description: "Energy transition, ESG pressure, and operational complexity require leaders who can navigate disruption without losing execution." },
  { href: "/industries/government", description: "Public trust, workforce engagement, and digital government transformation demand leadership built for the public interest." },
  { href: "/industries/professional-services", description: "Law, consulting, accounting, and advisory firms face unique leadership challenges: developing partners, retaining talent, and managing client-facing cultures at every level." },
  { href: "/industries/education", description: "From K-12 to research universities, educational institutions need leaders who can inspire faculty, navigate governance complexity, and lead through continuous change." },
  { href: "/industries/retail", description: "Omnichannel transformation, customer experience demands, and high-turnover workforces require retail leaders who can execute at speed and build culture at scale." },
  { href: "/industries/nonprofit", description: "Mission-driven organizations need leaders who can mobilize volunteers, manage constrained resources, and build stakeholder trust — while staying true to purpose." },
  { href: "/industries/life-sciences", description: "Regulated, high-stakes, and innovation-driven — life sciences organizations need leaders who can balance scientific rigor with commercial execution and regulatory accountability." },
  { href: "/industries/hospitality", description: "Guest experience, frontline leadership, and high-volume people management make hospitality one of the most demanding sectors for leadership development at scale." },
]

export default function IndustriesPage() {
  return (
    <>
      <section
        className="pt-40 pb-24"
        style={{ background: "linear-gradient(160deg, var(--color-forest-50) 0%, var(--color-warm-50) 100%)" }}
      >
        <div className="container-content">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-3xl">
            <p className="text-xs font-700 tracking-widest uppercase text-forest-600 mb-5" style={{ fontWeight: 700 }}>Industries</p>
            <h1 className="display-lg text-forest-950 mb-5">Leadership challenges are universal. Industry context is not.</h1>
            <p className="text-xl text-forest-800/70 leading-relaxed">Our lifecycle methodology adapts to the specific pressures, regulatory environments, and cultural norms of your sector — because great leadership development is always contextual.</p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding" style={{ background: "var(--color-warm-white)" }}>
        <div className="container-content">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {INDUSTRIES.map((industry, i) => {
              const detail = INDUSTRY_DETAILS.find((d) => d.href === industry.href)
              return (
                <motion.div
                  key={industry.href}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                >
                  <Link
                    href={industry.href}
                    className="block h-full p-8 rounded-2xl bg-white border border-warm-100 hover:border-gold-300 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
                  >
                    <h3 className="font-700 text-navy-900 text-xl mb-3 group-hover:text-gold-700 transition-colors" style={{ fontWeight: 700 }}>
                      {industry.title}
                    </h3>
                    <p className="text-sm text-neutral-500 leading-relaxed mb-5">
                      {detail?.description ?? "Industry-specific leadership development tailored to your sector's challenges."}
                    </p>
                    <span className="text-sm font-600 text-gold-600 flex items-center gap-1" style={{ fontWeight: 600 }}>
                      Explore →
                    </span>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      <CTABanner headline="Tell us about your industry — we'll show you the lifecycle." />
    </>
  )
}
