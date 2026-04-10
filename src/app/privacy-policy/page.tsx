"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const sections = [
  {
    title: "Information We Collect",
    jp: "収集",
    content: [
      "When you create an account or place an order, we collect your name, phone number, shipping address, and order details. This information is necessary to fulfill your orders and provide customer support.",
      "We may also collect device information, browser type, and browsing patterns on our website to improve your experience. This data is collected through cookies and similar technologies.",
    ],
  },
  {
    title: "How We Use Your Information",
    jp: "使用",
    content: [
      "Your personal information is used to process and deliver orders, manage your account, communicate order updates, and provide customer support.",
      "We may use your contact information to send you updates about new collections, promotions, or changes to our service. You can opt out of marketing communications at any time.",
    ],
  },
  {
    title: "Data Protection",
    jp: "保護",
    content: [
      "We implement industry-standard security measures to protect your personal information. All data transmission is encrypted using SSL/TLS protocols. Your password is stored in a hashed format and is never accessible in plain text.",
      "We do not sell, trade, or rent your personal information to third parties. We may share your data with trusted service providers (such as shipping partners) solely for the purpose of fulfilling your orders.",
    ],
  },
  {
    title: "Cookies & Tracking",
    jp: "追跡",
    content: [
      "Our website uses essential cookies to maintain your session, remember your cart, and keep you logged in. These are necessary for the website to function properly.",
      "We may use analytics cookies to understand how visitors interact with our website. This helps us improve the shopping experience. You can disable non-essential cookies through your browser settings.",
    ],
  },
  {
    title: "Your Rights",
    jp: "権利",
    content: [
      "You have the right to access, update, or delete your personal information at any time through your account settings. You may also request a complete copy of all data we hold about you.",
      "If you wish to delete your account entirely, please contact our support team. We will process your request and remove your data within 30 days, except where retention is required by law.",
    ],
  },
  {
    title: "Data Retention",
    jp: "保持",
    content: [
      "We retain your personal information for as long as your account is active or as needed to provide you services. Order records are kept for a minimum of 5 years for legal and tax compliance purposes.",
      "If you close your account, we will delete or anonymize your personal data within 30 days, except for information we are required to retain by applicable law.",
    ],
  },
  {
    title: "Changes to This Policy",
    jp: "変更",
    content: [
      "We may update this privacy policy from time to time. Any changes will be posted on this page with an updated revision date. We encourage you to review this policy periodically.",
      "For significant changes, we will notify you through your registered contact information or through a prominent notice on our website.",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#ECECEC]">
        {/* Dark Banner */}
        <div className="relative bg-[#0F0F0F] text-[#F7F6F2] overflow-hidden">
          <motion.div
            className="absolute top-[8%] right-[6%] text-[220px] font-light select-none pointer-events-none leading-none"
            style={{ fontFamily: "serif" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.03 }}
            transition={{ duration: 2 }}
          >
            秘
          </motion.div>
          <motion.div
            className="absolute top-0 left-[40%] w-[1px] h-full bg-white"
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: 1, opacity: 0.04 }}
            transition={{ duration: 2, delay: 0.3 }}
            style={{ transformOrigin: "top" }}
          />
          <motion.div
            className="absolute top-[65%] left-0 w-full h-[1px] bg-white"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 0.03 }}
            transition={{ duration: 2, delay: 0.5 }}
            style={{ transformOrigin: "left" }}
          />

          <div className="max-w-4xl mx-auto px-6 pt-28 pb-16 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-[#C23B22] text-[10px] tracking-[0.35em] uppercase mb-3">プライバシーポリシー</p>
              <h1 className="text-3xl md:text-4xl font-normal tracking-tight">Privacy Policy</h1>
              <p className="text-[#A8A29E] text-sm mt-3 max-w-lg leading-relaxed">
                Your trust matters. Here is how we handle your personal information with care and transparency.
              </p>
              <p className="text-[#A8A29E]/40 text-xs mt-6">Last updated: April 2026</p>
            </motion.div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-6 py-12">
          {/* Intro Card */}
          <motion.div
            className="bg-white border border-text/10 p-4 sm:p-8 mb-8"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <p className="text-sm text-text/70 leading-relaxed">
              At Heisei, we believe in the same principles that guide our products — simplicity, care, and intentionality. This policy explains what information we collect, how we use it, and the choices you have. We are committed to protecting your privacy and ensuring your data is handled responsibly.
            </p>
          </motion.div>

          {/* Sections */}
          <div className="space-y-6">
            {sections.map((section, i) => (
              <motion.div
                key={section.title}
                className="bg-white border border-text/10 overflow-hidden"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 + i * 0.05 }}
              >
                {/* Section Header */}
                <div className="px-4 sm:px-8 py-4 sm:py-5 border-b border-text/5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] text-text/25 font-mono">{String(i + 1).padStart(2, "0")}</span>
                    <h2 className="text-base font-medium tracking-tight">{section.title}</h2>
                  </div>
                  <span className="text-accent text-xs tracking-widest">{section.jp}</span>
                </div>
                {/* Section Body */}
                <div className="px-4 sm:px-8 py-5 sm:py-6 space-y-4">
                  {section.content.map((para, pi) => (
                    <p key={pi} className="text-sm text-text/55 leading-relaxed">
                      {para}
                    </p>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Contact Card */}
          <motion.div
            className="bg-white border border-text/10 p-4 sm:p-8 mt-8"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-[#F5F0EB] rounded-sm flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-text/50">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" strokeLinecap="round" strokeLinejoin="round"/>
                  <polyline points="22,6 12,13 2,6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p className="text-[10px] text-text/50 tracking-[0.25em] uppercase">Questions?</p>
            </div>
            <p className="text-sm text-text/55 leading-relaxed mb-4">
              If you have any questions about this privacy policy or how we handle your data, please don&apos;t hesitate to reach out.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 text-xs text-text/50 hover:text-accent border-b border-text/15 hover:border-accent pb-0.5 transition-colors"
            >
              Contact Us &rarr;
            </Link>
          </motion.div>

          {/* Bottom nav */}
          <motion.div
            className="flex items-center justify-between mt-10 pt-6 border-t border-text/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Link href="/" className="text-xs text-text/40 hover:text-text transition-colors">
              &larr; Home
            </Link>
            <Link
              href="/terms-of-service"
              className="text-xs text-text/40 hover:text-accent border-b border-text/15 hover:border-accent pb-0.5 transition-colors"
            >
              Terms of Service &rarr;
            </Link>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
