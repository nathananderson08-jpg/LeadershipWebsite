import type { Metadata } from "next"
import { SolutionPageTemplate } from "@/components/sections/SolutionPageTemplate"
import { FIRM_NAME } from "@/lib/constants"

export const metadata: Metadata = {
  title: `Leadership Development Programs — Custom & Cohort-Based Training | ${FIRM_NAME}`,
  description:
    "Structured leadership development programs for every level. Cohort-based learning, custom curricula, and blended delivery integrated with coaching and assessment.",
}

export default function ProgramsPage() {
  return (
    <SolutionPageTemplate
      breadcrumb="Development Programs"
      phase="03 — Develop"
      phaseIndex={2}
      heroTitle="Programs built for scale. Designed for depth."
      heroSubtitle="Leadership development programs that go beyond workshops — we build curricula, cohort experiences, and learning architectures that produce lasting behavioral change."
      challengeTitle="Most training doesn't transfer. We design for transfer from the start."
      challengeBody="The biggest failure in leadership development is the application gap — the distance between what leaders learn in a program and what they actually change when they return to work. We close that gap by design."
      challengePoints={[
        "One-off workshops produce knowledge, not behavior change — and knowledge depreciates fast.",
        "Generic leadership curricula miss the specific challenges, culture, and context of your organization.",
        "Programs disconnected from coaching have no mechanism for individual application.",
        "Learning without measurement has no accountability and no business case.",
      ]}
      approachTitle="Cohort learning meets custom design meets embedded coaching."
      approachBody="Our programs are built on three principles: cohort accountability, contextual relevance, and integration with the broader lifecycle. We don't deliver content — we architect capability."
      features={[
        {
          icon: "🎓",
          title: "Leadership Academies",
          description: "Multi-module programs for distinct leadership populations — emerging leaders, senior directors, or enterprise-wide transformation. Typically 6-12 months.",
        },
        {
          icon: "⚡",
          title: "Cohort-Based Learning",
          description: "Peer cohorts who learn together, challenge each other, and build lasting professional networks. The social architecture of learning matters as much as the content.",
        },
        {
          icon: "🎛️",
          title: "Custom Curriculum Design",
          description: "We design programs from scratch when needed — based on assessment data, organizational strategy, and the specific capability gaps we need to close.",
        },
        {
          icon: "🌐",
          title: "Blended Delivery",
          description: "Virtual, in-person, and hybrid delivery formats optimized for your workforce — including live workshops, digital learning, peer learning circles, and action learning projects.",
        },
        {
          icon: "📊",
          title: "Measurement & Impact Tracking",
          description: "Every program includes measurement architecture: pre/post assessments, behavioral surveys, and impact metrics tied to organizational outcomes.",
        },
      ]}
      audiences={[
        "Organizations building systematic leadership pipelines at scale",
        "HR and L&D teams needing structured programs for defined leadership populations",
        "Companies launching leadership academies for emerging or senior talent",
        "Organizations undergoing significant transformation who need to build new capabilities fast",
        "Companies with distributed workforces who need consistent development experiences",
      ]}
      engagementModels={[
        {
          title: "Signature Program (Off-the-Shelf)",
          description: "Our proven programs for emerging, senior, or C-suite audiences — contextualized for your organization. Fastest time to delivery.",
        },
        {
          title: "Custom Program Design",
          description: "Fully bespoke curriculum designed around your organizational needs, culture, and strategy. 60-90 day design phase, then ongoing facilitation.",
        },
        {
          title: "Leadership Academy Build",
          description: "End-to-end design, build, and launch of a multi-year leadership academy — including governance, measurement, and content licensing.",
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
