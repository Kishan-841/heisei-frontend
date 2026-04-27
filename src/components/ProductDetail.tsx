"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useRef, useState } from "react";
import { Product } from "@/lib/products";
import { useCart } from "@/lib/cart";
import Link from "next/link";

function ZoomTile({
  src,
  alt,
  priority,
}: {
  src: string;
  alt: string;
  priority?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);
  const [origin, setOrigin] = useState({ x: 50, y: 50 });

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setOrigin({ x, y });
  };

  return (
    <div
      ref={ref}
      className="relative aspect-[3/4] bg-surface overflow-hidden cursor-zoom-in"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onMouseMove={handleMove}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 40vw"
        className="object-cover object-center transition-transform duration-300 ease-out will-change-transform"
        style={{
          transform: hovering ? "scale(2)" : "scale(1)",
          transformOrigin: `${origin.x}% ${origin.y}%`,
        }}
        priority={priority}
      />
    </div>
  );
}

type AccordionKey =
  | "description"
  | "material"
  | "care"
  | "item"
  | "size"
  | "returns";

const accordionOrder: { key: AccordionKey; label: string }[] = [
  { key: "description", label: "Description" },
  { key: "material", label: "Material" },
  { key: "care", label: "Care instructions" },
  { key: "item", label: "Item number" },
  { key: "size", label: "Size Guide" },
  { key: "returns", label: "Returns" },
];

