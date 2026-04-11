"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { FIRM_NAME, FIRM_EMAIL, FIRM_PHONE } from "@/lib/constants"

const INQUIRY_TYPES = ["General Inquiry", "Solution Question", "Partnership", "Media", "Careers"]

const OFFICES = [
  { city: "New York", address: "1250 Avenue of the Americas, Suite 4200", country: "United States" },
  { city: "London", address: "One Canada Square, Canary Wharf", country: "United Kingdom" },
  { city: "Singapore", address: "8 Marina View, Asia Square Tower 1", country: "Singapore" },
]

export default function ContactPage() {
  const [inquiryType, setInquiryType] = useState("General Inquiry")
  const [submitted, setSubmitted] = useState(false)

  return (
    <>
      <section
        className="pt-40 pb-24"
        style={{ background: "linear-gradient(160deg, var(--color-navy-900) 0%, var(--color-navy-800) 100%)" }}
      >
        <div className="container-content">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-2xl">
            <p className="text-xs font-700 tracking-widest uppercase text-gold-400 mb-4" style={{ fontWeight: 700 }}>Get in Touch</p>
            <h1 className="display-lg text-white mb-5">Let&apos;s Talk.</h1>
            <p className="text-xl text-white/60 leading-relaxed">Whether you have a specific challenge, want to explore a partnership, or just want to understand what end-to-end leadership development could mean for your organization — we&apos;re here.</p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding" style={{ background: "white" }}>
        <div className="container-content">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
            {/* Contact form */}
            <div className="lg:col-span-3">
              {submitted ? (
                <div className="p-10 rounded-2xl text-center" style={{ background: "var(--color-warm-50)", border: "1px solid var(--color-warm-100)" }}>
                  <div className="text-4xl mb-4">✓</div>
                  <h3 className="font-700 text-navy-900 text-xl mb-2" style={{ fontWeight: 700 }}>Message received.</h3>
                  <p className="text-neutral-500">We&apos;ll be in touch within 24 hours.</p>
                </div>
              ) : (
                <form
                  className="space-y-5"
                  onSubmit={(e) => { e.preventDefault(); setSubmitted(true) }}
                >
                  {/* Inquiry type */}
                  <div>
                    <label className="block text-sm font-600 text-navy-900 mb-2" style={{ fontWeight: 600 }}>Inquiry Type</label>
                    <div className="flex flex-wrap gap-2">
                      {INQUIRY_TYPES.map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setInquiryType(type)}
                          className="px-4 py-2 rounded-full text-sm font-600 transition-all"
                          style={{
                            fontWeight: 600,
                            background: inquiryType === type ? "var(--color-gold-500)" : "var(--color-warm-100)",
                            color: inquiryType === type ? "var(--color-navy-900)" : "var(--color-neutral-600)",
                          }}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Name + Email */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { label: "Full Name", placeholder: "Jane Smith", type: "text" },
                      { label: "Email Address", placeholder: "jane@company.com", type: "email" },
                    ].map((field) => (
                      <div key={field.label}>
                        <label className="block text-sm font-600 text-navy-900 mb-2" style={{ fontWeight: 600 }}>{field.label}</label>
                        <input type={field.type} placeholder={field.placeholder} required className="w-full px-4 py-3 rounded-xl border border-warm-200 text-navy-900 placeholder-neutral-300 focus:outline-none focus:border-gold-500 transition-colors text-sm" />
                      </div>
                    ))}
                  </div>

                  {/* Company + Role */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { label: "Company", placeholder: "Acme Corporation" },
                      { label: "Your Role", placeholder: "Chief HR Officer" },
                    ].map((field) => (
                      <div key={field.label}>
                        <label className="block text-sm font-600 text-navy-900 mb-2" style={{ fontWeight: 600 }}>{field.label}</label>
                        <input type="text" placeholder={field.placeholder} className="w-full px-4 py-3 rounded-xl border border-warm-200 text-navy-900 placeholder-neutral-300 focus:outline-none focus:border-gold-500 transition-colors text-sm" />
                      </div>
                    ))}
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-600 text-navy-900 mb-2" style={{ fontWeight: 600 }}>Message</label>
                    <textarea required rows={5} placeholder="Tell us what you're working on..." className="w-full px-4 py-3 rounded-xl border border-warm-200 text-navy-900 placeholder-neutral-300 focus:outline-none focus:border-gold-500 transition-colors text-sm resize-none" />
                  </div>

                  <button type="submit" className="btn btn-primary btn-lg w-full justify-center">
                    Send Message
                  </button>

                  <p className="text-xs text-neutral-400 text-center">We respond within 24 hours. No automated responses — a human will reply.</p>
                </form>
              )}
            </div>

            {/* Contact info sidebar */}
            <div className="lg:col-span-2 space-y-6">
              <div className="p-6 rounded-2xl" style={{ background: "var(--color-warm-50)", border: "1px solid var(--color-warm-100)" }}>
                <p className="text-xs font-700 tracking-widest uppercase text-gold-600 mb-4" style={{ fontWeight: 700 }}>Direct Contact</p>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-neutral-400 mb-0.5">Email</p>
                    <a href={`mailto:${FIRM_EMAIL}`} className="text-navy-900 font-600 hover:text-gold-600 transition-colors" style={{ fontWeight: 600 }}>{FIRM_EMAIL}</a>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-400 mb-0.5">Phone</p>
                    <a href={`tel:${FIRM_PHONE}`} className="text-navy-900 font-600 hover:text-gold-600 transition-colors" style={{ fontWeight: 600 }}>{FIRM_PHONE}</a>
                  </div>
                  <div className="pt-3 border-t border-warm-100">
                    <p className="text-sm text-neutral-500">
                      <span className="text-navy-900 font-600" style={{ fontWeight: 600 }}>Response commitment:</span> We respond to all inquiries within 24 business hours.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-2xl" style={{ background: "var(--color-navy-900)", border: "1px solid rgba(193,154,91,0.12)" }}>
                <p className="text-xs font-700 tracking-widest uppercase text-gold-500 mb-5" style={{ fontWeight: 700 }}>Our Offices</p>
                <div className="space-y-5">
                  {OFFICES.map((office) => (
                    <div key={office.city}>
                      <p className="text-gold-400 font-700 text-sm" style={{ fontWeight: 700 }}>{office.city}</p>
                      <p className="text-white/50 text-xs leading-relaxed mt-1">{office.address}</p>
                      <p className="text-white/30 text-xs">{office.country}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
