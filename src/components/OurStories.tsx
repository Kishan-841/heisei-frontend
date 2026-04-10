"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const values = [
  {
    jp: "抑制",
    title: "Restraint",
    text: "We remove until only what matters remains. Every seam, every stitch exists for a reason.",
  },
  {
    jp: "均衡",
    title: "Balance",
    text: "Between softness and structure. Between visibility and subtlety. We find the middle ground.",
  },
  {
    jp: "意図",
    title: "Intention",
    text: "Nothing is accidental. From fabric weight to waistband tension — each choice is deliberate.",
  },
  {
    jp: "静寂",
    title: "Silence",
    text: "The best underwear is the kind you forget you're wearing. That silence is our highest standard.",
  },
];

export default function OurStories() {
  const heroRef = useRef(null);
  const visionRef = useRef(null);
  const craftRef = useRef(null);
  const productRef = useRef(null);
  const promiseRef = useRef(null);
  const valuesRef = useRef(null);
  const closingRef = useRef(null);

  const heroInView = useInView(heroRef, { once: true });
  const visionInView = useInView(visionRef, { once: true, margin: "-80px" });
  const craftInView = useInView(craftRef, { once: true, margin: "-80px" });
  const productInView = useInView(productRef, { once: true, margin: "-80px" });
  const promiseInView = useInView(promiseRef, { once: true, margin: "-80px" });
  const valuesInView = useInView(valuesRef, { once: true, margin: "-80px" });
  const closingInView = useInView(closingRef, { once: true, margin: "-80px" });

  return (
    <div className="bg-bg text-text min-h-screen">
      {/* HERO */}
      <section ref={heroRef} className="relative pt-24 md:pt-28 pb-12 md:pb-16 px-6 overflow-hidden">
        {/* LARGE WATERMARK */}
        <motion.div
          className="absolute right-[5%] top-[5%] text-[220px] md:text-[400px] font-light select-none pointer-events-none leading-none hidden md:block"
          style={{ color: "rgba(15,15,15,0.03)" }}
          initial={{ opacity: 0 }}
          animate={heroInView ? { opacity: 1 } : {}}
          transition={{ duration: 2, delay: 0.5 }}
        >
          物語
        </motion.div>

        <div className="max-w-5xl mx-auto">
          <motion.p
            className="text-accent text-sm tracking-widest"
            initial={{ opacity: 0, y: 10 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            私たちの物語
          </motion.p>
          <motion.h1
            className="text-4xl md:text-6xl font-normal tracking-tight mt-4 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.15 }}
          >
            Our Story
          </motion.h1>
          <motion.div
            className="h-[2px] w-16 bg-accent mt-8"
            initial={{ scaleX: 0 }}
            animate={heroInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            style={{ transformOrigin: "left center" }}
          />

          <div className="mt-8 max-w-2xl space-y-5">
            <motion.p
              className="text-muted text-[17px] leading-relaxed"
              initial={{ opacity: 0, y: 15 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Every morning, millions of men get dressed with intention. They pick their shirt
              carefully. They choose their shoes deliberately. They build an appearance that reflects
              who they are and where they&rsquo;re going.
            </motion.p>
            <motion.p
              className="text-muted text-[17px] leading-relaxed"
              initial={{ opacity: 0, y: 15 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.55 }}
            >
              And then, without a second thought, they reach for whatever underwear is in the drawer.
            </motion.p>
            <motion.p
              className="text-muted text-[17px] leading-relaxed"
              initial={{ opacity: 0, y: 15 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              We noticed that. And we couldn&rsquo;t ignore it.
            </motion.p>
          </div>
        </div>
      </section>

      {/* QUOTE BREAK — THE FOUNDATION */}
      <section className="py-10 md:py-14 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="border-l-2 border-accent/40 pl-8 md:pl-12 max-w-2xl"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-xl md:text-2xl font-light leading-relaxed tracking-tight text-text/80">
              <span className="text-accent mr-1.5">&ldquo;</span>Underwear is the first thing you put on and the last thing you think about<span className="text-accent ml-1.5">&rdquo;</span>
            </p>
            <p className="text-muted text-[17px] mt-4 leading-relaxed">
              — yet it&rsquo;s with you through every meeting, every commute, every long day and late night.
              It is, quite literally, your foundation.
            </p>
            <p className="text-muted text-[17px] mt-6 leading-relaxed">
              So why has it always been treated as an afterthought? That question is why HEISEI exists.
            </p>
          </motion.div>
        </div>
      </section>

      {/* DIVIDER */}
      <div className="max-w-5xl mx-auto px-6">
        <div className="h-[1px] bg-text/8" />
      </div>

      {/* OUR VISION */}
      <section ref={visionRef} className="py-14 md:py-20 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-10 md:gap-14">
          <div>
            <motion.p
              className="text-accent text-xs tracking-widest"
              initial={{ opacity: 0, y: 10 }}
              animate={visionInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7 }}
            >
              ビジョン
            </motion.p>
            <motion.h2
              className="text-2xl md:text-3xl font-normal tracking-tight mt-3"
              initial={{ opacity: 0, y: 15 }}
              animate={visionInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              Our Vision
            </motion.h2>
          </div>
          <div className="space-y-6">
            <motion.p
              className="text-muted text-[17px] leading-relaxed"
              initial={{ opacity: 0, y: 15 }}
              animate={visionInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              We set out to build a brand that finally gave men&rsquo;s innerwear the respect it
              deserves — not as a commodity, but as a product worth caring about. A product worthy
              of the modern Indian professional who holds himself to a high standard in every area
              of his life.
            </motion.p>
            <motion.p
              className="text-muted text-[17px] leading-relaxed"
              initial={{ opacity: 0, y: 15 }}
              animate={visionInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.35 }}
            >
              We envisioned{" "}
              <span className="text-accent mr-1.5">&ldquo;</span>
              <span className="font-light tracking-tight text-text/80">underwear that wasn&rsquo;t just functional, but genuinely refined</span>
              <span className="text-accent ml-1.5">&rdquo;</span>
              . Underwear you&rsquo;d choose with the same intention you choose everything else.
            </motion.p>
          </div>
        </div>
      </section>

      {/* DIVIDER */}
      <div className="max-w-5xl mx-auto px-6">
        <div className="h-[1px] bg-text/8" />
      </div>

      {/* HOW WE MADE IT */}
      <section ref={craftRef} className="py-14 md:py-20 px-6 relative overflow-hidden">
        {/* WATERMARK */}
        <motion.div
          className="absolute right-[3%] top-[15%] text-[180px] md:text-[280px] font-light select-none pointer-events-none leading-none hidden md:block"
          style={{ color: "rgba(15,15,15,0.03)" }}
          initial={{ opacity: 0 }}
          animate={craftInView ? { opacity: 1 } : {}}
          transition={{ duration: 2, delay: 0.3 }}
        >
          工芸
        </motion.div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-10 md:gap-14">
          <div>
            <motion.p
              className="text-accent text-xs tracking-widest"
              initial={{ opacity: 0, y: 10 }}
              animate={craftInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7 }}
            >
              製法
            </motion.p>
            <motion.h2
              className="text-2xl md:text-3xl font-normal tracking-tight mt-3"
              initial={{ opacity: 0, y: 15 }}
              animate={craftInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              How We Made It
            </motion.h2>
          </div>
          <div className="space-y-6">
            <motion.p
              className="text-muted text-[17px] leading-relaxed"
              initial={{ opacity: 0, y: 15 }}
              animate={craftInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              We knew that to build something truly premium, we had to start at the very beginning —
              the fabric.
            </motion.p>
            <motion.p
              className="text-muted text-[17px] leading-relaxed"
              initial={{ opacity: 0, y: 15 }}
              animate={craftInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.35 }}
            >
              We went to Japan. Not for the name, not for the aesthetic, but because{" "}
              <span className="text-accent mr-1.5">&ldquo;</span>
              <span className="font-light tracking-tight text-text/80">Japanese textile craftsmanship represents the pinnacle of precision, softness, and durability</span>
              <span className="text-accent ml-1.5">&rdquo;</span>
              . We source our fabrics from Japanese mills that have spent generations perfecting what
              it means for something to feel exceptional against your skin.
            </motion.p>
            <motion.p
              className="text-muted text-[17px] leading-relaxed"
              initial={{ opacity: 0, y: 15 }}
              animate={craftInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              Those fabrics then travel home to India, where skilled artisans cut and craft every
              piece with care. The result is a product that carries the discipline of Japanese
              quality and the heart of Indian craftsmanship.
            </motion.p>
          </div>
        </div>
      </section>

      {/* DIVIDER */}
      <div className="max-w-5xl mx-auto px-6">
        <div className="h-[1px] bg-text/8" />
      </div>

      {/* WHAT WE MADE */}
      <section ref={productRef} className="py-14 md:py-20 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-10 md:gap-14">
          <div>
            <motion.p
              className="text-accent text-xs tracking-widest"
              initial={{ opacity: 0, y: 10 }}
              animate={productInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7 }}
            >
              製品
            </motion.p>
            <motion.h2
              className="text-2xl md:text-3xl font-normal tracking-tight mt-3"
              initial={{ opacity: 0, y: 15 }}
              animate={productInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              What We Made
            </motion.h2>
          </div>
          <div className="space-y-6">
            <motion.p
              className="text-muted text-[17px] leading-relaxed"
              initial={{ opacity: 0, y: 15 }}
              animate={productInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="text-accent mr-1.5">&ldquo;</span>
              <span className="font-light tracking-tight text-text/80">The first thing you put on every morning. The last thing you take off every night</span>
              <span className="text-accent ml-1.5">&rdquo;</span>
              . Closer to your skin than anything else you will ever wear.
            </motion.p>
            <motion.p
              className="text-muted text-[17px] leading-relaxed"
              initial={{ opacity: 0, y: 15 }}
              animate={productInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.35 }}
            >
              And yet, for most men, it has never once been worth thinking about.
            </motion.p>
            <motion.p
              className="text-muted text-[17px] leading-relaxed"
              initial={{ opacity: 0, y: 15 }}
              animate={productInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              HEISEI changes that.
            </motion.p>
            <motion.p
              className="text-muted text-[17px] leading-relaxed"
              initial={{ opacity: 0, y: 15 }}
              animate={productInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.65 }}
            >
              Our debut range — briefs and boxers for men — is minimal in design, precise in fit,
              and quietly extraordinary in the way only something truly well-made can be.
            </motion.p>
            <motion.p
              className="text-muted text-[17px] leading-relaxed"
              initial={{ opacity: 0, y: 15 }}
              animate={productInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              Not a statement. Not a compromise. Just the finest foundation you have never thought
              to demand — until now.
            </motion.p>
          </div>
        </div>
      </section>

      {/* QUOTE BREAK — PROMISE */}
      <section ref={promiseRef} className="py-10 md:py-14 px-6 relative">
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="border-l-2 border-accent/40 pl-8 md:pl-12 max-w-3xl"
            initial={{ opacity: 0, x: -20 }}
            animate={promiseInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <p className="text-xs tracking-[0.3em] text-accent/60 uppercase mb-4">
              Our Promise
            </p>
            <p className="text-xl md:text-2xl font-light leading-relaxed tracking-tight text-text/80">
              HEISEI is named after an era defined by harmony and progress. That&rsquo;s not just
              history — it&rsquo;s our standard.
            </p>
            <p className="text-muted text-[17px] leading-relaxed mt-6">
              We will never cut corners on fabric, never compromise on fit, and never treat your
              comfort as secondary. Because we believe that how you feel on the inside shapes how
              you show up on the outside.
            </p>
          </motion.div>
        </div>
      </section>

      {/* DIVIDER */}
      <div className="max-w-5xl mx-auto px-6">
        <div className="h-[1px] bg-text/8" />
      </div>

      {/* VALUES */}
      <section ref={valuesRef} className="py-14 md:py-20 px-6 relative overflow-hidden">
        {/* WATERMARK */}
        <motion.div
          className="absolute left-[3%] bottom-[10%] text-[180px] md:text-[280px] font-light select-none pointer-events-none leading-none hidden md:block"
          style={{ color: "rgba(15,15,15,0.03)" }}
          initial={{ opacity: 0 }}
          animate={valuesInView ? { opacity: 1 } : {}}
          transition={{ duration: 2, delay: 0.3 }}
        >
          道
        </motion.div>

        <div className="max-w-5xl mx-auto">
          <motion.p
            className="text-accent text-sm tracking-widest"
            initial={{ opacity: 0, y: 10 }}
            animate={valuesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            価値観
          </motion.p>
          <motion.h2
            className="text-2xl md:text-3xl mt-3 font-normal tracking-tight"
            initial={{ opacity: 0, y: 15 }}
            animate={valuesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            What We Stand For
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 mt-10 md:mt-14">
            {values.map((value, i) => (
              <motion.div
                key={i}
                className="flex gap-6"
                initial={{ opacity: 0, y: 30 }}
                animate={valuesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.2 + i * 0.12 }}
              >
                {/* RED DOT */}
                <div className="flex-shrink-0 mt-2">
                  <div className="w-2 h-2 rounded-full bg-accent" />
                </div>

                <div>
                  <p className="text-accent text-xs tracking-widest">
                    {value.jp}
                  </p>
                  <h3 className="text-lg font-normal tracking-tight mt-2">
                    {value.title}
                  </h3>
                  <p className="text-muted text-[17px] leading-relaxed mt-3">
                    {value.text}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CLOSING */}
      <section ref={closingRef} className="py-14 md:py-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <motion.p
            className="text-accent text-sm tracking-widest"
            initial={{ opacity: 0, y: 10 }}
            animate={closingInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            平成
          </motion.p>
          <motion.h2
            className="text-2xl md:text-3xl font-normal tracking-tight mt-4 leading-relaxed"
            initial={{ opacity: 0, y: 15 }}
            animate={closingInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.15 }}
          >
            This is not just underwear.
            <br />
            This is the foundation of how you show up.
          </motion.h2>
          <motion.p
            className="text-muted text-base mt-6"
            initial={{ opacity: 0, y: 10 }}
            animate={closingInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Welcome to HEISEI.
          </motion.p>
          <motion.div
            className="h-[2px] w-12 bg-accent mx-auto mt-8"
            initial={{ scaleX: 0 }}
            animate={closingInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          />
          <motion.a
            href="/collection"
            className="group relative inline-block mt-10 px-10 py-4 border border-text text-sm tracking-widest cursor-pointer overflow-hidden"
            initial={{ opacity: 0, y: 10 }}
            animate={closingInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.55 }}
          >
            <span className="absolute inset-0 bg-text origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
            <span className="relative z-10 group-hover:text-bg transition-colors duration-500">
              Shop Collection
            </span>
          </motion.a>
        </div>
      </section>
    </div>
  );
}
