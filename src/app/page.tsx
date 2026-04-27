import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ValuesStrip from "@/components/ValuesStrip";
import SectionTwo from "@/components/SectionTwo";
import FeaturedCollection from "@/components/FeaturedCollection";
import AboutSection from "@/components/AboutSection";
import ShowcaseBanner from "@/components/ShowcaseBanner";
import VideoSection from "@/components/VideoSection";
import InkDivider from "@/components/InkDivider";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <ValuesStrip />
      <SectionTwo />
      <FeaturedCollection />
      <AboutSection />
      <VideoSection />
      <Footer />
    </>
  );
}
