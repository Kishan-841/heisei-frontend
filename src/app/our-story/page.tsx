import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import OurStories from "@/components/OurStories";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "The philosophy behind HEISEI — restraint, balance, intention, and silence. The art of making underwear you forget you're wearing.",
  alternates: { canonical: "/our-story" },
  openGraph: {
    title: "Our Story | HEISEI",
    description: "The philosophy behind HEISEI — restraint, balance, intention, and silence.",
    url: "/our-story",
  },
};

export default function OurStoryPage() {
  return (
    <>
      <Navbar />
      <OurStories />
      <Footer />
    </>
  );
}
