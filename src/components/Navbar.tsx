"use client";

import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";
import { useCart } from "@/lib/cart";
import { useAuthStore } from "@/lib/auth-store";
import { useState } from "react";

function NavLink({
  href,
  children,
  direction = "left",
}: {
  href: string;
  children: React.ReactNode;
  direction?: "left" | "right";
}) {
  return (
    <a
      href={href}
      className="relative text-sm tracking-wide text-text/80 hover:text-accent transition-colors duration-200 group pb-1"
    >
      {children}
      <span
        className={`absolute bottom-0 ${direction === "left" ? "left-0" : "right-0"} h-[1px] w-0 bg-accent transition-all duration-300 ease-out group-hover:w-full`}
        style={{ transformOrigin: direction === "left" ? "left" : "right" }}
      />
    </a>
  );
}

const mobileLinks = [
  { href: "/collection", label: "Explore" },
  { href: "/our-story", label: "Our Story" },
  { href: "/collection", label: "Collection" },
  { href: "/contact", label: "Contact" },
  { href: "/account", label: "Account" },
];

export default function Navbar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 80, damping: 20 });
  const { totalItems, setIsOpen } = useCart();
  const user = useAuthStore((s) => s.user);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 bg-bg"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 h-[60px] flex items-center justify-between">
          {/* LEFT LINKS */}
          <div className="hidden md:flex items-center gap-8">
            <NavLink href="/collection" direction="left">
              Explore
            </NavLink>
            <NavLink href="/our-story" direction="left">
              Our Story
            </NavLink>
          </div>

          {/* CENTER — BRAND */}
          <a
            href="/"
            className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center leading-none z-[52]"
          >
            <span className="text-[11px] text-text/70 tracking-[0.6em] pl-[0.6em] pb-[3px] mb-[4px] border-b border-text/30">
              平成
            </span>
            <span className="text-xl md:text-2xl font-medium tracking-[0.15em]">
              HEISEI
            </span>
          </a>

          {/* RIGHT LINKS */}
          <div className="hidden md:flex items-center gap-8">
            <NavLink href="/collection" direction="right">
              Collection
            </NavLink>
            <NavLink href="/contact" direction="right">
              Contact
            </NavLink>
          </div>

          {/* HAMBURGER — mobile only */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden ml-auto w-6 h-5 relative cursor-pointer z-[52]"
            aria-label="Toggle menu"
          >
            <motion.span
              className="absolute left-0 w-full h-[1.5px] bg-text block"
              animate={
                menuOpen
                  ? { top: "50%", rotate: 45, translateY: "-50%" }
                  : { top: "0%", rotate: 0, translateY: "0%" }
              }
              transition={{ duration: 0.3, ease: "easeInOut" }}
            />
            <motion.span
              className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[1.5px] bg-text block"
              animate={menuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.2 }}
            />
            <motion.span
              className="absolute left-0 w-full h-[1.5px] bg-text block"
              animate={
                menuOpen
                  ? { bottom: "50%", rotate: -45, translateY: "50%" }
                  : { bottom: "0%", rotate: 0, translateY: "0%" }
              }
              transition={{ duration: 0.3, ease: "easeInOut" }}
            />
          </button>
        </div>

        {/* SCROLL PROGRESS BAR */}
        <motion.div
          className="h-[2px] w-full bg-accent origin-left"
          style={{ scaleX }}
        />
      </motion.nav>

      {/* ACCOUNT ICON — hidden on mobile, accessible via mobile menu */}
      <a
        href={user ? "/account" : "/login"}
        className="hidden md:block fixed top-4 md:right-16 z-[51] cursor-pointer hover:text-accent transition-colors duration-200"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      </a>

      {/* CART ICON — hidden on mobile, accessible via mobile menu */}
      <button
        onClick={() => setIsOpen(true)}
        className="hidden md:block fixed top-4 md:right-6 z-[51] cursor-pointer hover:text-accent transition-colors duration-200"
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
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

      {/* MOBILE MENU OVERLAY */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* BACKDROP */}
            <motion.div
              className="fixed inset-0 bg-black/20 z-40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setMenuOpen(false)}
            />

            {/* MENU PANEL */}
            <motion.div
              className="fixed inset-0 top-0 bg-bg z-40 md:hidden flex flex-col items-center justify-center"
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

                {/* CART LINK IN MOBILE MENU */}
                <motion.button
                  className="text-2xl tracking-wide text-text hover:text-accent transition-colors duration-200 cursor-pointer flex items-center gap-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ delay: 0.15 + mobileLinks.length * 0.08, duration: 0.4 }}
                  onClick={() => {
                    setMenuOpen(false);
                    setIsOpen(true);
                  }}
                >
                  Cart
                  {totalItems > 0 && (
                    <span className="w-5 h-5 bg-accent text-white text-[10px] rounded-full flex items-center justify-center leading-none">
                      {totalItems}
                    </span>
                  )}
                </motion.button>

                {/* JAPANESE ACCENT */}
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
