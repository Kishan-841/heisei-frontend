"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

export default function VideoSection() {
  const sectionRef = useRef(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });
  const [isHovered, setIsHovered] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    setHasPlayed(true);
    videoRef.current?.play();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    videoRef.current?.pause();
  };

  return (
    <section
      ref={sectionRef}
      className="bg-bg text-text py-10 md:py-14 px-6 relative overflow-hidden"
    >
      {/* DECORATIVE VERTICAL JP TEXT — left side */}
      <motion.div
        className="absolute left-6 top-1/2 -translate-y-1/2 text-muted text-xs tracking-[0.5em] writing-mode-vertical opacity-30 select-none hidden md:block"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 0.3 } : {}}
        transition={{ duration: 1, delay: 0.5 }}
      >
        映像
      </motion.div>

      <div className="max-w-7xl mx-auto">
        {/* HEADING */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-6 md:mb-8 gap-4">
          <div>
            <motion.p
              className="text-accent text-sm tracking-widest"
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7 }}
            >
              動き
            </motion.p>
            <motion.h2
              className="text-3xl md:text-4xl mt-3 font-normal tracking-tight"
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.15 }}
            >
              In Motion
            </motion.h2>
          </div>

          <motion.p
            className="text-muted text-sm max-w-xs leading-relaxed"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            Movement reveals what stillness cannot. Hover to experience.
          </motion.p>
        </div>

        {/* VIDEO CONTAINER */}
        <motion.div
          className="relative w-full aspect-[16/9] bg-surface overflow-hidden cursor-pointer group"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.2 }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={() => {
            if (!isHovered) {
              handleMouseEnter();
            } else {
              handleMouseLeave();
            }
          }}
        >
          {/* VIDEO PLACEHOLDER */}
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover grayscale"
            muted
            loop
            playsInline
            preload="metadata"
          >
            <source src="https://res.cloudinary.com/da3jdyoh7/video/upload/v1742826476/lv_0_20260324171756_ydspf7.mp4" type="video/mp4" />
          </video>

          {/* PLACEHOLDER OVERLAY — only visible before first play */}
          <div
            className={`absolute inset-0 bg-surface flex items-center justify-center transition-opacity duration-700 ${
              hasPlayed ? "opacity-0 pointer-events-none" : "opacity-100"
            }`}
          >
            {/* Play indicator */}
            <div className="flex flex-col items-center gap-4">
              <motion.div
                className="w-16 h-16 rounded-full border border-text/20 flex items-center justify-center"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="text-text/40 ml-1"
                >
                  <polygon points="5,3 19,12 5,21" />
                </svg>
              </motion.div>
              <span className="text-muted text-xs tracking-widest uppercase">
                <span className="hidden sm:inline">Hover</span>
                <span className="sm:hidden">Tap</span>
                {" "}to Play
              </span>
            </div>
          </div>

          {/* RED ACCENT — small circle, top right corner */}
          <motion.div
            className="absolute top-6 right-6 w-3 h-3 bg-accent rounded-full z-10"
            animate={
              isHovered
                ? { scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }
                : { scale: 1, opacity: 1 }
            }
            transition={{ duration: 1.5, repeat: Infinity }}
          />

          {/* CORNER MARKS — editorial framing */}
          <div className="absolute top-4 left-4 w-5 h-5 border-l border-t border-text/10 z-10" />
          <div className="absolute top-4 right-4 w-5 h-5 border-r border-t border-text/10 z-10" />
          <div className="absolute bottom-4 left-4 w-5 h-5 border-l border-b border-text/10 z-10" />
          <div className="absolute bottom-4 right-4 w-5 h-5 border-r border-b border-text/10 z-10" />

          {/* BOTTOM BAR — subtle info strip */}
          <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-black/20 to-transparent z-10 flex items-end px-6 pb-2">
            <span className="text-[10px] tracking-widest text-white/40 uppercase">
              HEISEI — Quiet Comfort
            </span>
          </div>
        </motion.div>

        {/* BOTTOM DECORATIVE LINE */}
        <motion.div
          className="mt-6 h-[1px] bg-text/5"
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ duration: 1.5, delay: 0.8 }}
          style={{ transformOrigin: "left center" }}
        />
      </div>
    </section>
  );
}
