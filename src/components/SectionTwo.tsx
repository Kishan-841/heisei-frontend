"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

type Slide = {
  images: [string, string];
  alts: [string, string];
};

const slides: Slide[] = [
  {
    images: [
      "/model-black.png",
      "/model-white.png",
    ],
    alts: [
      "Model wearing HEISEI Sumi Black boxer brief",
      "Model wearing HEISEI Kumo White boxer brief",
    ],
  },
  {
    images: [
      "/model-grey.png",
      "/model-editorial.png",
    ],
    alts: [
      "Model wearing HEISEI Kure Slate boxer brief",
      "Model resting — HEISEI editorial",
    ],
  },
];

export default function SectionTwo() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const total = slides.length;
  const slide = slides[index];

  const prev = () => {
    setDirection(-1);
    setIndex((index - 1 + total) % total);
  };
  const next = () => {
    setDirection(1);
    setIndex((index + 1) % total);
  };

  return (
    <section className="relative h-[80vh] sm:h-[95vh] w-full bg-bg text-text overflow-hidden">
      {/* FULL SCREEN IMAGE CAROUSEL — 2 images side by side on desktop, single on mobile */}
      <div className="absolute inset-0">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={`imgs-${index}`}
            custom={direction}
            initial={{ opacity: 0, x: direction * 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -60 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 grid grid-cols-1 sm:grid-cols-2"
          >
            {slide.images.map((src, i) => (
              <div
                key={src}
                className={`relative h-full w-full bg-surface overflow-hidden ${i === 1 ? "hidden sm:block" : ""}`}
              >
                <Image
                  src={src}
                  alt={slide.alts[i]}
                  fill
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="object-cover object-top"
                />
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* EXPLORE COLLECTION — centered pill button */}
      <a
        href="/collection"
        className="group absolute left-1/2 -translate-x-1/2 bottom-24 sm:bottom-16 md:bottom-20 z-[4] inline-flex items-center gap-3 px-7 py-3.5 border border-[#F5F1E8]/70 backdrop-blur-sm overflow-hidden"
      >
        <span className="absolute inset-0 bg-[#F5F1E8] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
        <span className="relative z-10 text-[11px] tracking-[0.3em] uppercase text-[#F5F1E8] group-hover:text-[#0F0F0F] transition-colors duration-500">
          Explore Collection
        </span>
        <svg width="14" height="10" viewBox="0 0 14 10" fill="none" className="relative z-10 text-[#F5F1E8] group-hover:text-[#0F0F0F] transition-colors duration-500">
          <path d="M1 5 H12 M8 1 L12 5 L8 9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>

      {/* CAROUSEL CONTROLS — bottom right */}
      <div className="absolute bottom-8 sm:bottom-16 md:bottom-20 right-4 sm:right-8 md:right-16 z-[4] flex items-center gap-3 sm:gap-5">
        <button
          onClick={prev}
          aria-label="Previous slide"
          className="group w-11 h-11 rounded-full border border-[#F5F1E8]/60 backdrop-blur-sm flex items-center justify-center hover:bg-[#F5F1E8] transition-all duration-300"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-[#F5F1E8] group-hover:text-[#0F0F0F] transition-colors duration-300">
            <path d="M9 2 L3 7 L9 12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div className="flex items-center gap-2 text-xs tracking-widest text-[#EAE4D9]/80 tabular-nums [text-shadow:0_1px_8px_rgba(0,0,0,0.5)]">
          <span className="text-[#F5F1E8]">{String(index + 1).padStart(2, "0")}</span>
          <span className="w-8 h-[1px] bg-[#F5F1E8]/30" />
          <span>{String(total).padStart(2, "0")}</span>
        </div>

        <button
          onClick={next}
          aria-label="Next slide"
          className="group w-11 h-11 rounded-full border border-[#F5F1E8]/60 backdrop-blur-sm flex items-center justify-center hover:bg-[#F5F1E8] transition-all duration-300"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-[#F5F1E8] group-hover:text-[#0F0F0F] transition-colors duration-300">
            <path d="M5 2 L11 7 L5 12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </section>
  );
}
