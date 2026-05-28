"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const serifFamily = "Georgia, 'Times New Roman', serif";

const slides = [
  {
    src: "/hero/hero.png",
    alt: "HEISEI — yacht at golden hour by the sea",
  },
  {
    src: "/hero/hero 2.png",
    alt: "HEISEI — model in a sunlit onsen interior",
  },
  {
    src: "/hero/hero 3.png",
    alt: "HEISEI — model in black boxer brief on a coastal terrace at sunset",
  },
];

const SLIDE_INTERVAL_MS = 5000;
const SLIDE_DURATION_MS = 1200;

// direction = +1 → forward (next button or autoplay): new slide enters from
//   the right, old slide exits to the left.
// direction = -1 → backward (prev button): new slide enters from the left,
//   old slide exits to the right.
const slideVariants = {
  enter: (direction: number) => ({ x: direction > 0 ? "100%" : "-100%" }),
  center: { x: "0%" },
  exit: (direction: number) => ({ x: direction > 0 ? "-100%" : "100%" }),
};

export default function Hero() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  // Guard against rapid-fire clicks queuing multiple in-flight transitions.
  const isAnimating = useRef(false);

  // Preload every slide image on mount so wrap-around (last → first) and
  // forward advances never trigger a network fetch mid-transition.
  useEffect(() => {
    const links: HTMLLinkElement[] = [];
    slides.forEach((s) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = s.src;
      document.head.appendChild(link);
      links.push(link);
    });
    return () => links.forEach((l) => l.remove());
  }, []);

  // Autoplay — restarts when `index` changes (manual nav or wrap) so the
  // freshly-shown slide always gets a full SLIDE_INTERVAL_MS dwell.
  useEffect(() => {
    const id = setInterval(() => {
      if (isAnimating.current) return;
      isAnimating.current = true;
      setDirection(1);
      setIndex((i) => (i + 1) % slides.length);
    }, SLIDE_INTERVAL_MS);
    return () => clearInterval(id);
  }, [index]);

  const goPrev = () => {
    if (isAnimating.current) return;
    isAnimating.current = true;
    setDirection(-1);
    setIndex((i) => (i - 1 + slides.length) % slides.length);
  };
  const goNext = () => {
    if (isAnimating.current) return;
    isAnimating.current = true;
    setDirection(1);
    setIndex((i) => (i + 1) % slides.length);
  };

  return (
    <section className="relative h-screen w-full text-text overflow-hidden">
      {/* MOBILE BACKGROUND — single vertical image */}
      <div className="absolute inset-0 sm:hidden">
        <Image
          src="/hero/hero-mobile.png"
          alt="HEISEI — Luxury Innerwear"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>

      {/* DESKTOP BACKGROUND — auto-advancing slide carousel */}
      <div className="absolute inset-0 hidden sm:block overflow-hidden">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={slides[index].src}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: SLIDE_DURATION_MS / 1000, ease: [0.22, 1, 0.36, 1] }}
            onAnimationComplete={(d) => {
              if (d === "center") isAnimating.current = false;
            }}
            style={{ willChange: "transform" }}
            className="absolute inset-0"
          >
            <Image
              src={slides[index].src}
              alt={slides[index].alt}
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Top vignette — gives the transparent navbar a dark band to sit on */}
      <div className="absolute left-0 right-0 top-0 h-[32%] bg-gradient-to-b from-black/80 via-black/30 to-transparent pointer-events-none" />

      {/* Left wash — boosts text legibility over the water */}
      <div className="absolute inset-y-0 left-0 w-full sm:w-[55%] bg-gradient-to-r from-black/55 via-black/25 to-transparent pointer-events-none" />

      {/* Bottom vignette — soft anchor for the section transition */}
      <div className="absolute left-0 right-0 bottom-0 h-[20%] bg-gradient-to-t from-black/45 to-transparent pointer-events-none" />

      {/* HEADLINE BLOCK — left-aligned, vertically centered */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="absolute left-[6%] sm:left-[7%] md:left-[8%] top-1/2 -translate-y-1/2 max-w-[92%] sm:max-w-md z-[3] [text-shadow:0_2px_18px_rgba(0,0,0,0.5)]"
      >
        <h1
          className="text-[#F5F1E8] text-5xl sm:text-6xl md:text-7xl font-normal leading-[1.05] tracking-tight"
          style={{ fontFamily: serifFamily }}
        >
          Luxury<br />Innerwear.
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="mt-6 text-[#F5F1E8]/85 text-sm sm:text-base leading-relaxed max-w-xs"
        >
          Refined essentials for<br />everyday living.
        </motion.p>

        <motion.a
          href="/collection"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="group mt-8 inline-flex items-center gap-3 text-[#F5F1E8] text-[10px] sm:text-[11px] tracking-[0.3em] uppercase cursor-pointer"
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
        </motion.a>
      </motion.div>

      {/* CAROUSEL CONTROLS — bottom-right, desktop only */}
      <div className="absolute bottom-8 md:bottom-12 right-6 md:right-12 z-[5] hidden sm:flex items-center gap-4">
        <button
          onClick={goPrev}
          aria-label="Previous slide"
          className="group w-10 h-10 rounded-full border border-[#F5F1E8]/50 bg-black/30 backdrop-blur-sm flex items-center justify-center hover:bg-[#F5F1E8] transition-all duration-300 cursor-pointer"
        >
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none" className="text-[#F5F1E8] group-hover:text-[#0F0F0F] transition-colors duration-300">
            <path d="M9 2 L3 7 L9 12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div className="text-[#F5F1E8] text-xs tracking-widest tabular-nums [text-shadow:0_1px_8px_rgba(0,0,0,0.6)] flex items-center gap-2">
          <span>{String(index + 1).padStart(2, "0")}</span>
          <span className="w-6 h-[1px] bg-[#F5F1E8]/40" />
          <span className="text-[#EAE4D9]/70">{String(slides.length).padStart(2, "0")}</span>
        </div>

        <button
          onClick={goNext}
          aria-label="Next slide"
          className="group w-10 h-10 rounded-full border border-[#F5F1E8]/50 bg-black/30 backdrop-blur-sm flex items-center justify-center hover:bg-[#F5F1E8] transition-all duration-300 cursor-pointer"
        >
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none" className="text-[#F5F1E8] group-hover:text-[#0F0F0F] transition-colors duration-300">
            <path d="M5 2 L11 7 L5 12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </section>
  );
}
