"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import MagneticButton from "@/components/MagneticButton";

export default function Hero() {
  return (
    <section className="relative h-screen w-full text-text overflow-hidden">
      {/* BACKGROUND IMAGE */}
      <div className="absolute inset-0">
        <Image
          src="/hero-main.png"
          alt="HEISEI — Japanese interior with boxer brief on stone table"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>

      {/* Top gradient for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-transparent pointer-events-none" />

      {/* Bottom vignette */}
      <div className="absolute left-0 right-0 bottom-0 h-[22%] bg-gradient-to-t from-black via-black/70 to-transparent pointer-events-none" />

      {/* Right-bottom corner darkener */}
      <div className="absolute right-0 bottom-0 w-[30%] h-[28%] bg-gradient-to-tl from-black via-black/60 to-transparent pointer-events-none" />

      {/* LEFT JP VERTICAL */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 text-[#F5F1E8]/80 text-sm font-medium tracking-[0.5em] writing-mode-vertical select-none hidden md:block [text-shadow:0_1px_8px_rgba(0,0,0,0.5)]">
        平成
      </div>

      {/* RIGHT EN VERTICAL */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[#F5F1E8]/80 text-sm font-medium tracking-[0.5em] writing-mode-vertical select-none hidden md:block [text-shadow:0_1px_8px_rgba(0,0,0,0.5)]">
        HEISEI
      </div>

      {/* CONTENT OVERLAY */}
      <div className="relative h-full flex flex-col items-center pt-[15vh] md:pt-[18vh] px-6 pointer-events-none">
        <div className="flex flex-col items-center text-center max-w-2xl space-y-5 [text-shadow:0_2px_24px_rgba(0,0,0,0.7)]">
          <motion.p
            className="text-sm text-[#F5F1E8] font-light tracking-widest"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            静けさの中の快適さ
          </motion.p>

          <motion.h1
            className="text-4xl md:text-6xl font-normal leading-tight tracking-tight text-[#F5F1E8]"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Quiet Comfort, Precisely Made
          </motion.h1>

          <motion.p
            className="text-[#F5F1E8] text-base md:text-lg max-w-md leading-relaxed"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Designed with balance, softness, and intention for everyday wear.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="pt-3 [text-shadow:none] pointer-events-auto"
          >
            <MagneticButton
              as="a"
              href="/collection"
              className="group relative px-8 py-3.5 border border-[#0F0F0F] bg-[#0F0F0F] text-sm tracking-widest cursor-pointer inline-block overflow-hidden"
            >
              <span className="absolute inset-0 bg-[#F5F1E8] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
              <span className="relative z-10 text-[#F5F1E8] group-hover:text-[#0F0F0F] transition-colors duration-500">
                Shop Collection
              </span>
            </MagneticButton>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
