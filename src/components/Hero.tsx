"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative h-screen w-full text-text overflow-hidden">
      {/* BACKGROUND IMAGE — vertical 9:16 on mobile, landscape on tablet/desktop */}
      <div className="absolute inset-0">
        <Image
          src="/hero/hero-mobile.png"
          alt="HEISEI — model on velvet chesterfield in classical interior"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center sm:hidden"
        />
        <Image
          src="/hero/hero.png"
          alt="HEISEI — Luxury Innerwear. Thoughtfully engineered, made for how you live."
          fill
          priority
          sizes="100vw"
          className="hidden object-cover object-center sm:block"
        />
      </div>

      {/* Top vignette — gives the transparent navbar a dark band to sit on */}
      <div className="absolute left-0 right-0 top-0 h-[32%] bg-gradient-to-b from-black/85 via-black/40 to-transparent pointer-events-none" />

      {/* Bottom vignette — anchors the CTA */}
      <div className="absolute left-0 right-0 bottom-0 h-[35%] bg-gradient-to-t from-black/85 via-black/40 to-transparent pointer-events-none" />

      {/* CTA — left-aligned, sits just below the image's baked-in subtext */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="absolute left-[6%] top-[46%] sm:top-[45%] z-[4]"
      >
        <a
          href="/collection"
          className="group inline-flex items-center gap-3 text-[#F5F1E8] text-[10px] sm:text-[11px] tracking-[0.3em] uppercase cursor-pointer [text-shadow:0_1px_10px_rgba(0,0,0,0.5)]"
        >
          <span className="relative pb-1">
            Discover HEISEI
            <span className="absolute bottom-0 left-0 h-[1px] w-full bg-[#F5F1E8]/50 origin-left transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-0" />
          </span>
          <svg
            width="26"
            height="8"
            viewBox="0 0 26 8"
            fill="none"
            className="text-[#F5F1E8] transition-transform duration-300 group-hover:translate-x-1.5"
          >
            <path
              d="M0 4 H24 M20 1 L24 4 L20 7"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      </motion.div>
    </section>
  );
}
