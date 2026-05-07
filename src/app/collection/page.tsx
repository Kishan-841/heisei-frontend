import Navbar from "@/components/Navbar";
import CollectionGrid from "@/components/CollectionGrid";
import Footer from "@/components/Footer";

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
