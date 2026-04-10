"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminStore } from "@/lib/admin-store";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const admin = useAdminStore((s) => s.admin);
  const initialized = useAdminStore((s) => s.initialized);
  const fetchAdmin = useAdminStore((s) => s.fetchAdmin);
  const router = useRouter();

  useEffect(() => {
    if (!initialized) fetchAdmin();
  }, [initialized, fetchAdmin]);

  useEffect(() => {
    if (initialized && !admin) {
      router.replace("/admin/login");
    }
  }, [initialized, admin, router]);

  if (!initialized) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="w-5 h-5 border border-text/20 border-t-text rounded-full animate-spin" />
      </div>
    );
  }

  if (!admin) return null;

  return <>{children}</>;
}
