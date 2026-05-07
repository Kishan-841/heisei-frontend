import type { Product } from "@/lib/products";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

/**
 * Renders JSON-LD structured data for a product so Google can show price,
 * availability, and brand as rich snippets in search results.
 * Schema: https://schema.org/Product
 *
 * Renders as a plain <script type="application/ld+json"> tag in server-side HTML
 * — this is the pattern Google recommends. The content is trusted (our own
 * server-rendered product data) and contains no HTML control characters, so
 * React's default text escaping is safe here.
 */
export default function ProductJsonLd({ product }: { product: Product }) {
  const hasVariants = product.variants && product.variants.length > 0;
  const totalStock =
    product.variants?.reduce((sum, v) => sum + v.stock, 0) ?? 0;
  const availability =
    !hasVariants
      ? "https://schema.org/InStock"
      : totalStock > 0
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${product.color} ${product.name}`,
    description: product.description,
    sku: product.slug,
    mpn: product.slug,
    brand: { "@type": "Brand", name: "HEISEI" },
    category: product.category,
    image: product.img.startsWith("http")
      ? product.img
      : `${SITE_URL}${product.img}`,
    url: `${SITE_URL}/collection/${product.slug}`,
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/collection/${product.slug}`,
      priceCurrency: "INR",
      price: product.price,
      availability,
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@type": "Organization", name: "HEISEI" },
    },
  };

  // Escape any `<` so a malicious payload (or unexpected character in a name)
  // can never close the <script> tag and break out into the DOM.
  const safeJson = JSON.stringify(jsonLd).replace(/</g, "\\u003c");

  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
    >
      {safeJson}
    </script>
  );
}
