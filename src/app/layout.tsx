import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart";
import CartDrawer from "@/components/CartDrawer";
import Preloader from "@/components/Preloader";
import GrainOverlay from "@/components/GrainOverlay";
import AuthInit from "@/components/AuthInit";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HEISEI — Quiet Comfort, Precisely Made",
  description:
    "Premium underwear designed with balance, softness, and intention for everyday wear.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <CartProvider>
          <AuthInit />
          <Preloader />
          <GrainOverlay />
          {children}
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
