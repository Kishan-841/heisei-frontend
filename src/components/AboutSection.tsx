"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function AboutSection() {
  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Container extended 90px to clip Gemini watermark via overflow-hidden */}
      <div className="absolute top-0 left-0 right-0 h-[calc(100%+90px)]">
        <Image
          src="/about-section.png"
          alt="HEISEI brand visual"
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>

      {/* Bottom-left gradient — anchors the overlaid desc */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.35) 35%, transparent 65%)",
        }}
      />

      {/* OVERLAID CONTENT — bottom-left, editorial */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="absolute left-6 right-6 sm:left-12 md:left-20 lg:left-28 bottom-12 md:bottom-20 max-w-xl space-y-5 [text-shadow:0_2px_28px_rgba(0,0,0,0.85)]"
      >
        <p className="text-accent text-[11px] tracking-[0.35em]">
          私たちについて
        </p>
        <h2 className="text-3xl md:text-4xl font-normal tracking-tight leading-tight text-[#F5F1E8]">
          About HEISEI
        </h2>
        <motion.div
          className="h-[1px] w-12 bg-accent/80 origin-left"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
        />
        <p className="text-[#F5F1E8] text-base md:text-lg leading-relaxed font-light">
          HEISEI was built on a simple idea — the first thing you put on every
          morning should be the finest thing you own.
        </p>
        <p className="text-[#F5F1E8]/85 text-sm md:text-base leading-relaxed max-w-md">
          Fabric milled in Japan, hand-finished by Indian artisans — the
          discipline of one tradition, the heart of another. Minimal in design.
          Precise in fit. Quietly exceptional.
        </p>
        <a
          href="/our-story"
          className="group inline-flex items-center gap-3 pt-3 pb-1 border-b border-[#F5F1E8]/70 text-[11px] tracking-[0.3em] uppercase text-[#F5F1E8] [text-shadow:none] pointer-events-auto"
        >
          <span>Read Our Story</span>
          <svg
            width="14"
            height="10"
            viewBox="0 0 14 10"
            fill="none"
            className="transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1.5"
          >
            <path
              d="M1 5 H12 M8 1 L12 5 L8 9"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      </motion.div>
    </section>
  );
}
