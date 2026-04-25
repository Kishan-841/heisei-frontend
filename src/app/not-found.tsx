"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { products } from "@/lib/products";

export default function NotFound() {
  // Pick 4 products to feature — mix of boxers and trunks
  const featured = [
    ...products.filter((p) => p.category === "Boxer Brief").slice(0, 2),
    ...products.filter((p) => p.category === "Trunk").slice(0, 2),
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-bg text-text">
        {/* ─── HERO BANNER ─── */}
        <section className="relative bg-[#0F0F0F] text-[#F7F6F2] overflow-hidden min-h-screen flex items-center">
          {/* Giant watermark kanji */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 0.04, scale: 1 }}
            transition={{ duration: 2 }}
          >
            <span
              className="text-[52vw] md:text-[32vw] font-light leading-none text-white"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              迷
            </span>
          </motion.div>

          {/* Animated accent lines */}
          <motion.div
            className="absolute top-0 left-[20%] w-[1px] h-full bg-white/10"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
            style={{ transformOrigin: "top" }}
          />
          <motion.div
            className="absolute top-0 right-[20%] w-[1px] h-full bg-white/10"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
            style={{ transformOrigin: "bottom" }}
          />

          <div className="relative z-10 max-w-5xl mx-auto px-6 py-16 text-center w-full">
            {/* Small 404 badge */}
            <motion.div
              className="inline-flex items-center gap-3 mb-8"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <span className="w-8 h-[1px] bg-[#C23B22]" />
              <span className="text-[#C23B22] text-[10px] tracking-[0.4em] uppercase">
                404 · 迷子になった
              </span>
              <span className="w-8 h-[1px] bg-[#C23B22]" />
            </motion.div>

            {/* Big headline */}
            <motion.h1
              className="text-[40px] sm:text-[56px] md:text-[72px] font-light leading-[1.05] tracking-tight mb-6"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              You&rsquo;ve wandered
              <br />
              <span className="italic text-[#A8A29E]">off the path.</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              className="text-[#A8A29E] text-sm md:text-base leading-relaxed max-w-md mx-auto mb-10"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35 }}
            >
              The page you were looking for doesn&rsquo;t exist — but perhaps
              what you needed was here all along. Let&rsquo;s find it together.
            </motion.p>

            {/* CTAs */}
            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
            >
              <Link
                href="/collection"
                className="group relative w-full sm:w-auto min-w-[220px] py-4 px-8 bg-[#F7F6F2] text-[#0F0F0F] text-sm tracking-[0.2em] uppercase overflow-hidden inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="absolute inset-0 bg-[#C23B22] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
                <span className="relative z-10 group-hover:text-[#F7F6F2] transition-colors duration-500 flex items-center gap-2">
                  Explore the Collection
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="transition-transform group-hover:translate-x-0.5"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </span>
              </Link>
              <Link
                href="/"
                className="w-full sm:w-auto min-w-[220px] py-4 px-8 text-[#A8A29E] hover:text-[#F7F6F2] text-sm tracking-[0.2em] uppercase border border-white/15 hover:border-white/35 transition-colors inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
                Back to Home
              </Link>
            </motion.div>
          </div>
        </section>

        {/* ─── FEATURED PRODUCTS ─── */}
        <section className="max-w-7xl mx-auto px-6 py-16 md:py-24">
          <motion.div
            className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-10"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
          >
            <div>
              <p className="text-accent text-[10px] tracking-[0.35em] uppercase mb-2">
                おすすめ · While you&rsquo;re here
              </p>
              <h2 className="text-[26px] md:text-[32px] font-normal tracking-tight">
                Our most-loved pieces
              </h2>
            </div>
            <Link
              href="/collection"
              className="group inline-flex items-center gap-2 text-xs tracking-[0.15em] uppercase text-text/60 hover:text-text transition-colors self-start md:self-auto"
            >
              View all
              <span className="inline-block transition-transform group-hover:translate-x-0.5">
                &rarr;
              </span>
            </Link>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {featured.map((item, i) => (
              <motion.div
                key={item.slug}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.08, duration: 0.6, ease: "easeOut" }}
              >
                <Link href={`/collection/${item.slug}`} className="group block">
                  {/* Image */}
                  <div className="relative aspect-[3/4] bg-surface overflow-hidden">
                    <Image
                      src={item.img}
                      alt={`${item.color} ${item.name}`}
                      fill
                      sizes="(max-width: 640px) 48vw, 22vw"
                      className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.05]"
                    />
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/[0.04] transition-colors duration-500 pointer-events-none" />
                    {/* "View" badge on hover */}
                    <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300 pointer-events-none">
                      <span className="bg-[#0F0F0F] text-[#F7F6F2] text-[10px] tracking-[0.2em] uppercase px-3 py-1.5">
                        View
                      </span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="mt-4 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className="w-2.5 h-2.5 rounded-full border border-text/10 shrink-0"
                          style={{ backgroundColor: item.colorHex }}
                          aria-hidden
                        />
                        <p className="text-[10px] text-text/45 tracking-[0.2em] uppercase">
                          {item.color}
                        </p>
                      </div>
                      <p className="text-sm text-text/80 truncate">{item.name}</p>
                    </div>
                    <p className="text-sm text-text/80 tabular-nums shrink-0">
                      ₹{item.price.toLocaleString("en-IN")}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Quick nav chips */}
          <motion.div
            className="mt-16 pt-10 border-t border-text/[0.06] flex flex-wrap items-center justify-center gap-3"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <span className="text-[11px] text-text/40 tracking-[0.2em] uppercase mr-2">
              Or visit
            </span>
            {[
              { href: "/our-story", label: "Our Story" },
              { href: "/contact", label: "Contact" },
              { href: "/account", label: "Account" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs tracking-[0.15em] uppercase text-text/60 hover:text-text border border-text/15 hover:border-text/50 px-4 py-2 rounded-sm transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </motion.div>
        </section>
      </main>
      <Footer />
    </>
  );
}
