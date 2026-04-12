import type { Metadata } from "next"
import { IndustryPageTemplate } from "@/components/sections/IndustryPageTemplate"
import { FIRM_NAME } from "@/lib/constants"

export const metadata: Metadata = {
  title: `Technology Leadership Development | ${FIRM_NAME}`,
  description: "Leadership development for technology companies. From engineering manager to CTO — assessment, coaching, and programs built for the pace of tech.",
}

export default function TechnologyPage() {
  return (
    <IndustryPageTemplate
      industryName="Technology"
      heroTitle="Leadership for the speed of software."
      heroSubtitle="Technology companies move faster than any other sector. Leaders in tech must build culture, ship product, manage distributed teams, and navigate AI transformation — all at once."
      challenges={[
        { title: "Technical-to-Leadership Transition", desc: "The jump from individual contributor to engineering manager is one of the most difficult in any industry — and most technology companies underprepare their people for it." },
        { title: "Distributed & Remote Leadership", desc: "Most technology companies are distributed by design. Leading across time zones, cultures, and async communication requires deliberate leadership development." },
        { title: "Hypergrowth Leadership", desc: "Scaling from 50 to 500 to 5,000 people requires leaders who grow with the organization — or organizations that develop them fast enough to stay ahead." },
        { title: "AI-Native Leadership", desc: "Technology leaders must understand and work with AI not just as users, but as strategists — shaping how AI is deployed, governed, and led within their organizations." },
      ]}
      lifecycleApplication={[
        { phase: "01 Assess", detail: "Engineering leadership assessments, technical-to-manager readiness evaluations, and culture diagnostics for high-growth technology teams." },
        { phase: "02 Coach", detail: "Coaching for CTOs, engineering leaders, and founders navigating the leadership demands of hypergrowth, product pivots, and AI strategy." },
        { phase: "03 Develop", detail: "Manager effectiveness programs, technical leadership tracks, and AI leadership fluency curricula designed for the pace of technology companies." },
        { phase: "04 Transform", detail: "Culture transformation for scaling organizations, remote team alignment, and change management for major product or organizational pivots." },
        { phase: "05 Sustain", detail: "Succession planning for key technical and product leaders, with AI-readiness as a core dimension of leadership potential assessment." },
      ]}
      insights={[
        { title: "Why Engineering Managers Fail — And What to Do About It", category: "Technology" },
        { title: "The AI-Native Leader: What Great Tech Leadership Looks Like in 2025", category: "AI & Leadership" },
        { title: "Succession Planning for High-Growth Tech Companies", category: "Succession" },
      ]}
      keyword="technology leadership development"
    />
  )
}
