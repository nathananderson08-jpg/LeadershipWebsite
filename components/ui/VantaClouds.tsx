"use client"

import { useEffect, useRef, useState } from "react"

interface VantaCloudsProps {
  className?: string
}

/**
 * VantaClouds component - animated cloud background using Vanta.js
 * Creates a beautiful, performant animated sky effect
 */
export function VantaClouds({ className = "" }: VantaCloudsProps) {
  const vantaRef = useRef<HTMLDivElement>(null)
  const [vantaEffect, setVantaEffect] = useState<unknown>(null)

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReducedMotion) return

    // Dynamically load Three.js and Vanta
    const loadVanta = async () => {
      try {
        console.log("[v0] Loading Three.js...")
        // Load Three.js first
        const THREE = await import("three")
        // Vanta needs THREE on window
        ;(window as unknown as { THREE: typeof THREE }).THREE = THREE
        console.log("[v0] Three.js loaded successfully")

        // Load Vanta clouds effect
        console.log("[v0] Loading Vanta.js...")
        const VANTA = await import("vanta/dist/vanta.clouds.min")
        console.log("[v0] Vanta.js loaded successfully", VANTA)
        
        if (vantaRef.current && !vantaEffect) {
          console.log("[v0] Initializing Vanta effect...")
          const effect = VANTA.default({
            el: vantaRef.current,
            THREE: THREE,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.0,
            minWidth: 200.0,
            // Custom colors matching site's forest green palette
            backgroundColor: 0xf3faf5, // warm-white / forest-50
            skyColor: 0x68b8a7, // soft teal-green sky
            cloudColor: 0xe8f5eb, // light forest clouds
            cloudShadowColor: 0x183550, // navy shadow for depth
            sunColor: 0xff9919, // warm golden sun
            sunGlareColor: 0xff6633, // warm sun glare
            sunlightColor: 0xfff5e6, // soft warm sunlight
            speed: 0.8, // gentle movement
          })
          setVantaEffect(effect)
          console.log("[v0] Vanta effect initialized successfully")
        }
      } catch (error) {
        console.error("[v0] Failed to load Vanta.js:", error)
      }
    }

    loadVanta()

    return () => {
      if (vantaEffect) {
        // @ts-expect-error - Vanta effect has destroy method
        vantaEffect.destroy()
      }
    }
  }, [vantaEffect])

  return (
    <div className={`absolute inset-0 ${className}`} aria-hidden="true">
      {/* Vanta.js container */}
      <div ref={vantaRef} className="absolute inset-0" />
      
      {/* Subtle overlay for text readability */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(180deg, rgba(243,250,245,0.15) 0%, rgba(243,250,245,0.3) 100%)",
        }}
      />
      
      {/* Soft vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 85% 75% at 50% 50%, transparent 55%, rgba(243,250,245,0.3) 100%)",
        }}
      />
    </div>
  )
}
