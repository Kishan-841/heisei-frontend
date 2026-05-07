"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/lib/auth-store";
import Navbar from "@/components/Navbar";

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const login = useAuthStore((s) => s.login);
  const loading = useAuthStore((s) => s.loading);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await login(phone, password);
      router.push("/account");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-bg">
        <div className="grid md:grid-cols-2 min-h-screen">
          {/* LEFT — Brand panel */}
          <div className="hidden md:flex relative bg-[#0F0F0F] text-[#F7F6F2] flex-col justify-between p-16 overflow-hidden">
            {/* Decorative kanji */}
            <motion.div
              className="absolute top-[10%] right-[10%] text-[280px] font-light select-none pointer-events-none leading-none"
              style={{ fontFamily: "serif" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.04 }}
              transition={{ duration: 2 }}
            >
              入
            </motion.div>
            <motion.div
              className="absolute bottom-[5%] left-[5%] text-[180px] font-light select-none pointer-events-none leading-none"
              style={{ fontFamily: "serif" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.03 }}
              transition={{ duration: 2, delay: 0.3 }}
            >
              口
            </motion.div>

            {/* Thin lines */}
            <motion.div
              className="absolute top-0 left-[40%] w-[1px] h-full bg-white"
              initial={{ scaleY: 0, opacity: 0 }}
              animate={{ scaleY: 1, opacity: 0.04 }}
              transition={{ duration: 2, delay: 0.5 }}
              style={{ transformOrigin: "top" }}
            />
            <motion.div
              className="absolute top-[60%] left-0 w-full h-[1px] bg-white"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 0.04 }}
              transition={{ duration: 2, delay: 0.7 }}
              style={{ transformOrigin: "left" }}
            />

            {/* Top content */}
            <motion.div
              className="relative z-10 pt-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="text-3xl font-medium tracking-[0.2em]">HEISEI</span>
              <span className="block text-[10px] text-[#A8A29E] tracking-[0.5em] mt-1">平成</span>
            </motion.div>

            {/* Middle quote */}
            <motion.div
              className="relative z-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <p className="text-3xl font-light leading-snug tracking-tight max-w-sm">
                Quiet comfort, precisely made.
              </p>
              <p className="text-sm text-[#A8A29E] mt-4 max-w-xs leading-relaxed">
                Sign in to manage your orders, save addresses, and enjoy a seamless experience crafted just for you.
              </p>
            </motion.div>

            {/* Bottom */}
            <motion.div
              className="relative z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <div className="flex items-center gap-8 text-[10px] tracking-[0.3em] text-[#A8A29E]/60 uppercase">
                <span>Premium Essentials</span>
                <span className="w-8 h-[1px] bg-[#A8A29E]/30" />
                <span>Since 2026</span>
              </div>
            </motion.div>
          </div>

          {/* RIGHT — Login form */}
          <div className="flex items-center justify-center px-4 sm:px-8 md:px-16 py-20 pt-28 md:pt-20">
            <div className="w-full max-w-[400px]">
              {/* Mobile brand mark */}
              <motion.div
                className="flex flex-col items-center mb-10 md:hidden"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <span className="text-2xl font-medium tracking-[0.2em]">HEISEI</span>
                <span className="text-[9px] text-muted tracking-[0.4em] mt-1">平成</span>
              </motion.div>

              {/* Header */}
              <motion.div
                className="mb-10"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <p className="text-accent text-[10px] tracking-[0.35em] uppercase mb-3">ログイン</p>
                <h1 className="text-3xl md:text-4xl font-normal tracking-tight">Welcome Back</h1>
                <p className="text-text/50 text-sm mt-3 leading-relaxed">
                  Sign in to your account to continue.
                </p>
              </motion.div>

              {/* Error */}
              {error && (
                <motion.div
                  className="mb-6 px-4 py-3 bg-accent/5 border-l-2 border-accent"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <p className="text-sm text-accent">{error}</p>
                </motion.div>
              )}

              {/* Form */}
              <motion.form
                onSubmit={handleSubmit}
                className="space-y-7"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div>
                  <label className="text-[10px] text-text/60 tracking-[0.3em] uppercase block mb-3">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    placeholder="Enter your phone number"
                    maxLength={10}
                    className="w-full bg-transparent border-b border-text/20 focus:border-text/60 py-3.5 text-[15px] outline-none transition-all duration-300 placeholder:text-text/30"
                    required
                    autoFocus
                  />
                </div>

                <div>
                  <label className="text-[10px] text-text/60 tracking-[0.3em] uppercase block mb-3">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full bg-transparent border-b border-text/20 focus:border-text/60 py-3.5 text-[15px] outline-none transition-all duration-300 placeholder:text-text/30 pr-12"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-0 top-1/2 -translate-y-1/2 text-muted hover:text-text transition-colors cursor-pointer p-2"
                    >
                      {showPassword ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                          <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </svg>
                      ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading || phone.length !== 10 || !password}
                    className="group relative w-full py-4 border border-text text-sm tracking-[0.2em] uppercase cursor-pointer overflow-hidden disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <span className="absolute inset-0 bg-text origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
                    <span className="relative z-10 group-hover:text-bg transition-colors duration-500">
                      {loading ? "Signing in..." : "Sign In"}
                    </span>
                  </button>
                </div>
              </motion.form>

              {/* Divider */}
              <motion.div
                className="flex items-center gap-4 my-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex-1 h-[1px] bg-text/8" />
                <span className="text-[10px] text-text/40 tracking-widest uppercase">or</span>
                <div className="flex-1 h-[1px] bg-text/8" />
              </motion.div>

              {/* Create account */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45 }}
              >
                <Link
                  href="/signup"
                  className="group block w-full text-center py-3.5 border border-text/15 text-sm tracking-[0.15em] hover:border-text/40 transition-colors"
                >
                  <span className="text-text/50 group-hover:text-text transition-colors">
                    Create an Account
                  </span>
                </Link>
              </motion.div>

              {/* Features */}
              <motion.div
                className="grid grid-cols-3 gap-4 mt-10 pt-8 border-t border-text/5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.55 }}
              >
                {[
                  { icon: "📦", text: "Track Orders" },
                  { icon: "📍", text: "Save Addresses" },
                  { icon: "⚡", text: "Fast Checkout" },
                ].map((f) => (
                  <div key={f.text} className="text-center">
                    <span className="text-lg">{f.icon}</span>
                    <p className="text-[10px] text-text/50 tracking-wide mt-1">{f.text}</p>
                  </div>
                ))}
              </motion.div>

              <motion.p
                className="text-[11px] text-text/35 text-center mt-6 leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                No account needed to shop. You can checkout as a guest anytime.
              </motion.p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
