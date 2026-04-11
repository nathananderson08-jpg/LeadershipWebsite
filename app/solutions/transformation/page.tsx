import type { Metadata } from "next"
import { SolutionPageTemplate } from "@/components/sections/SolutionPageTemplate"
import { FIRM_NAME } from "@/lib/constants"

export const metadata: Metadata = {
  title: `Organizational Transformation — Culture Change & Team Alignment | ${FIRM_NAME}`,
  description:
    "Drive organizational transformation through culture change initiatives, team alignment workshops, and strategic change management. Enterprise-scale leadership transformation.",
}

export default function TransformationPage() {
  return (
    <SolutionPageTemplate
      breadcrumb="Team & Org Transformation"
      phase="04 — Transform"
      phaseIndex={3}
      heroTitle="Transformation isn't an event. It's a practice."
      heroSubtitle="Enterprise-scale organizational transformation that changes how leaders lead, teams collaborate, and organizations perform — sustained over time, not just launched."
      challengeTitle="Most transformation initiatives fail because they focus on structure, not leadership."
      challengeBody="Organizational transformations fail at an alarming rate — not because the strategy was wrong, but because the leaders driving the change weren't equipped for it. Culture change is a leadership challenge, not a process challenge."
      challengePoints={[
        "Culture transformation programs that don't address leadership behavior don't change culture.",
        "Team alignment workshops that end without follow-through produce temporary alignment at best.",
        "Change management frameworks without leadership coaching leave leaders technically prepared but psychologically unprepared.",
        "Organizational design changes without leadership capability development create new structures with old behaviors.",
      ]}
      approachTitle="We change behavior, not just structure."
      approachBody="Our transformation practice works at three levels simultaneously: individual leaders, teams, and organizational systems. Because lasting change requires all three to shift together."
      features={[
        {
          icon: "🌱",
          title: "Culture Transformation",
          description: "Identifying, designing, and embedding the leadership behaviors and cultural norms that will drive your organizational strategy. Evidence-based, behavior-first approach.",
        },
        {
          icon: "🔗",
          title: "Team Alignment",
          description: "Structured facilitation and coaching to build team trust, clarify direction, align on ways of working, and unlock collective performance.",
        },
        {
          icon: "🗺️",
          title: "Change Management",
          description: "Leadership capability and communication strategy for major transitions — mergers, restructures, digital transformation, and AI adoption.",
        },
        {
          icon: "🏗️",
          title: "Organizational Design Support",
          description: "Advisory on organizational structures, role design, and governance that support the leadership behaviors required for strategic success.",
        },
        {
          icon: "🤖",
          title: "AI Adoption Leadership",
          description: "Change management and culture transformation specifically designed for AI adoption — addressing fear, resistance, and the psychological dimensions of AI change.",
        },
      ]}
      audiences={[
        "Enterprise organizations undergoing significant strategic or structural change",
        "Leadership teams that are misaligned or underperforming collectively",
        "Organizations embarking on AI or digital transformation initiatives",
        "Post-merger or acquisition teams needing rapid integration",
        "Organizations with toxic or stagnant cultures requiring fundamental change",
      ]}
      engagementModels={[
        {
          title: "Team Alignment Sprint",
          description: "Intensive 60-90 day engagement to build alignment, trust, and shared direction in a leadership team. Includes diagnostics, workshops, and coaching.",
        },
        {
          title: "Culture Change Program",
          description: "12-18 month culture transformation engagement. Includes diagnostic, design, behavior change cascades, measurement, and leadership coaching integration.",
        },
        {
          title: "Enterprise Transformation",
          description: "Multi-year organizational transformation support — change management, leadership development, culture evolution, and organizational design advisory.",
        },
      ]}
      relatedSolutions={[
        { title: "Executive Coaching", href: "/solutions/coaching", phase: "02 Coach" },
        { title: "Development Programs", href: "/solutions/programs", phase: "03 Develop" },
        { title: "Succession Planning", href: "/solutions/succession", phase: "05 Sustain" },
        { title: "AI Transformation", href: "/solutions/ai-transformation", phase: "All Phases" },
      ]}
      ctaHeadline="Ready to build a leadership culture that lasts?"
    />
  )
}
