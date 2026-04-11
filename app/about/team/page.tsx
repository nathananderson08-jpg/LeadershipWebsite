"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { SectionHeading } from "@/components/ui/SectionHeading"
import { Breadcrumbs } from "@/components/ui/Breadcrumbs"
import { Button } from "@/components/ui/Button"
import { TEAM_MEMBERS, ADVISORY_BOARD, FIRM_NAME } from "@/lib/constants"

export default function TeamPage() {
  return (
    <>
      {/* Hero */}
      <section
        className="pt-40 pb-24"
        style={{ background: "linear-gradient(160deg, var(--color-navy-900) 0%, var(--color-navy-800) 100%)" }}
      >
        <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(at 60% 30%, rgba(193,154,91,0.07) 0px, transparent 50%)" }} />
        <div className="container-content relative z-10">
          <Breadcrumbs crumbs={[{ label: "About", href: "/about" }, { label: "Leadership Team" }]} />
          <div className="max-w-3xl mt-8">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <p className="text-xs font-700 tracking-widest uppercase text-gold-400 mb-4" style={{ fontWeight: 700 }}>Our Team</p>
              <h1 className="display-lg text-white mb-5">World-class practitioners. A single, unified practice.</h1>
              <p className="text-xl text-white/60 leading-relaxed">
                Our team combines former executives, organizational psychologists, ICF master coaches, and AI strategists — all under one practice, one methodology, and one standard of excellence.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team grid */}
      <section className="section-padding" style={{ background: "var(--color-warm-white)" }}>
        <div className="container-content">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {TEAM_MEMBERS.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.5 }}
                className="bg-white rounded-2xl overflow-hidden border border-warm-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                {/* Placeholder avatar */}
                <div
                  className="h-48 flex items-center justify-center text-4xl font-800 text-white"
                  style={{
                    background: `linear-gradient(135deg, var(--color-navy-800) 0%, var(--color-navy-700) 100%)`,
                    fontWeight: 800,
                  }}
                >
                  {member.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </div>
                <div className="p-6">
                  <h3 className="font-700 text-navy-900 text-base mb-1" style={{ fontWeight: 700 }}>{member.name}</h3>
                  <p className="text-xs text-gold-600 font-600 mb-3 leading-snug" style={{ fontWeight: 600 }}>{member.title}</p>
                  <p className="text-sm text-neutral-500 leading-relaxed mb-4">{member.bio}</p>

                  {/* Specialization tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {member.specializations.map((spec) => (
                      <span
                        key={spec}
                        className="text-xs px-2 py-1 rounded-full"
                        style={{ background: "var(--color-warm-100)", color: "var(--color-navy-700)" }}
                      >
                        {spec}
                      </span>
                    ))}
                  </div>

                  {/* Credentials */}
                  <div className="border-t border-warm-100 pt-4 space-y-1">
                    {member.credentials.slice(0, 2).map((cred) => (
                      <p key={cred} className="text-xs text-neutral-400 flex items-start gap-1">
                        <span className="text-gold-500 shrink-0">◈</span>
                        {cred}
                      </p>
                    ))}
                  </div>

                  {/* LinkedIn */}
                  <a
                    href={member.linkedin}
                    className="inline-flex items-center gap-1 mt-4 text-xs text-navy-600 hover:text-gold-600 transition-colors font-600"
                    style={{ fontWeight: 600 }}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                    LinkedIn
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Advisory Board */}
      <section className="section-padding" style={{ background: "var(--color-navy-900)" }}>
        <div className="container-content">
          <SectionHeading eyebrow="Advisory Board" title="Guided by the best in the field." subtitle="Our advisory board brings decades of experience from the world's leading organizations, academic institutions, and government bodies." light className="mb-14" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {ADVISORY_BOARD.map((advisor, i) => (
              <motion.div
                key={advisor.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-700 text-white mb-4"
                  style={{ background: "rgba(193,154,91,0.15)", fontWeight: 700 }}
                >
                  {advisor.name.split(" ").filter(n => n[0] === n[0].toUpperCase() && n !== "Prof." && n !== "Dr." && n !== "Gen." && n !== "(Ret.)").map(n => n[0]).join("").slice(0, 2)}
                </div>
                <h3 className="font-700 text-white text-base mb-1" style={{ fontWeight: 700 }}>{advisor.name}</h3>
                <p className="text-xs text-gold-600 mb-3 leading-snug">{advisor.title}</p>
                <p className="text-xs text-white/40">{advisor.specialization}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Join CTA */}
      <section className="py-16" style={{ background: "var(--color-warm-50)" }}>
        <div className="container-content text-center">
          <h2 className="display-md text-navy-900 mb-4">Join Our Team</h2>
          <p className="text-lg text-neutral-600 mb-8 max-w-xl mx-auto">We&apos;re building the most exceptional leadership development practice in the world. If that excites you, we want to hear from you.</p>
          <Button href="/about/careers" variant="primary" size="lg">Explore Open Roles</Button>
        </div>
      </section>
    </>
  )
}
