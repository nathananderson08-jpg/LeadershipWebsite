"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { FIRM_NAME, LIFECYCLE_PHASES } from "@/lib/constants"

const SOLUTIONS_OPTIONS = [
  "Assessment & Diagnostics",
  "Executive Coaching",
  "Leadership Development Programs",
  "Team & Org Transformation",
  "Succession Planning",
  "AI Leadership Transformation",
  "Emerging Leaders Program",
  "Senior Leader Development",
  "C-Suite & Board Advisory",
  "Not sure yet",
]

const COMPANY_SIZES = ["1-100", "101-500", "501-2,000", "2,001-10,000", "10,000+"]

export default function ConsultationPage() {
  const [submitted, setSubmitted] = useState(false)
  const [selectedPhases, setSelectedPhases] = useState<string[]>([])
  const [selectedAudiences, setSelectedAudiences] = useState<string[]>([])

  const togglePhase = (id: string) =>
    setSelectedPhases((prev) => prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id])

  const toggleAudience = (id: string) =>
    setSelectedAudiences((prev) => prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id])

  return (
    <>
      {/* Hero */}
      <section
        className="pt-40 pb-20 relative"
        style={{ background: "linear-gradient(160deg, var(--color-navy-900) 0%, var(--color-navy-800) 100%)" }}
      >
        <div className="container-content">
          <div className="max-w-2xl">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <p className="text-xs font-700 tracking-widest uppercase text-gold-400 mb-4" style={{ fontWeight: 700 }}>Request a Consultation</p>
              <h1 className="display-lg text-white mb-5">Start Your Leadership Transformation.</h1>
              <ul className="space-y-2 text-white/60">
                {[
                  "A 60-minute strategy conversation with a senior practitioner",
                  "An initial assessment of your leadership development needs",
                  "A proposed approach tailored to your organization",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-lg">
                    <span className="text-gold-400 shrink-0 mt-0.5">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="section-padding" style={{ background: "var(--color-warm-white)" }}>
        <div className="container-content">
          <div className="max-w-3xl mx-auto">
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-12 rounded-2xl text-center bg-white"
                style={{ border: "1px solid var(--color-warm-100)" }}
              >
                <div className="text-6xl mb-5">✓</div>
                <h2 className="display-md text-navy-900 mb-3">Request received.</h2>
                <p className="text-neutral-500 text-lg mb-2">We&apos;ll reach out within 24 hours to schedule your consultation.</p>
                <p className="text-sm text-neutral-400">In the meantime, explore our <a href="/lifecycle" className="text-gold-600 hover:underline">lifecycle methodology</a> or browse our <a href="/insights" className="text-gold-600 hover:underline">insights</a>.</p>
              </motion.div>
            ) : (
              <form
                className="space-y-8"
                onSubmit={(e) => { e.preventDefault(); setSubmitted(true) }}
              >
                {/* Contact info */}
                <div className="p-8 rounded-2xl bg-white" style={{ border: "1px solid var(--color-warm-100)" }}>
                  <p className="font-700 text-navy-900 text-lg mb-6" style={{ fontWeight: 700 }}>Your Information</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { label: "Full Name *", placeholder: "Jane Smith" },
                      { label: "Job Title *", placeholder: "Chief HR Officer" },
                      { label: "Email Address *", placeholder: "jane@company.com", type: "email" },
                      { label: "Phone Number", placeholder: "+1 (212) 555-0100", type: "tel" },
                      { label: "Company Name *", placeholder: "Acme Global" },
                    ].map((field) => (
                      <div key={field.label} className={field.label === "Company Name *" ? "md:col-span-2" : ""}>
                        <label className="block text-sm font-600 text-navy-900 mb-2" style={{ fontWeight: 600 }}>{field.label}</label>
                        <input type={field.type ?? "text"} placeholder={field.placeholder} required={field.label.includes("*")} className="w-full px-4 py-3 rounded-xl border border-warm-200 text-navy-900 placeholder-neutral-300 focus:outline-none focus:border-gold-500 transition-colors text-sm" />
                      </div>
                    ))}
                    <div>
                      <label className="block text-sm font-600 text-navy-900 mb-2" style={{ fontWeight: 600 }}>Company Size</label>
                      <select className="w-full px-4 py-3 rounded-xl border border-warm-200 text-navy-900 focus:outline-none focus:border-gold-500 transition-colors text-sm bg-white">
                        <option value="">Select size...</option>
                        {COMPANY_SIZES.map((s) => <option key={s}>{s} employees</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Primary interest */}
                <div className="p-8 rounded-2xl bg-white" style={{ border: "1px solid var(--color-warm-100)" }}>
                  <p className="font-700 text-navy-900 text-lg mb-6" style={{ fontWeight: 700 }}>Primary Interest</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {SOLUTIONS_OPTIONS.map((opt) => (
                      <label key={opt} className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-warm-50 transition-colors">
                        <input type="radio" name="primary-interest" value={opt} className="accent-gold-500" />
                        <span className="text-sm text-navy-900">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Lifecycle phases */}
                <div className="p-8 rounded-2xl bg-white" style={{ border: "1px solid var(--color-warm-100)" }}>
                  <p className="font-700 text-navy-900 text-lg mb-2" style={{ fontWeight: 700 }}>Lifecycle Phases of Interest</p>
                  <p className="text-sm text-neutral-500 mb-5">Select all that apply</p>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {LIFECYCLE_PHASES.map((phase) => (
                      <button
                        key={phase.id}
                        type="button"
                        onClick={() => togglePhase(phase.id)}
                        className="p-3 rounded-xl text-center border transition-all text-sm"
                        style={{
                          background: selectedPhases.includes(phase.id) ? "var(--color-gold-500)" : "var(--color-warm-50)",
                          color: selectedPhases.includes(phase.id) ? "var(--color-navy-900)" : "var(--color-neutral-600)",
                          borderColor: selectedPhases.includes(phase.id) ? "var(--color-gold-500)" : "var(--color-warm-200)",
                          fontWeight: selectedPhases.includes(phase.id) ? 700 : 500,
                        }}
                      >
                        <span className="block text-xs mb-0.5 opacity-70">{phase.number}</span>
                        {phase.title}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Audience levels */}
                <div className="p-8 rounded-2xl bg-white" style={{ border: "1px solid var(--color-warm-100)" }}>
                  <p className="font-700 text-navy-900 text-lg mb-2" style={{ fontWeight: 700 }}>Audience Levels</p>
                  <p className="text-sm text-neutral-500 mb-5">Who are you developing?</p>
                  <div className="flex flex-wrap gap-3">
                    {["Emerging Leaders", "Mid-Level / Senior Leaders", "C-Suite", "Board Members", "All Levels"].map((aud) => (
                      <button
                        key={aud}
                        type="button"
                        onClick={() => toggleAudience(aud)}
                        className="px-4 py-2 rounded-full text-sm border transition-all"
                        style={{
                          background: selectedAudiences.includes(aud) ? "var(--color-gold-500)" : "transparent",
                          color: selectedAudiences.includes(aud) ? "var(--color-navy-900)" : "var(--color-neutral-600)",
                          borderColor: selectedAudiences.includes(aud) ? "var(--color-gold-500)" : "var(--color-warm-200)",
                          fontWeight: selectedAudiences.includes(aud) ? 700 : 500,
                        }}
                      >
                        {aud}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Description + contact method */}
                <div className="p-8 rounded-2xl bg-white" style={{ border: "1px solid var(--color-warm-100)" }}>
                  <p className="font-700 text-navy-900 text-lg mb-5" style={{ fontWeight: 700 }}>Tell Us More</p>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-600 text-navy-900 mb-2" style={{ fontWeight: 600 }}>Briefly describe your needs</label>
                      <textarea rows={4} placeholder="What are the leadership challenges you're trying to solve? What does success look like?" className="w-full px-4 py-3 rounded-xl border border-warm-200 text-navy-900 placeholder-neutral-300 focus:outline-none focus:border-gold-500 transition-colors text-sm resize-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-600 text-navy-900 mb-2" style={{ fontWeight: 600 }}>Preferred contact method</label>
                      <div className="flex gap-4">
                        {["Email", "Phone", "Video call"].map((method) => (
                          <label key={method} className="flex items-center gap-2 cursor-pointer text-sm text-neutral-700">
                            <input type="radio" name="contact-method" value={method} className="accent-gold-500" />
                            {method}
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <button type="submit" className="btn btn-primary btn-lg w-full justify-center">
                  Request My Consultation
                </button>
                <p className="text-xs text-neutral-400 text-center">We respond within 24 hours. No automated responses — a senior practitioner will reach out directly.</p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* What to expect */}
      <section className="py-16" style={{ background: "var(--color-navy-900)" }}>
        <div className="container-content max-w-3xl mx-auto">
          <p className="text-xs font-700 tracking-widest uppercase text-gold-500 mb-8 text-center" style={{ fontWeight: 700 }}>What to Expect</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { step: "01", title: "We reach out within 24 hours", desc: "A senior practitioner — not a sales person — will contact you to understand your needs." },
              { step: "02", title: "60-minute strategy conversation", desc: "We explore your challenges, priorities, and what success would look like for your organization." },
              { step: "03", title: "Tailored proposal", desc: "Within 5 business days, you receive a proposed approach specific to your needs." },
            ].map((step) => (
              <div key={step.step} className="text-center">
                <div className="text-2xl font-700 text-gold-400 mb-2" style={{ fontWeight: 700 }}>{step.step}</div>
                <h3 className="font-700 text-white text-base mb-2" style={{ fontWeight: 700 }}>{step.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
