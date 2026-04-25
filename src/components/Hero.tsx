"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import MagneticButton from "@/components/MagneticButton";

export default function Hero() {
  return (
    <section className="relative h-[95vh] w-full text-text overflow-hidden">
      {/* BACKGROUND IMAGE */}
      <div className="absolute inset-0">
        <Image
          src="/section-two-slide-2.png"
          alt="HEISEI — Japanese interior with boxer brief on stone table"
          fill
          priority
          sizes="100vw"
          className="object-cover object-bottom scale-145 origin-bottom"
        />
      </div>

      {/* Bottom vignette — anchors the CTA */}
      <div className="absolute left-0 right-0 bottom-0 h-[28%] bg-gradient-to-t from-black/70 via-black/25 to-transparent pointer-events-none" />

      {/* CTA — centered, bottom */}
      <div className="absolute inset-x-0 bottom-6 sm:bottom-8 md:bottom-10 flex justify-center pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="pointer-events-auto"
        >
          <MagneticButton
            as="a"
            href="/collection"
            className="group relative inline-flex items-center gap-3 px-8 py-3.5 bg-[#0F0F0F]/55 border border-[#F5F1E8]/40 backdrop-blur-md text-[11px] tracking-[0.3em] uppercase cursor-pointer overflow-hidden"
          >
            <span className="absolute inset-0 bg-[#F5F1E8] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
            <span className="relative z-10 text-[#F5F1E8] group-hover:text-[#0F0F0F] transition-colors duration-500">
              Shop Collection
            </span>
            <svg
              width="14"
              height="10"
              viewBox="0 0 14 10"
              fill="none"
              className="relative z-10 text-[#F5F1E8] group-hover:text-[#0F0F0F] transition-colors duration-500"
            >
              <path
                d="M1 5 H12 M8 1 L12 5 L8 9"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </MagneticButton>
        </motion.div>
      </div>
    </section>
  );
}
