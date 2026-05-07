import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import CollectionGrid from "@/components/CollectionGrid";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "The Collection",
  description:
    "Boxer briefs and trunks in premium micro-modal. Four colors. Quiet essentials designed with balance, softness, and intention.",
  alternates: { canonical: "/collection" },
  openGraph: {
    title: "The Collection | HEISEI",
    description: "Boxer briefs and trunks in premium micro-modal. Four colors.",
    url: "/collection",
  },
};

export default function CollectionPage() {
  return (
    <>
      <Navbar />
      <main className="bg-bg text-text pt-20">
        <CollectionGrid />
      </main>
      <Footer />
    </>
  );
}
