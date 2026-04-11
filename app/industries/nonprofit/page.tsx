import type { Metadata } from "next"
import { IndustryPageTemplate } from "@/components/sections/IndustryPageTemplate"
import { FIRM_NAME } from "@/lib/constants"

export const metadata: Metadata = {
  title: `Non-Profit & Social Sector Leadership Development | ${FIRM_NAME}`,
  description: "Leadership development for non-profits, foundations, and social sector organizations. Mission-driven leadership that delivers impact at scale.",
}

export default function NonprofitPage() {
  return (
    <IndustryPageTemplate
      industryName="Non-Profit & Social Sector"
      heroTitle="Leadership in service of something larger."
      heroSubtitle="Non-profit and social sector organizations attract people driven by purpose. But passion is not a substitute for leadership capability. The organizations that deliver the most impact invest the most in developing the leaders who drive it."
      challenges={[
        { title: "Leading Without the Incentives of the Private Sector", desc: "Non-profit leaders can't offer equity or outsized compensation. They retain and motivate talent through mission alignment, culture, and growth opportunity — which requires exceptional leadership to sustain." },
        { title: "Board and Stakeholder Complexity", desc: "Managing relationships with boards, donors, government partners, and community stakeholders simultaneously is a uniquely demanding leadership challenge that most executive directors navigate without support." },
        { title: "Resource Constraints and Burnout", desc: "Leaders in the social sector routinely do more with less — and often carry significant personal weight from the work they do. Sustainable leadership development in this context requires deliberate investment." },
        { title: "Scaling Impact Without Losing Mission", desc: "Growth is complicated for mission-driven organizations. Leaders who can scale programs, partnerships, and operations without diluting purpose or culture are rare and need development." },
      ]}
      lifecycleApplication={[
        { phase: "01 Assess", detail: "Executive director readiness assessments, board effectiveness diagnostics, and organizational health surveys calibrated for the non-profit context." },
        { phase: "02 Coach", detail: "Executive coaching for executive directors and CEOs, leadership transition coaching for founders stepping back or new leaders stepping in, and coaching for senior program leaders." },
        { phase: "03 Develop", detail: "Leadership development programs designed for the resource realities of the social sector — affordable, high-impact, and directly connected to organizational mission and strategy." },
        { phase: "04 Transform", detail: "Strategic planning facilitation, culture alignment for growing organizations, and change management for program pivots, mergers, or major funder transitions." },
        { phase: "05 Sustain", detail: "Succession planning for executive director and C-suite roles, leadership pipeline development, and continuity planning for founder-led organizations." },
      ]}
      insights={[
        { title: "Why Non-Profit Leaders Burn Out — And What Boards Can Do About It", category: "Non-Profit" },
        { title: "The Founder Transition: How to Lead the Most Important Succession in Your Organization's History", category: "Non-Profit" },
        { title: "Scaling Impact Without Scaling Dysfunction", category: "Non-Profit" },
      ]}
      keyword="non-profit"
    />
  )
}