export default function ProductDetail({
  product,
  colorVariants,
}: {
  product: Product;
  colorVariants: Product[];
}) {
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [openSection, setOpenSection] = useState<AccordionKey | null>(null);
  const [sizeModalOpen, setSizeModalOpen] = useState(false);
  const { addItem } = useCart();

  const selectedVariant = product.variants?.find((v) => v.size === selectedSize);
  const selectedStock = selectedVariant?.stock ?? Number.POSITIVE_INFINITY;
  const exceedsStock = selectedSize && selectedVariant && quantity > selectedStock;

  const handleAddToCart = () => {
    if (!selectedSize) return;
    if (selectedStock === 0) return;
    if (exceedsStock) return;
    for (let i = 0; i < quantity; i++) {
      addItem({
        slug: product.slug,
        name: product.name,
        color: product.color,
        size: selectedSize,
        price: product.price,
        img: product.img,
      });
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const toggle = (key: AccordionKey) =>
    setOpenSection((prev) => (prev === key ? null : key));

  const gallery = [
    product.img,
    product.modelImg,
    product.closeUpImg ?? product.modelImg,
  ];
  const itemNumber = `HEI-${product.slug.toUpperCase().replace(/-/g, "")}-001`;

  const accordionContent: Record<AccordionKey, React.ReactNode> = {
    description: (
      <p className="text-muted text-[14px] leading-relaxed">
        {product.description}
      </p>
    ),
    material: (
      <ul className="text-muted text-[14px] leading-relaxed space-y-1.5">
        <li>90% Micro Modal, 10% Elastane</li>
        <li>Tonal HEISEI waistband woven in Japan</li>
        <li>Pre-washed for softness and shape retention</li>
      </ul>
    ),
    care: (
      <ul className="text-muted text-[14px] leading-relaxed space-y-1.5">
        <li>Machine wash cold with similar colors</li>
        <li>Do not bleach</li>
        <li>Tumble dry low</li>
        <li>Iron on low if needed</li>
        <li>Do not dry clean</li>
      </ul>
    ),
    item: (
      <p className="text-muted text-[14px] leading-relaxed tracking-wide">
        {itemNumber}
      </p>
    ),
    size: (
      <div className="text-muted text-[14px] leading-relaxed space-y-3">
        <p>Indian sizing — find your size by your waist measurement:</p>
        <ul className="space-y-1">
          <li>S — 28–30&quot; (71–76 cm)</li>
          <li>M — 30–32&quot; (76–81 cm)</li>
          <li>L — 32–34&quot; (81–86 cm)</li>
          <li>XL — 34–36&quot; (86–91 cm)</li>
        </ul>
        <button
          onClick={() => setSizeModalOpen(true)}
          className="inline-flex items-center gap-2 text-text text-[12px] tracking-[0.15em] uppercase border-b border-text pb-0.5 mt-1 hover:gap-3 transition-all cursor-pointer"
        >
          View Full Chart
          <span>→</span>
        </button>
      </div>
    ),
    returns: (
      <div className="text-muted text-[14px] leading-relaxed space-y-3">
        <p>
          <span className="text-text">All innerwear sales are final.</span>{" "}
          For hygiene reasons, we do not accept returns or exchanges on opened
          products.
        </p>
        <p>
          If your order arrives damaged or you receive the wrong item, please
          contact us within 48 hours of delivery and we&rsquo;ll make it right.
        </p>
      </div>
    ),
  };

  return (
    <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-10 md:py-14">
      {/* BREADCRUMB */}
      <motion.div
        className="flex items-center gap-2 text-xs text-muted mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Link href="/collection" className="hover:text-text transition-colors">
          Collection
        </Link>
        <span>/</span>
        <span className="text-text">
          {product.color} — {product.name}
        </span>
      </motion.div>

      <div className="grid md:grid-cols-[1.6fr_1fr] gap-6 md:gap-16 items-start">
        {/* LEFT — IMAGE GRID (2x2) */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          {gallery.map((src, i) => (
            <ZoomTile
              key={`${src}-${i}`}
              src={src}
              alt={`HEISEI ${product.color} ${product.name} — view ${i + 1}`}
              priority={i === 0}
            />
          ))}

          {/* BENEFITS CARD — replaces 4th image */}
          <div className="relative aspect-[3/4] bg-[#0F0F0F] text-[#F5F1E8] overflow-hidden flex flex-col justify-between p-6 md:p-8">
            <p className="text-[10px] md:text-[11px] tracking-[0.25em] uppercase text-[#F5F1E8]/70 text-center">
              The Finest Everyday Essential
            </p>

            <div className="space-y-5">
              <h3 className="text-xl md:text-2xl font-normal tracking-tight text-center leading-snug">
                The HEISEI{" "}
                <span className="underline underline-offset-4 decoration-1">
                  Benefits
                </span>
              </h3>

              <ul className="space-y-2 text-[11px] md:text-[12px] leading-relaxed text-[#EAE4D9]/85">
                <li className="flex gap-2">
                  <span className="text-[#F5F1E8]">•</span>
                  <span>Second-skin feel, close-fitting and elastic</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#F5F1E8]">•</span>
                  <span>90% Micro Modal, 10% Elastane</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#F5F1E8]">•</span>
                  <span>Sourced from sustainable European beechwood</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#F5F1E8]">•</span>
                  <span>Fine-gauge single jersey knit, pre-washed for softness</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#F5F1E8]">•</span>
                  <span>Flat-lock seams for zero-chafe comfort</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#F5F1E8]">•</span>
                  <span>Tonal HEISEI waistband, woven in Japan</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#F5F1E8]">•</span>
                  <span>Breathable, thermo-regulating all day</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col items-center gap-1">
              <span className="text-[10px] tracking-[0.4em] text-[#F5F1E8]/60">
                平成
              </span>
              <span className="text-base tracking-[0.25em] font-medium">
                HEISEI
              </span>
            </div>
          </div>
        </motion.div>

        {/* RIGHT — PRODUCT INFO (sticky) */}
        <motion.div
          className="md:sticky md:top-24 space-y-7"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          {/* TITLE */}
          <div>
            <p className="text-accent text-[11px] tracking-[0.25em] uppercase mb-3">
              {product.categoryJp}
            </p>
            <h1 className="text-2xl md:text-[28px] font-normal tracking-tight leading-snug">
              {product.name} — {product.color}
            </h1>
            <p className="text-text/70 text-base mt-2">
              ₹{product.price.toLocaleString("en-IN")}
            </p>
          </div>

          {/* COLOR SWATCHES */}
          <div>
            <p className="text-[11px] text-muted tracking-[0.2em] uppercase mb-3">
              Color — <span className="text-text">{product.color}</span>
            </p>
            <div className="flex gap-3">
              <span
                className="w-7 h-7 rounded-full block border-2 border-text"
                style={{ backgroundColor: product.colorHex }}
              />
              {colorVariants.map((v) => (
                <Link
                  key={v.slug}
                  href={`/collection/${v.slug}`}
                  aria-label={v.color}
                >
                  <span
                    className="w-7 h-7 rounded-full block border-2 border-text/10 hover:border-text/40 transition-colors"
                    style={{ backgroundColor: v.colorHex }}
                    title={v.color}
                  />
                </Link>
              ))}
            </div>
          </div>

          {/* SIZE + QUANTITY */}
          <div className="grid grid-cols-[1fr_auto] gap-3">
            <div className="relative">
              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="w-full h-12 appearance-none bg-bg border border-text/15 px-4 pr-10 text-sm tracking-wide text-text focus:outline-none focus:border-text transition-colors cursor-pointer"
              >
                <option value="" disabled>
                  Select size
                </option>
                {product.sizes.map((size) => {
                  const variant = product.variants?.find((v) => v.size === size);
                  const stock = variant?.stock ?? 0;
                  const isOOS = variant !== undefined && stock === 0;
                  const isLow = stock > 0 && stock <= 3;
                  return (
                    <option key={size} value={size} disabled={isOOS}>
                      {size}
                      {isOOS ? " — Out of Stock" : isLow ? ` — Only ${stock} left` : ""}
                    </option>
                  );
                })}
              </select>
              <svg
                width="10"
                height="6"
                viewBox="0 0 10 6"
                className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text/60"
                fill="none"
              >
                <path
                  d="M1 1 L5 5 L9 1"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <div className="flex items-center border border-text/15 h-12">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-10 h-full text-text/60 hover:text-text transition-colors cursor-pointer"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="w-8 text-center text-sm tabular-nums">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="w-10 h-full text-text/60 hover:text-text transition-colors cursor-pointer"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>

          {/* ADD TO CART */}
          <div>
            <button
              onClick={handleAddToCart}
              disabled={!selectedSize || !!exceedsStock || selectedStock === 0}
              className={`group relative w-full h-12 text-[11px] tracking-[0.25em] uppercase cursor-pointer overflow-hidden border transition-all duration-300 ${
                !selectedSize || exceedsStock || selectedStock === 0
                  ? "bg-text/5 text-muted cursor-not-allowed border-transparent"
                  : added
                    ? "bg-accent text-white border-accent"
                    : "bg-text text-bg border-text"
              }`}
            >
              {selectedSize && !added && !exceedsStock && selectedStock !== 0 && (
                <span className="absolute inset-0 bg-bg origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
              )}
              <span
                className={`relative z-10 ${
                  selectedSize && !added && !exceedsStock && selectedStock !== 0
                    ? "group-hover:text-text transition-colors duration-500"
                    : ""
                }`}
              >
                {!selectedSize
                  ? "Select a Size"
                  : selectedStock === 0
                    ? "Out of Stock"
                    : exceedsStock
                      ? `Only ${selectedStock} left`
                      : added
                        ? "Added to Cart ✓"
                        : "Add to Cart"}
              </span>
            </button>
            <p className="text-[11px] text-muted text-center mt-3 tracking-wide">
              Delivered in 3–5 business days
            </p>
          </div>

          {/* ACCORDION */}
          <div className="border-t border-text/10 pt-2">
            {accordionOrder.map(({ key, label }) => {
              const isOpen = openSection === key;
              return (
                <div key={key} className="border-b border-text/10">
                  <button
                    onClick={() => toggle(key)}
                    className="w-full flex items-center justify-between py-4 text-sm tracking-wide text-text cursor-pointer group"
                  >
                    <span>{label}</span>
                    <span className="relative w-3 h-3 text-text/60 group-hover:text-text transition-colors">
                      <span className="absolute top-1/2 left-0 w-full h-[1px] bg-current -translate-y-1/2" />
                      <span
                        className={`absolute top-0 left-1/2 w-[1px] h-full bg-current -translate-x-1/2 transition-transform duration-300 ${
                          isOpen ? "scale-y-0" : "scale-y-100"
                        }`}
                      />
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{
                          duration: 0.35,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className="overflow-hidden"
                      >
                        <div className="pb-5 pr-4">{accordionContent[key]}</div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* SIZE CHART MODAL */}
      <AnimatePresence>
        {sizeModalOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 z-[60]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setSizeModalOpen(false)}
            />
            <motion.div
              className="fixed inset-0 z-[61] flex items-center justify-center p-4 md:p-8 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="relative bg-bg max-w-3xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* CLOSE BUTTON */}
                <button
                  onClick={() => setSizeModalOpen(false)}
                  className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center text-text/60 hover:text-text transition-colors cursor-pointer z-10"
                  aria-label="Close size chart"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path
                      d="M1 1 L13 13 M13 1 L1 13"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>

                <div className="px-4 sm:px-8 md:px-12 py-8 sm:py-10 md:py-14">
                  <p className="text-accent text-[11px] tracking-[0.25em] uppercase mb-2">
                    サイズ
                  </p>
                  <h2 className="text-2xl md:text-3xl font-normal tracking-tight">
                    Men Essentials Sizes
                  </h2>
                  <p className="text-muted text-[12px] tracking-wide mt-1.5 mb-8">
                    Indian men&rsquo;s sizing
                  </p>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-[11px] sm:text-[13px] md:text-[14px]">
                      <thead>
                        <tr className="border-b border-text/15">
                          <th className="py-3 pr-4 font-normal text-text/70 align-top">
                            Indian
                            <br />
                            size
                          </th>
                          <th className="py-3 pr-4 font-normal text-text/70 align-top">
                            Waist
                            <br />
                            (A)
                          </th>
                          <th className="py-3 font-normal text-text/70 align-top">
                            Hip
                            <br />
                            (B)
                          </th>
                        </tr>
                      </thead>
                      <tbody className="text-text">
                        {[
                          {
                            intl: "S",
                            waist: ["71–76 cm", "28–30 in"],
                            hip: ["91–96 cm", "36–38 in"],
                          },
                          {
                            intl: "M",
                            waist: ["76–81 cm", "30–32 in"],
                            hip: ["96–101 cm", "38–40 in"],
                          },
                          {
                            intl: "L",
                            waist: ["81–86 cm", "32–34 in"],
                            hip: ["101–106 cm", "40–42 in"],
                          },
                          {
                            intl: "XL",
                            waist: ["86–91 cm", "34–36 in"],
                            hip: ["106–111 cm", "42–44 in"],
                          },
                          {
                            intl: "XXL",
                            waist: ["91–96 cm", "36–38 in"],
                            hip: ["111–116 cm", "44–46 in"],
                          },
                          {
                            intl: "3XL",
                            waist: ["96–102 cm", "38–40 in"],
                            hip: ["116–121 cm", "46–48 in"],
                          },
                        ].map((row) => (
                          <tr
                            key={row.intl}
                            className="border-b border-text/8 align-top"
                          >
                            <td className="py-4 pr-4">{row.intl}</td>
                            <td className="py-4 pr-4">
                              <div>{row.waist[0]}</div>
                              <div className="text-muted">{row.waist[1]}</div>
                            </td>
                            <td className="py-4">
                              <div>{row.hip[0]}</div>
                              <div className="text-muted">{row.hip[1]}</div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <p className="text-[12px] text-muted mt-6 leading-relaxed">
                    How to measure — use a flexible measuring tape, keep it
                    level and snug but not tight. Measure waist at the
                    narrowest point, hip at the fullest point. If you&apos;re
                    between sizes, size up for a relaxed fit.
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
