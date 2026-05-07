"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

type Value = {
  jp: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
};

const stroke = "#0F0F0F";

const values: Value[] = [
  {
    jp: "静雅",
    title: "Quiet Luxury",
    desc: "An intimate dialogue between skin and substance — the rarest fiber, curated for absolute equilibrium.",
    icon: (
      <svg
        width="38"
        height="38"
        viewBox="0 0 38 38"
        fill="none"
        stroke={stroke}
        strokeWidth="1"
        strokeLinecap="round"
      >
        <path d="M4 10 H34" />
        <path d="M4 19 H34" />
        <path d="M4 28 H34" />
        <path d="M10 4 V34" opacity="0.5" />
        <path d="M19 4 V34" opacity="0.5" />
        <path d="M28 4 V34" opacity="0.5" />
      </svg>
    ),
  },
  {
    jp: "合作",
    title: "Japanese Purity, Indian Intent",
    desc: "Fabric milled in Japan, hand-finished by Indian artisans — the discipline of one tradition, the heart of another.",
    icon: (
      <svg
        width="38"
        height="38"
        viewBox="0 0 38 38"
        fill="none"
        stroke={stroke}
        strokeWidth="1"
        strokeLinecap="round"
      >
        <path d="M5 19 C12 10, 26 28, 33 19" />
        <path d="M8 19 L11 19" />
        <path d="M14 15 L17 15" />
        <path d="M21 23 L24 23" />
        <path d="M27 19 L30 19" />
      </svg>
    ),
  },
  {
    jp: "極上",
    title: "The Most Exclusive Quality",
    desc: "The world's most disciplined micro-gauge knit — conceived for the skin.",
    icon: (
      <svg
        width="38"
        height="38"
        viewBox="0 0 38 38"
        fill="none"
        stroke={stroke}
        strokeWidth="1"
        strokeLinecap="round"
      >
        <circle cx="19" cy="19" r="13" opacity="0.9" />
        <path d="M19 19 m-6 0 a6 6 0 0 1 12 0 a6 6 0 0 1 -12 0" opacity="0.4" />
        <circle cx="19" cy="19" r="1" fill={stroke} stroke="none" />
      </svg>
    ),
  },
];

export default function ValuesStrip() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      ref={ref}
      className="bg-surface/60 border-y border-muted/15 px-6 py-9 md:py-11"
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 md:gap-0">
        {values.map((v, i) => (
          <motion.div
            key={v.title}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: i * 0.15, ease: "easeOut" }}
            className={`flex items-start gap-5 md:px-8 ${
              i > 0 ? "md:border-l md:border-muted/20" : ""
            }`}
          >
            <div className="flex-shrink-0 mt-1">{v.icon}</div>

            <div className="space-y-2.5 max-w-xs">
              <p className="text-accent text-[11px] tracking-[0.35em]">
                {v.jp}
              </p>
              <h3 className="text-lg md:text-xl font-normal tracking-tight leading-snug">
                {v.title}
              </h3>
              <p className="text-muted text-sm leading-relaxed">{v.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
