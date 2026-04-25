"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import Navbar from "@/components/Navbar";

type Step = "email" | "reset" | "done";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [info, setInfo] = useState("");

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await api.auth.forgotPassword(email);
      setInfo(res.message);
      setStep("reset");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send reset code");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setSubmitting(true);
    try {
      await api.auth.resetPassword(email, code, newPassword);
      setStep("done");
      setTimeout(() => router.push("/login"), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not reset password");
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setInfo("");
    setSubmitting(true);
    try {
      const res = await api.auth.forgotPassword(email);
      setInfo(res.message);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not resend code");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-bg">
        <div className="grid md:grid-cols-2 min-h-screen">
          {/* LEFT — Brand panel */}
          <div className="hidden md:flex relative bg-[#0F0F0F] text-[#F7F6F2] flex-col justify-between p-16 overflow-hidden">
            <motion.div
              className="absolute top-[10%] right-[8%] text-[280px] font-light select-none pointer-events-none leading-none"
              style={{ fontFamily: "serif" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.04 }}
              transition={{ duration: 2 }}
            >
              鍵
            </motion.div>

            <motion.div
              className="absolute top-0 left-[40%] w-[1px] h-full bg-white"
              initial={{ scaleY: 0, opacity: 0 }}
              animate={{ scaleY: 1, opacity: 0.04 }}
              transition={{ duration: 2, delay: 0.5 }}
              style={{ transformOrigin: "top" }}
            />

            <motion.div
              className="relative z-10 pt-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="text-3xl font-medium tracking-[0.2em]" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>HEISEI</span>
              <span className="block text-[10px] text-[#A8A29E] tracking-[0.5em] mt-1">平成</span>
            </motion.div>

            <motion.div
              className="relative z-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <p className="text-3xl font-light leading-snug tracking-tight max-w-sm" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
                A new beginning,<br />precisely secured.
              </p>
              <p className="text-sm text-[#A8A29E] mt-4 max-w-xs leading-relaxed">
                Reset your password in three steps. We&rsquo;ll send a verification code to your email.
              </p>
            </motion.div>

            <motion.div
              className="relative z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <div className="flex items-center gap-8 text-[10px] tracking-[0.3em] text-[#A8A29E]/60 uppercase">
                <span>Secure Reset</span>
                <span className="w-8 h-[1px] bg-[#A8A29E]/30" />
                <span>10-minute window</span>
              </div>
            </motion.div>
          </div>

          {/* RIGHT — Form */}
          <div className="flex items-center justify-center px-4 sm:px-8 md:px-16 py-20 pt-28 md:pt-20">
            <div className="w-full max-w-[400px]">
              <motion.div
                className="flex flex-col items-center mb-10 md:hidden"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <span className="text-2xl font-medium tracking-[0.2em]" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>HEISEI</span>
                <span className="text-[9px] text-muted tracking-[0.4em] mt-1">平成</span>
              </motion.div>

              {/* Step indicator */}
              <motion.div
                className="flex items-center justify-between mb-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {[
                  { key: "email", label: "Email", num: "01" },
                  { key: "reset", label: "Reset", num: "02" },
                  { key: "done", label: "Done", num: "03" },
                ].map((s, i, arr) => {
                  const currentIdx = ["email", "reset", "done"].indexOf(step);
                  const active = i <= currentIdx;
                  return (
                    <div key={s.key} className="flex items-center flex-1 last:flex-none">
                      <div className="flex items-center gap-2">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-mono transition-colors ${active ? "bg-text text-bg" : "bg-text/5 text-text/30"}`}>
                          {s.num}
                        </div>
                        <span className={`text-xs ${active ? "text-text" : "text-text/30"}`}>{s.label}</span>
                      </div>
                      {i < arr.length - 1 && (
                        <div className={`flex-1 h-[1px] mx-3 ${i < currentIdx ? "bg-text" : "bg-text/10"}`} />
                      )}
                    </div>
                  );
                })}
              </motion.div>

              {/* Header */}
              <motion.div
                className="mb-8"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <p className="text-accent text-[10px] tracking-[0.35em] uppercase mb-3">
                  {step === "done" ? "完了" : "パスワード再設定"}
                </p>
                <h1 className="text-3xl md:text-4xl font-normal tracking-tight">
                  {step === "email" ? "Forgot password?" : step === "reset" ? "Enter the code" : "All set."}
                </h1>
                <p className="text-text/50 text-sm mt-3 leading-relaxed">
                  {step === "email"
                    ? "Enter the email you used to sign up. We'll send you a 6-digit code to reset your password."
                    : step === "reset"
                    ? `We sent a code to ${email}. Enter it along with your new password.`
                    : "Your password has been reset. Redirecting you to sign in…"}
                </p>
              </motion.div>

              {/* Info banner */}
              {info && step === "reset" && (
                <motion.div
                  className="mb-5 px-4 py-3 bg-text/[0.03] border-l-2 border-text/30"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <p className="text-xs text-text/70">{info}</p>
                </motion.div>
              )}

              {/* Error */}
              {error && (
                <motion.div
                  className="mb-5 px-4 py-3 bg-accent/5 border-l-2 border-accent"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <p className="text-sm text-accent">{error}</p>
                </motion.div>
              )}

              <AnimatePresence mode="wait">
                {/* Step 1 — email */}
                {step === "email" && (
                  <motion.form
                    key="email"
                    onSubmit={handleRequestReset}
                    className="space-y-7"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <div>
                      <label className="text-[10px] text-text/60 tracking-[0.3em] uppercase block mb-3">Email Address</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full bg-transparent border-b border-text/20 focus:border-text/60 py-3.5 text-[15px] outline-none transition-all placeholder:text-text/30"
                        required
                        autoFocus
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitting || !isValidEmail}
                      className="group relative w-full py-4 border border-text text-sm tracking-[0.2em] uppercase cursor-pointer overflow-hidden disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <span className="absolute inset-0 bg-text origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
                      <span className="relative z-10 group-hover:text-bg transition-colors duration-500">
                        {submitting ? "Sending..." : "Send Reset Code"}
                      </span>
                    </button>

                    <div className="text-center">
                      <Link href="/login" className="text-xs text-text/50 hover:text-text transition-colors">
                        &larr; Back to sign in
                      </Link>
                    </div>
                  </motion.form>
                )}

                {/* Step 2 — code + new password */}
                {step === "reset" && (
                  <motion.form
                    key="reset"
                    onSubmit={handleReset}
                    className="space-y-7"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <div>
                      <label className="text-[10px] text-text/60 tracking-[0.3em] uppercase block mb-3">Verification Code</label>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={code}
                        onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                        placeholder="000000"
                        maxLength={6}
                        className="w-full bg-transparent border-b border-text/20 focus:border-text/60 py-3.5 text-2xl text-center tracking-[0.6em] font-mono outline-none transition-all placeholder:text-text/20"
                        required
                        autoFocus
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-text/60 tracking-[0.3em] uppercase block mb-3">New Password</label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Minimum 6 characters"
                          className="w-full bg-transparent border-b border-text/20 focus:border-text/60 py-3.5 text-[15px] outline-none transition-all placeholder:text-text/30 pr-12"
                          required
                          minLength={6}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-0 top-1/2 -translate-y-1/2 text-muted hover:text-text transition-colors cursor-pointer p-2"
                          aria-label="Toggle password visibility"
                        >
                          {showPassword ? (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                          ) : (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] text-text/60 tracking-[0.3em] uppercase block mb-3">Confirm New Password</label>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter password"
                        className="w-full bg-transparent border-b border-text/20 focus:border-text/60 py-3.5 text-[15px] outline-none transition-all placeholder:text-text/30"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitting || code.length !== 6 || !newPassword || !confirmPassword}
                      className="group relative w-full py-4 border border-text text-sm tracking-[0.2em] uppercase cursor-pointer overflow-hidden disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <span className="absolute inset-0 bg-text origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
                      <span className="relative z-10 group-hover:text-bg transition-colors duration-500">
                        {submitting ? "Resetting..." : "Reset Password"}
                      </span>
                    </button>

                    <div className="flex items-center justify-between text-xs text-text/50 pt-2">
                      <button
                        type="button"
                        onClick={() => { setStep("email"); setCode(""); setError(""); setInfo(""); }}
                        className="hover:text-text transition-colors cursor-pointer"
                      >
                        &larr; Change email
                      </button>
                      <button
                        type="button"
                        onClick={handleResend}
                        disabled={submitting}
                        className="hover:text-text transition-colors cursor-pointer disabled:opacity-50"
                      >
                        Resend code
                      </button>
                    </div>
                  </motion.form>
                )}

                {/* Step 3 — done */}
                {step === "done" && (
                  <motion.div
                    key="done"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8"
                  >
                    <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-text/5 flex items-center justify-center">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <p className="text-text/60 text-sm">Redirecting you to sign in…</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
