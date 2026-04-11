"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/Button"

interface CTABannerProps {
  headline?: string
  subtext?: string
  primaryLabel?: string
  primaryHref?: string
  secondaryLabel?: string
  secondaryHref?: string
}

export function CTABanner({
  headline = "Ready to build leadership at every level?",
  subtext = "From assessment to succession, we cover the entire lifecycle. Let's design the right solution for your organization.",
  primaryLabel = "Contact Us",
  primaryHref = "/contact",
  secondaryLabel = "Explore Solutions",
  secondaryHref = "/solutions",
}: CTABannerProps) {
  return (
    <section className="py-24 relative overflow-hidden" style={{ background: "var(--color-forest-100)" }}>
      {/* Background decoration */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: "radial-gradient(at 30% 50%, rgba(93,171,121,0.2) 0px, transparent 60%), radial-gradient(at 70% 50%, rgba(93,171,121,0.12) 0px, transparent 60%)",
        }}
      />
      <div className="container-content relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="display-md text-forest-950 mb-5">{headline}</h2>
          <p className="text-lg text-forest-800/70 mb-10 leading-relaxed">{subtext}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button href={primaryHref} variant="primary" size="lg">
              {primaryLabel}
            </Button>
            <Button href={secondaryHref} variant="secondary" size="lg">
              {secondaryLabel}
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
