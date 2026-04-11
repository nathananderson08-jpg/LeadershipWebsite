import type { Metadata } from "next"
import { FIRM_NAME } from "@/lib/constants"

export const metadata: Metadata = {
  title: `Privacy Policy | ${FIRM_NAME}`,
  description: "Privacy policy for [FIRM NAME] Leadership.",
}

export default function PrivacyPage() {
  return (
    <div className="pt-40 pb-20" style={{ background: "white" }}>
      <div className="container-content max-w-3xl">
        <h1 className="display-md text-navy-900 mb-6">Privacy Policy</h1>
        <p className="text-sm text-neutral-400 mb-10">Last updated: January 1, 2025</p>
        <div className="space-y-8 text-neutral-700 leading-relaxed">
          {[
            { heading: "Information We Collect", body: "We collect information you provide directly to us, including when you fill out a form, request a consultation, subscribe to our newsletter, or contact us. This may include your name, email address, phone number, company name, and professional title." },
            { heading: "How We Use Your Information", body: "We use the information we collect to respond to your inquiries, provide our services, send you information about our solutions and insights (with your consent), improve our website and services, and comply with legal obligations." },
            { heading: "Information Sharing", body: "We do not sell, trade, or rent your personal information to third parties. We may share your information with trusted service providers who assist us in operating our website and conducting our business, subject to strict confidentiality agreements." },
            { heading: "Data Security", body: "We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction." },
            { heading: "Your Rights", body: "Depending on your location, you may have rights including access to your personal data, correction of inaccurate data, deletion of your data, and opt-out from marketing communications. Contact us at privacy@leadershipfirm.com to exercise these rights." },
            { heading: "Cookies", body: "We use cookies and similar tracking technologies to analyze trends, administer the website, and gather demographic information. You can control cookie preferences through your browser settings." },
            { heading: "Contact Us", body: "If you have questions about this privacy policy, please contact us at privacy@leadershipfirm.com." },
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
