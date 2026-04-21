"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "@/lib/cart";
import { useAuthStore } from "@/lib/auth-store";
import { useState, useEffect } from "react";

export default function Navbar() {
  const { totalItems, setIsOpen } = useCart();
  const user = useAuthStore((s) => s.user);
  const isAdmin = !!user?.isAdmin;
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const mobileLinks = [
    { href: "/collection", label: "Explore" },
    { href: "/our-story", label: "Our Story" },
    isAdmin
      ? { href: "/admin", label: "Admin Dashboard" }
      : { href: "/collection", label: "Collection" },
    { href: "/contact", label: "Contact" },
    { href: "/account", label: "Account" },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <nav
        className={`sticky top-0 w-full transition-all duration-300 ${
          scrolled
            ? "bg-bg/80 backdrop-blur-xl border-b border-text/[0.06] shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
            : "bg-transparent"
        }`}
        style={{ zIndex: 10000 }}
      >
        {/* DESKTOP */}
        <div className="hidden md:flex items-center h-[60px] px-12">
          <div className="flex-1 flex items-center gap-8">
            <a href="/collection" className="relative text-sm tracking-wide text-text/80 hover:text-accent transition-colors duration-200 py-5 group">
              Explore
              <span className="absolute bottom-3 left-0 h-[1px] w-0 bg-accent transition-all duration-300 ease-out group-hover:w-full" />
            </a>
            <a href="/our-story" className="relative text-sm tracking-wide text-text/80 hover:text-accent transition-colors duration-200 py-5 group">
              Our Story
              <span className="absolute bottom-3 left-0 h-[1px] w-0 bg-accent transition-all duration-300 ease-out group-hover:w-full" />
            </a>
          </div>

          <a href="/" className="flex flex-col items-center leading-none px-8 shrink-0">
            <span className="text-[11px] text-text/70 tracking-[0.6em] pl-[0.6em] pb-[3px] mb-[4px] border-b border-text/30">
              平成
            </span>
            <span
              className="text-2xl font-normal tracking-[0.1em]"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              HEISEI
            </span>
          </a>

          <div className="flex-1 flex items-center justify-end gap-8">
            {isAdmin ? (
              <a href="/admin" className="relative text-sm tracking-wide text-accent hover:text-accent/70 transition-colors duration-200 py-5 group flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" />
                  <rect x="14" y="14" width="7" height="7" rx="1" />
                </svg>
                Admin Dashboard
                <span className="absolute bottom-3 right-0 h-[1px] w-0 bg-accent transition-all duration-300 ease-out group-hover:w-full" />
              </a>
            ) : (
              <a href="/collection" className="relative text-sm tracking-wide text-text/80 hover:text-accent transition-colors duration-200 py-5 group">
                Collection
                <span className="absolute bottom-3 right-0 h-[1px] w-0 bg-accent transition-all duration-300 ease-out group-hover:w-full" />
              </a>
            )}
            <a href="/contact" className="relative text-sm tracking-wide text-text/80 hover:text-accent transition-colors duration-200 py-5 group">
              Contact
              <span className="absolute bottom-3 right-0 h-[1px] w-0 bg-accent transition-all duration-300 ease-out group-hover:w-full" />
            </a>
            <a href={user ? "/account" : "/login"} className="hover:text-accent transition-colors duration-200 ml-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </a>
            <button onClick={() => setIsOpen(true)} className="hover:text-accent transition-colors duration-200 relative">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent text-white text-[9px] rounded-full flex items-center justify-center leading-none">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* MOBILE */}
        <div className="flex md:hidden items-center justify-center h-[60px] px-6 relative">
          <a href="/" className="flex flex-col items-center leading-none">
            <span className="text-[11px] text-text/70 tracking-[0.6em] pl-[0.6em] pb-[3px] mb-[4px] border-b border-text/30">
              平成
            </span>
            <span
              className="text-xl font-normal tracking-[0.1em]"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              HEISEI
            </span>
          </a>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="absolute right-6 w-6 h-5"
            aria-label="Toggle menu"
          >
            <motion.span
              className="absolute left-0 w-full h-[1.5px] bg-text block"
              animate={menuOpen ? { top: "50%", rotate: 45, translateY: "-50%" } : { top: "0%", rotate: 0, translateY: "0%" }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            />
            <motion.span
              className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[1.5px] bg-text block"
              animate={menuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.2 }}
            />
            <motion.span
              className="absolute left-0 w-full h-[1.5px] bg-text block"
              animate={menuOpen ? { bottom: "50%", rotate: -45, translateY: "50%" } : { bottom: "0%", rotate: 0, translateY: "0%" }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            />
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/20 md:hidden"
              style={{ zIndex: 9998 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              className="fixed inset-0 bg-bg md:hidden flex flex-col items-center justify-center"
              style={{ zIndex: 9999 }}
              initial={{ clipPath: "circle(0% at calc(100% - 30px) 28px)" }}
              animate={{ clipPath: "circle(150% at calc(100% - 30px) 28px)" }}
              exit={{ clipPath: "circle(0% at calc(100% - 30px) 28px)" }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <nav className="flex flex-col items-center gap-8">
                {mobileLinks.map((link, i) => (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    className="text-2xl tracking-wide text-text hover:text-accent transition-colors duration-200"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ delay: 0.15 + i * 0.08, duration: 0.4 }}
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.label}
                  </motion.a>
                ))}
                <motion.button
                  className="text-2xl tracking-wide text-text hover:text-accent transition-colors duration-200 flex items-center gap-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ delay: 0.15 + mobileLinks.length * 0.08, duration: 0.4 }}
                  onClick={() => { setMenuOpen(false); setIsOpen(true); }}
                >
                  Cart
                  {totalItems > 0 && (
                    <span className="w-5 h-5 bg-accent text-white text-[10px] rounded-full flex items-center justify-center leading-none">
                      {totalItems}
                    </span>
                  )}
                </motion.button>
                <motion.p
                  className="text-accent text-xs tracking-widest mt-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 0.6, duration: 0.4 }}
                >
                  平成
                </motion.p>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
