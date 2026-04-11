"use client"

import { motion } from "framer-motion"
import { SectionHeading } from "@/components/ui/SectionHeading"
import { Breadcrumbs } from "@/components/ui/Breadcrumbs"
import { Button } from "@/components/ui/Button"
import { FIRM_NAME } from "@/lib/constants"

const VALUES = [
  { title: "Intellectual Rigor", desc: "We believe great leadership development is a science as much as an art. We hold ourselves to the highest standards of evidence, expertise, and continuous improvement." },
  { title: "Practitioner Excellence", desc: "We are practitioners first. We don't sell what we don't do. Every member of our team works at the leading edge of their domain — and proves it every day." },
  { title: "Integrated Thinking", desc: "The best insight often comes from across the lifecycle. We think in systems, not silos — and we hire people who do the same." },
  { title: "Ambitious Impact", desc: "We exist to change how organizations develop leaders — and to create measurable, lasting impact in the people and organizations we work with. We don't do incremental." },
]

const OPEN_ROLES = [
  { title: "Executive Coach (ICF PCC or MCC)", department: "Coaching Practice", location: "Remote — Global", type: "Full-time" },
  { title: "Senior Associate — Assessment Practice", department: "Assessment", location: "New York / London", type: "Full-time" },
  { title: "Program Design Lead", department: "Learning & Development", location: "Remote — Americas", type: "Full-time" },
  { title: "AI Leadership Consultant", department: "AI Transformation", location: "Remote — Global", type: "Full-time" },
  { title: "Head of Client Success", department: "Client Partnerships", location: "New York", type: "Full-time" },
  { title: "Associate Consultant — Organizational Transformation", department: "Transformation", location: "London / New York", type: "Full-time" },
]

export default function CareersPage() {
  return (
    <>
      <section
        className="pt-40 pb-24"
        style={{ background: "linear-gradient(160deg, var(--color-navy-900) 0%, var(--color-navy-800) 100%)" }}
      >
        <div className="container-content">
          <Breadcrumbs crumbs={[{ label: "About", href: "/about" }, { label: "Careers" }]} />
          <div className="max-w-3xl mt-8">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <p className="text-xs font-700 tracking-widest uppercase text-gold-400 mb-4" style={{ fontWeight: 700 }}>Careers</p>
              <h1 className="display-lg text-white mb-5">Join the Team Redefining Leadership Development.</h1>
              <p className="text-xl text-white/60 leading-relaxed">We&apos;re building the world&apos;s only end-to-end leadership development firm. If you want to do the best work of your career alongside people who set the standard — read on.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding" style={{ background: "var(--color-warm-white)" }}>
        <div className="container-content">
          <SectionHeading eyebrow="How We Work" title="Culture built on craft." subtitle="We hire slowly, develop deliberately, and build a culture where the best work in leadership development can happen." className="mb-14" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {VALUES.map((v, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="card-base card-light">
                <h3 className="font-700 text-navy-900 text-xl mb-3" style={{ fontWeight: 700 }}>{v.title}</h3>
                <p className="text-neutral-600 leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16" style={{ background: "var(--color-navy-900)" }}>
        <div className="container-content">
          <p className="text-xs font-700 tracking-widest uppercase text-gold-500 mb-8 text-center" style={{ fontWeight: 700 }}>Benefits</p>
          <div className="flex flex-wrap gap-4 justify-center">
            {["Competitive compensation + equity", "Flexible & remote-first", "Professional certification support (ICF, HOGAN, etc.)", "Annual learning & development budget", "Global team retreats", "Health & wellbeing benefits", "Meaningful client work from day one", "Access to leading researchers & practitioners"].map((benefit) => (
              <span key={benefit} className="px-5 py-2.5 rounded-full text-sm font-600 text-white/80 bg-white/5 border border-white/10" style={{ fontWeight: 600 }}>
                ✓ {benefit}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Open Roles */}
      <section className="section-padding" style={{ background: "white" }}>
        <div className="container-content">
          <SectionHeading eyebrow="Open Roles" title="Current opportunities" subtitle="We're growing. Explore our current openings — or reach out if you don't see your role listed." className="mb-14" />
          <div className="space-y-3">
            {OPEN_ROLES.map((role, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-xl hover:bg-warm-50 transition-colors cursor-pointer group"
                style={{ border: "1px solid var(--color-warm-100)" }}
              >
                <div>
                  <h3 className="font-700 text-navy-900 text-lg mb-1 group-hover:text-gold-700 transition-colors" style={{ fontWeight: 700 }}>{role.title}</h3>
                  <div className="flex items-center gap-3 text-sm text-neutral-400">
                    <span>{role.department}</span>
                    <span>·</span>
                    <span>{role.location}</span>
                    <span>·</span>
                    <span>{role.type}</span>
                  </div>
                </div>
                <Button variant="secondary" size="sm">Apply →</Button>
              </motion.div>
            ))}
          </div>
          <div className="mt-10 p-8 rounded-2xl text-center" style={{ background: "var(--color-warm-50)", border: "1px solid var(--color-warm-100)" }}>
            <p className="font-700 text-navy-900 mb-2" style={{ fontWeight: 700 }}>Don&apos;t see your role?</p>
            <p className="text-neutral-500 text-sm mb-5">If you believe you can contribute to our mission, we want to hear from you. Send your CV and a note about what you&apos;d bring.</p>
            <Button href="mailto:careers@leadershipfirm.com" variant="primary">Send a Speculative Application</Button>
          </div>
        </div>
      </section>
    </>
  )
}
