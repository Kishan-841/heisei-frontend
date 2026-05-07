import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Questions about sizing, orders, or collaborations? Get in touch with HEISEI — we reply within 24 hours.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact | HEISEI",
    description: "Questions about sizing, orders, or collaborations? We reply within 24 hours.",
    url: "/contact",
  },
};

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <ContactForm />
      <Footer />
    </>
  );
}
