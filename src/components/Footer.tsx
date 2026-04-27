"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function Footer() {
  const footerRef = useRef(null);
  const isInView = useInView(footerRef, { once: true, margin: "-50px" });

  return (
    <footer
      ref={footerRef}
      className="bg-[#0F0F0F] text-[#F7F6F2] relative overflow-hidden"
    >
      {/* UPPER FOOTER — links + newsletter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-16 pt-16 sm:pt-20 md:pt-28 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
          {/* NAVIGATION */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <p className="text-[11px] tracking-[0.3em] text-[#A8A29E] mb-6 uppercase">
              Navigation
            </p>
            <ul className="space-y-3">
              {[
                { label: "Explore", href: "/collection" },
                { label: "Collection", href: "/collection" },
                { label: "Our Story", href: "/our-story" },
                { label: "Account", href: "/account" },
              ].map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="text-sm text-[#A8A29E] hover:text-[#F7F6F2] transition-colors duration-200"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* INFORMATION */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <p className="text-[11px] tracking-[0.3em] text-[#A8A29E] mb-6 uppercase">
              Information
            </p>
            <ul className="space-y-3">
              {[
                { label: "Shipping & Returns", href: "#" },
                { label: "Privacy Policy", href: "/privacy-policy" },
                { label: "Terms of Service", href: "/terms-of-service" },
                { label: "Contact", href: "/contact" },
              ].map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="text-sm text-[#A8A29E] hover:text-[#F7F6F2] transition-colors duration-200"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* NEWSLETTER */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <p className="text-[11px] tracking-[0.3em] text-[#A8A29E] mb-6 uppercase">
              The Archive Newsletter
            </p>
            <p className="text-sm text-[#A8A29E] mb-6 leading-relaxed">
              Receive notes on craft, new arrivals, and exclusive access.
            </p>
            <div className="flex items-center border-b border-[#A8A29E]/30 pb-2">
              <input
                type="email"
                placeholder="Email address"
                className="flex-1 bg-transparent text-sm text-[#F7F6F2] placeholder:text-[#A8A29E]/50 outline-none"
              />
              <button className="text-[11px] tracking-[0.3em] text-[#A8A29E] hover:text-[#F7F6F2] transition-colors duration-200 cursor-pointer uppercase">
                Subscribe
              </button>
            </div>
          </motion.div>
        </div>

        {/* DIVIDER */}
        <motion.div
          className="mt-16 mb-8 h-[1px] bg-[#A8A29E]/15"
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ duration: 1.2, delay: 0.4 }}
          style={{ transformOrigin: "left center" }}
        />

        {/* COPYRIGHT ROW */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <motion.p
            className="text-[11px] tracking-[0.25em] text-[#A8A29E]/50 uppercase"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.6 }}
          >
            &copy; 2026 Heisei. All rights reserved.
          </motion.p>
          <motion.p
            className="text-[11px] tracking-[0.25em] text-[#A8A29E]/50"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.7 }}
          >
            A quiet pursuit of comfort, craft, and form.
          </motion.p>
        </div>
      </div>

      {/* GIANT BRAND NAME — bottom */}
      <div className="relative w-full overflow-hidden pb-4 md:pb-0 max-w-full">
        <motion.h2
          className="text-[14vw] sm:text-[18vw] md:text-[18vw] font-normal leading-[0.85] tracking-tight text-center select-none whitespace-nowrap"
          style={{
            color: "#FFFFFF",
            fontFamily: "Georgia, 'Times New Roman', serif",
          }}
          initial={{ y: 80, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
        >
          HEISEI
        </motion.h2>

        {/* Subtle gradient fade at top of brand text */}
        <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-[#0F0F0F] to-transparent pointer-events-none" />
      </div>
    </footer>
  );
}
