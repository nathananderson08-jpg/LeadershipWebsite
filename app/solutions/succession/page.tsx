import type { Metadata } from "next"
import { SolutionPageTemplate } from "@/components/sections/SolutionPageTemplate"
import { FIRM_NAME } from "@/lib/constants"

export const metadata: Metadata = {
  title: `Succession Planning — Leadership Pipeline & Transition Strategy | ${FIRM_NAME}`,
  description:
    "Build a sustainable leadership pipeline with strategic succession planning. High-potential identification, transition planning, and board advisory services.",
}

export default function SuccessionPage() {
  return (
    <SolutionPageTemplate
      breadcrumb="Succession Planning"
      phase="05 — Sustain"
      phaseIndex={4}
      heroTitle="Build the pipeline before you need it."
      heroSubtitle="Strategic succession planning that ensures leadership continuity, pipeline depth, and organizational resilience — long before the vacancy occurs."
      challengeTitle="Most organizations plan for succession too late and too narrowly."
      challengeBody="Succession planning often happens in crisis mode — when a departure forces the question. This reactive approach leads to rushed decisions, costly external hires, and significant disruption. Great succession planning is a continuous capability, not an emergency procedure."
      challengePoints={[
        "Organizations that don't identify high-potentials early miss the critical window for leadership development.",
        "Succession plans that cover only the CEO underestimate the depth of leadership risk.",
        "Pipeline assessments without leadership development plans produce readiness data with no path to readiness.",
        "Board-level succession planning requires a different rigor and confidentiality than corporate planning.",
      ]}
      approachTitle="Succession as a strategic capability, not a compliance exercise."
      approachBody="We build succession systems that identify, develop, and track potential at every level — integrated with assessment, coaching, and leadership development so leaders are ready when the moment comes."
      features={[
        {
          icon: "🗺️",
          title: "Pipeline Mapping",
          description: "Visual, data-driven mapping of your leadership pipeline — identifying depth, gaps, and risk at every critical role level.",
        },
        {
          icon: "⭐",
          title: "High-Potential Identification",
          description: "Rigorous, evidence-based HiPo identification using our proprietary potential framework, calibrated to your organizational context.",
        },
        {
          icon: "🔄",
          title: "Accelerated Development",
          description: "Targeted leadership development programs for identified successors — including stretch assignments, coaching, mentoring, and programmatic learning.",
        },
        {
          icon: "🤝",
          title: "Executive Transition Support",
          description: "Intensive coaching and onboarding support for leaders stepping into critical roles — 90-day, 6-month, and first-year engagement models.",
        },
        {
          icon: "🏛️",
          title: "Board Advisory",
          description: "CEO and board succession advisory, including board effectiveness assessments, director leadership development, and governance frameworks for succession oversight.",
        },
      ]}
      audiences={[
        "Boards and CHROs managing CEO and C-suite succession risk",
        "Organizations with significant leadership retirements in the next 3-5 years",
        "Companies with rapid growth requiring rapid leadership pipeline leadership development",
        "PE-backed companies requiring leadership due diligence and transition planning",
        "Any organization that has experienced unexpected leadership departures",
      ]}
      engagementModels={[
        {
          title: "Pipeline Assessment & Planning",
          description: "6-8 week engagement to assess current pipeline depth, identify key risks, and create a succession roadmap. Delivered to executive team and board.",
        },
        {
          title: "High-Potential Program",
          description: "12-18 month accelerated leadership development program for identified successors — combining assessment, coaching, cohort learning, and stretch assignments.",
        },
        {
          title: "Succession System Build",
          description: "End-to-end design and implementation of a succession system — including governance, tools, processes, calibration cadence, and technology integration.",
        },
      ]}
      relatedSolutions={[
        { title: "Assessment & Diagnostics", href: "/solutions/assessment", phase: "01 Assess" },
        { title: "Executive Coaching", href: "/solutions/coaching", phase: "02 Coach" },
        { title: "Team & Org Transformation", href: "/solutions/transformation", phase: "04 Transform" },
        { title: "C-Suite & Board", href: "/solutions/c-suite", phase: "Audience" },
      ]}
      ctaHeadline="Start building your leadership pipeline today."
    />
  )
}
