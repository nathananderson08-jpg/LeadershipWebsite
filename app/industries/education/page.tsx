import type { Metadata } from "next"
import { IndustryPageTemplate } from "@/components/sections/IndustryPageTemplate"
import { FIRM_NAME } from "@/lib/constants"

export const metadata: Metadata = {
  title: `Education Leadership Development | ${FIRM_NAME}`,
  description: "Leadership development for educational institutions — K-12, higher education, and research universities. Developing principals, deans, and academic leaders built for complexity.",
}

export default function EducationPage() {
  return (
    <IndustryPageTemplate
      industryName="Education"
      heroTitle="Leadership for institutions that shape the future."
      heroSubtitle="Educational institutions operate with unique governance structures, deeply mission-driven cultures, and the constant challenge of leading highly educated, autonomous professionals. Developing leaders in this environment requires a different approach."
      challenges={[
        { title: "Leading Highly Educated Professionals", desc: "Faculty, researchers, and academic staff are accreditation-holders who expect to be led differently than corporate employees. Influence, not authority, is the primary lever — and most educational leaders aren't trained for it." },
        { title: "Shared Governance Complexity", desc: "The tension between administrative leadership and faculty governance is a constant source of organizational friction. Leaders who can navigate shared governance productively are rare and valuable." },
        { title: "Enrollment, Funding, and Mission Pressure", desc: "Demographic shifts, funding constraints, and rapidly changing student expectations are creating strategic pressure that educational leaders weren't trained to manage." },
        { title: "Principal and Department Chair Development", desc: "The pipeline from classroom to leadership is poorly supported at every level. Teachers promoted to principals, professors elevated to department chairs — these transitions rarely come with the leadership development they require." },
      ]}
      lifecycleApplication={[
        { phase: "01 Assess", detail: "Leadership readiness assessments for aspiring administrators, department chair effectiveness diagnostics, and institutional culture surveys that reveal alignment between stated and lived values." },
        { phase: "02 Coach", detail: "Executive coaching for presidents, provosts, and superintendents; transition coaching for new principals and department chairs; and team coaching for senior leadership teams navigating institutional change." },
        { phase: "03 Develop", detail: "Principal leadership academies, mid-level administrator leadership development programs, and cohort-based curricula for faculty on the path to academic leadership roles." },
        { phase: "04 Transform", detail: "Strategic planning facilitation, culture alignment work, and change leadership programs for institutions navigating enrollment shifts, technology adoption, or structural reorganization." },
        { phase: "05 Sustain", detail: "Succession planning for key administrative roles, high-potential identification for the next generation of institutional leaders, and leadership pipeline mapping across the organization." },
      ]}
      insights={[
        { title: "Why Shared Governance Requires a Different Kind of Leader", category: "Education" },
        { title: "The Teacher-to-Principal Gap No One is Talking About", category: "Education" },
        { title: "Leading the Modern University Through Disruption", category: "Education" },
      ]}
      keyword="education"
    />
  )
}
