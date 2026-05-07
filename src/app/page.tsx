import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import SectionTwo from "@/components/SectionTwo";
import ProcessSection from "@/components/ProcessSection";
import VideoSection from "@/components/VideoSection";
import InkDivider from "@/components/InkDivider";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <SectionTwo />
      <InkDivider />
      <ProcessSection />
      <InkDivider />
      <VideoSection />
      <InkDivider />
      <Footer />
    </>
  );
}
