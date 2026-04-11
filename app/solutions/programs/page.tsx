import type { Metadata } from "next"
import { SolutionPageTemplate } from "@/components/sections/SolutionPageTemplate"
import { FIRM_NAME } from "@/lib/constants"

export const metadata: Metadata = {
  title: `Leadership Development Programs — Academies, Cohort Learning & Custom Curricula | ${FIRM_NAME}`,
  description:
    "Structured leadership development programs for every level and need. From leadership academies to skills training to AI readiness — all designed for behavior change, not just knowledge transfer.",
}

export default function ProgramsPage() {
  return (
    <SolutionPageTemplate
      breadcrumb="Development Programs"
      phase="03 — Develop"
      phaseIndex={2}
      heroTitle="Programs built for scale. Designed for depth."
      heroSubtitle="Leadership development programs that go beyond content delivery — we architect curricula, cohort experiences, and learning systems that produce lasting behavioral change at individual, team, and organizational levels."
      challengeTitle="Most training doesn't transfer. We design for transfer from the start."
      challengeBody="The biggest failure in leadership development is the application gap — the distance between what leaders learn in a program and what they actually change when they return to work. We close that gap through design, not hope."
      challengePoints={[
        "One-off workshops produce knowledge, not behavior change — and knowledge depreciates fast without reinforcement.",
        "Generic curricula miss the specific challenges, culture, and strategic context of your organization.",
        "Programs disconnected from coaching have no mechanism for individual application and accountability.",
        "Learning without measurement has no business case and no feedback loop for continuous improvement.",
      ]}
      approachTitle="Learning architectures that produce lasting capability."
      approachBody="Our programs span individual, team, and organizational levels. We offer six distinct program types — each designed to a specific depth, audience, and type of change. All can be integrated with coaching, assessment, and measurement."
      features={[
        {
          icon: "🎓",
          title: "Leadership Academies",
          description: "Multi-module programs for distinct leadership populations — emerging managers, senior directors, or enterprise-wide transformation. Duration of 6–12 months. Built on cohort-based learning with coaching integration.",
        },
        {
          icon: "⚡",
          title: "Executive Breakthrough Programs",
          description: "High-impact development experiences for senior leaders: immersive workshops, action learning projects, and structured peer challenge. Typically 3–6 months. Combines group learning with individual coaching.",
        },
        {
          icon: "🌱",
          title: "Inner Development & Character Work",
          description: "Programs addressing the inner dimension of leadership — values, purpose, identity, psychological patterns, and leadership character. Often integrated into academy programs or offered as stand-alone development interventions.",
        },
        {
          icon: "🤝",
          title: "Skills Training & Team Effectiveness",
          description: "Targeted skill-building for specific leadership capabilities: communication, feedback, influence, decision-making, and team effectiveness. Modular design allows custom combinations based on diagnostic data.",
        },
        {
          icon: "🤖",
          title: "AI & Leadership Readiness",
          description: "Programs preparing leaders to lead in an AI-enabled environment: strategic AI fluency, human-AI collaboration, managing AI adoption anxiety, and building AI-ready team cultures. Available as stand-alone or integrated into broader academies.",
        },
        {
          icon: "📊",
          title: "Change Management at Scale",
          description: "Leadership development specifically designed for major change programs — restructures, mergers, digital transformations, and AI rollouts. Equips leaders with the mindsets, tools, and communication skills required to lead through uncertainty.",
        },
      ]}
      audiences={[
        "Organizations building systematic leadership pipelines for emerging, mid-level, or senior populations",
        "HR and L&D teams deploying structured programs for defined leadership cohorts",
        "Companies launching leadership academies and needing end-to-end design and facilitation",
        "Organizations with distributed workforces requiring consistent, scalable development experiences",
        "Leaders and teams preparing for AI adoption or significant organizational transformation",
      ]}
      engagementModels={[
        {
          title: "Signature Program (Contextualized)",
          description: "Our proven program designs for specific audiences — emerging, mid-level, or senior — adapted to your organizational culture, strategy, and language. Fastest time to delivery.",
        },
        {
          title: "Custom Program Design",
          description: "Fully bespoke curriculum built around your diagnostic data, organizational challenges, and strategic priorities. 60–90 day design phase, followed by facilitated delivery and measurement.",
        },
        {
          title: "Leadership Academy Build",
          description: "End-to-end design, build, and launch of a multi-year leadership academy — including governance model, cohort architecture, measurement framework, and content licensing.",
        },
      ]}
      relatedSolutions={[
        { title: "Assessment & Diagnostics", href: "/solutions/assessment", phase: "01 Assess" },
        { title: "Executive Coaching", href: "/solutions/coaching", phase: "02 Coach" },
        { title: "Team & Org Transformation", href: "/solutions/transformation", phase: "04 Transform" },
        { title: "Emerging Leaders", href: "/solutions/emerging-leaders", phase: "Audience" },
      ]}
      ctaHeadline="Ready to build your leadership development program?"
    />
  )
}
