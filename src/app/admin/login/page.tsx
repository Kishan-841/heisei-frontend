"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminStore } from "@/lib/admin-store";

export default function AdminLoginPage() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const login = useAdminStore((s) => s.login);
  const admin = useAdminStore((s) => s.admin);
  const loading = useAdminStore((s) => s.loading);
  const initialized = useAdminStore((s) => s.initialized);
  const fetchAdmin = useAdminStore((s) => s.fetchAdmin);
  const router = useRouter();

  useEffect(() => {
    if (!initialized) fetchAdmin();
  }, [initialized, fetchAdmin]);

  useEffect(() => {
    if (initialized && admin) router.replace("/admin");
  }, [initialized, admin, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await login(phone, password);
      router.push("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    }
  };

  return (
    <main className="min-h-screen bg-bg flex items-center justify-center px-4">
      <motion.div
        className="w-full max-w-[380px]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex flex-col items-center mb-12">
          <span className="text-[10px] text-muted tracking-[0.5em] mb-1">平成</span>
          <span className="text-2xl font-medium tracking-[0.2em] text-text">HEISEI</span>
          <span className="text-[10px] text-muted tracking-[0.3em] mt-3 uppercase">Admin Panel</span>
        </div>

        {error && (
          <motion.div
            className="mb-6 px-4 py-3 bg-accent/5 border-l-2 border-accent"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <p className="text-sm text-accent">{error}</p>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-7">
          <div>
            <label className="text-[10px] text-text/60 tracking-[0.3em] uppercase block mb-3">
              Phone Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
              placeholder="Admin phone number"
              maxLength={10}
              className="w-full bg-transparent border-b border-text/20 focus:border-text/60 py-3.5 text-[15px] text-text outline-none transition-all duration-300 placeholder:text-text/30"
              required
              autoFocus
            />
          </div>

          <div>
            <label className="text-[10px] text-text/60 tracking-[0.3em] uppercase block mb-3">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Admin password"
              className="w-full bg-transparent border-b border-text/20 focus:border-text/60 py-3.5 text-[15px] text-text outline-none transition-all duration-300 placeholder:text-text/30"
              required
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading || phone.length !== 10 || !password}
              className="group relative w-full py-4 border border-text text-sm tracking-[0.2em] uppercase cursor-pointer overflow-hidden disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <span className="absolute inset-0 bg-text origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
              <span className="relative z-10 text-text group-hover:text-bg transition-colors duration-500">
                {loading ? "Signing in..." : "Sign In"}
              </span>
            </button>
          </div>
        </form>

        <p className="text-[11px] text-muted/60 text-center mt-8">
          Admin access only. Contact support if you need access.
        </p>
      </motion.div>
    </main>
  );
}
