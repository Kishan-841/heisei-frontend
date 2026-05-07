"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/lib/auth-store";
import { api } from "@/lib/api";
import Navbar from "@/components/Navbar";

type Step = "phone" | "otp" | "details";

export default function SignupPage() {
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const register = useAuthStore((s) => s.register);
  const loading = useAuthStore((s) => s.loading);
  const router = useRouter();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSending(true);
    try {
      await api.auth.sendOtp(phone);
      setStep("otp");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send OTP");
    } finally {
      setSending(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSending(true);
    try {
      await api.auth.verifyOtp(phone, otp);
      setStep("details");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid OTP");
    } finally {
      setSending(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await register(name, phone, password);
      router.push("/account");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    }
  };

  const steps = [
    { key: "phone" as Step, label: "Phone", num: "01" },
    { key: "otp" as Step, label: "Verify", num: "02" },
    { key: "details" as Step, label: "Details", num: "03" },
  ];

  const currentIndex = steps.findIndex((s) => s.key === step);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-bg">
        <div className="grid md:grid-cols-2 min-h-screen">
          {/* LEFT — Brand panel */}
          <div className="hidden md:flex relative bg-[#0F0F0F] text-[#F7F6F2] flex-col justify-between p-16 overflow-hidden">
            {/* Decorative */}
            <motion.div
              className="absolute top-[8%] left-[8%] text-[300px] font-light select-none pointer-events-none leading-none"
              style={{ fontFamily: "serif" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.035 }}
              transition={{ duration: 2 }}
            >
              新
            </motion.div>

            <motion.div
              className="absolute top-0 right-[30%] w-[1px] h-full bg-white"
              initial={{ scaleY: 0, opacity: 0 }}
              animate={{ scaleY: 1, opacity: 0.04 }}
              transition={{ duration: 2, delay: 0.3 }}
              style={{ transformOrigin: "top" }}
            />

            {/* Top */}
            <motion.div
              className="relative z-10 pt-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="text-3xl font-medium tracking-[0.2em]">HEISEI</span>
              <span className="block text-[10px] text-[#A8A29E] tracking-[0.5em] mt-1">平成</span>
            </motion.div>

            {/* Middle */}
            <motion.div
              className="relative z-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <p className="text-3xl font-light leading-snug tracking-tight max-w-sm">
                Join the quiet pursuit of comfort.
              </p>
              <p className="text-sm text-[#A8A29E] mt-4 max-w-xs leading-relaxed">
                Create your account to save addresses, track orders, and enjoy a personalized experience.
              </p>

              {/* Benefits */}
              <div className="mt-10 space-y-4">
                {[
                  "Free shipping on orders above ₹4,999",
                  "Easy 30-day returns",
                  "Exclusive early access to new drops",
                ].map((text, i) => (
                  <motion.div
                    key={text}
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + i * 0.1 }}
                  >
                    <div className="w-1 h-1 rounded-full bg-[#C23B22]" />
                    <span className="text-xs text-[#A8A29E]">{text}</span>
                  </motion.div>
                ))}
              </div>
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

          {/* RIGHT — Form */}
          <div className="flex items-center justify-center px-4 sm:px-8 md:px-16 py-20 pt-28 md:pt-20">
            <div className="w-full max-w-[400px]">
              {/* Mobile brand */}
              <motion.div
                className="flex flex-col items-center mb-10 md:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <span className="text-2xl font-medium tracking-[0.2em]">HEISEI</span>
                <span className="text-[9px] text-muted tracking-[0.4em] mt-1">平成</span>
              </motion.div>

              {/* Header */}
              <motion.div
                className="mb-8"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <p className="text-accent text-[10px] tracking-[0.35em] uppercase mb-3">アカウント作成</p>
                <h1 className="text-3xl md:text-4xl font-normal tracking-tight">Create Account</h1>
              </motion.div>

              {/* Step indicator */}
              <motion.div
                className="flex items-center gap-0 mb-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15 }}
              >
                {steps.map((s, i) => (
                  <div key={s.key} className="flex items-center">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-medium transition-all duration-300 ${
                          i <= currentIndex
                            ? "bg-text text-bg"
                            : "bg-text/5 text-muted"
                        }`}
                      >
                        {s.num}
                      </div>
                      <span className={`text-xs transition-colors ${i <= currentIndex ? "text-text" : "text-muted/50"}`}>
                        {s.label}
                      </span>
                    </div>
                    {i < 2 && (
                      <div className={`w-10 h-[1px] mx-3 transition-colors ${i < currentIndex ? "bg-text" : "bg-text/10"}`} />
                    )}
                  </div>
                ))}
              </motion.div>

              {error && (
                <motion.div
                  className="mb-6 px-4 py-3 bg-accent/5 border-l-2 border-accent"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <p className="text-sm text-accent">{error}</p>
                </motion.div>
              )}

              {/* Step 1: Phone */}
              {step === "phone" && (
                <motion.form
                  onSubmit={handleSendOtp}
                  className="space-y-7"
                  key="phone"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div>
                    <label className="text-[10px] text-text/60 tracking-[0.3em] uppercase block mb-3">Phone Number</label>
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
                    <p className="text-xs text-text/40 mt-3">
                      We&apos;ll send a 6-digit verification code to this number.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={sending || phone.length !== 10}
                    className="group relative w-full py-4 border border-text text-sm tracking-[0.2em] uppercase cursor-pointer overflow-hidden disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <span className="absolute inset-0 bg-text origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
                    <span className="relative z-10 group-hover:text-bg transition-colors duration-500">
                      {sending ? "Sending..." : "Send Verification Code"}
                    </span>
                  </button>
                </motion.form>
              )}

              {/* Step 2: OTP */}
              {step === "otp" && (
                <motion.form
                  onSubmit={handleVerifyOtp}
                  className="space-y-7"
                  key="otp"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div>
                    <label className="text-[10px] text-text/60 tracking-[0.3em] uppercase block mb-3">Verification Code</label>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      placeholder="000000"
                      className="w-full bg-transparent border-b border-text/20 focus:border-text/60 py-3.5 text-2xl outline-none tracking-[0.6em] text-center transition-all duration-300 placeholder:text-muted/20 font-mono"
                      maxLength={6}
                      required
                      autoFocus
                    />
                    <p className="text-xs text-text/40 mt-3">Code sent to {phone}</p>
                  </div>

                  <button
                    type="submit"
                    disabled={sending || otp.length !== 6}
                    className="group relative w-full py-4 border border-text text-sm tracking-[0.2em] uppercase cursor-pointer overflow-hidden disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <span className="absolute inset-0 bg-text origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
                    <span className="relative z-10 group-hover:text-bg transition-colors duration-500">
                      {sending ? "Verifying..." : "Verify Code"}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setStep("phone"); setOtp(""); setError(""); }}
                    className="w-full text-xs text-muted hover:text-text transition-colors cursor-pointer pt-2"
                  >
                    Change phone number
                  </button>
                </motion.form>
              )}

              {/* Step 3: Name & Password */}
              {step === "details" && (
                <motion.form
                  onSubmit={handleRegister}
                  className="space-y-7"
                  key="details"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div>
                    <label className="text-[10px] text-text/60 tracking-[0.3em] uppercase block mb-3">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="What should we call you?"
                      className="w-full bg-transparent border-b border-text/20 focus:border-text/60 py-3.5 text-[15px] outline-none transition-all duration-300 placeholder:text-text/30"
                      required
                      autoFocus
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-text/60 tracking-[0.3em] uppercase block mb-3">Create Password</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="w-full bg-transparent border-b border-text/20 focus:border-text/60 py-3.5 text-[15px] outline-none transition-all duration-300 placeholder:text-text/30"
                      minLength={6}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !name || password.length < 6}
                    className="group relative w-full py-4 border border-text text-sm tracking-[0.2em] uppercase cursor-pointer overflow-hidden disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <span className="absolute inset-0 bg-text origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
                    <span className="relative z-10 group-hover:text-bg transition-colors duration-500">
                      {loading ? "Creating account..." : "Create Account"}
                    </span>
                  </button>
                </motion.form>
              )}

              {/* Sign in link */}
              <div className="mt-8 pt-8 border-t border-text/5">
                <p className="text-sm text-muted text-center">
                  Already have an account?{" "}
                  <Link href="/login" className="text-text hover:text-accent transition-colors">
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
