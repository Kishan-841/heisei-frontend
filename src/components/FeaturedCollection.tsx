"use client";

import { motion, useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { products } from "@/lib/products";

const colorDots: Record<string, string> = {
  "Sumi Black": "#0F0F0F",
  "Kumo White": "#F0F0F0",
  "Katsu Blue": "#1B2A4A",
  "Kure Slate": "#4A4A4A",
};

const FEATURED_SLUGS = [
  "black-boxer",
  "white-boxer",
  "navy-boxer",
  "slate-boxer",
];

const featured = FEATURED_SLUGS.map(
  (slug) => products.find((p) => p.slug === slug)!
).filter(Boolean);

export default function FeaturedCollection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      className="bg-bg py-20 md:py-16 px-6 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="mb-12 md:mb-16 flex items-end justify-between gap-6 flex-wrap">
          <div>
            <motion.p
              className="text-accent text-sm tracking-widest"
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7 }}
            >
              コレクション
            </motion.p>
            <motion.h2
              className="text-3xl md:text-4xl font-normal tracking-tight mt-3 leading-tight"
              initial={{ opacity: 0, y: 15 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.12 }}
            >
              The Shibui Series
            </motion.h2>
            <motion.p
              className="text-muted mt-3 max-w-md leading-relaxed text-[15px]"
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.25 }}
            >
              Four colorways of our signature boxer brief. Minimal in design, precise in fit.
            </motion.p>
          </div>

          {/* THIN RULE */}
          <motion.div
            className="flex-1 min-w-[80px] h-[1px] bg-muted/25 origin-right mb-3 hidden md:block"
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 1, delay: 0.3 }}
            style={{ transformOrigin: "right center" }}
          />
        </div>

        {/* PRODUCT GRID */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {featured.map((product, i) => {
            const productImgClassName = product.cropBottom
              ? "object-cover"
              : "object-contain object-center";
            const productImgStyle: React.CSSProperties = product.cropBottom
              ? {
                  objectPosition: "center 25%",
                  ...(product.displayScale
                    ? { transform: `scale(${product.displayScale})` }
                    : {}),
                }
              : { transform: `scale(${product.displayScale ?? 1.25})` };

            return (
              <motion.div
                key={product.slug}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.15 + i * 0.08 }}
              >
                <Link
                  href={`/collection/${product.slug}`}
                  className="block group"
                >
                  <div className="relative aspect-[3/4] bg-white overflow-hidden mb-4">
                    <Image
                      src={product.img}
                      alt={`HEISEI ${product.color} ${product.name}`}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className={`${productImgClassName} transition-transform duration-500 ease-out group-hover:scale-[1.03]`}
                      style={productImgStyle}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <p className="text-sm text-text group-hover:text-accent transition-colors duration-200">
                      {product.color} — {product.name}
                    </p>
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full border border-text/10"
                        style={{ backgroundColor: colorDots[product.color] }}
                      />
                      <span className="text-sm text-muted">
                        ₹{product.price.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          className="mt-14 md:mt-20 flex justify-center"
          initial={{ opacity: 0, y: 15 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.6 }}
        >
          <Link
            href="/collection"
            className="group relative inline-flex items-center gap-3 px-9 py-3.5 border border-text text-sm tracking-widest overflow-hidden"
          >
            <span className="absolute inset-0 bg-text origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
            <span className="relative z-10 group-hover:text-bg transition-colors duration-500">
              View Full Collection
            </span>
            <svg
              width="14"
              height="10"
              viewBox="0 0 14 10"
              fill="none"
              className="relative z-10 transition-colors duration-500 group-hover:text-bg"
            >
              <path
                d="M1 5 H12 M8 1 L12 5 L8 9"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
