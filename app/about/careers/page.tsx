"use client"

import { useState, useEffect } from "react"
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

interface OpenRole {
  id: string
  title: string
  department: string
  location: string
  type: string
  description?: string
}

export default function CareersPage() {
  const [openRoles, setOpenRoles] = useState<OpenRole[]>([])

  useEffect(() => {
    fetch('/api/careers/roles')
      .then(r => r.json())
      .then(d => setOpenRoles(d.roles ?? []))
      .catch(() => {})
  }, [])

  return (
    <>
      <section
        className="pt-40 pb-24"
        style={{ background: "linear-gradient(160deg, var(--color-forest-50) 0%, var(--color-warm-50) 100%)" }}
      >
        <div className="container-content">
          <Breadcrumbs crumbs={[{ label: "About", href: "/about" }, { label: "Careers" }]} />
          <div className="max-w-3xl mt-8">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <p className="text-xs font-700 tracking-widest uppercase text-forest-600 mb-4" style={{ fontWeight: 700 }}>Careers</p>
              <h1 className="display-lg text-forest-950 mb-5">Join the Team Redefining Leadership Development.</h1>
              <p className="text-xl text-forest-800/70 leading-relaxed">We&apos;re building the world&apos;s only end-to-end leadership development firm. If you want to do the best work of your career alongside people who set the standard — read on.</p>
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
      <section className="py-16" style={{ background: "var(--color-forest-100)" }}>
        <div className="container-content">
          <p className="text-xs font-700 tracking-widest uppercase text-forest-600 mb-8 text-center" style={{ fontWeight: 700 }}>Benefits</p>
          <div className="flex flex-wrap gap-4 justify-center">
            {["Competitive compensation", "Flexible & remote-first", "Professional certification support (ICF, HOGAN, etc.)", "Meaningful client work from day one", "Access to leading researchers & practitioners"].map((benefit) => (
              <span key={benefit} className="px-5 py-2.5 rounded-full text-sm font-600 text-forest-800 bg-white border border-forest-200" style={{ fontWeight: 600 }}>
                ✓ {benefit}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Open Roles */}
      <section className="section-padding" style={{ background: "white" }}>
        <div className="container-content">
          <SectionHeading eyebrow="Open Roles" title="Current opportunities" subtitle="We hire for permanent and contractor roles. Explore our current openings — or reach out if you don't see your role listed." className="mb-14" />
          {openRoles.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-neutral-400">No open roles listed at the moment. Check back soon — or send a speculative application below.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {openRoles.map((role, i) => (
                <motion.div
                  key={role.id}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-xl hover:bg-warm-50 transition-colors cursor-pointer group"
                  style={{ border: "1px solid var(--color-warm-100)" }}
                >
                  <div>
                    <h3 className="font-700 text-navy-900 text-lg mb-1 group-hover:text-gold-700 transition-colors" style={{ fontWeight: 700 }}>{role.title}</h3>
                    <div className="flex items-center gap-3 text-sm text-neutral-400 flex-wrap">
                      <span>{role.department}</span>
                      <span>·</span>
                      <span>{role.location}</span>
                      <span>·</span>
                      <span>{role.type}</span>
                    </div>
                    {role.description && <p className="text-sm text-neutral-500 mt-2 max-w-xl">{role.description}</p>}
                  </div>
                  <Button variant="secondary" size="sm">Apply →</Button>
                </motion.div>
              ))}
            </div>
          )}
          <div className="mt-10 p-8 rounded-2xl text-center" style={{ background: "var(--color-warm-50)", border: "1px solid var(--color-warm-100)" }}>
            <p className="font-700 text-navy-900 mb-2" style={{ fontWeight: 700 }}>Don&apos;t see your role?</p>
            <p className="text-neutral-500 text-sm mb-5">We work with full-time employees and specialist contractors. If you believe you can contribute to our mission, we want to hear from you.</p>
            <Button href="mailto:careers@leadershipfirm.com" variant="primary">Send a Speculative Application</Button>
          </div>
        </div>
      </section>
    </>
  )
}
