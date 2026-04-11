"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { SectionHeading } from "@/components/ui/SectionHeading"
import { CTABanner } from "@/components/sections/CTABanner"
import { FIRM_NAME } from "@/lib/constants"

const PARTNERSHIP_TYPES = [
  {
    title: "Coaching Partners",
    desc: "ICF-certified coaches who want to expand their practice through our delivery network. We match client needs with coach expertise, provide platform access, and support your practice with our methodology.",
    requirements: ["ICF PCC or MCC certification", "5+ years of executive coaching experience", "Commitment to our evidence-based methodology"],
    icon: "👤",
  },
  {
    title: "Institutional Partners",
    desc: "Universities, business schools, and research institutions who want to collaborate on leadership research, executive education, or thought leadership. We bring practitioners; you bring academic rigor.",
    requirements: ["Established leadership or management department", "Interest in applied research collaboration", "Executive education capability"],
    icon: "🏛️",
  },
  {
    title: "Technology Partners",
    desc: "HRIS, LMS, and talent management platform providers who want to integrate with our platform. We offer API access, co-marketing, and joint go-to-market opportunities.",
    requirements: ["Established enterprise HR or learning platform", "REST API capability", "Enterprise customer base"],
    icon: "⚙️",
  },
  {
    title: "Channel Partners",
    desc: "Management consulting firms, executive search companies, and HR advisory firms who want to offer our solutions to their clients. We provide training, support, and commercial terms.",
    requirements: ["Established client relationships in our target market", "Complementary service offering (not directly competitive)", "Commitment to quality standards"],
    icon: "🤝",
  },
]

export default function PartnersPage() {
  const [submitted, setSubmitted] = useState(false)
  const [partnerType, setPartnerType] = useState("")

  return (
    <>
      <section
        className="pt-40 pb-24"
        style={{ background: "linear-gradient(160deg, var(--color-forest-50) 0%, var(--color-warm-50) 100%)" }}
      >
        <div className="container-content">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-3xl">
            <p className="text-xs font-700 tracking-widest uppercase text-forest-600 mb-4" style={{ fontWeight: 700 }}>Partner With Us</p>
            <h1 className="display-lg text-forest-950 mb-5">Expand Your Impact. Join Our Network.</h1>
            <p className="text-xl text-forest-800/70 leading-relaxed">We partner with practitioners, institutions, and technology providers who share our commitment to exceptional leadership development. If that&apos;s you, let&apos;s talk.</p>
          </motion.div>
        </div>
      </section>

      {/* Partnership types */}
      <section className="section-padding" style={{ background: "var(--color-warm-white)" }}>
        <div className="container-content">
          <SectionHeading eyebrow="Partnership Types" title="Four ways to work together." className="mb-14" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PARTNERSHIP_TYPES.map((type, i) => (
              <motion.div
                key={type.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-2xl bg-white"
                style={{ border: "1px solid var(--color-warm-100)" }}
              >
                <div className="text-3xl mb-4">{type.icon}</div>
                <h3 className="font-700 text-navy-900 text-xl mb-3" style={{ fontWeight: 700 }}>{type.title}</h3>
                <p className="text-neutral-500 text-sm leading-relaxed mb-5">{type.desc}</p>
                <div>
                  <p className="text-xs font-700 tracking-widest uppercase text-neutral-400 mb-3" style={{ fontWeight: 700 }}>Requirements</p>
                  <ul className="space-y-2">
                    {type.requirements.map((req) => (
                      <li key={req} className="flex items-start gap-2 text-sm text-neutral-600">
                        <span className="text-gold-500 shrink-0 mt-0.5">◈</span>
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Application form */}
      <section className="section-padding" style={{ background: "white" }}>
        <div className="container-content max-w-2xl mx-auto">
          <SectionHeading eyebrow="Apply" title="Ready to partner with us?" subtitle="Tell us about yourself and what kind of partnership you have in mind. We review all applications and respond within 5 business days." className="mb-10" />

          {submitted ? (
            <div className="p-10 rounded-2xl text-center" style={{ background: "var(--color-warm-50)", border: "1px solid var(--color-warm-100)" }}>
              <div className="text-4xl mb-4">✓</div>
              <h3 className="font-700 text-navy-900 text-xl mb-2" style={{ fontWeight: 700 }}>Application received.</h3>
              <p className="text-neutral-500">We&apos;ll review your application and be in touch within 5 business days.</p>
            </div>
          ) : (
            <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); setSubmitted(true) }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: "Full Name *", placeholder: "Jane Smith" },
                  { label: "Email *", placeholder: "jane@company.com", type: "email" },
                  { label: "Organization *", placeholder: "Company or Institution" },
                  { label: "Website", placeholder: "https://..." },
                ].map((f) => (
                  <div key={f.label}>
                    <label className="block text-sm font-600 text-navy-900 mb-2" style={{ fontWeight: 600 }}>{f.label}</label>
                    <input type={f.type ?? "text"} placeholder={f.placeholder} required={f.label.includes("*")} className="w-full px-4 py-3 rounded-xl border border-warm-200 text-navy-900 placeholder-neutral-300 focus:outline-none focus:border-gold-500 transition-colors text-sm" />
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-sm font-600 text-navy-900 mb-2" style={{ fontWeight: 600 }}>Partnership Type *</label>
                <select required className="w-full px-4 py-3 rounded-xl border border-warm-200 text-navy-900 focus:outline-none focus:border-gold-500 transition-colors text-sm bg-white" onChange={(e) => setPartnerType(e.target.value)}>
                  <option value="">Select a partnership type...</option>
                  {PARTNERSHIP_TYPES.map((t) => <option key={t.title}>{t.title}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-600 text-navy-900 mb-2" style={{ fontWeight: 600 }}>Tell us about yourself and your interest</label>
                <textarea rows={5} placeholder="What makes you a good partner for us, and what do you hope to achieve through the partnership?" className="w-full px-4 py-3 rounded-xl border border-warm-200 text-navy-900 placeholder-neutral-300 focus:outline-none focus:border-gold-500 transition-colors text-sm resize-none" />
              </div>

              <button type="submit" className="btn btn-primary btn-lg w-full justify-center">Submit Application</button>
            </form>
          )}
        </div>
      </section>
    </>
  )
}
