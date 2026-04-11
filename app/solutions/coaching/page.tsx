import type { Metadata } from "next"
import { SolutionPageTemplate } from "@/components/sections/SolutionPageTemplate"
import { FIRM_NAME } from "@/lib/constants"

export const metadata: Metadata = {
  title: `Executive Coaching — Deep Coaching & Breakthrough Programs | ${FIRM_NAME}`,
  description:
    "Transform leadership performance through deep executive coaching, breakthrough programs, and inner development work. ICF-certified coaches integrated with assessment and development.",
}

export default function CoachingPage() {
  return (
    <SolutionPageTemplate
      breadcrumb="Executive Coaching"
      phase="02 — Coach"
      phaseIndex={1}
      heroTitle="The most direct path to leadership transformation."
      heroSubtitle="Our coaches bring deep expertise across industries and leadership levels — and every coaching engagement is anchored in assessment data and connected to broader development goals for maximum, lasting impact."
      challengeTitle="Coaching only works if it's connected to something real."
      challengeBody="Standalone coaching — disconnected from diagnostic data, development programs, and organizational context — delivers limited, short-lived results. Leaders need coaching embedded in a broader system of growth, not another vendor relationship that starts from scratch."
      challengePoints={[
        "Coaching that starts without diagnostic data misses the leader's most critical developmental gaps.",
        "Coaches without organizational context can't help leaders navigate the systemic barriers they actually face.",
        "Generic coaching that doesn't evolve with the leader's needs plateaus within months.",
        "Individual coaching alone cannot resolve team dysfunction or systemic cultural issues.",
      ]}
      approachTitle="Coaching embedded in a system of transformation."
      approachBody="Our coaches work from assessment data, coordinate with program facilitators, and maintain continuity through succession planning. We offer five distinct coaching modalities — each calibrated to a specific leadership challenge, level, and desired depth of change."
      features={[
        {
          icon: "🧭",
          title: "Deep Executive Coaching",
          description: "Long-term, high-depth coaching relationships for senior leaders. Combines psychological depth with strategic context. Engagements of 6–18 months. Focuses on identity, leadership presence, and complex organizational navigation.",
        },
        {
          icon: "⚡",
          title: "Executive Breakthrough Programs",
          description: "Intensive, time-bounded coaching for leaders at inflection points — new roles, capability gaps, or performance challenges. Structured sprint format (90 days) with clear milestones and measurable outcomes.",
        },
        {
          icon: "🌱",
          title: "Inner Development & Character Work",
          description: "Coaching that addresses the inner game of leadership: values alignment, psychological patterns, emotional intelligence, and leadership character. Essential for leaders whose technical capability has outpaced their inner development.",
        },
        {
          icon: "👥",
          title: "Group & Cohort Coaching",
          description: "Cohort-based coaching that builds shared language, peer accountability, and collective capability — typically paired with development programs. Accelerates learning and creates lasting peer networks.",
        },
        {
          icon: "🔄",
          title: "Transition & Role Coaching",
          description: "Intensive coaching for high-stakes leadership transitions: new role, new organization, newly expanded scope, or post-restructure. Typically 90-day sprint engagements with weekly sessions.",
        },
      ]}
      audiences={[
        "C-suite executives navigating strategic complexity and organizational change",
        "Senior leaders transitioning into expanded roles or new organizations",
        "High-potential leaders accelerating toward senior leadership",
        "Leaders whose performance has plateaued or who are facing specific derailers",
        "Teams facing collective challenges: alignment, trust, or shared direction",
      ]}
      engagementModels={[
        {
          title: "90-Day Breakthrough Sprint",
          description: "Intensive coaching focused on a single high-priority challenge or transition. Weekly sessions, between-session support, and a structured progress framework.",
        },
        {
          title: "6-Month Development Partnership",
          description: "Deep coaching relationship covering multiple developmental priorities. Bi-weekly sessions plus assessment integration, development planning, and mid-point review.",
        },
        {
          title: "12–18 Month Executive Partnership",
          description: "Long-term strategic coaching relationship for executives requiring sustained development. Monthly deep-dive sessions plus ongoing availability between sessions.",
        },
      ]}
      relatedSolutions={[
        { title: "Assessment & Diagnostics", href: "/solutions/assessment", phase: "01 Assess" },
        { title: "Development Programs", href: "/solutions/programs", phase: "03 Develop" },
        { title: "Team & Org Transformation", href: "/solutions/transformation", phase: "04 Transform" },
        { title: "AI Transformation", href: "/solutions/ai-transformation", phase: "All Phases" },
      ]}
      ctaHeadline="Find the right coaching engagement for your leaders."
    />
  )
}
