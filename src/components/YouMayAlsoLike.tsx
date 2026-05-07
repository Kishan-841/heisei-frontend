"use client";

import { motion, useInView } from "framer-motion";
import { useMemo, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/lib/products";

/**
 * Shows up to 4 related products on the PDP.
 * Picking logic:
 *   1. Same category, different colors — "shop the range in this fit"
 *   2. If fewer than 4, fill with cross-category products (Boxer → Trunk, etc.)
 *   3. Never include the current product.
 */
function pickRelated(current: Product, all: Product[], max = 4): Product[] {
  const sameCategory = all.filter(
    (p) => p.category === current.category && p.slug !== current.slug
  );
  const otherCategory = all.filter(
    (p) => p.category !== current.category && p.slug !== current.slug
  );
  return [...sameCategory, ...otherCategory].slice(0, max);
}

export default function YouMayAlsoLike({
  product,
  allProducts,
}: {
  product: Product;
  allProducts: Product[];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const related = useMemo(
    () => pickRelated(product, allProducts, 4),
    [product, allProducts]
  );

  if (related.length === 0) return null;

  return (
    <section
      ref={ref}
      className="bg-bg py-16 md:py-24 px-6 border-t border-text/[0.06]"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-10 md:mb-14 flex flex-col md:flex-row md:items-end md:justify-between gap-3"
          initial={{ opacity: 0, y: 15 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div>
            <p className="text-accent text-[10px] tracking-[0.35em] uppercase mb-2">
              おすすめ
            </p>
            <h2 className="text-[26px] md:text-[32px] font-normal tracking-tight">
              You may also like
            </h2>
          </div>
          <Link
            href="/collection"
            className="group hidden md:inline-flex items-center gap-2 text-xs tracking-[0.15em] uppercase text-text/60 hover:text-text transition-colors"
          >
            Shop All
            <span className="inline-block transition-transform group-hover:translate-x-0.5">
              &rarr;
            </span>
          </Link>
        </motion.div>

        {/* Horizontal scroll on mobile, grid on md+ */}
        <div className="relative -mx-6 md:mx-0">
          <div className="flex md:grid md:grid-cols-4 gap-4 md:gap-6 overflow-x-auto md:overflow-visible px-6 md:px-0 snap-x snap-mandatory scrollbar-hide">
            {related.map((item, i) => (
              <motion.div
                key={item.slug}
                className="min-w-[85%] sm:min-w-[42%] md:min-w-0 snap-start"
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1, duration: 0.6, ease: "easeOut" }}
              >
                <Link
                  href={`/collection/${item.slug}`}
                  className="group block"
                  aria-label={`${item.color} ${item.name}`}
                >
                  {/* Image */}
                  <div className="relative aspect-[3/4] bg-surface overflow-hidden">
                    <Image
                      src={item.img}
                      alt={`${item.color} ${item.name}`}
                      fill
                      sizes="(max-width: 640px) 72vw, (max-width: 768px) 42vw, 22vw"
                      className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.04]"
                    />

                    {/* Subtle overlay on hover */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/[0.03] transition-colors duration-500 pointer-events-none" />

                    {/* "View" tag on hover (desktop) */}
                    <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300 hidden md:block pointer-events-none">
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
        </div>

        {/* Mobile "Shop All" fallback */}
        <motion.div
          className="mt-8 text-center md:hidden"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
        >
          <Link
            href="/collection"
            className="inline-flex items-center gap-2 text-xs tracking-[0.15em] uppercase text-text/60 border-b border-text/20 pb-0.5"
          >
            Shop All Collection
            <span>&rarr;</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
