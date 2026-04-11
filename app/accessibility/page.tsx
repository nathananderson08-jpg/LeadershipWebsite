import type { Metadata } from "next"
import { FIRM_NAME } from "@/lib/constants"

export const metadata: Metadata = {
  title: `Accessibility Statement | ${FIRM_NAME}`,
}

export default function AccessibilityPage() {
  return (
    <div className="pt-40 pb-20" style={{ background: "white" }}>
      <div className="container-content max-w-3xl">
        <h1 className="display-md text-navy-900 mb-6">Accessibility Statement</h1>
        <p className="text-neutral-700 leading-relaxed mb-8">{FIRM_NAME} is committed to ensuring digital accessibility for people with disabilities. We continually improve the user experience for everyone and apply relevant accessibility standards.</p>
        <div className="space-y-6 text-neutral-700 leading-relaxed">
          {[
            { heading: "Conformance Status", body: "We aim to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA. These guidelines explain how to make web content more accessible to people with disabilities." },
            { heading: "Technical Specifications", body: "Our website relies on the following technologies for conformance: HTML, CSS, JavaScript. These technologies are relied upon for conformance with the accessibility standards used." },
            { heading: "Feedback", body: "We welcome your feedback on the accessibility of our website. If you experience accessibility barriers, please contact us at accessibility@leadershipfirm.com. We try to respond to feedback within 2 business days." },
            { heading: "Assessment Approach", body: "We assess the accessibility of our website through self-evaluation and periodic third-party audits. We are committed to continuously improving accessibility." },
          ].map((section) => (
            <div key={section.heading}>
              <h2 className="font-700 text-navy-900 text-xl mb-3" style={{ fontWeight: 700 }}>{section.heading}</h2>
              <p>{section.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
