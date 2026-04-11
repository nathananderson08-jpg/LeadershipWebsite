"use client"

import { motion } from "framer-motion"

interface SectionHeadingProps {
  eyebrow?: string
  title: string
  subtitle?: string
  align?: "left" | "center"
  light?: boolean
  className?: string
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  light = false,
  className = "",
}: SectionHeadingProps) {
  const textAlign = align === "center" ? "text-center" : "text-left"
  const maxWidth = align === "center" ? "mx-auto max-w-3xl" : ""

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`${textAlign} ${maxWidth} ${className}`}
    >
      {eyebrow && (
        <p
          className={`text-sm font-700 tracking-[0.15em] uppercase mb-4 ${
            light ? "text-forest-300" : "text-forest-600"
          }`}
          style={{ fontWeight: 700 }}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={`display-md mb-5 ${light ? "text-white" : "text-forest-900"}`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`text-lg leading-relaxed ${
            light ? "text-white/70" : "text-neutral-600"
          }`}
        >
          {subtitle}
        </p>
      )}
    </motion.div>
  )
}
