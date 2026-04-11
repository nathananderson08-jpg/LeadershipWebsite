"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"

interface VideoBackgroundProps {
  videoSrc?: string
  overlayOpacity?: number
  className?: string
}

/**
 * VideoBackground component for hero sections.
 * Displays a looping background video with overlay for text readability.
 * Falls back to animated gradient for reduced motion or video load errors.
 */
export function VideoBackground({
  videoSrc = "https://static.videezy.com/system/resources/previews/000/044/030/original/clouds-timelapse.mp4",
  overlayOpacity = 0.4,
  className = "",
}: VideoBackgroundProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [videoError, setVideoError] = useState(false)
  const [videoLoaded, setVideoLoaded] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    setPrefersReducedMotion(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches)
    }
    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  const showVideo = !prefersReducedMotion && !videoError && videoSrc

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {/* Fallback gradient background - always visible as base */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(135deg, #e8f5eb 0%, #d4e8da 40%, #f3faf5 100%)",
        }}
      />

      {/* Video element */}
      {showVideo && (
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          onLoadedData={() => setVideoLoaded(true)}
          onError={() => setVideoError(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            videoLoaded ? "opacity-100" : "opacity-0"
          }`}
          style={{ filter: "brightness(1.05) saturate(0.9)" }}
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      )}

      {/* Gradient overlay for text readability */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(160deg, 
            rgba(243, 250, 245, ${overlayOpacity + 0.15}) 0%, 
            rgba(227, 242, 232, ${overlayOpacity}) 40%, 
            rgba(248, 248, 246, ${overlayOpacity - 0.1}) 100%)`,
        }}
      />

      {/* Animated accent orbs for depth */}
      <motion.div
        className="absolute pointer-events-none"
        style={{
          width: "70vw",
          height: "70vw",
          maxWidth: 900,
          maxHeight: 900,
          borderRadius: "50%",
          background: "radial-gradient(circle at 50% 50%, rgba(93,171,121,0.06) 0%, rgba(93,171,121,0.02) 40%, transparent 65%)",
          top: "-20%",
          right: "-15%",
        }}
        animate={prefersReducedMotion ? {} : {
          x: [0, 30, -15, 0],
          y: [0, -20, 15, 0],
          scale: [1, 1.04, 0.98, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute pointer-events-none"
        style={{
          width: "50vw",
          height: "50vw",
          maxWidth: 700,
          maxHeight: 700,
          borderRadius: "50%",
          background: "radial-gradient(circle at 50% 50%, rgba(93,171,121,0.05) 0%, transparent 60%)",
          bottom: "-15%",
          left: "-10%",
        }}
        animate={prefersReducedMotion ? {} : {
          x: [0, -25, 20, 0],
          y: [0, 20, -10, 0],
          scale: [1, 1.08, 0.96, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      {/* Soft vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 85% 75% at 50% 50%, transparent 55%, rgba(243,250,245,0.4) 100%)",
        }}
      />
    </div>
  )
}
