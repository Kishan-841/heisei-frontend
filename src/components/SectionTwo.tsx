"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

// Each slide can be either one full-width image, or two images shown side-by-side.
// The render logic below switches layout based on `images.length`.
type Slide = {
  images: string[];
  alts: string[];
  // Per-image vertical anchor; defaults to "object-top". Use "object-bottom"
  // when the subject sits low in the frame and we want to crop empty space
  // off the top.
  imagePositions?: string[];
  // When true, we extend the image container past the bottom of the section
  // so the photo's bottom edge gets clipped. Useful for AI-generated images
  // with a watermark in the corner.
  cropBottom?: boolean;
  // When true (single-image slides only), render the image on the right half
  // with a clean cream block on the left half. Use for portrait images that
  // shouldn't span the full width.
  halfImage?: boolean;
};

// Desktop: 2 slides — slide 2 is dual-image side-by-side.
const slidesDesktop: Slide[] = [
  {
    images: ["/landscape 2nd section.png"],
    alts: ["Model wearing HEISEI boxer brief in a classical interior"],
    cropBottom: true,
  },
  {
    images: ["/collections/2nd section 3rd iamge.png", "/section-two-half.png"],
    alts: [
      "Model reading on bed in HEISEI black boxer — quiet morning editorial",
      "Model wearing HEISEI boxer brief — half-frame editorial portrait",
    ],
    imagePositions: ["object-center", "object-center"],
    cropBottom: true,
  },
];

// Mobile: 3 slides — one image per slide, anchored center so the model
// stays in frame on portrait viewports.
const slidesMobile: Slide[] = [
  {
    images: ["/landscape 2nd section.png"],
    alts: ["Model wearing HEISEI boxer brief in a classical interior"],
    imagePositions: ["object-center"],
    cropBottom: true,
  },
  {
    images: ["/collections/2nd section 3rd iamge.png"],
    alts: ["Model reading on bed in HEISEI black boxer — quiet morning editorial"],
    imagePositions: ["object-center"],
    cropBottom: true,
  },
  {
    images: ["/section-two-half.png"],
    alts: ["Model wearing HEISEI boxer brief — half-frame editorial portrait"],
    imagePositions: ["object-center"],
    cropBottom: true,
  },
];

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 1 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? "-100%" : "100%", opacity: 1 }),
};

