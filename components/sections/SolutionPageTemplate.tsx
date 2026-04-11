"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { SectionHeading } from "@/components/ui/SectionHeading"
import { Breadcrumbs } from "@/components/ui/Breadcrumbs"
import { CTABanner } from "./CTABanner"
import { LIFECYCLE_PHASES } from "@/lib/constants"

interface Feature {
  icon: string
  title: string
  description: string
}

interface EngagementModel {
  title: string
  description: string
}

interface RelatedSolution {
  title: string
  href: string
  phase: string
}

interface SolutionPageProps {
  breadcrumb: string
  phase: string
  phaseIndex: number // 0-based index into LIFECYCLE_PHASES
  heroTitle: string
  heroSubtitle: string
  challengeTitle: string
  challengeBody: string
  challengePoints: string[]
  approachTitle: string
  approachBody: string
  features: Feature[]
  audiences: string[]
  engagementModels: EngagementModel[]
  relatedSolutions: RelatedSolution[]
  ctaHeadline: string
}

export function SolutionPageTemplate({
  breadcrumb,
  phase,
  phaseIndex,
  heroTitle,
  heroSubtitle,
  challengeTitle,
  challengeBody,
  challengePoints,
  approachTitle,
  approachBody,
  features,
  audiences,
  engagementModels,
  relatedSolutions,
  ctaHeadline,
}: SolutionPageProps) {
  return (
    <>
      {/* Hero */}
      <section
        className="pt-40 pb-24 relative"
        style={{ background: "linear-gradient(160deg, var(--color-navy-900) 0%, var(--color-navy-800) 100%)" }}
      >
        <div
          className="absolute inset-0 opacity-50"
          style={{ backgroundImage: "radial-gradient(at 60% 30%, rgba(193,154,91,0.08) 0px, transparent 50%)" }}
        />
        <div className="container-content relative z-10">
          <Breadcrumbs crumbs={[{ label: "Solutions", href: "/solutions" }, { label: breadcrumb }]} />
          <div className="max-w-3xl mt-8">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="text-xs font-700 tracking-widest uppercase text-gold-400 mb-4" style={{ fontWeight: 700 }}>
                {phase}
              </p>
              <h1 className="display-lg text-white mb-5">{heroTitle}</h1>
              <p className="text-xl text-white/60 leading-relaxed">{heroSubtitle}</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* The Challenge */}
      <section className="section-padding" style={{ background: "var(--color-warm-white)" }}>
        <div className="container-content">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-xs font-700 tracking-widest uppercase text-gold-600 mb-4" style={{ fontWeight: 700 }}>
                The Challenge
              </p>
              <h2 className="display-md text-navy-900 mb-5">{challengeTitle}</h2>
              <p className="text-neutral-600 leading-relaxed text-lg">{challengeBody}</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15, duration: 0.6 }}
              className="space-y-3"
            >
              {challengePoints.map((point, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 p-5 rounded-xl"
                  style={{ background: "white", border: "1px solid var(--color-warm-100)" }}
                >
                  <span className="text-gold-500 text-lg shrink-0">◈</span>
                  <p className="text-neutral-700">{point}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Approach */}
      <section className="section-padding" style={{ background: "var(--color-navy-900)" }}>
        <div className="container-content">
          <div className="max-w-3xl mx-auto text-center mb-14">
            <SectionHeading
              eyebrow="Our Approach"
              title={approachTitle}
              subtitle={approachBody}
              light
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="card-dark card-base p-7 group"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-5"
                  style={{ background: "rgba(193,154,91,0.1)" }}
                >
                  {feature.icon}
                </div>
                <h3 className="font-700 text-white text-lg mb-3" style={{ fontWeight: 700 }}>
                  {feature.title}
                </h3>
                <p className="text-sm text-white/55 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Connects (mini lifecycle) */}
      <section className="section-padding" style={{ background: "var(--color-warm-50)" }}>
        <div className="container-content">
          <SectionHeading
            eyebrow="How It Connects"
            title="Where this fits in the lifecycle"
            subtitle="Our solutions don't work in isolation — they're designed to connect seamlessly with every adjacent phase."
            className="mb-12"
          />
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {LIFECYCLE_PHASES.map((lp, i) => (
              <Link key={lp.id} href={lp.link}>
                <div
                  className={`p-5 rounded-xl text-center transition-all hover:translate-y-[-2px] ${
                    i === phaseIndex
                      ? "border-gold-500 shadow-lg scale-105"
                      : "border-neutral-200 opacity-60 hover:opacity-90"
                  }`}
                  style={{
                    background: i === phaseIndex ? "white" : "white",
                    border: i === phaseIndex ? "2px solid var(--color-gold-500)" : "1px solid var(--color-warm-200)",
                  }}
                >
                  <span
                    className={`text-xs font-700 block mb-2 ${i === phaseIndex ? "text-gold-600" : "text-neutral-400"}`}
                    style={{ fontWeight: 700 }}
                  >
                    {lp.number}
                  </span>
                  <span className={`text-sm font-700 ${i === phaseIndex ? "text-navy-900" : "text-neutral-500"}`} style={{ fontWeight: 700 }}>
                    {lp.title}
                  </span>
                  {i === phaseIndex && (
                    <span
                      className="block mt-1 text-xs"
                      style={{ color: "var(--color-gold-600)" }}
                    >
                      ← You are here
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Who It's For + Engagement Models */}
      <section className="section-padding" style={{ background: "white" }}>
        <div className="container-content">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Audience */}
            <div>
              <p className="text-xs font-700 tracking-widest uppercase text-gold-600 mb-6" style={{ fontWeight: 700 }}>
                Who It&apos;s For
              </p>
              <div className="space-y-3">
                {audiences.map((aud) => (
                  <div
                    key={aud}
                    className="flex items-center gap-3 p-4 rounded-xl"
                    style={{ background: "var(--color-warm-50)", border: "1px solid var(--color-warm-100)" }}
                  >
                    <span style={{ color: "var(--color-gold-500)" }}>✓</span>
                    <span className="text-navy-900 font-500" style={{ fontWeight: 500 }}>{aud}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Engagement Models */}
            <div>
              <p className="text-xs font-700 tracking-widest uppercase text-gold-600 mb-6" style={{ fontWeight: 700 }}>
                Engagement Models
              </p>
              <div className="space-y-4">
                {engagementModels.map((model) => (
                  <div key={model.title} className="border-l-2 pl-5" style={{ borderColor: "var(--color-gold-400)" }}>
                    <p className="font-700 text-navy-900 mb-1" style={{ fontWeight: 700 }}>{model.title}</p>
                    <p className="text-sm text-neutral-500">{model.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Solutions */}
      <section className="py-16" style={{ background: "var(--color-warm-50)" }}>
        <div className="container-content">
          <p className="text-xs font-700 tracking-widest uppercase text-neutral-400 mb-8 text-center" style={{ fontWeight: 700 }}>
            Related Solutions
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            {relatedSolutions.map((rel) => (
              <Link
                key={rel.href}
                href={rel.href}
                className="flex items-center gap-3 px-5 py-3 rounded-full bg-white border border-neutral-200 hover:border-gold-400 transition-colors group"
              >
                <span className="text-xs font-700 text-gold-600" style={{ fontWeight: 700 }}>{rel.phase}</span>
                <span className="text-sm text-neutral-700 group-hover:text-navy-900 font-600" style={{ fontWeight: 600 }}>{rel.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CTABanner
        headline={ctaHeadline}
        primaryLabel="Discuss This Solution"
        primaryHref="/consultation"
        secondaryLabel="Explore All Solutions"
        secondaryHref="/solutions"
      />
    </>
  )
}
