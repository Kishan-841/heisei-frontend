"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const panels = [
  {
    src: "/section-two/image-1.png",
    alt: "Model wearing the HEISEI black boxer brief by the sea",
    label: "Engineered for Comfort",
  },
  {
    src: "/section-two/image-2.png",
    alt: "HEISEI packaging on draped natural linen",
    label: "Premium Material",
  },
  {
    src: "/section-two/image-3.png",
    alt: "Model in a fitted white HEISEI tee",
    label: "Timeless Essentials",
  },
  {
    src: "/section-two/image-4.png",
    alt: "HEISEI yacht under sail at golden hour",
    label: "Made for Real Life",
  },
];

export default function SectionTwo() {
  return (
    <section className="relative w-full bg-bg text-text overflow-hidden sm:h-[65vh]">
      <div className="grid grid-cols-2 sm:grid-cols-4 sm:h-full">
        {panels.map((p, i) => (
          <motion.div
            key={p.src}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="relative aspect-[2/3] sm:aspect-auto sm:h-full overflow-hidden bg-surface group"
          >
            <Image
              src={p.src}
              alt={p.alt}
              fill
              sizes="(max-width: 640px) 50vw, 25vw"
              className="object-cover object-center transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
            />

            {/* Bottom gradient — keeps the label legible across image variance */}
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/55 via-black/15 to-transparent pointer-events-none" />

            <span className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 text-[#F5F1E8] text-[9px] sm:text-[10px] tracking-[0.3em] uppercase [text-shadow:0_1px_8px_rgba(0,0,0,0.5)] pointer-events-none">
              {p.label}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
