"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { useAuthStore } from "@/lib/auth-store";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type Visibility = { current: boolean; next: boolean; confirm: boolean };

export default function SecurityPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const initialized = useAuthStore((s) => s.initialized);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [show, setShow] = useState<Visibility>({ current: false, next: false, confirm: false });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Redirect unauthenticated users to login
  useEffect(() => {
    if (initialized && !user) router.replace("/login");
  }, [initialized, user, router]);

  const passwordsMatch =
    confirmPassword.length > 0 && newPassword === confirmPassword;
  const passwordsMismatch =
    confirmPassword.length > 0 && newPassword !== confirmPassword;
  const canSubmit =
    currentPassword.length > 0 &&
    newPassword.length >= 6 &&
    passwordsMatch &&
    newPassword !== currentPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New password and confirmation do not match");
      return;
    }
    if (newPassword === currentPassword) {
      setError("New password must be different from the current password");
      return;
    }

    setSubmitting(true);
    try {
      await api.auth.changePassword(currentPassword, newPassword);
      setSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => router.push("/account"), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not change password");
    } finally {
      setSubmitting(false);
    }
  };

  if (!initialized) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-bg flex items-center justify-center">
          <div className="w-5 h-5 border border-text/20 border-t-text rounded-full animate-spin" />
        </main>
      </>
    );
  }

  if (!user) return null;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#F4F3EF]">
        <div className="max-w-xl mx-auto px-5 sm:px-6 pt-28 pb-16">
          {/* Breadcrumb */}
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Link
              href="/account"
              className="text-[11px] text-text/50 hover:text-text tracking-[0.1em] transition-colors"
            >
              &larr; Back to Account
            </Link>
          </motion.div>

          {/* Header */}
          <motion.div
            className="mb-10"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-accent text-[10px] tracking-[0.35em] uppercase mb-3">
              セキュリティ
            </p>
            <h1 className="text-[28px] md:text-[32px] font-light tracking-tight text-text/90">
              Change Password
            </h1>
            <p className="text-text/50 text-sm mt-3 leading-relaxed max-w-md">
              Use a strong password you don&rsquo;t use on any other site.
              You&rsquo;ll stay signed in after changing it.
            </p>
          </motion.div>

          {/* Form card */}
          <motion.div
            className="bg-white border border-text/10 p-6 md:p-8 rounded-sm"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <AnimatePresence mode="wait">
              {success ? (
                <motion.div
                  key="success"
                  className="py-8 text-center"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-emerald-50 flex items-center justify-center">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <p className="text-accent text-[10px] tracking-[0.35em] uppercase mb-2">完了</p>
                  <h2 className="text-xl font-normal tracking-tight">Password changed</h2>
                  <p className="text-text/50 text-sm mt-3">Redirecting you back to your account&hellip;</p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  className="space-y-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {/* Error */}
                  {error && (
                    <motion.div
                      className="px-4 py-3 bg-accent/5 border-l-2 border-accent"
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      <p className="text-sm text-accent">{error}</p>
                    </motion.div>
                  )}

                  {/* Current password */}
                  <PasswordField
                    label="Current Password"
                    value={currentPassword}
                    onChange={setCurrentPassword}
                    visible={show.current}
                    onToggle={() => setShow((s) => ({ ...s, current: !s.current }))}
                    placeholder="Enter your current password"
                    autoFocus
                    required
                  />

                  <div className="h-[1px] bg-text/[0.06]" />

                  {/* New password */}
                  <div>
                    <PasswordField
                      label="New Password"
                      value={newPassword}
                      onChange={setNewPassword}
                      visible={show.next}
                      onToggle={() => setShow((s) => ({ ...s, next: !s.next }))}
                      placeholder="Minimum 6 characters"
                      required
                      minLength={6}
                    />
                    {newPassword.length > 0 && (
                      <p
                        className={`text-[11px] mt-2 ${
                          newPassword.length < 6 ? "text-text/40" : "text-emerald-600"
                        }`}
                      >
                        {newPassword.length < 6
                          ? `${6 - newPassword.length} more character${6 - newPassword.length === 1 ? "" : "s"} needed`
                          : "✓ Meets minimum length"}
                      </p>
                    )}
                  </div>

                  {/* Confirm new password */}
                  <div>
                    <PasswordField
                      label="Confirm New Password"
                      value={confirmPassword}
                      onChange={setConfirmPassword}
                      visible={show.confirm}
                      onToggle={() => setShow((s) => ({ ...s, confirm: !s.confirm }))}
                      placeholder="Re-enter new password"
                      required
                    />
                    {confirmPassword.length > 0 && (
                      <p
                        className={`text-[11px] mt-2 ${
                          passwordsMatch
                            ? "text-emerald-600"
                            : passwordsMismatch
                              ? "text-accent"
                              : "text-text/40"
                        }`}
                      >
                        {passwordsMatch
                          ? "✓ Passwords match"
                          : passwordsMismatch
                            ? "Passwords don't match"
                            : ""}
                      </p>
                    )}
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={!canSubmit || submitting}
                    className="group relative w-full py-3.5 border border-text text-sm tracking-[0.2em] uppercase cursor-pointer overflow-hidden disabled:opacity-30 disabled:cursor-not-allowed mt-2"
                  >
                    <span className="absolute inset-0 bg-text origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
                    <span className="relative z-10 group-hover:text-bg transition-colors duration-500">
                      {submitting ? "Changing…" : "Change Password"}
                    </span>
                  </button>

                  <p className="text-[10px] text-text/40 text-center">
                    Forgot your current password?{" "}
                    <Link href="/forgot-password" className="text-text/60 hover:text-text underline underline-offset-2">
                      Reset it via email
                    </Link>
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}

/* ─── Password input with visibility toggle ─── */

function PasswordField({
  label,
  value,
  onChange,
  visible,
  onToggle,
  placeholder,
  autoFocus,
  required,
  minLength,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  visible: boolean;
  onToggle: () => void;
  placeholder?: string;
  autoFocus?: boolean;
  required?: boolean;
  minLength?: number;
}) {
  return (
    <div>
      <label className="text-[10px] text-text/60 tracking-[0.3em] uppercase block mb-3">
        {label}
      </label>
      <div className="relative">
        <input
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          minLength={minLength}
          autoFocus={autoFocus}
          className="w-full bg-transparent border-b border-text/20 focus:border-text/60 py-3 text-[15px] outline-none transition-all placeholder:text-text/30 pr-11"
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-0 top-1/2 -translate-y-1/2 text-text/40 hover:text-text transition-colors cursor-pointer p-2"
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? (
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
  );
}
