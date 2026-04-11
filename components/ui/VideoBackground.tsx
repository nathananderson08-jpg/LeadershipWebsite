"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

interface VideoBackgroundProps {
  overlayOpacity?: number
  className?: string
}

/**
 * AnimatedBackground component for hero sections.
 * Uses CSS animations for a smooth, professional clouds/sky timelapse effect.
 * Respects reduced motion preferences.
 */
export function VideoBackground({
  overlayOpacity = 0.4,
  className = "",
}: VideoBackgroundProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    setPrefersReducedMotion(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches)
    }
    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {/* Sky gradient base */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg, #87CEEB 0%, #B0E0E6 30%, #E0F4F7 60%, #f3faf5 100%)",
        }}
      />

      {/* Animated cloud layers */}
      {!prefersReducedMotion && (
        <>
          {/* Cloud layer 1 - large, slow moving */}
          <motion.div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                radial-gradient(ellipse 300px 120px at 10% 20%, rgba(255,255,255,0.9) 0%, transparent 70%),
                radial-gradient(ellipse 400px 150px at 80% 15%, rgba(255,255,255,0.85) 0%, transparent 70%),
                radial-gradient(ellipse 350px 130px at 50% 25%, rgba(255,255,255,0.8) 0%, transparent 70%),
                radial-gradient(ellipse 280px 100px at 25% 35%, rgba(255,255,255,0.75) 0%, transparent 70%),
                radial-gradient(ellipse 320px 110px at 70% 30%, rgba(255,255,255,0.8) 0%, transparent 70%)
              `,
            }}
            animate={{
              x: [0, 100, 0],
            }}
            transition={{
              duration: 60,
              repeat: Infinity,
              ease: "linear",
            }}
          />

          {/* Cloud layer 2 - medium, moderate speed */}
          <motion.div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                radial-gradient(ellipse 250px 90px at 15% 40%, rgba(255,255,255,0.7) 0%, transparent 70%),
                radial-gradient(ellipse 300px 100px at 60% 45%, rgba(255,255,255,0.65) 0%, transparent 70%),
                radial-gradient(ellipse 220px 80px at 85% 50%, rgba(255,255,255,0.7) 0%, transparent 70%),
                radial-gradient(ellipse 280px 95px at 40% 55%, rgba(255,255,255,0.6) 0%, transparent 70%)
              `,
            }}
            animate={{
              x: [0, 150, 0],
            }}
            transition={{
              duration: 45,
              repeat: Infinity,
              ease: "linear",
            }}
          />

          {/* Cloud layer 3 - small wisps, faster */}
          <motion.div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                radial-gradient(ellipse 180px 60px at 20% 60%, rgba(255,255,255,0.5) 0%, transparent 70%),
                radial-gradient(ellipse 200px 70px at 55% 65%, rgba(255,255,255,0.45) 0%, transparent 70%),
                radial-gradient(ellipse 160px 55px at 75% 70%, rgba(255,255,255,0.5) 0%, transparent 70%)
              `,
            }}
            animate={{
              x: [0, 200, 0],
            }}
            transition={{
              duration: 35,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </>
      )}

      {/* Gradient overlay for text readability */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(160deg, 
            rgba(243, 250, 245, ${overlayOpacity + 0.2}) 0%, 
            rgba(227, 242, 232, ${overlayOpacity + 0.1}) 40%, 
            rgba(248, 248, 246, ${overlayOpacity}) 100%)`,
        }}
      />

      {/* Animated accent orbs */}
      <motion.div
        className="absolute"
        style={{
          width: "80vw",
          height: "80vw",
          maxWidth: 1000,
          maxHeight: 1000,
          borderRadius: "50%",
          background: "radial-gradient(circle at 50% 50%, rgba(93,171,121,0.08) 0%, rgba(93,171,121,0.02) 35%, transparent 65%)",
          top: "-25%",
          right: "-20%",
          willChange: "transform",
        }}
        animate={prefersReducedMotion ? {} : {
          x: [0, 40, -20, 0],
          y: [0, -30, 20, 0],
          scale: [1, 1.06, 0.97, 1],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute"
        style={{
          width: "60vw",
          height: "60vw",
          maxWidth: 800,
          maxHeight: 800,
          borderRadius: "50%",
          background: "radial-gradient(circle at 50% 50%, rgba(135,206,235,0.1) 0%, rgba(135,206,235,0.03) 40%, transparent 65%)",
          bottom: "-20%",
          left: "-15%",
          willChange: "transform",
        }}
        animate={prefersReducedMotion ? {} : {
          x: [0, -35, 25, 0],
          y: [0, 25, -15, 0],
          scale: [1, 1.1, 0.95, 1],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 3 }}
      />

      {/* Subtle texture */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Soft vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 80% 70% at 50% 50%, transparent 50%, rgba(243,250,245,0.5) 100%)",
        }}
      />
    </div>
  )
}
