"use client";

import Image from "next/image";

export default function ShowcaseBanner() {
  return (
    <section className="relative w-full bg-bg overflow-hidden">
      <div className="relative w-full aspect-[2/1]">
        {/* IMAGE — container extends 100px below the section so the Gemini
            watermark in the bottom-right corner gets clipped by overflow-hidden
            on the parent. Same pattern as SectionTwo's cropBottom slides. */}
        <div className="absolute top-0 left-0 right-0 h-[calc(100%+100px)]">
          <Image
            src="/landscape-showcase.png"
            alt="HEISEI — model wearing navy boxer brief in a brutalist gallery"
            fill
            sizes="100vw"
            className="object-cover object-top"
          />
        </div>

        {/* Bottom gradient — anchors the CTA */}
        <div
          className="absolute inset-x-0 bottom-0 h-1/2 pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)",
          }}
        />

        {/* SHOP NOW — centered bottom pill */}
        <a
          href="/collection"
          className="group absolute left-1/2 -translate-x-1/2 bottom-8 sm:bottom-12 md:bottom-16 z-[4] inline-flex items-center gap-3 px-7 py-3.5 bg-[#0F0F0F]/60 border border-[#F5F1E8]/40 backdrop-blur-md overflow-hidden"
        >
          <span className="absolute inset-0 bg-[#F5F1E8] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
          <span className="relative z-10 text-[11px] tracking-[0.3em] uppercase text-[#F5F1E8] group-hover:text-[#0F0F0F] transition-colors duration-500">
            Shop Now
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
      </div>
    </section>
  );
}
