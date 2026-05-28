export type ProductVariant = {
  size: string;
  stock: number;
};

export type Product = {
  slug: string;
  name: string;
  category: string;
  categoryJp: string;
  color: string;
  colorHex: string;
  price: number;
  img: string;
  modelImg: string;
  sizes: string[];
  description: string;
  /** Optional per-size stock populated from the backend. When unset, the UI assumes unlimited stock (for static/seed data). */
  variants?: ProductVariant[];
  /** Visual scale factor applied to the product image in grids, to normalize garment size across differently-framed source photos. Defaults to 1.25. */
  displayScale?: number;
  /** Fabric swatch — shown as the 3rd gallery tile on product detail page. */
  fabricImg?: string;
  /** Model front full-body shot — 4th gallery tile (boxer briefs only). */
  modelFrontImg?: string;
  /** Model back full-body shot — 5th gallery tile (boxer briefs only). */
  modelBackImg?: string;
  /** Product detail close-up — 6th gallery tile (boxer briefs only). */
  detailImg?: string;
  /** When true, the grid uses object-cover with top-anchored positioning so the
   *  bottom of the source image is cropped. Used for AI-generated images that
   *  have a watermark in the bottom-right corner. */
  cropBottom?: boolean;
};

export const products: Product[] = [
  // Boxer Briefs
  {
    slug: "black-boxer",
    name: "Boxer Brief",
    category: "Boxer Brief",
    categoryJp: "ボクサーブリーフ",
    color: "Sumi Black",
    colorHex: "#0F0F0F",
    price: 2499,
    img: "/collections/black-boxer/main.png",
    modelImg: "/collections/black-boxer/model.png",
    fabricImg: "/collections/black-boxer/fabric.png",
    modelFrontImg: "/collections/black-boxer/front.png",
    modelBackImg: "/collections/black-boxer/back.png",
    detailImg: "/collections/black-boxer/detail.png",
    sizes: ["S", "M", "L", "XL", "XXL"],
    cropBottom: true,
    description:
      "Crafted from 90% micro modal and 10% elastane for an exceptionally soft, breathable fit. The longer leg design prevents ride-up while the tonal HEISEI waistband sits comfortably at the natural waist.",
  },
  {
    slug: "white-boxer",
    name: "Boxer Brief",
    category: "Boxer Brief",
    categoryJp: "ボクサーブリーフ",
    color: "Kumo White",
    colorHex: "#F0F0F0",
    price: 2499,
    img: "/collections/white-boxer/main.png",
    modelImg: "/collections/white-boxer/model.png",
    fabricImg: "/collections/white-boxer/fabric.png",
    modelFrontImg: "/collections/white-boxer/front.png",
    modelBackImg: "/collections/white-boxer/back.png",
    detailImg: "/collections/white-boxer/detail.png",
    sizes: ["S", "M", "L", "XL", "XXL"],
    cropBottom: true,
    description:
      "Clean white micro modal boxer brief with a refined fit. Opaque fabric ensures full coverage while remaining lightweight and breathable throughout the day.",
  },
  {
    slug: "navy-boxer",
    name: "Boxer Brief",
    category: "Boxer Brief",
    categoryJp: "ボクサーブリーフ",
    color: "Katsu Blue",
    colorHex: "#1B2A4A",
    price: 2499,
    img: "/collections/navy-boxer/main.png",
    modelImg: "/collections/navy-boxer/model.png",
    fabricImg: "/collections/navy-boxer/fabric.png",
    modelFrontImg: "/collections/navy-boxer/front.png",
    modelBackImg: "/collections/navy-boxer/back.png",
    detailImg: "/collections/navy-boxer/detail.png",
    sizes: ["S", "M", "L", "XL", "XXL"],
    cropBottom: true,
    description:
      "Deep navy boxer brief in premium micro modal. Rich, understated color with tonal waistband branding. Designed for quiet confidence and all-day comfort.",
  },
  {
    slug: "slate-boxer",
    name: "Boxer Brief",
    category: "Boxer Brief",
    categoryJp: "ボクサーブリーフ",
    color: "Kure Slate",
    colorHex: "#4A4A4A",
    price: 2499,
    img: "/collections/slate-boxer/main.png",
    modelImg: "/collections/slate-boxer/model.png",
    fabricImg: "/collections/slate-boxer/fabric.png",
    modelFrontImg: "/collections/slate-boxer/front.png",
    modelBackImg: "/collections/slate-boxer/back.png",
    detailImg: "/collections/slate-boxer/detail.png",
    sizes: ["S", "M", "L", "XL", "XXL"],
    cropBottom: true,
    description:
      "Warm slate grey boxer brief with subtle sophistication. The medium-dark charcoal tone pairs effortlessly with any wardrobe while maintaining premium softness.",
  },
  // Trunks
  {
    slug: "black-trunk",
    name: "Trunk",
    category: "Trunk",
    categoryJp: "トランクス",
    color: "Sumi Black",
    colorHex: "#0F0F0F",
    price: 1999,
    img: "/collections/black-trunk/main.png",
    modelImg: "/collections/black-trunk/model.png",
    fabricImg: "/collections/black-trunk/fabric.png",
    modelFrontImg: "/collections/black-trunk/front.png",
    modelBackImg: "/collections/black-trunk/back.png",
    detailImg: "/collections/black-trunk/detail.png",
    cropBottom: true,
    sizes: ["S", "M", "L", "XL", "XXL"],
    description:
      "Shorter inseam trunk in premium black micro modal. The compact silhouette offers freedom of movement while the HEISEI waistband provides a secure, comfortable fit.",
  },
  {
    slug: "white-trunk",
    name: "Trunk",
    category: "Trunk",
    categoryJp: "トランクス",
    color: "Kumo White",
    colorHex: "#F0F0F0",
    price: 1999,
    img: "/collections/white-trunk/main.png",
    modelImg: "/collections/white-trunk/model.png",
    fabricImg: "/collections/white-trunk/fabric.png",
    modelFrontImg: "/collections/white-trunk/front.png",
    modelBackImg: "/collections/white-trunk/back.png",
    detailImg: "/collections/white-trunk/detail.png",
    cropBottom: true,
    sizes: ["S", "M", "L", "XL", "XXL"],
    description:
      "Clean white trunk with a shorter, modern cut. Opaque micro modal fabric with breathable construction for everyday wear.",
  },
  {
    slug: "navy-trunk",
    name: "Trunk",
    category: "Trunk",
    categoryJp: "トランクス",
    color: "Katsu Blue",
    colorHex: "#1B2A4A",
    price: 1999,
    img: "/collections/navy-trunk/main.png",
    modelImg: "/collections/navy-trunk/model.png",
    fabricImg: "/collections/navy-trunk/fabric.png",
    modelFrontImg: "/collections/navy-trunk/front.png",
    modelBackImg: "/collections/navy-trunk/back.png",
    detailImg: "/collections/navy-trunk/detail.png",
    cropBottom: true,
    sizes: ["S", "M", "L", "XL", "XXL"],
    description:
      "Deep navy trunk with compact silhouette. Rich color, tonal detailing, and premium micro modal fabric for effortless comfort.",
  },
  {
    slug: "slate-trunk",
    name: "Trunk",
    category: "Trunk",
    categoryJp: "トランクス",
    color: "Kure Slate",
    colorHex: "#4A4A4A",
    price: 1999,
    img: "/collections/slate-trunk/main.png",
    modelImg: "/collections/slate-trunk/model.png",
    fabricImg: "/collections/slate-trunk/fabric.png",
    modelFrontImg: "/collections/slate-trunk/front.png",
    modelBackImg: "/collections/slate-trunk/back.png",
    detailImg: "/collections/slate-trunk/detail.png",
    cropBottom: true,
    sizes: ["S", "M", "L", "XL", "XXL"],
    description:
      "Warm slate grey trunk with shorter modern cut. Sophisticated charcoal tone in soft micro modal, designed to move with you.",
  },
];

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}
