import type { Metadata } from "next"
import { SolutionPageTemplate } from "@/components/sections/SolutionPageTemplate"
import { FIRM_NAME } from "@/lib/constants"

export const metadata: Metadata = {
  title: `Organizational Transformation — Culture Change, Team Alignment & Enterprise Leadership | ${FIRM_NAME}`,
  description:
    "Drive organizational transformation through top team alignment, culture change, organizational change management, and enterprise leadership architecture. Built on behavior change, not just strategy.",
}

export default function TransformationPage() {
  return (
    <SolutionPageTemplate
      breadcrumb="Team & Org Transformation"
      phase="04 — Transform"
      phaseIndex={3}
      heroTitle="Transformation isn't an event. It's a practice."
      heroSubtitle="Enterprise-scale organizational transformation that changes how leaders lead, teams collaborate, and organizations perform — sustained over time, embedded in culture, and measured in outcomes."
      challengeTitle="Most transformation initiatives fail because they focus on structure, not leadership."
      challengeBody="Organizational transformations fail at an alarming rate — not because the strategy was wrong, but because the leaders driving the change weren't equipped for it. Culture change is fundamentally a leadership challenge, not a process or structure challenge."
      challengePoints={[
        "Culture transformation programs that don't address leader behavior in specific terms don't change culture.",
        "Team alignment workshops that end without sustained coaching produce temporary alignment at best.",
        "Change management frameworks equip leaders technically but leave them psychologically unprepared.",
        "Organizational design changes without leadership capability development create new structures with old behaviors.",
      ]}
      approachTitle="We change behavior, not just structure."
      approachBody="Our transformation practice works at three levels simultaneously: individual leaders, teams, and organizational systems. Lasting change requires all three to shift together — which is why our engagements integrate coaching, team facilitation, and enterprise design in a single coordinated approach."
      features={[
        {
          icon: "🏔️",
          title: "Top Team Alignment & Integration",
          description: "Structured assessment and facilitation to build executive team trust, clarify collective direction, align on operating norms, and unlock senior team performance. Includes team diagnostic, immersive workshops, and ongoing coaching.",
        },
        {
          icon: "🌱",
          title: "Culture Transformation",
          description: "Identifying, designing, and embedding the leadership behaviors and cultural norms required to execute your organizational strategy. Evidence-based, behavior-first approach with cascading implementation across leadership levels.",
        },
        {
          icon: "🗺️",
          title: "Organizational Change & Adaptive Leadership",
          description: "Leadership capability and change strategy for major transitions — mergers, restructures, digital transformation, and AI adoption. Equips leaders with adaptive capacity, communication frameworks, and psychological resilience.",
        },
        {
          icon: "🏗️",
          title: "Enterprise Leadership Architecture",
          description: "Designing the leadership infrastructure your organization needs to scale: role definitions, capability frameworks, leadership standards, and governance models that make great leadership systematic rather than heroic.",
        },
        {
          icon: "🔗",
          title: "Leadership Pipeline Development",
          description: "Building a robust pipeline of leaders at every level — from first-time managers to C-suite successors. Includes pipeline assessment, targeted development programs, and succession integration.",
        },
      ]}
      audiences={[
        "Enterprise organizations undergoing significant strategic, structural, or cultural transformation",
        "Executive teams that are misaligned, underperforming collectively, or navigating major change",
        "Organizations embarking on AI or digital transformation requiring leadership culture change",
        "Post-merger or acquisition teams needing rapid integration of leadership cultures",
        "Organizations building or rebuilding their leadership architecture from the ground up",
      ]}
      engagementModels={[
        {
          title: "Team Alignment Sprint",
          description: "Intensive 60–90 day engagement to build trust, alignment, and shared direction in a leadership team. Includes team diagnostic, immersive offsite, and coaching integration.",
        },
        {
          title: "Culture Change Program",
          description: "12–18 month culture transformation engagement. Includes diagnostic, behavior design, cascade to all leadership levels, measurement, and ongoing coaching support.",
        },
        {
          title: "Enterprise Transformation Partnership",
          description: "Multi-year organizational transformation support — leadership development, culture evolution, change management, and organizational design advisory across the enterprise.",
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
