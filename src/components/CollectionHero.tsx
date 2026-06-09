"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const serifFamily = "Georgia, 'Times New Roman', serif";

export default function CollectionHero() {
  return (
    <section className="relative w-full h-[95vh] bg-bg overflow-hidden">
      <Image
        src="/collection.png"
        alt="HEISEI — the collection: boxer briefs and trunks in premium micro-modal"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />

      {/* LEFT TEXT BLOCK */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="absolute left-[6%] sm:left-[7%] md:left-[8%] top-1/2 -translate-y-[calc(50%+110px)] max-w-[88%] sm:max-w-md z-[3]"
      >
        <h2
          className="text-text font-normal leading-[1.05] tracking-tight text-4xl sm:text-5xl md:text-6xl"
          style={{ fontFamily: serifFamily }}
        >
          Quiet.<br />By Design.
        </h2>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: "left center" }}
          className="h-px w-12 bg-text/30 mt-7 mb-6"
        />

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-text/70 text-sm sm:text-base leading-relaxed"
        >
          Understated in form.<br />
          Meticulous in every detail.<br />
          Made to be felt, not seen.
        </motion.p>
      </motion.div>

      {/* CENTER SPEC LABELS — placed in the empty panel below center */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="absolute left-[49%] top-[83%] -translate-x-1/2 -translate-y-1/2 z-[3] flex flex-col items-start text-left"
      >
        <h3
          className="text-text font-normal leading-[1.05] tracking-tight text-3xl sm:text-4xl"
          style={{ fontFamily: serifFamily }}
        >
          Essentials,<br />Elevated.
        </h3>

        <div className="h-px w-12 bg-text/30 mt-5 mb-6" />

        {["Developed in Japan", "Precision fit", "Small batch production", "Finished in India"].map(
          (label, i) => (
            <span
              key={label}
              className={`flex items-center gap-3 text-text/70 text-sm sm:text-base leading-relaxed ${
                i > 0 ? "mt-2" : ""
              }`}
            >
              <span className="text-text/40 text-xs leading-none">&bull;</span>
              {label}
            </span>
          )
        )}
      </motion.div>
    </section>
  );
}
