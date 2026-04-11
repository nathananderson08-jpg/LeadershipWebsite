import type { Metadata } from "next"
import { IndustryPageTemplate } from "@/components/sections/IndustryPageTemplate"
import { FIRM_NAME } from "@/lib/constants"

export const metadata: Metadata = {
  title: `Professional Services Leadership Development | ${FIRM_NAME}`,
  description: "Leadership development for law firms, consulting firms, and advisory organizations. Partner development, talent retention, and client-facing culture — built for professional services.",
}

export default function ProfessionalServicesPage() {
  return (
    <IndustryPageTemplate
      industryName="Professional Services"
      heroTitle="Leadership for firms built on expertise and trust."
      heroSubtitle="Professional services organizations — law, consulting, accounting, advisory — are people businesses. Their entire value proposition walks out the door every evening. Developing those people into exceptional leaders is the only sustainable competitive advantage."
      challenges={[
        { title: "The Partner Track Problem", desc: "The skills that make someone a brilliant analyst, associate, or senior manager are often the opposite of what makes them an effective partner or principal. The path from practitioner to leader is rarely developed deliberately." },
        { title: "Talent Retention in a War for Talent", desc: "High performers in professional services have options. Firms that invest in leadership development retain their best people — those that don't see them walk to competitors or start their own practices." },
        { title: "Client Relationship Leadership", desc: "Managing complex, high-stakes client relationships requires leadership capabilities that go beyond technical expertise — executive presence, influence, and the ability to lead without authority." },
        { title: "Culture in Distributed Expert Networks", desc: "Firms with multiple offices, practice areas, or geographies struggle to maintain a consistent culture and leadership standard. Cohesion must be built intentionally." },
      ]}
      lifecycleApplication={[
        { phase: "01 Assess", detail: "Partner readiness assessments, leadership potential evaluations for high-performers, and firm-wide culture diagnostics that identify strengths and development priorities." },
        { phase: "02 Coach", detail: "Executive coaching for managing partners and practice leads, group coaching for cohorts on the partner track, and transition coaching for new partners in their first year." },
        { phase: "03 Develop", detail: "Partner development programs, client leadership skills curricula, and leadership academies designed for the demands of professional services career progression." },
        { phase: "04 Transform", detail: "Culture alignment across offices and practices, team effectiveness for cross-functional client teams, and change management for firm mergers and strategic pivots." },
        { phase: "05 Sustain", detail: "Succession planning for leadership positions, high-potential identification for long-term pipeline development, and continuity planning for key client relationships." },
      ]}
      insights={[
        { title: "Why the Best Advisors Often Make the Worst Partners — At First", category: "Professional Services" },
        { title: "Client Leadership: The Capability Firms Forget to Develop", category: "Professional Services" },
        { title: "Building Culture in a Distributed Expert Network", category: "Professional Services" },
      ]}
      keyword="professional services"
    />
  )
}
