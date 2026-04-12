import type { Metadata } from "next"
import { IndustryPageTemplate } from "@/components/sections/IndustryPageTemplate"
import { FIRM_NAME } from "@/lib/constants"

export const metadata: Metadata = {
  title: `Hospitality & Travel Leadership Development | ${FIRM_NAME}`,
  description: "Leadership development for hotels, resorts, airlines, and travel companies. Building the guest-experience leaders who define your brand.",
}

export default function HospitalityPage() {
  return (
    <IndustryPageTemplate
      industryName="Hospitality & Travel"
      heroTitle="Leadership that makes every guest feel it."
      heroSubtitle="In hospitality, leadership is the product. The guest experience delivered in every interaction — from check-in to checkout, from gate to destination — is a direct reflection of how leaders at every level are developed, supported, and inspired."
      challenges={[
        { title: "Frontline Service Leadership", desc: "The quality of a hotel, airline, or resort is ultimately defined by its frontline team leads and supervisors. Building leadership capability in high-volume, high-turnover environments requires systematic leadership development at scale." },
        { title: "Cultural and Geographic Complexity", desc: "Global hospitality brands must deliver a consistent experience across radically different cultural contexts. Leaders who can maintain brand standards while adapting to local cultures are exceptionally difficult to develop." },
        { title: "Seasonal Workforce and Variable Volume", desc: "Hospitality organizations face constant leadership challenges around variable staffing, seasonal peaks, and the need to maintain culture and performance standards with workforces that shift significantly across the year." },
        { title: "General Manager Development", desc: "The general manager role in hospitality is one of the broadest leadership roles in any industry — P&L accountability, team leadership, guest relations, community engagement, and brand stewardship, all at once." },
      ]}
      lifecycleApplication={[
        { phase: "01 Assess", detail: "General manager and department head effectiveness assessments, property-level culture diagnostics, and leadership readiness evaluations for high-potential frontline supervisors." },
        { phase: "02 Coach", detail: "Executive coaching for regional and portfolio leaders; GM transition coaching for new property leaders; and group coaching for senior leadership teams focused on guest experience strategy." },
        { phase: "03 Develop", detail: "Frontline supervisor leadership development programs, GM academies for emerging property leaders, and brand ambassador leadership curricula that connect culture, service standards, and leadership behavior." },
        { phase: "04 Transform", detail: "Culture alignment across properties and regions, change management for brand repositioning or major operational transformation, and team effectiveness programs for corporate leadership teams." },
        { phase: "05 Sustain", detail: "Succession planning for GM and regional director roles, high-potential identification across the property network, and leadership pipeline leadership development for long-term organizational resilience." },
      ]}
      insights={[
        { title: "Why the GM Role Is the Hardest Leadership Job in Any Industry", category: "Hospitality" },
        { title: "Delivering Brand Culture Across 100 Properties in 40 Countries", category: "Hospitality" },
        { title: "Frontline Leadership: The Multiplier Effect on Guest Experience", category: "Hospitality" },
      ]}
      keyword="hospitality"
    />
  )
}
