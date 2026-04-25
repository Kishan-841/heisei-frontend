import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms under which HEISEI provides products and services. Please read carefully.",
  alternates: { canonical: "/terms-of-service" },
  openGraph: {
    title: "Terms of Service | HEISEI",
    description: "The terms under which HEISEI provides products and services.",
    url: "/terms-of-service",
  },
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
