import type { Metadata } from "next"
import { IndustryPageTemplate } from "@/components/sections/IndustryPageTemplate"
import { FIRM_NAME } from "@/lib/constants"

export const metadata: Metadata = {
  title: `Government & Public Sector Leadership Development | ${FIRM_NAME}`,
  description: "Leadership development for government and public sector organizations. Building capable, accountable, mission-driven public leaders.",
}

export default function GovernmentPage() {
  return (
    <IndustryPageTemplate
      industryName="Government & Public Sector"
      heroTitle="Public leadership demands a different kind of excellence."
      heroSubtitle="Government leaders operate in an environment of public accountability, political complexity, constrained resources, and immense purpose. We develop leaders who can do justice to that responsibility."
      challenges={[
        { title: "Public Accountability & Trust", desc: "Government leaders must perform in a fishbowl — every decision visible, every failure magnified. Building the resilience and judgment for that environment is a distinct development need." },
        { title: "Political Complexity", desc: "Senior public servants and political appointees must navigate the interface between political direction and operational management — a uniquely complex leadership challenge." },
        { title: "Digital Government Transformation", desc: "From AI-powered public services to digital identity, government leaders must drive digital transformation while managing legacy infrastructure, procurement, and public trust." },
        { title: "Workforce Engagement in the Public Sector", desc: "Public sector workforces are often deeply mission-driven but structurally disengaged. Unlocking that motivation requires leadership that connects individual work to public impact." },
      ]}
      lifecycleApplication={[
        { phase: "01 Assess", detail: "Senior civil service assessments, public sector leadership diagnostics, and organizational effectiveness reviews for government departments and agencies." },
        { phase: "02 Coach", detail: "Coaching for permanent secretaries, agency heads, and senior officials navigating the interface of political and operational leadership." },
        { phase: "03 Develop", detail: "Civil service leadership development programs, digital transformation leadership curricula, and public sector executive education." },
        { phase: "04 Transform", detail: "Culture change for government organizations undergoing digital transformation, post-crisis rebuilding, or significant policy-driven restructuring." },
        { phase: "05 Sustain", detail: "Succession planning for senior civil service roles, with particular attention to the development of diverse leadership pipelines in public sector organizations." },
      ]}
      insights={[
        { title: "Public Trust as a Leadership Competency — What Government Leaders Can Learn from Corporate Practice", category: "Government" },
        { title: "Digital Government Needs Digital Leaders: Closing the AI Literacy Gap in the Public Sector", category: "AI & Leadership" },
        { title: "Building a Diverse Pipeline in Government: Progress, Obstacles, and What Works", category: "Succession" },
      ]}
      keyword="government leadership development"
    />
  )
}
