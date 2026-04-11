import type { Metadata } from "next"
import { SolutionPageTemplate } from "@/components/sections/SolutionPageTemplate"
import { FIRM_NAME } from "@/lib/constants"

export const metadata: Metadata = {
  title: `Executive Coaching — ICF-Certified Leadership Coaches | ${FIRM_NAME}`,
  description:
    "Transform leadership performance with ICF-certified executive coaching. 1:1, group, and team coaching integrated with assessment and development programs.",
}

export default function CoachingPage() {
  return (
    <SolutionPageTemplate
      breadcrumb="Executive Coaching"
      phase="02 — Coach"
      phaseIndex={1}
      heroTitle="The most direct path to leadership transformation."
      heroSubtitle="Our ICF-certified coaches bring deep expertise across industries and levels — and every coaching engagement integrates with assessment data and development plans for maximum impact."
      challengeTitle="Coaching only works if it's connected to something real."
      challengeBody="Standalone coaching — disconnected from assessment data, development programs, and organizational context — delivers limited, short-lived results. Leaders need coaching that's embedded in a broader system of growth."
      challengePoints={[
        "Coaching that starts without diagnostic data misses the most important developmental gaps.",
        "Coaches without organizational context can't help leaders navigate the systemic barriers to change.",
        "Generic coaching relationships that don't evolve with the leader's needs plateau quickly.",
        "Team dysfunction often can't be solved through individual coaching alone.",
      ]}
      approachTitle="Coaching embedded in a system of transformation."
      approachBody="Our coaches are embedded in the full lifecycle — they work from assessment data, coordinate with program facilitators, and maintain continuity through succession planning. This integration is what produces lasting change."
      features={[
        {
          icon: "👤",
          title: "1:1 Executive Coaching",
          description: "Deep, confidential coaching relationships built on assessment data and tailored to the individual leader's context, goals, and career stage.",
        },
        {
          icon: "👥",
          title: "Group Coaching",
          description: "Cohort-based coaching that builds shared language, peer accountability, and collective capability — often paired with leadership development programs.",
        },
        {
          icon: "🏆",
          title: "Team Coaching",
          description: "The entire leadership team as the unit of change. We address team dynamics, psychological safety, and collective effectiveness — not just individuals.",
        },
        {
          icon: "🤖",
          title: "AI Strategy Coaching",
          description: "Specialized coaching for leaders navigating AI transformation — building strategic AI fluency, managing adoption anxiety, and leading AI-driven change.",
        },
        {
          icon: "🔄",
          title: "Transition Coaching",
          description: "Intensive coaching support for high-stakes leadership transitions — new role, new organization, or new scope. Typically 90-day sprint engagements.",
        },
      ]}
      audiences={[
        "C-suite executives navigating strategic complexity and organizational change",
        "Senior leaders transitioning into expanded roles or new organizations",
        "High-potential leaders accelerating toward senior leadership",
        "Teams facing collective challenges: alignment, trust, performance",
        "Leaders at any level preparing for an AI-driven business environment",
      ]}
      engagementModels={[
        {
          title: "90-Day Sprint",
          description: "Intensive coaching focused on a specific leadership challenge, transition, or capability gap. Six bi-weekly sessions plus continuous support.",
        },
        {
          title: "6-Month Engagement",
          description: "Deep coaching relationship covering multiple developmental priorities. Twelve sessions plus assessment integration and development planning.",
        },
        {
          title: "Ongoing Advisory",
          description: "Long-term strategic coaching relationship for executives who need a trusted sounding board. Monthly sessions, unlimited availability between sessions.",
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
