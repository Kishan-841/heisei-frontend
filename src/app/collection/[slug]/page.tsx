import type { Metadata } from "next";
import { products } from "@/lib/products";
import type { Product, ProductVariant } from "@/lib/products";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductDetail from "@/components/ProductDetail";
import ProductJsonLd from "@/components/ProductJsonLd";
import YouMayAlsoLike from "@/components/YouMayAlsoLike";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);

  if (!product) {
    return {
      title: "Product not found",
      robots: { index: false, follow: false },
    };
  }

  const title = `${product.color} ${product.name} — ₹${product.price.toLocaleString("en-IN")}`;
  const description = `${product.color} ${product.name} in premium micro-modal. ${product.description.split(".")[0]}. Free shipping on orders over ₹4,999.`;
  const canonical = `${SITE_URL}/collection/${product.slug}`;
  const imgUrl = product.img.startsWith("http") ? product.img : `${SITE_URL}${product.img}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: "website",
      url: canonical,
      siteName: "HEISEI",
      title: `${product.color} ${product.name} | HEISEI`,
      description,
      images: [
        {
          url: imgUrl,
          width: 1200,
          height: 1200,
          alt: `${product.color} ${product.name} — HEISEI`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.color} ${product.name} | HEISEI`,
      description,
      images: [imgUrl],
    },
  };
}

async function fetchLiveVariants(slug: string): Promise<ProductVariant[] | null> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
    const res = await fetch(`${apiUrl}/api/products/${slug}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.product?.variants ?? null;
  } catch {
    return null;
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const staticProduct = products.find((p) => p.slug === slug);

  if (!staticProduct) notFound();

  const variants = await fetchLiveVariants(slug);
  const product: Product = variants ? { ...staticProduct, variants } : staticProduct;

  const colorVariants = products.filter(
    (p) => p.category === product.category && p.slug !== product.slug
  );

  return (
    <>
      <ProductJsonLd product={product} />
      <Navbar />
      <main className="bg-bg text-text pt-20">
        <ProductDetail product={product} colorVariants={colorVariants} />
        <YouMayAlsoLike product={product} allProducts={products} />
      </main>
      <Footer />
    </>
  );
}
