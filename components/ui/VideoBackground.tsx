"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"

interface VideoBackgroundProps {
  videoSrc?: string
  posterSrc?: string
  overlayOpacity?: number
  className?: string
}

/**
 * VideoBackground component for hero sections.
 * Falls back gracefully to a gradient if video can't load.
 * Respects reduced motion preferences.
 */
export function VideoBackground({
  videoSrc = "https://videos.pexels.com/video-files/3129671/3129671-uhd_2560_1440_30fps.mp4",
  posterSrc,
  overlayOpacity = 0.65,
  className = "",
}: VideoBackgroundProps) {
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    setPrefersReducedMotion(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches)
    }
    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  useEffect(() => {
    if (videoRef.current && !prefersReducedMotion) {
      videoRef.current.play().catch(() => {
        // Video autoplay failed, fallback handled by state
      })
    }
  }, [prefersReducedMotion])

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {/* Base gradient layer - always visible */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(160deg, #f3faf5 0%, #e3f2e8 55%, #f8f8f6 100%)",
        }}
      />

      {/* Video layer - only if motion is allowed */}
      {!prefersReducedMotion && (
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: videoLoaded ? 1 : 0 }}
          transition={{ duration: 1.5 }}
        >
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            poster={posterSrc}
            onCanPlayThrough={() => setVideoLoaded(true)}
            crossOrigin="anonymous"
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
        </motion.div>
      )}

      {/* Gradient overlay for text readability */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(160deg, 
            rgba(243, 250, 245, ${overlayOpacity}) 0%, 
            rgba(227, 242, 232, ${overlayOpacity - 0.1}) 40%, 
            rgba(248, 248, 246, ${overlayOpacity - 0.15}) 100%)`,
        }}
      />

      {/* Animated mesh orbs - subtle and airy */}
      <motion.div
        className="absolute"
        style={{
          width: "80vw",
          height: "80vw",
          maxWidth: 1000,
          maxHeight: 1000,
          borderRadius: "50%",
          background: "radial-gradient(circle at 50% 50%, rgba(93,171,121,0.12) 0%, rgba(93,171,121,0.04) 35%, transparent 65%)",
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
          background: "radial-gradient(circle at 50% 50%, rgba(201,168,138,0.1) 0%, rgba(201,168,138,0.03) 40%, transparent 65%)",
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
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Soft vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 80% 70% at 50% 50%, transparent 50%, rgba(243,250,245,0.4) 100%)",
        }}
      />
    </div>
  )
}
