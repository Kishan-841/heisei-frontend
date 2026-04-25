import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How HEISEI collects, uses, and protects your personal information. Your privacy matters.",
  alternates: { canonical: "/privacy-policy" },
  openGraph: {
    title: "Privacy Policy | HEISEI",
    description: "How HEISEI collects, uses, and protects your personal information.",
    url: "/privacy-policy",
  },
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
