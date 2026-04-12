import type { Metadata } from "next"
import { SolutionPageTemplate } from "@/components/sections/SolutionPageTemplate"
import { FIRM_NAME } from "@/lib/constants"

export const metadata: Metadata = {
  title: `Leadership Assessment & Diagnostics — 360 Reviews, Psychometrics & Organizational Audits | ${FIRM_NAME}`,
  description:
    "Comprehensive leadership diagnostics including 360 reviews, psychometric assessments, high-potential identification, and organizational audits. Integrated with coaching and leadership development for measurable outcomes.",
}

export default function AssessmentPage() {
  return (
    <SolutionPageTemplate
      breadcrumb="Assessment & Diagnostics"
      phase="01 — Assess"
      phaseIndex={0}
      heroTitle="Diagnose with Precision. Develop with Purpose."
      heroSubtitle="Our assessment practice goes beyond generating data — we translate diagnostic insights directly into actionable leadership development plans. Assessment is where transformation begins, and where strategy meets the individual."
      challengeTitle="Most assessments generate reports. We generate change."
      challengeBody="Organizations invest in leadership assessments and get back decks full of data they don't know how to use. The information sits, leaders don't change, and the organization pays twice — once for the assessment and again for the gap it didn't close."
      challengePoints={[
        "360 feedback delivered without coaching or follow-through creates anxiety, not leadership development.",
        "Organizational diagnostics disconnected from leadership development planning waste budget and erode trust.",
        "High-potential identification without rigorous methodology mislabels talent and creates unfair systems.",
        "Psychometric data without expert interpretation is noise — numbers without a narrative.",
      ]}
      approachTitle="Assessment as the beginning, not the end."
      approachBody="We design every assessment to feed directly into coaching plans, leadership development programs, and succession strategies. A diagnosis without a treatment plan is incomplete — and an assessment without integration is a missed opportunity."
      features={[
        {
          icon: "🔄",
          title: "360-Degree Leadership Reviews",
          description: "Multi-rater feedback from direct reports, peers, and managers, contextualized by our expert coaches. Every 360 includes a debrief session and is tied directly to a leadership development plan. Available for individuals and leadership teams.",
        },
        {
          icon: "🧠",
          title: "Psychometric Assessments",
          description: "Validated instruments including personality assessments (Hogan, NEO, MBTI), cognitive evaluations, emotional intelligence inventories, and leadership style instruments. Administered and interpreted by certified practitioners.",
        },
        {
          icon: "🎯",
          title: "High-Potential Identification",
          description: "Rigorous, evidence-based evaluation of leadership potential, learning agility, and readiness for advanced roles. Calibrated against your organization's specific leadership requirements and succession needs.",
        },
        {
          icon: "🏢",
          title: "Organizational Culture Diagnostics",
          description: "Culture assessments, leadership climate surveys, and team effectiveness diagnostics that reveal systemic patterns — not just individual gaps. Includes benchmarking, pattern analysis, and strategic recommendations.",
        },
        {
          icon: "📋",
          title: "Leadership Readiness Evaluations",
          description: "Structured assessments for specific transitions: new manager, director, VP, and C-suite. Provides benchmarked readiness profiles and targeted leadership development priorities for individuals preparing to step up.",
        },
      ]}
      audiences={[
        "HR and talent teams seeking rigorous data to inform leadership development investment",
        "Organizations preparing for succession planning or significant leadership transitions",
        "Teams and divisions seeking culture and leadership climate clarity",
        "Individual leaders preparing for a new, expanded, or more complex role",
        "Boards and executive teams evaluating C-suite readiness and succession pipeline",
      ]}
      engagementModels={[
        {
          title: "Individual Assessment Package",
          description: "Full psychometric battery + 360-degree review + expert debrief + integrated leadership development planning session. Ideal as a coaching intake or standalone leadership development investment.",
        },
        {
          title: "Team Diagnostic",
          description: "Assessment of the collective leadership of a team — climate, individual profiles, collective strengths and gaps. Typically completed in 3–4 weeks. Includes team debrief and action planning.",
        },
        {
          title: "Organizational Audit",
          description: "Enterprise-wide leadership capability assessment, culture diagnostic, and succession readiness review. Multi-month engagement with executive presentation and strategic recommendations.",
        },
      ]}
      relatedSolutions={[
        { title: "Executive Coaching", href: "/solutions/coaching", phase: "02 Coach" },
        { title: "Development Programs", href: "/solutions/programs", phase: "03 Develop" },
        { title: "Succession Planning", href: "/solutions/succession", phase: "05 Sustain" },
        { title: "AI Transformation", href: "/solutions/ai-transformation", phase: "All Phases" },
      ]}
      ctaHeadline="Ready to turn assessment into action?"
    />
  )
}
