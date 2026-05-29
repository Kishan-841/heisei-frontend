"use client";

import { motion } from "framer-motion";

const serifFamily = "Georgia, 'Times New Roman', serif";

const stats = [
  { value: "08", label: "Pieces" },
  { value: "02", label: "Series" },
  { value: "04", label: "Colorways" },
  { value: "JP × IN", label: "Origin" },
];

export default function CollectionHero() {
  return (
    <section className="relative w-full bg-bg border-b border-text/10 overflow-hidden">
      {/* Faint giant background numeral — editorial decoration */}
      <span
        aria-hidden
        className="pointer-events-none select-none absolute -right-[2%] -top-[8%] text-[40rem] leading-none font-normal text-text/[0.025] hidden md:block"
        style={{ fontFamily: serifFamily }}
      >
        01
      </span>

      <div className="relative max-w-7xl mx-auto px-6 sm:px-10 md:px-16 pt-20 md:pt-28 pb-0">
        {/* Top meta row — series tag (left) + season (right) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center gap-6 mb-12 md:mb-16"
        >
          <span className="text-accent text-[10px] sm:text-[11px] tracking-[0.4em] uppercase">
            The Shibui Series
          </span>
          <span className="flex-1 h-px bg-text/10" />
          <span className="text-muted text-[10px] sm:text-[11px] tracking-[0.3em] uppercase tabular-nums">
            2026 · Permanent
          </span>
        </motion.div>

        {/* MAIN SPLIT — headline left, manifesto quote right */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16">
          {/* Headline + copy */}
          <div className="md:col-span-7">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
              className="text-text font-normal tracking-tight leading-[0.95] text-5xl sm:text-6xl md:text-7xl lg:text-[88px]"
              style={{ fontFamily: serifFamily }}
            >
              The<br />Collection.
            </motion.h1>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformOrigin: "left center" }}
              className="h-px w-16 bg-accent mt-8 mb-7"
            />

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35 }}
              className="text-muted text-base md:text-[17px] leading-relaxed max-w-md"
            >
              Quiet essentials designed with balance, softness, and intention —
              boxer briefs and trunks in premium micro-modal, across four
              colorways.
            </motion.p>
          </div>

          {/* Editorial quote / manifesto */}
          <motion.aside
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="md:col-span-5 md:pl-10 md:border-l md:border-text/10 flex flex-col justify-end pb-2"
          >
            <p
              className="text-text/80 text-xl sm:text-2xl md:text-[26px] leading-[1.35] font-normal"
              style={{ fontFamily: serifFamily, fontStyle: "italic" }}
            >
              <span className="text-accent text-3xl leading-none mr-1 align-top">
                &ldquo;
              </span>
              Underwear is the first thing you put on and the last thing you
              think about — yet it&rsquo;s with you through every meeting,
              every commute, every long day.
              <span className="text-accent text-3xl leading-none ml-1 align-top">
                &rdquo;
              </span>
            </p>
            <p className="mt-5 text-muted text-[10px] sm:text-[11px] tracking-[0.4em] uppercase">
              — HEISEI Manifesto
            </p>
          </motion.aside>
        </div>

        {/* DIVIDER */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: "left center" }}
          className="h-px bg-text/10 mt-14 md:mt-20 mb-0"
        />

        {/* STATS — full-width row at the bottom */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-2 md:grid-cols-4"
        >
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={`py-7 md:py-9 px-2 ${
                i > 0 ? "md:border-l md:border-text/10" : ""
              } ${i >= 2 ? "border-t md:border-t-0 border-text/10" : ""}`}
            >
              <span
                className="block text-text text-3xl md:text-4xl lg:text-5xl font-normal leading-none tabular-nums"
                style={{ fontFamily: serifFamily }}
              >
                {s.value}
              </span>
              <span className="block text-muted text-[10px] sm:text-[11px] tracking-[0.35em] uppercase mt-3">
                {s.label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
