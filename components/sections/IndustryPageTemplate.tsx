"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { SectionHeading } from "@/components/ui/SectionHeading"
import { Breadcrumbs } from "@/components/ui/Breadcrumbs"
import { CTABanner } from "./CTABanner"

interface IndustryPageProps {
  industryName: string
  heroTitle: string
  heroSubtitle: string
  challenges: { title: string; desc: string }[]
  lifecycleApplication: { phase: string; detail: string }[]
  insights: { title: string; category: string }[]
  keyword: string
}

export function IndustryPageTemplate({
  industryName,
  heroTitle,
  heroSubtitle,
  challenges,
  lifecycleApplication,
  insights,
  keyword,
}: IndustryPageProps) {
  return (
    <>
      <section
        className="pt-40 pb-24 relative"
        style={{ background: "linear-gradient(160deg, var(--color-forest-50) 0%, var(--color-warm-50) 100%)" }}
      >
        <div className="container-content relative z-10">
          <Breadcrumbs crumbs={[{ label: "Industries", href: "/industries" }, { label: industryName }]} />
          <div className="max-w-3xl mt-8">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <p className="text-xs font-700 tracking-widest uppercase text-forest-600 mb-4" style={{ fontWeight: 700 }}>{industryName}</p>
              <h1 className="display-lg text-forest-950 mb-5">{heroTitle}</h1>
              <p className="text-xl text-forest-800/70 leading-relaxed">{heroSubtitle}</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Leadership challenges */}
      <section className="section-padding" style={{ background: "var(--color-warm-white)" }}>
        <div className="container-content">
          <SectionHeading
            eyebrow={`${industryName} Leadership Challenges`}
            title={`The leadership pressures unique to ${industryName}.`}
            className="mb-14"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {challenges.map((c, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card-base card-light"
              >
                <h3 className="font-700 text-navy-900 text-lg mb-2" style={{ fontWeight: 700 }}>{c.title}</h3>
                <p className="text-neutral-500 text-sm leading-relaxed">{c.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lifecycle application */}
      <section className="section-padding" style={{ background: "var(--color-forest-100)" }}>
        <div className="container-content">
          <SectionHeading
            eyebrow="Our Lifecycle Approach"
            title={`How our lifecycle serves ${industryName}.`}
            subtitle={`We apply the full leadership development lifecycle to the specific context of ${industryName} — adapting every phase to your sector's challenges.`}
            className="mb-14"
          />
          <div className="space-y-4">
            {lifecycleApplication.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col md:flex-row md:items-start gap-5 p-6 rounded-2xl bg-white"
                style={{ border: "1px solid var(--color-forest-200)" }}
              >
                <span
                  className="text-xs font-700 px-4 py-1.5 rounded-full shrink-0 tracking-wider"
                  style={{ background: "var(--color-forest-100)", color: "var(--color-forest-700)", fontWeight: 700 }}
                >
                  {item.phase}
                </span>
                <p className="text-sm text-forest-700 leading-relaxed">{item.detail}</p>
              </motion.div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Button href="/lifecycle" variant="primary">
              Explore the Full Lifecycle →
            </Button>
          </div>
        </div>
      </section>

      {/* Insights preview */}
      {insights.length > 0 && (
        <section className="section-padding" style={{ background: "var(--color-warm-white)" }}>
          <div className="container-content">
            <SectionHeading eyebrow="Relevant Insights" title={`Leadership thinking for ${industryName}.`} className="mb-12" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {insights.map((insight, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="card-base card-light"
                >
                  <span
                    className="inline-block text-xs font-700 px-3 py-1 rounded-full mb-4"
                    style={{ background: "var(--color-gold-100)", color: "var(--color-gold-700)", fontWeight: 700 }}
                  >
                    {insight.category}
                  </span>
                  <h3 className="font-700 text-navy-900 leading-snug" style={{ fontWeight: 700 }}>{insight.title}</h3>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      <CTABanner
        headline={`Ready to develop leaders for ${industryName}?`}
        primaryLabel="Request a Consultation"
        primaryHref="/consultation"
        secondaryLabel="Explore Solutions"
        secondaryHref="/solutions"
      />
    </>
  )
}
