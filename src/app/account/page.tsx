"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/lib/auth-store";
import { api, Order, Address } from "@/lib/api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AccountPage() {
  const user = useAuthStore((s) => s.user);
  const initialized = useAuthStore((s) => s.initialized);
  const logout = useAuthStore((s) => s.logout);
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!initialized || !user) return;
    Promise.all([
      api.orders.list().catch(() => ({ orders: [] })),
      api.addresses.list().catch(() => ({ addresses: [] })),
    ]).then(([o, a]) => {
      setOrders(o.orders);
      setAddresses(a.addresses);
      setLoaded(true);
    });
  }, [initialized, user]);

  const handleLogout = async () => {
    await logout();
    router.push("/");
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

  if (!user) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-bg">
          <div className="grid md:grid-cols-2 min-h-screen">
            <div className="hidden md:flex relative bg-[#0F0F0F] text-[#F7F6F2] flex-col justify-center p-16 overflow-hidden">
              <motion.div
                className="absolute top-[10%] right-[10%] text-[250px] font-light select-none pointer-events-none leading-none"
                style={{ fontFamily: "serif" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.03 }}
                transition={{ duration: 2 }}
              >
                会
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                <span className="text-3xl font-medium tracking-[0.2em]">HEISEI</span>
                <span className="block text-[10px] text-[#A8A29E] tracking-[0.5em] mt-1 mb-10">平成</span>
                <p className="text-3xl font-light leading-snug max-w-sm">Your personal space for comfort.</p>
                <p className="text-sm text-[#A8A29E] mt-4 max-w-xs leading-relaxed">
                  Sign in to access order tracking, saved addresses, and exclusive features.
                </p>
              </motion.div>
            </div>
            <div className="flex items-center justify-center px-4 sm:px-8 md:px-16 py-20 pt-28 md:pt-20">
              <motion.div className="w-full max-w-sm text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <p className="text-accent text-[10px] tracking-[0.35em] uppercase mb-3">アカウント</p>
                <h1 className="text-3xl font-normal tracking-tight mb-3">Account</h1>
                <p className="text-text/50 text-sm mb-10">Sign in to view your account</p>
                <div className="space-y-3">
                  <Link href="/login" className="group relative block w-full py-4 border border-text text-sm tracking-[0.2em] uppercase overflow-hidden">
                    <span className="absolute inset-0 bg-text origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
                    <span className="relative z-10 group-hover:text-bg transition-colors duration-500">Sign In</span>
                  </Link>
                  <Link href="/signup" className="block w-full py-3.5 border border-text/20 text-sm tracking-[0.15em] text-text/50 hover:border-text/40 hover:text-text transition-colors text-center">
                    Create Account
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const totalSpent = orders.reduce((sum, o) => sum + o.total, 0);
  const recentOrder = orders[0];
  const defaultAddr = addresses.find((a) => a.isDefault);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-bg pt-20 pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Header with dark banner */}
          <motion.div
            className="bg-[#0F0F0F] text-[#F7F6F2] p-8 md:p-12 mb-8 relative overflow-hidden"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="absolute top-[5%] right-[3%] text-[180px] font-light select-none pointer-events-none leading-none hidden md:block"
              style={{ fontFamily: "serif" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.05 }}
              transition={{ duration: 2, delay: 0.3 }}
            >
              人
            </motion.div>
            <motion.div
              className="absolute top-0 left-[60%] w-[1px] h-full bg-white hidden md:block"
              initial={{ scaleY: 0, opacity: 0 }}
              animate={{ scaleY: 1, opacity: 0.05 }}
              transition={{ duration: 1.5, delay: 0.5 }}
              style={{ transformOrigin: "top" }}
            />

            <div className="relative z-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <p className="text-[#C23B22] text-[10px] tracking-[0.35em] uppercase mb-3">アカウント</p>
                <h1 className="text-3xl md:text-4xl font-light tracking-tight">
                  Welcome, {user.name}
                </h1>
                <p className="text-[#A8A29E] text-sm mt-2">{user.phone}</p>
              </div>
              <button
                onClick={handleLogout}
                className="text-xs text-[#A8A29E] hover:text-[#C23B22] transition-colors cursor-pointer tracking-widest uppercase self-start md:self-auto"
              >
                Sign Out
              </button>
            </div>

            {user.isGuest && (
              <div className="relative z-10 mt-5 pt-5 border-t border-white/10">
                <p className="text-xs text-[#A8A29E]">
                  Guest account —{" "}
                  <Link href="/signup" className="text-[#C23B22] hover:underline">
                    Create a full account
                  </Link>{" "}
                  to save your details for next time.
                </p>
              </div>
            )}
          </motion.div>

          {/* Stats row */}
          {loaded && (
            <motion.div
              className="grid grid-cols-3 gap-3 md:gap-4 mb-8"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              {[
                { label: "Orders", value: orders.length.toString(), sub: "注文", color: "bg-[#0F0F0F]" },
                { label: "Total Spent", value: `₹${totalSpent.toLocaleString("en-IN")}`, sub: "合計", color: "bg-[#C23B22]" },
                { label: "Addresses", value: addresses.length.toString(), sub: "住所", color: "bg-[#0F0F0F]" },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  className="group bg-white border border-text/10 p-3 sm:p-5 md:p-6 hover:border-text/25 transition-all duration-300 relative overflow-hidden cursor-default"
                  whileHover={{ y: -2 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.05 }}
                >
                  {/* Accent bar top */}
                  <div className={`absolute top-0 left-0 right-0 h-[3px] ${stat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                  <p className="text-[10px] text-text/50 tracking-[0.25em] uppercase">{stat.label}</p>
                  <p className="text-lg sm:text-2xl md:text-3xl font-light mt-2 text-text truncate">{stat.value}</p>
                  <p className="text-[10px] text-accent tracking-widest mt-1">{stat.sub}</p>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Main cards */}
          <div className="grid md:grid-cols-2 gap-3 md:gap-4 mb-8">
            {/* Order History card */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Link
                href="/account/orders"
                className="group block bg-white border border-text/10 hover:border-text/25 transition-all duration-300 h-full relative overflow-hidden"
              >
                {/* Left accent bar on hover */}
                <div className="absolute top-0 left-0 w-[3px] h-full bg-accent origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />

                <div className="p-6 md:p-8">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-accent text-[10px] tracking-[0.3em] mb-2">注文履歴</p>
                      <h2 className="text-xl text-text group-hover:text-accent transition-colors duration-300">Order History</h2>
                      <p className="text-xs text-text/45 mt-2 leading-relaxed max-w-xs">
                        View past orders, track shipments, and reorder your favorites.
                      </p>
                    </div>
                    <motion.div
                      className="w-10 h-10 rounded-full bg-surface flex items-center justify-center flex-shrink-0 group-hover:bg-accent/10 transition-colors duration-300"
                      whileHover={{ scale: 1.1 }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-text/40 group-hover:text-accent transition-colors">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </motion.div>
                  </div>

                  {/* Recent order preview */}
                  {recentOrder ? (
                    <div className="mt-6 pt-5 border-t border-text/8">
                      <p className="text-[10px] text-text/40 tracking-widest uppercase mb-3">Most Recent Order</p>
                      <div className="bg-surface/50 p-4 rounded-sm">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-[#0F0F0F] rounded-full flex items-center justify-center">
                              <span className="text-white text-[8px] font-mono">
                                {recentOrder.items.length}
                              </span>
                            </div>
                            <div>
                              <p className="text-xs text-text font-mono">
                                #{recentOrder.id.slice(0, 8).toUpperCase()}
                              </p>
                              <p className="text-[10px] text-text/40 mt-0.5">
                                ₹{recentOrder.total.toLocaleString("en-IN")}
                              </p>
                            </div>
                          </div>
                          <span className={`text-[10px] tracking-widest uppercase px-2 py-1 ${
                            recentOrder.status === "DELIVERED" ? "bg-green-50 text-green-700" :
                            recentOrder.status === "SHIPPED" ? "bg-accent/10 text-accent" :
                            "bg-text/5 text-text/50"
                          }`}>
                            {recentOrder.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-6 pt-5 border-t border-text/8">
                      <p className="text-xs text-text/30 italic">No orders yet — time to explore</p>
                    </div>
                  )}
                </div>
              </Link>
            </motion.div>

            {/* Saved Addresses card */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <Link
                href="/account/addresses"
                className="group block bg-white border border-text/10 hover:border-text/25 transition-all duration-300 h-full relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-[3px] h-full bg-accent origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />

                <div className="p-6 md:p-8">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-accent text-[10px] tracking-[0.3em] mb-2">住所管理</p>
                      <h2 className="text-xl text-text group-hover:text-accent transition-colors duration-300">Saved Addresses</h2>
                      <p className="text-xs text-text/45 mt-2 leading-relaxed max-w-xs">
                        Manage your shipping addresses for faster checkout.
                      </p>
                    </div>
                    <motion.div
                      className="w-10 h-10 rounded-full bg-surface flex items-center justify-center flex-shrink-0 group-hover:bg-accent/10 transition-colors duration-300"
                      whileHover={{ scale: 1.1 }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-text/40 group-hover:text-accent transition-colors">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </motion.div>
                  </div>

                  {/* Default address preview */}
                  {defaultAddr ? (
                    <div className="mt-6 pt-5 border-t border-text/8">
                      <p className="text-[10px] text-text/40 tracking-widest uppercase mb-3">Default Address</p>
                      <div className="bg-surface/50 p-4 rounded-sm">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-[#0F0F0F] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
                              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                              <circle cx="12" cy="10" r="3" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-xs text-text">{defaultAddr.fullName}</p>
                            <p className="text-[11px] text-text/40 mt-0.5 leading-relaxed">
                              {defaultAddr.addressLine1}, {defaultAddr.city}, {defaultAddr.state}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-6 pt-5 border-t border-text/8">
                      <div className="bg-surface/50 p-4 rounded-sm flex items-center gap-3">
                        <div className="w-8 h-8 border border-dashed border-text/20 rounded-full flex items-center justify-center">
                          <span className="text-text/30 text-lg leading-none">+</span>
                        </div>
                        <p className="text-xs text-text/35">Add your first shipping address</p>
                      </div>
                    </div>
                  )}
                </div>
              </Link>
            </motion.div>
          </div>

          {/* Quick links */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {[
              { href: "/collection", label: "Shop Collection", jp: "買い物", icon: "→" },
              { href: "/contact", label: "Contact Us", jp: "お問合せ", icon: "→" },
              { href: "/our-story", label: "Our Story", jp: "物語", icon: "→" },
              { href: "/checkout", label: "Checkout", jp: "精算", icon: "→" },
            ].map((link, i) => (
              <motion.div
                key={link.href}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  href={link.href}
                  className="group block bg-white border border-text/10 hover:border-text/25 p-5 text-center transition-all duration-300 relative overflow-hidden"
                >
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
                  <p className="text-[9px] text-accent tracking-widest">{link.jp}</p>
                  <p className="text-xs text-text/50 group-hover:text-text transition-colors mt-1.5 flex items-center justify-center gap-1.5">
                    {link.label}
                    <span className="inline-block group-hover:translate-x-1 transition-transform duration-300 text-accent opacity-0 group-hover:opacity-100">
                      {link.icon}
                    </span>
                  </p>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
