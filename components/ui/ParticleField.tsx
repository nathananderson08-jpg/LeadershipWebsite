"use client"

import { useEffect, useRef, useState, useCallback } from "react"

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  connections: number[]
}

interface ParticleFieldProps {
  className?: string
  particleCount?: number
  particleColor?: string
  lineColor?: string
  maxDistance?: number
  speed?: number
}

/**
 * ParticleField creates an animated network of floating particles with connecting lines.
 * Ideal for AI/tech sections to add a professional, dynamic feel.
 * Respects reduced motion preferences.
 */
export function ParticleField({
  className = "",
  particleCount = 50,
  particleColor = "rgba(93, 171, 121, 0.6)",
  lineColor = "rgba(93, 171, 121, 0.15)",
  maxDistance = 120,
  speed = 0.3,
}: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | undefined>(undefined)
  const particlesRef = useRef<Particle[]>([])
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    setPrefersReducedMotion(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches)
    }
    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect()
        setDimensions({ width: rect.width, height: rect.height })
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Initialize particles
  useEffect(() => {
    if (dimensions.width === 0 || dimensions.height === 0) return

    particlesRef.current = Array.from({ length: particleCount }, () => ({
      x: Math.random() * dimensions.width,
      y: Math.random() * dimensions.height,
      vx: (Math.random() - 0.5) * speed,
      vy: (Math.random() - 0.5) * speed,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.3,
      connections: [],
    }))
  }, [dimensions, particleCount, speed])

  // Animation loop
  const animate = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx || prefersReducedMotion) return

    ctx.clearRect(0, 0, dimensions.width, dimensions.height)

    const particles = particlesRef.current

    // Update particle positions
    particles.forEach((particle) => {
      particle.x += particle.vx
      particle.y += particle.vy

      // Bounce off edges
      if (particle.x < 0 || particle.x > dimensions.width) particle.vx *= -1
      if (particle.y < 0 || particle.y > dimensions.height) particle.vy *= -1

      // Keep in bounds
      particle.x = Math.max(0, Math.min(dimensions.width, particle.x))
      particle.y = Math.max(0, Math.min(dimensions.height, particle.y))
    })

    // Draw connections
    ctx.strokeStyle = lineColor
    ctx.lineWidth = 0.5

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x
        const dy = particles[i].y - particles[j].y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < maxDistance) {
          const opacity = 1 - distance / maxDistance
          ctx.globalAlpha = opacity * 0.5
          ctx.beginPath()
          ctx.moveTo(particles[i].x, particles[j].y)
          ctx.lineTo(particles[j].x, particles[j].y)
          ctx.stroke()
        }
      }
    }

    // Draw particles
    particles.forEach((particle) => {
      ctx.beginPath()
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
      ctx.fillStyle = particleColor
      ctx.globalAlpha = particle.opacity
      ctx.fill()
    })

    ctx.globalAlpha = 1
    animationRef.current = requestAnimationFrame(animate)
  }, [dimensions, lineColor, maxDistance, particleColor, prefersReducedMotion])

  useEffect(() => {
    if (!prefersReducedMotion) {
      animationRef.current = requestAnimationFrame(animate)
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [animate, prefersReducedMotion])

  // For reduced motion, show static particles
  useEffect(() => {
    if (prefersReducedMotion && canvasRef.current && dimensions.width > 0) {
      const ctx = canvasRef.current.getContext("2d")
      if (!ctx) return

      ctx.clearRect(0, 0, dimensions.width, dimensions.height)
      
      // Draw static particles
      particlesRef.current.forEach((particle) => {
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = particleColor
        ctx.globalAlpha = particle.opacity * 0.5
        ctx.fill()
      })
    }
  }, [prefersReducedMotion, dimensions, particleColor])

  return (
    <canvas
      ref={canvasRef}
      width={dimensions.width}
      height={dimensions.height}
      className={`absolute inset-0 pointer-events-none ${className}`}
      aria-hidden="true"
    />
  )
}
