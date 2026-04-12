import type { Metadata } from "next"
import { IndustryPageTemplate } from "@/components/sections/IndustryPageTemplate"
import { FIRM_NAME } from "@/lib/constants"

export const metadata: Metadata = {
  title: `Manufacturing Leadership Development | ${FIRM_NAME}`,
  description: "Leadership development for manufacturing organizations. Operational excellence, Industry 4.0, and workforce transformation — led by capable, adaptive leaders.",
}

export default function ManufacturingPage() {
  return (
    <IndustryPageTemplate
      industryName="Manufacturing"
      heroTitle="Leading the factory of the future."
      heroSubtitle="Manufacturing leaders are navigating the most significant transformation in industrial history. Industry 4.0, automation, supply chain complexity, and workforce evolution require leaders built for deep operational change."
      challenges={[
        { title: "Industry 4.0 & Automation Leadership", desc: "Robotic process automation, AI-driven supply chains, and smart manufacturing require leaders who can lead both human workers and intelligent systems." },
        { title: "Frontline Leadership Development", desc: "Manufacturing's largest leadership population — first-line supervisors and plant managers — is often the least invested-in. The business case for their leadership development is enormous." },
        { title: "Supply Chain Complexity", desc: "Global supply chains require leaders with cross-cultural competence, systemic thinking, and the ability to lead through uncertainty and disruption." },
        { title: "Workforce Transformation", desc: "The shift from manual to knowledge work within manufacturing requires leaders who can develop their people, manage change, and sustain engagement through major transitions." },
      ]}
      lifecycleApplication={[
        { phase: "01 Assess", detail: "Plant manager assessments, frontline supervisor readiness evaluations, and culture diagnostics for manufacturing environments." },
        { phase: "02 Coach", detail: "Coaching for operations VPs, plant leaders, and supply chain executives navigating Industry 4.0 transitions and workforce challenges." },
        { phase: "03 Develop", detail: "Frontline leader programs, operational excellence leadership curricula, and automation leadership development at every level." },
        { phase: "04 Transform", detail: "Change management for major automation and digital manufacturing initiatives, with particular focus on workforce engagement and trust." },
        { phase: "05 Sustain", detail: "Succession planning for critical operational roles, with a focus on identifying leaders capable of operating in an increasingly automated environment." },
      ]}
      insights={[
        { title: "Leading Through Automation: What Factory Leaders Need Now", category: "Manufacturing" },
        { title: "The Frontline Leadership Opportunity in Manufacturing", category: "Emerging Leaders" },
        { title: "Supply Chain Disruption as a Leadership Crucible", category: "Manufacturing" },
      ]}
      keyword="manufacturing leadership development"
    />
  )
}
