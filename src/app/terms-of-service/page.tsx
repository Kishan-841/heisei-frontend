"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const sections = [
  {
    title: "Acceptance of Terms",
    jp: "承諾",
    content: [
      "By accessing or using the Heisei website and services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.",
      "We reserve the right to modify these terms at any time. Continued use of the website after changes constitutes acceptance of the updated terms.",
    ],
  },
  {
    title: "Account Registration",
    jp: "登録",
    content: [
      "To access certain features, you may need to create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.",
      "You must provide accurate and complete information during registration. You may also checkout as a guest without creating an account. Guest orders are linked to the phone number provided at checkout.",
    ],
  },
  {
    title: "Products & Pricing",
    jp: "商品",
    content: [
      "All product descriptions, images, and specifications are provided for informational purposes. While we strive for accuracy, we do not warrant that product descriptions or prices are error-free.",
      "Prices are displayed in Indian Rupees (INR) and are inclusive of applicable taxes unless stated otherwise. We reserve the right to change prices at any time without prior notice. Orders placed before a price change will be honored at the original price.",
    ],
  },
  {
    title: "Orders & Payment",
    jp: "注文",
    content: [
      "Placing an order constitutes an offer to purchase. We reserve the right to accept or decline any order. An order confirmation does not guarantee product availability.",
      "Currently, we accept Cash on Delivery (COD) as the payment method. The full amount is due at the time of delivery. Refusal to accept delivery may result in the order being cancelled and future order restrictions.",
    ],
  },
  {
    title: "Shipping & Delivery",
    jp: "配送",
    content: [
      "We offer free shipping on orders above the specified threshold (currently orders above a certain value). Standard shipping charges apply to orders below this threshold.",
      "Delivery timelines are estimates and not guaranteed. We are not liable for delays caused by shipping carriers, natural disasters, or circumstances beyond our control. Risk of loss transfers to you upon delivery to the shipping carrier.",
    ],
  },
  {
    title: "Returns & Exchanges",
    jp: "返品",
    content: [
      "We accept returns within 30 days of delivery for unused, unworn items in their original packaging. Underwear and intimate apparel may only be returned if the hygiene seal is intact and the product is in its original, unopened condition.",
      "To initiate a return, contact our support team with your order details. Return shipping costs may be the responsibility of the customer unless the return is due to a defect or error on our part. Refunds will be processed within 7-10 business days of receiving the returned item.",
    ],
  },
  {
    title: "Intellectual Property",
    jp: "知財",
    content: [
      "All content on this website — including text, images, logos, product designs, and the Heisei brand identity — is the property of Heisei and is protected by intellectual property laws.",
      "You may not reproduce, distribute, modify, or create derivative works from any content on this website without our prior written consent. The Heisei name, logo, and all related marks are trademarks of Heisei.",
    ],
  },
  {
    title: "Limitation of Liability",
    jp: "責任",
    content: [
      "Heisei shall not be liable for any indirect, incidental, special, or consequential damages arising from the use of our website or products. Our total liability shall not exceed the amount paid by you for the specific product or service in question.",
      "We do not guarantee uninterrupted or error-free access to our website. We are not responsible for any loss of data or damage resulting from your use of the website.",
    ],
  },
  {
    title: "Governing Law",
    jp: "法律",
    content: [
      "These terms are governed by and construed in accordance with the laws of India. Any disputes arising from these terms or your use of our services shall be subject to the exclusive jurisdiction of the courts in India.",
      "If any provision of these terms is found to be invalid or unenforceable, the remaining provisions shall continue in full force and effect.",
    ],
  },
];

export default function TermsOfServicePage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#ECECEC]">
        {/* Dark Banner */}
        <div className="relative bg-[#0F0F0F] text-[#F7F6F2] overflow-hidden">
          <motion.div
            className="absolute top-[8%] right-[8%] text-[220px] font-light select-none pointer-events-none leading-none"
            style={{ fontFamily: "serif" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.03 }}
            transition={{ duration: 2 }}
          >
            約
          </motion.div>
          <motion.div
            className="absolute top-0 right-[35%] w-[1px] h-full bg-white"
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: 1, opacity: 0.04 }}
            transition={{ duration: 2, delay: 0.3 }}
            style={{ transformOrigin: "top" }}
          />
          <motion.div
            className="absolute top-[60%] left-0 w-full h-[1px] bg-white"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 0.03 }}
            transition={{ duration: 2, delay: 0.5 }}
            style={{ transformOrigin: "right" }}
          />

          <div className="max-w-4xl mx-auto px-6 pt-28 pb-16 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-[#C23B22] text-[10px] tracking-[0.35em] uppercase mb-3">利用規約</p>
              <h1 className="text-3xl md:text-4xl font-normal tracking-tight">Terms of Service</h1>
              <p className="text-[#A8A29E] text-sm mt-3 max-w-lg leading-relaxed">
                The principles that govern our relationship with you — clear, fair, and straightforward.
              </p>
              <p className="text-[#A8A29E]/40 text-xs mt-6">Effective: April 2026</p>
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
              Welcome to Heisei. These terms outline the rules and guidelines for using our website and purchasing our products. We have written them to be as clear and accessible as possible — the same intentionality we bring to everything we make.
            </p>
          </motion.div>

          {/* Table of Contents */}
          <motion.div
            className="bg-white border border-text/10 p-4 sm:p-8 mb-8"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <p className="text-[10px] text-text/40 tracking-[0.25em] uppercase mb-5">Contents</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {sections.map((section, i) => (
                <div key={section.title} className="flex items-center gap-3">
                  <span className="text-[10px] text-text/25 font-mono">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-xs text-text/50">{section.title}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Sections */}
          <div className="space-y-6">
            {sections.map((section, i) => (
              <motion.div
                key={section.title}
                className="bg-white border border-text/10 overflow-hidden"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.04 }}
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
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-[#F5F0EB] rounded-sm flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-text/50">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" strokeLinecap="round"/>
                  <line x1="12" y1="8" x2="12.01" y2="8" strokeLinecap="round"/>
                </svg>
              </div>
              <p className="text-[10px] text-text/50 tracking-[0.25em] uppercase">Questions about these terms?</p>
            </div>
            <p className="text-sm text-text/55 leading-relaxed mb-4">
              If anything is unclear or you need further clarification, our team is here to help.
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
            transition={{ delay: 0.6 }}
          >
            <Link href="/privacy-policy" className="text-xs text-text/40 hover:text-text transition-colors">
              &larr; Privacy Policy
            </Link>
            <Link
              href="/"
              className="text-xs text-text/40 hover:text-accent border-b border-text/15 hover:border-accent pb-0.5 transition-colors"
            >
              Home &rarr;
            </Link>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
