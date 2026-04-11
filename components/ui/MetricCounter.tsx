"use client"

import { useEffect, useRef, useState } from "react"
import { useInView } from "framer-motion"

interface MetricCounterProps {
  value: number
  suffix?: string
  label: string
  light?: boolean
  duration?: number
}

export function MetricCounter({ value, suffix = "", label, light = false, duration = 2000 }: MetricCounterProps) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (!isInView || hasAnimated.current) return
    hasAnimated.current = true

    const startTime = performance.now()
    const startValue = 0
    const endValue = value

    const ease = (t: number) => 1 - Math.pow(1 - t, 3)

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easedProgress = ease(progress)
      setCount(Math.round(startValue + (endValue - startValue) * easedProgress))

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [isInView, value, duration])

  return (
    <div ref={ref} className="text-center">
      <div className={`display-md font-800 ${light ? "text-white" : "text-navy-900"}`} style={{ fontWeight: 800 }}>
        <span>{count.toLocaleString()}</span>
        <span className={light ? "text-gold-400" : "text-gold-500"}>{suffix}</span>
      </div>
      <p className={`text-sm font-600 tracking-wide mt-1 ${light ? "text-white/60" : "text-neutral-500"}`} style={{ fontWeight: 600 }}>
        {label}
      </p>
    </div>
  )
}
