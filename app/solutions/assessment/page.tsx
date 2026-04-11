import type { Metadata } from "next"
import { SolutionPageTemplate } from "@/components/sections/SolutionPageTemplate"
import { FIRM_NAME } from "@/lib/constants"

export const metadata: Metadata = {
  title: `Leadership Assessment & Diagnostics — 360 Reviews & Organizational Audits | ${FIRM_NAME}`,
  description:
    "Comprehensive leadership assessments including 360 reviews, organizational diagnostics, and readiness evaluations. Integrated with coaching and development for measurable outcomes.",
}

export default function AssessmentPage() {
  return (
    <SolutionPageTemplate
      breadcrumb="Assessment & Diagnostics"
      phase="01 — Assess"
      phaseIndex={0}
      heroTitle="Diagnose with Precision. Develop with Purpose."
      heroSubtitle="Our assessment practice goes beyond data — we translate diagnostic insights directly into actionable development plans. Assessment is where transformation begins."
      challengeTitle="Most assessments generate reports. We generate change."
      challengeBody="Organizations invest in leadership assessments and get back decks full of data they don't know how to use. The information sits, leaders don't change, and the organization pays twice — once for the assessment and again for the gap it didn't close."
      challengePoints={[
        "360 feedback that's delivered without coaching or follow-through creates anxiety, not change.",
        "Organizational diagnostics that don't connect to development planning waste budget and erode trust.",
        "Leadership audits that can't identify succession-ready talent fail at the strategic level.",
        "Psychometric data without expert interpretation is noise without signal.",
      ]}
      approachTitle="Assessment as the beginning, not the end."
      approachBody="We design our assessments to feed directly into coaching plans, development programs, and succession strategies — because a diagnosis without a treatment plan is incomplete."
      features={[
        {
          icon: "🔄",
          title: "360-Degree Leadership Reviews",
          description: "Multi-rater feedback from direct reports, peers, and managers, contextualized by our expert coaches and tied directly to development priorities.",
        },
        {
          icon: "🏢",
          title: "Organizational Diagnostics",
          description: "Culture assessments, leadership climate surveys, and team effectiveness diagnostics that reveal systemic patterns, not just individual gaps.",
        },
        {
          icon: "🎯",
          title: "High-Potential Identification",
          description: "Rigorous, evidence-based evaluation of leadership potential, learning agility, and readiness for advanced roles — calibrated for your organization.",
        },
        {
          icon: "🧠",
          title: "Psychometric Assessments",
          description: "Validated instruments including personality assessments, cognitive evaluations, and leadership style inventories, administered by certified practitioners.",
        },
        {
          icon: "📋",
          title: "Leadership Readiness Evaluations",
          description: "Structured assessments for specific leadership transitions — new manager, director, VP, and C-suite — with benchmarked readiness profiles.",
        },
      ]}
      audiences={[
        "HR and talent teams seeking data to inform development investment",
        "Organizations preparing for succession planning or leadership transitions",
        "Teams seeking culture and leadership climate insights",
        "Individual leaders preparing for a new or expanded role",
        "Boards and executive teams evaluating C-suite readiness",
      ]}
      engagementModels={[
        {
          title: "Individual Assessment Package",
          description: "Full psychometric battery + 360-degree review + expert debrief + development planning session. Ideal for executive coaching intake.",
        },
        {
          title: "Team Diagnostic",
          description: "Assessment of the collective leadership of a team, including team climate, individual profiles, and collective strengths/gaps. Typically 3-4 weeks.",
        },
        {
          title: "Organizational Audit",
          description: "Enterprise-wide leadership capability assessment, culture diagnostic, and succession readiness review. Multi-month engagement with executive presentation.",
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
