import type { Metadata } from "next"
import { IndustryPageTemplate } from "@/components/sections/IndustryPageTemplate"
import { FIRM_NAME } from "@/lib/constants"

export const metadata: Metadata = {
  title: `Healthcare Leadership Development | ${FIRM_NAME}`,
  description: "Leadership development for healthcare organizations. From clinical leaders to health system CEOs — assessment, coaching, and programs for mission-driven leadership.",
}

export default function HealthcarePage() {
  return (
    <IndustryPageTemplate
      industryName="Healthcare"
      heroTitle="Leadership at the intersection of mission and margin."
      heroSubtitle="Healthcare leaders carry a unique burden: every decision has human consequences. Developing leaders who can navigate that weight — while managing complexity, burnout, and digital transformation — requires a different kind of leadership development partner."
      challenges={[
        { title: "Clinical-to-Administrative Transition", desc: "The most capable clinicians often become the least prepared administrators. Bridging the gap between clinical excellence and organizational leadership is a critical leadership development challenge." },
        { title: "Burnout & Psychological Safety", desc: "Healthcare faces a leadership crisis driven by burnout, turnover, and broken trust. Building psychologically safe cultures isn't optional — it's a patient safety issue." },
        { title: "Digital Health Transformation", desc: "AI diagnostics, digital records, telehealth, and precision medicine require clinical leaders who understand both the technology and the human experience it affects." },
        { title: "Workforce & Mission Alignment", desc: "Healthcare leaders must inspire a workforce that is simultaneously over-stretched and deeply mission-driven. Aligning management with mission is a complex leadership challenge." },
      ]}
      lifecycleApplication={[
        { phase: "01 Assess", detail: "Physician leadership assessments, clinical culture diagnostics, and executive team effectiveness evaluations calibrated to healthcare's unique pressures." },
        { phase: "02 Coach", detail: "Executive coaching for health system CEOs, CMOs, and CNOs — addressing the specific demands of leading a complex, mission-driven, regulated organization." },
        { phase: "03 Develop", detail: "Physician leadership programs, nursing leadership academies, and administrative leadership development tailored to healthcare's multi-constituency environment." },
        { phase: "04 Transform", detail: "Culture transformation focused on psychological safety, burnout reduction, and workforce engagement — grounded in healthcare-specific evidence." },
        { phase: "05 Sustain", detail: "Succession planning for health system leadership, including clinical succession frameworks and board governance for nonprofit health systems." },
      ]}
      insights={[
        { title: "Rebuilding Psychological Safety After the Pandemic — A Healthcare Leadership Guide", category: "Healthcare" },
        { title: "What AI Diagnostics Mean for Clinical Leadership", category: "AI & Leadership" },
        { title: "The Physician Leadership Crisis — And How to Solve It", category: "Healthcare" },
      ]}
      keyword="healthcare leadership development"
    />
  )
}
