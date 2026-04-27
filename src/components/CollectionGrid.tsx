"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { products } from "@/lib/products";

const colorDots: Record<string, string> = {
  "Sumi Black": "#0F0F0F",
  "Kumo White": "#F0F0F0",
  "Katsu Blue": "#1B2A4A",
  "Kure Slate": "#4A4A4A",
};

const categories = [
  {
    name: "Boxer Brief",
    series: "The Shibui Series-01",
    jp: "ボクサーブリーフ",
    items: products.filter((p) => p.category === "Boxer Brief"),
  },
  {
    name: "Trunk",
    series: "The Shibui Series-02",
    jp: "トランクス",
    items: products.filter((p) => p.category === "Trunk"),
  },
];

function ProductCard({
  product,
  index,
}: {
  product: (typeof products)[0];
  index: number;
}) {
  const [imgIndex, setImgIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState(0);
  const images = [product.img, product.modelImg];

  // For images flagged with cropBottom (e.g. AI-generated with a watermark at
  // the bottom or a coloured backdrop), use object-cover anchored near the top
  // so the bottom gets clipped. A `displayScale` on top of that zooms into the
  // center — useful when the source image has a non-white backdrop that should
  // be cropped out of the card.
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
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      viewport={{ once: true }}
    >
      <Link href={`/collection/${product.slug}`} className="block group">
        {/* IMAGE CONTAINER */}
        <div
          className="relative aspect-[3/4] bg-white overflow-hidden cursor-pointer mb-4"
          onMouseEnter={() => {
            if (window.matchMedia("(hover: hover)").matches) setImgIndex(1);
          }}
          onMouseLeave={() => {
            if (window.matchMedia("(hover: hover)").matches) setImgIndex(0);
          }}
          onTouchStart={(e) => setTouchStartX(e.touches[0].clientX)}
          onTouchEnd={(e) => {
            const diff = touchStartX - e.changedTouches[0].clientX;
            if (diff > 40 && imgIndex < images.length - 1) setImgIndex(1);
            if (diff < -40 && imgIndex > 0) setImgIndex(0);
          }}
        >
          {/* SLIDING IMAGE TRACK — mobile swipe, desktop crossfade */}
          <div
            className="absolute inset-0 md:hidden flex transition-transform duration-400 ease-out"
            style={{ transform: `translateX(-${imgIndex * 100}%)` }}
          >
            <div className="relative w-full h-full flex-shrink-0">
              <Image
                src={product.img}
                alt={`HEISEI ${product.color}`}
                fill
                sizes="50vw"
                className={productImgClassName}
                style={productImgStyle}
              />
            </div>
            <div className="relative w-full h-full flex-shrink-0">
              <Image
                src={product.modelImg}
                alt={`Model wearing HEISEI ${product.color}`}
                fill
                sizes="50vw"
                className="object-cover object-center"
              />
            </div>
          </div>

          {/* DESKTOP CROSSFADE — hidden on mobile */}
          <Image
            src={product.img}
            alt={`HEISEI ${product.color}`}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className={`hidden md:block ${productImgClassName} transition-opacity duration-500 ${
              imgIndex === 1 ? "opacity-0" : "opacity-100"
            }`}
            style={productImgStyle}
          />
          <Image
            src={product.modelImg}
            alt={`Model wearing HEISEI ${product.color}`}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className={`hidden md:block object-cover object-center transition-opacity duration-500 ${
              imgIndex === 1 ? "opacity-100" : "opacity-0"
            }`}
          />

          {/* MOBILE DOTS INDICATOR */}
          <div className="md:hidden absolute bottom-2.5 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {images.map((_, i) => (
              <span
                key={i}
                className={`w-1 h-1 rounded-full transition-colors duration-300 ${
                  i === imgIndex ? "bg-text" : "bg-text/25"
                }`}
              />
            ))}
          </div>
        </div>

        {/* PRODUCT INFO */}
        <div className="space-y-1">
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
}

export default function CollectionGrid() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-16 py-12 md:py-20">
      {/* PAGE HEADER */}
      <div className="mb-16 md:mb-24">
        <motion.p
          className="text-accent text-sm tracking-widest mb-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          コレクション
        </motion.p>
        <motion.h1
          className="text-4xl md:text-5xl font-normal tracking-tight"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          The Collection
        </motion.h1>
        <motion.p
          className="text-muted mt-4 max-w-md leading-relaxed"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          Quiet essentials designed with balance, softness, and intention.
        </motion.p>
      </div>

      {/* CATEGORIES */}
      {categories.map((category, ci) => (
        <div key={category.name} className={ci > 0 ? "mt-20 md:mt-28" : ""}>
          <div className="mb-10">
            {category.series && (
              <motion.h2
                className="text-2xl md:text-3xl font-normal tracking-tight text-text"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                {category.series}
              </motion.h2>
            )}
            <div className="flex items-end gap-4 mt-1">
              <motion.h3
                className="text-lg md:text-xl font-light tracking-tight text-muted"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                {category.name}
              </motion.h3>
              <motion.span
                className="text-accent text-xs tracking-widest pb-1"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.15 }}
              >
                {category.jp}
              </motion.span>
            </div>
          </div>

          <motion.div
            className="h-[1px] bg-text/8 mb-10"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            style={{ transformOrigin: "left center" }}
          />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 md:gap-8">
            {category.items.map((product, pi) => (
              <ProductCard key={product.slug} product={product} index={pi} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
