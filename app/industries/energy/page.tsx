import type { Metadata } from "next"
import { IndustryPageTemplate } from "@/components/sections/IndustryPageTemplate"
import { FIRM_NAME } from "@/lib/constants"

export const metadata: Metadata = {
  title: `Energy Sector Leadership Development | ${FIRM_NAME}`,
  description: "Leadership development for the energy sector. Navigating the energy transition, ESG transformation, and operational complexity with capable, adaptive leaders.",
}

export default function EnergyPage() {
  return (
    <IndustryPageTemplate
      industryName="Energy"
      heroTitle="Leading through the most consequential transition of our time."
      heroSubtitle="The energy transition is rewriting business models, reallocating capital, and redefining what leadership in this sector looks like. We develop leaders who can navigate complexity without losing operational discipline."
      challenges={[
        { title: "Energy Transition Leadership", desc: "The shift from fossil fuels to renewables and low-carbon alternatives requires leaders who can manage portfolios in transformation — balancing legacy operations with strategic reinvention." },
        { title: "ESG & Stakeholder Complexity", desc: "Energy leaders face an unprecedented range of stakeholder expectations — investors, regulators, communities, employees, and activists — all with conflicting demands." },
        { title: "Operational Safety Culture", desc: "In an industry where leadership failures can have catastrophic consequences, building a genuine safety culture — not a compliance culture — is a strategic leadership priority." },
        { title: "Talent Attraction & Retention", desc: "The energy sector faces intense competition for technical and leadership talent as the transition creates demand for new skill sets across the entire value chain." },
      ]}
      lifecycleApplication={[
        { phase: "01 Assess", detail: "Executive team assessments, safety culture diagnostics, and transition readiness evaluations for energy sector leaders and organizations." },
        { phase: "02 Coach", detail: "Coaching for energy CEOs and C-suite leaders navigating the energy transition, board pressure, and the personal challenges of leading a transforming industry." },
        { phase: "03 Develop", detail: "Energy transition leadership programs, ESG strategy leadership development, and frontline safety leadership programs for operations teams." },
        { phase: "04 Transform", detail: "Culture transformation from traditional energy to low-carbon business models — including the difficult work of changing established norms and identities." },
        { phase: "05 Sustain", detail: "Succession planning for critical technical and commercial roles, with transition readiness as a key dimension of leadership potential assessment." },
      ]}
      insights={[
        { title: "The Energy CEO's Most Difficult Leadership Challenge: The Transition Paradox", category: "Energy" },
        { title: "Safety Culture vs. Compliance Culture: Why the Distinction Matters in Energy Leadership", category: "Energy" },
        { title: "Attracting and Retaining Leadership Talent Through the Energy Transition", category: "Succession" },
      ]}
      keyword="energy sector leadership development"
    />
  )
}
