"use client";

import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

const steps = [
  {
    title: "Thread Formation",
    jp: "糸",
    img: "/yarn.png",
    desc: "Fine fibers prepared with precision.",
    detail:
      "We source premium micro modal fibres and blend them with elastane for a fabric that breathes, stretches, and softens with every wash.",
    specs: ["90% Micro Modal base", "10% Elastane for stretch", "Pre-treated for shrink resistance"],
  },
  {
    title: "Knitting Fabric",
    jp: "編み",
    img: "/fabric-knitting.png",
    desc: "Structured for softness and durability.",
    detail:
      "Each panel is knitted on fine-gauge machines at controlled tension — creating a fabric that holds its shape without stiffness.",
    specs: ["Fine-gauge circular knit", "200 GSM weight", "4-way stretch construction"],
  },
  {
    title: "Garment Construction",
    jp: "構造",
    img: "/garment-construction.png",
    desc: "Designed for natural movement.",
    detail:
      "Flat-lock seams eliminate bulk. Every stitch is placed for comfort against the skin — no friction, no irritation, just movement.",
    specs: ["Flat-lock seam finishing", "Bonded waistband edge", "Zero-chafe gusset design"],
  },
  {
    title: "Final Form",
    jp: "完成",
    img: "/final-form.png",
    desc: "Refined and ready for everyday wear.",
    detail:
      "Inspected, folded, and presented in matte black packaging. The finished garment is a quiet statement of craft and intention.",
    specs: ["Triple quality inspection", "Hand-folded presentation", "Matte black rigid packaging"],
  },
];

export default function ProcessSection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const lineScaleY = useTransform(scrollYProgress, [0.05, 0.85], [0, 1]);

  return (
    <section
      ref={sectionRef}
      className="bg-bg py-24 md:py-32 px-6 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto">
        {/* HEADING */}
        <div className="mb-20 md:mb-28">
          <motion.p
            className="text-accent text-sm tracking-widest"
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            プロセス
          </motion.p>
          <motion.h2
            className="text-3xl md:text-5xl mt-3 font-normal tracking-tight"
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            From Thread to Form
          </motion.h2>
          <motion.p
            className="text-muted mt-4 max-w-lg leading-relaxed"
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            Four deliberate stages. Each one shapes the comfort you feel.
          </motion.p>
        </div>

        {/* TIMELINE LAYOUT */}
        <div className="relative">
          {/* TIMELINE LINE — left side on desktop, scroll-driven */}
          <motion.div
            className="absolute left-4 md:left-6 top-0 bottom-0 w-[1px] bg-accent/20 origin-top hidden md:block"
            style={{ scaleY: lineScaleY }}
          />

          {steps.map((step, i) => (
            <StepRow key={i} step={step} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StepRow({
  step,
  index,
}: {
  step: (typeof steps)[0];
  index: number;
}) {
  const rowRef = useRef(null);
  const visible = useInView(rowRef, { once: true, margin: "-60px" });

  return (
    <div
      ref={rowRef}
      className={`relative ${index > 0 ? "mt-20 md:mt-32" : ""}`}
    >
      {/* TIMELINE DOT — on the line */}
      <motion.div
        className="absolute left-4 md:left-6 top-0 -translate-x-1/2 hidden md:flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={visible ? { opacity: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="w-3 h-3 rounded-full border-2 border-accent bg-bg" />
      </motion.div>

      {/* STEP NUMBER — next to dot */}
      <motion.div
        className="hidden md:block absolute left-0 md:left-14 top-0"
        initial={{ opacity: 0, x: -10 }}
        animate={visible ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <span className="text-[11px] tracking-[0.3em] text-muted/50 uppercase">
          {String(index + 1).padStart(2, "0")}
        </span>
      </motion.div>

      {/* CONTENT ROW */}
      <div className={`md:pl-20 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14 ${index % 2 !== 0 ? "md:[direction:rtl]" : ""}`}>
        {/* IMAGE */}
        <motion.div
          className="overflow-hidden group relative md:[direction:ltr]"
          initial={{ opacity: 0, y: 30 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          <div className="w-full aspect-[3/4] bg-surface relative overflow-hidden">
            <Image
              src={step.img}
              alt={step.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-top scale-[1.15] -translate-y-[7%] transition-transform duration-700 group-hover:scale-[1.18]"
            />
          </div>
        </motion.div>

        {/* TEXT CONTENT */}
        <motion.div
          className="flex flex-col justify-center space-y-5 md:[direction:ltr]"
          initial={{ opacity: 0, y: 30 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.35, ease: "easeOut" }}
        >
          {/* MOBILE STEP NUMBER */}
          <span className="text-[11px] tracking-[0.3em] text-muted/50 uppercase md:hidden">
            Step {String(index + 1).padStart(2, "0")}
          </span>

          {/* JP LABEL */}
          <p className="text-accent text-sm tracking-widest">{step.jp}</p>

          {/* TITLE */}
          <h3 className="text-2xl md:text-3xl font-normal tracking-tight">
            {step.title}
          </h3>

          {/* RED DIVIDER */}
          <motion.div
            className="h-[1px] w-12 bg-accent/50 origin-left"
            initial={{ scaleX: 0 }}
            animate={visible ? { scaleX: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
          />

          {/* SHORT DESC */}
          <p className="text-text/80 text-base leading-relaxed max-w-md">
            {step.desc}
          </p>

          {/* DETAILED TEXT */}
          <p className="text-muted text-sm leading-relaxed max-w-md">
            {step.detail}
          </p>

          {/* SPECS LIST */}
          <div className="pt-2 space-y-2.5">
            {step.specs.map((spec, si) => (
              <motion.div
                key={si}
                className="flex items-center gap-3"
                initial={{ opacity: 0, x: -10 }}
                animate={visible ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.6 + si * 0.1 }}
              >
                <span className="w-1 h-1 rounded-full bg-accent flex-shrink-0" />
                <span className="text-xs text-muted tracking-wide">{spec}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* CONNECTOR LINE — horizontal from dot to content */}
      <motion.div
        className="absolute left-[11px] md:left-[23px] top-[5px] w-[calc(100%-11px)] md:w-[57px] h-[1px] bg-accent/10 origin-left hidden md:block"
        initial={{ scaleX: 0 }}
        animate={visible ? { scaleX: 1 } : {}}
        transition={{ duration: 0.6, delay: 0.3 }}
      />
    </div>
  );
}
