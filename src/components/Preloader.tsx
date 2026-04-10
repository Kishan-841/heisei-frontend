"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export default function Preloader() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Total animation ~1.2s, then fade out
    const timer = setTimeout(() => setDone(true), 700);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[9999] bg-bg flex items-center justify-center"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <div className="relative select-none">
            {/* Grey base text */}
            <span
              className="text-5xl md:text-7xl font-medium tracking-[0.3em] text-muted/30"
              style={{ fontFamily: "var(--font-geist-sans)" }}
            >
              HEISEI
            </span>

            {/* Red fill text — clipped and revealed left to right */}
            <motion.span
              className="absolute inset-0 text-5xl md:text-7xl font-medium tracking-[0.3em] text-accent overflow-hidden"
              style={{
                fontFamily: "var(--font-geist-sans)",
                clipPath: "inset(0 100% 0 0)",
              }}
              animate={{ clipPath: "inset(0 0% 0 0)" }}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              HEISEI
            </motion.span>

            {/* Thin underline that draws in */}
            <motion.div
              className="absolute -bottom-3 left-0 h-[2px] bg-accent"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 0.4, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
