import type { Metadata } from "next"
import { IndustryPageTemplate } from "@/components/sections/IndustryPageTemplate"
import { FIRM_NAME } from "@/lib/constants"

export const metadata: Metadata = {
  title: `Life Sciences & Pharma Leadership Development | ${FIRM_NAME}`,
  description: "Leadership development for pharmaceutical, biotech, and medical device companies. Scientific expertise meets commercial leadership in one of the world's most complex industries.",
}

export default function LifeSciencesPage() {
  return (
    <IndustryPageTemplate
      industryName="Life Sciences & Pharma"
      heroTitle="Leadership where the stakes are measured in lives."
      heroSubtitle="Life sciences organizations operate at the intersection of scientific rigor, commercial ambition, and regulatory accountability. The leaders who can hold all three simultaneously — and inspire teams to do the same — are among the most valuable in any industry."
      challenges={[
        { title: "Scientist-to-Leader Transition", desc: "The path from researcher or clinician to organizational leader is one of the most difficult professional transitions in any field. Scientific training does not prepare people to lead teams, manage complexity, or drive commercial outcomes." },
        { title: "Cross-Functional Collaboration Under Pressure", desc: "Drug leadership development and commercialization require R&D, clinical, regulatory, medical affairs, and commercial functions to work together seamlessly — often under significant time and competitive pressure." },
        { title: "Regulatory Culture and Ethical Leadership", desc: "Leaders in life sciences set the tone for how quality, safety, and compliance are treated across the organization. The leadership culture of a life sciences company is inseparable from its regulatory and ethical performance." },
        { title: "M&A Integration and Organizational Complexity", desc: "The life sciences industry is among the most active in M&A. Integrating cultures, leadership teams, and pipelines while maintaining scientific momentum requires exceptional organizational leadership." },
      ]}
      lifecycleApplication={[
        { phase: "01 Assess", detail: "Leadership readiness assessments for scientists and clinicians moving into management, organizational health diagnostics for cross-functional teams, and culture assessments for post-merger integration." },
        { phase: "02 Coach", detail: "Executive coaching for C-suite and VP-level leaders; transition coaching for first-time people managers from scientific backgrounds; and group coaching for senior leadership teams navigating pipeline or commercial inflection points." },
        { phase: "03 Develop", detail: "Scientist-to-leader leadership development programs, cross-functional leadership curricula, and commercial leadership tracks for leaders transitioning from R&D into general management roles." },
        { phase: "04 Transform", detail: "Post-merger culture integration, cross-functional team alignment, and change management for major strategic pivots — from research to commercial, or from specialty to primary care." },
        { phase: "05 Sustain", detail: "Succession planning for key scientific and commercial leadership roles, high-potential identification across the organization, and pipeline leadership development for the next generation of senior leaders." },
      ]}
      insights={[
        { title: "The Scientist Who Became a Leader: Why This Transition Is So Hard — And How to Make It Work", category: "Life Sciences" },
        { title: "Cross-Functional Leadership in Drug Development: What Actually Works", category: "Life Sciences" },
        { title: "Post-Merger Integration in Pharma: Why Culture Derails the Science", category: "Life Sciences" },
      ]}
      keyword="life sciences"
    />
  )
}
