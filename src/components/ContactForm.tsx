"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

export default function ContactForm() {
  const formRef = useRef(null);
  const infoRef = useRef(null);
  const formInView = useInView(formRef, { once: true });
  const infoInView = useInView(infoRef, { once: true });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-bg text-text min-h-screen">
      {/* HERO */}
      <section className="relative pt-24 md:pt-28 pb-8 md:pb-10 px-6 overflow-hidden">
        {/* WATERMARK */}
        <motion.div
          className="absolute right-[5%] top-[5%] text-[220px] md:text-[380px] font-light select-none pointer-events-none leading-none hidden md:block"
          style={{ fontFamily: "serif", color: "rgba(15,15,15,0.025)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 0.5 }}
        >
          連絡
        </motion.div>

        <div className="max-w-5xl mx-auto">
          <motion.p
            className="text-accent text-sm tracking-widest"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            お問い合わせ
          </motion.p>
          <motion.h1
            className="text-4xl md:text-6xl font-normal tracking-tight mt-4 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
          >
            Get in Touch
          </motion.h1>
          <motion.div
            className="h-[2px] w-16 bg-accent mt-5"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            style={{ transformOrigin: "left center" }}
          />
          <motion.p
            className="text-text/70 mt-5 max-w-lg text-base leading-relaxed"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Questions about sizing, orders, or collaborations? We&rsquo;d love
            to hear from you.
          </motion.p>
        </div>
      </section>

      {/* DIVIDER */}
      <div className="max-w-5xl mx-auto px-6">
        <div className="h-[1px] bg-text/8" />
      </div>

      {/* FORM + INFO */}
      <section className="py-10 md:py-14 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-[1fr_340px] gap-16 md:gap-24">
          {/* FORM */}
          <motion.div
            ref={formRef}
            initial={{ opacity: 0, y: 30 }}
            animate={formInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            {submitted ? (
              <motion.div
                className="py-20 text-center"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <p className="text-accent text-sm tracking-widest">送信完了</p>
                <h3 className="text-2xl md:text-3xl font-normal tracking-tight mt-3">
                  Message Sent
                </h3>
                <p className="text-text/70 text-sm mt-4 max-w-sm mx-auto leading-relaxed">
                  Thank you for reaching out. We&rsquo;ll get back to you
                  within 24 hours.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* NAME */}
                <div>
                  <label className="text-[11px] tracking-[0.3em] text-text/75 uppercase block mb-3">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full bg-transparent border-b border-text/25 pb-3 text-sm text-text outline-none focus:border-accent transition-colors duration-300 placeholder:text-text/40"
                    placeholder="Your name"
                  />
                </div>

                {/* EMAIL */}
                <div>
                  <label className="text-[11px] tracking-[0.3em] text-text/75 uppercase block mb-3">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    className="w-full bg-transparent border-b border-text/25 pb-3 text-sm text-text outline-none focus:border-accent transition-colors duration-300 placeholder:text-text/40"
                    placeholder="you@example.com"
                  />
                </div>

                {/* SUBJECT */}
                <div>
                  <label className="text-[11px] tracking-[0.3em] text-text/75 uppercase block mb-3">
                    Subject
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full bg-transparent border-b border-text/25 pb-3 text-sm text-text outline-none focus:border-accent transition-colors duration-300 placeholder:text-text/40"
                    placeholder="What is this regarding?"
                  />
                </div>

                {/* MESSAGE */}
                <div>
                  <label className="text-[11px] tracking-[0.3em] text-text/75 uppercase block mb-3">
                    Message
                  </label>
                  <textarea
                    required
                    rows={5}
                    className="w-full bg-transparent border-b border-text/25 pb-3 text-sm text-text outline-none focus:border-accent transition-colors duration-300 placeholder:text-text/40 resize-none"
                    placeholder="Tell us more..."
                  />
                </div>

                {/* SUBMIT */}
                <button
                  type="submit"
                  className="group relative px-10 py-4 border border-text text-sm tracking-widest cursor-pointer overflow-hidden"
                >
                  <span className="absolute inset-0 bg-text origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
                  <span className="relative z-10 group-hover:text-bg transition-colors duration-500">
                    Send Message
                  </span>
                </button>
              </form>
            )}
          </motion.div>

          {/* INFO SIDEBAR */}
          <motion.div
            ref={infoRef}
            className="space-y-10"
            initial={{ opacity: 0, y: 30 }}
            animate={infoInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            {/* EMAIL */}
            <div>
              <div className="h-[1px] w-full bg-text/8 mb-6" />
              <p className="text-[11px] tracking-[0.3em] text-text/75 uppercase mb-2">
                Email
              </p>
              <a
                href="mailto:hello@heisei.co"
                className="text-sm hover:text-accent transition-colors duration-200"
              >
                hello@heisei.co
              </a>
            </div>

            {/* RESPONSE TIME */}
            <div>
              <div className="h-[1px] w-full bg-text/8 mb-6" />
              <p className="text-[11px] tracking-[0.3em] text-text/75 uppercase mb-2">
                Response Time
              </p>
              <p className="text-sm text-text/70">Within 24 hours</p>
            </div>

            {/* BASED IN */}
            <div>
              <div className="h-[1px] w-full bg-text/8 mb-6" />
              <p className="text-[11px] tracking-[0.3em] text-text/75 uppercase mb-2">
                Based In
              </p>
              <p className="text-sm text-text/70">India</p>
            </div>

            {/* SOCIALS */}
            <div>
              <div className="h-[1px] w-full bg-text/8 mb-6" />
              <p className="text-[11px] tracking-[0.3em] text-text/75 uppercase mb-3">
                Follow
              </p>
              <div className="flex flex-col gap-2">
                {["Instagram", "Twitter / X"].map((social) => (
                  <a
                    key={social}
                    href="#"
                    className="text-sm text-text/70 hover:text-accent transition-colors duration-200"
                  >
                    {social}
                  </a>
                ))}
              </div>
            </div>

            {/* JAPANESE ACCENT */}
            <div className="pt-4">
              <p className="text-accent text-xs tracking-widest">お気軽にどうぞ</p>
              <p className="text-text/60 text-[11px] mt-1">
                Feel free to reach out
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
