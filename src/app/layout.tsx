import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart";
import CartDrawer from "@/components/CartDrawer";
import Preloader from "@/components/Preloader";
import AuthInit from "@/components/AuthInit";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const SITE_NAME = "HEISEI";
const SITE_DESCRIPTION =
  "Premium underwear designed with balance, softness, and intention for everyday wear. Precisely made for the quiet details.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "HEISEI — Quiet Comfort, Precisely Made",
    template: "%s | HEISEI",
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "HEISEI",
    "premium underwear",
    "boxer brief",
    "trunk",
    "micro modal underwear",
    "Japanese minimalism",
    "men's underwear India",
  ],
  authors: [{ name: "HEISEI" }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: SITE_NAME,
    url: SITE_URL,
    title: "HEISEI — Quiet Comfort, Precisely Made",
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/hero-main.png",
        width: 1200,
        height: 630,
        alt: "HEISEI — premium underwear",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HEISEI — Quiet Comfort, Precisely Made",
    description: SITE_DESCRIPTION,
    images: ["/hero-main.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
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
          {children}
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
