import { products } from "@/lib/products";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductDetail from "@/components/ProductDetail";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);

  if (!product) notFound();

  // Find other colors in the same category
  const colorVariants = products.filter(
    (p) => p.category === product.category && p.slug !== product.slug
  );

  return (
    <>
      <Navbar />
      <main className="bg-bg text-text pt-20">
        <ProductDetail product={product} colorVariants={colorVariants} />
      </main>
      <Footer />
    </>
  );
}