export default function SectionTwo() {
  const [isMobile, setIsMobile] = useState(false);
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const update = () => {
      setIsMobile(mq.matches);
      setIndex(0);
    };
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const slides = isMobile ? slidesMobile : slidesDesktop;
  const total = slides.length;
  const slide = slides[Math.min(index, total - 1)];

  const prev = () => {
    setDirection(-1);
    setIndex((index - 1 + total) % total);
  };
  const next = () => {
    setDirection(1);
    setIndex((index + 1) % total);
  };

  const isSingle = slide.images.length === 1;

  return (
    <section className="relative h-[60vh] sm:h-[80vh] md:h-[95vh] w-full bg-bg text-text overflow-hidden">
      {/* Image layer — slides left/right on change */}
      <div className="absolute inset-0">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={`slide-${index}`}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className={
              isSingle
                ? "absolute inset-0"
                : "absolute inset-0 grid grid-cols-1 sm:grid-cols-2"
            }
          >
            {isSingle && slide.halfImage ? (
              /*
                HALF IMAGE. Cream block on the left, image on the right half.
                On mobile (< sm), only the image shows full-width.
              */
              <div className="absolute inset-0 grid grid-cols-1 sm:grid-cols-2">
                <div className="hidden sm:block bg-surface" />
                <div className="relative bg-surface overflow-hidden">
                  <div
                    className={
                      slide.cropBottom
                        ? "absolute top-0 left-0 right-0 h-[calc(100%+90px)]"
                        : "absolute inset-0"
                    }
                  >
                    <Image
                      src={slide.images[0]}
                      alt={slide.alts[0]}
                      fill
                      sizes="(max-width: 640px) 100vw, 50vw"
                      priority
                      className="object-cover object-center"
                    />
                  </div>
                </div>
              </div>
            ) : isSingle ? (
              /*
                SINGLE IMAGE — full width. Container extends 90px below so its
                bottom gets clipped by overflow-hidden on the parent (Gemini
                watermark crop).
              */
              <div
                className={
                  slide.cropBottom
                    ? "absolute top-0 left-0 right-0 h-[calc(100%+90px)]"
                    : "absolute inset-0"
                }
              >
                <Image
                  src={slide.images[0]}
                  alt={slide.alts[0]}
                  fill
                  sizes="100vw"
                  priority
                  className={`object-cover ${slide.imagePositions?.[0] ?? "object-top"}`}
                />
              </div>
            ) : (
              /* DUAL IMAGE — side-by-side split on sm+, stacked first on mobile */
              slide.images.map((src, i) => (
                <div
                  key={src}
                  className={`relative h-full w-full bg-surface overflow-hidden ${
                    i === 1 ? "hidden sm:block" : ""
                  }`}
                >
                  <div
                    className={
                      slide.cropBottom
                        ? "absolute top-0 left-0 right-0 h-[calc(100%+90px)]"
                        : "absolute inset-0"
                    }
                  >
                    <Image
                      src={src}
                      alt={slide.alts[i]}
                      fill
                      sizes="(max-width: 640px) 100vw, 50vw"
                      className={`object-cover ${slide.imagePositions?.[i] ?? "object-top"}`}
                    />
                  </div>
                </div>
              ))
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* VIGNETTE — radial darkening at corners */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.35) 85%, rgba(0,0,0,0.55) 100%)",
        }}
      />

      {/* BOTTOM GRADIENT — anchors the CTA */}
      <div
        className="absolute inset-x-0 bottom-0 h-1/2 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 40%, transparent 100%)",
        }}
      />

      {/* Top corner darkeners */}
      <div
        className="absolute top-0 left-0 w-[35%] h-[35%] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at top left, rgba(0,0,0,0.35) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute top-0 right-0 w-[35%] h-[35%] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at top right, rgba(0,0,0,0.35) 0%, transparent 70%)",
        }}
      />

      {/* EXPLORE COLLECTION — centered pill button */}
      <a
        href="/collection"
        className="group absolute left-1/2 -translate-x-1/2 bottom-16 sm:bottom-16 md:bottom-20 z-[4] hidden sm:inline-flex items-center gap-3 px-7 py-3.5 bg-[#0F0F0F]/60 border border-[#F5F1E8]/40 backdrop-blur-md overflow-hidden"
      >
        <span className="absolute inset-0 bg-[#F5F1E8] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
        <span className="relative z-10 text-[11px] tracking-[0.3em] uppercase text-[#F5F1E8] group-hover:text-[#0F0F0F] transition-colors duration-500">
          Explore Collection
        </span>
        <svg
          width="14"
          height="10"
          viewBox="0 0 14 10"
          fill="none"
          className="relative z-10 text-[#F5F1E8] group-hover:text-[#0F0F0F] transition-colors duration-500"
        >
          <path
            d="M1 5 H12 M8 1 L12 5 L8 9"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </a>

      {/* CAROUSEL CONTROLS — bottom right */}
      <div className="absolute bottom-8 sm:bottom-12 md:bottom-20 right-4 sm:right-8 md:right-16 z-[4] flex items-center gap-3 sm:gap-5">
        <button
          onClick={prev}
          aria-label="Previous slide"
          disabled={total <= 1}
          className="group w-11 h-11 rounded-full border border-[#F5F1E8]/60 bg-[#0F0F0F]/40 backdrop-blur-sm flex items-center justify-center hover:bg-[#F5F1E8] transition-all duration-300 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#0F0F0F]/40"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            className="text-[#F5F1E8] group-hover:text-[#0F0F0F] transition-colors duration-300"
          >
            <path
              d="M9 2 L3 7 L9 12"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <div className="flex items-center gap-2 text-xs tracking-widest tabular-nums [text-shadow:0_1px_8px_rgba(0,0,0,0.6)]">
          <span className="text-[#F5F1E8]">{String(index + 1).padStart(2, "0")}</span>
          <span className="w-8 h-[1px] bg-[#F5F1E8]/30" />
          <span className="text-[#EAE4D9]/80">{String(total).padStart(2, "0")}</span>
        </div>

        <button
          onClick={next}
          aria-label="Next slide"
          disabled={total <= 1}
          className="group w-11 h-11 rounded-full border border-[#F5F1E8]/60 bg-[#0F0F0F]/40 backdrop-blur-sm flex items-center justify-center hover:bg-[#F5F1E8] transition-all duration-300 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#0F0F0F]/40"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            className="text-[#F5F1E8] group-hover:text-[#0F0F0F] transition-colors duration-300"
          >
            <path
              d="M5 2 L11 7 L5 12"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </section>
  );
}
