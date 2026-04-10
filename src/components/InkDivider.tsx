"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function InkDivider() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <div ref={ref} className="relative py-10 md:py-14 overflow-hidden bg-bg">
      <div className="max-w-5xl mx-auto px-6 relative">
        {/* MAIN INK BRUSH STROKE */}
        <motion.svg
          viewBox="0 0 1200 24"
          className="w-full h-6"
          preserveAspectRatio="none"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
        >
          <motion.path
            d="M0 12 C50 4 100 18 200 10 C300 3 350 20 450 12 C550 5 600 17 700 11 C800 6 850 19 950 10 C1050 4 1100 16 1200 12"
            stroke="#A8A29E"
            strokeWidth={1.2}
            strokeLinecap="round"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={isInView ? { pathLength: 1 } : {}}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </motion.svg>

        {/* CENTER RED DOT */}
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-accent rounded-full"
          initial={{ scale: 0, opacity: 0 }}
          animate={isInView ? { scale: 1, opacity: 1 } : {}}
          transition={{ delay: 0.8, duration: 0.4, ease: "easeOut" }}
        />

        {/* SMALL INK SPLATTER DOTS */}
        <motion.div
          className="absolute left-[20%] top-1/2 -translate-y-1/2 w-1 h-1 bg-muted/30 rounded-full"
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : {}}
          transition={{ delay: 1.2, duration: 0.3 }}
        />
        <motion.div
          className="absolute right-[25%] top-[30%] w-[3px] h-[3px] bg-muted/20 rounded-full"
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : {}}
          transition={{ delay: 1.4, duration: 0.3 }}
        />
        <motion.div
          className="absolute right-[15%] top-[65%] w-1 h-1 bg-muted/25 rounded-full"
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : {}}
          transition={{ delay: 1.0, duration: 0.3 }}
        />
      </div>
    </div>
  );
}
