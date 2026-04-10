"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/lib/auth-store";

export default function AuthInit() {
  const fetchUser = useAuthStore((s) => s.fetchUser);
  const initialized = useAuthStore((s) => s.initialized);

  useEffect(() => {
    if (!initialized) {
      fetchUser();
    }
  }, [initialized, fetchUser]);

  return null;
}
