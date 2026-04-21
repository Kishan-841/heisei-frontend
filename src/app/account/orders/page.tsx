"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import { api, Order, Pagination } from "@/lib/api";
import { useAuthStore } from "@/lib/auth-store";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const statusConfig: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  PENDING: { label: "Pending", bg: "bg-[#F5F0EB]", text: "text-[#8C7B6B]", dot: "bg-[#8C7B6B]" },
  CONFIRMED: { label: "Confirmed", bg: "bg-[#EBF0F5]", text: "text-[#4A6B8A]", dot: "bg-[#4A6B8A]" },
  SHIPPED: { label: "Shipped", bg: "bg-accent/8", text: "text-accent", dot: "bg-accent" },
  DELIVERED: { label: "Delivered", bg: "bg-green-50", text: "text-green-700", dot: "bg-green-600" },
  CANCELLED: { label: "Cancelled", bg: "bg-red-50", text: "text-red-600", dot: "bg-red-500" },
};

export default function OrdersPage() {
  const user = useAuthStore((s) => s.user);
  const initialized = useAuthStore((s) => s.initialized);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<Pagination | null>(null);

  useEffect(() => {
    if (!initialized || !user) return;
    setLoading(true);
    api.orders.list(page, 8).then(
      (data) => { setOrders(data.orders); setPagination(data.pagination); setLoading(false); },
      () => setLoading(false)
    );
  }, [initialized, user, page]);

  const totalSpent = pagination ? 0 : orders.reduce((sum, o) => sum + o.total, 0);
  const totalItems = pagination ? 0 : orders.reduce((sum, o) => o.items.reduce((s, it) => s + it.qty, 0) + sum, 0);

  if (!initialized || loading) {
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
        <main className="min-h-screen bg-bg flex items-center justify-center px-6">
          <div className="text-center">
            <p className="text-text/50 text-sm mb-4">Please sign in to view your orders</p>
            <Link href="/login" className="border border-text px-8 py-3 text-sm tracking-widest hover:bg-text hover:text-bg transition-colors">
              Sign In
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#ECECEC]">
        {/* Dark Banner */}
        <div className="relative bg-[#0F0F0F] text-[#F7F6F2] overflow-hidden">
          {/* Decorative kanji */}
          <motion.div
            className="absolute top-[10%] right-[8%] text-[200px] font-light select-none pointer-events-none leading-none"
            style={{ fontFamily: "serif" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.03 }}
            transition={{ duration: 2 }}
          >
            注
          </motion.div>
          <motion.div
            className="absolute top-0 left-[35%] w-[1px] h-full bg-white"
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: 1, opacity: 0.04 }}
            transition={{ duration: 2, delay: 0.3 }}
            style={{ transformOrigin: "top" }}
          />

          <div className="max-w-4xl mx-auto px-6 pt-28 pb-16 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Link href="/account" className="text-xs text-[#A8A29E]/60 hover:text-[#A8A29E] transition-colors mb-6 inline-block">
                &larr; Back to Account
              </Link>
              <p className="text-[#C23B22] text-[10px] tracking-[0.35em] uppercase mb-3">注文履歴</p>
              <h1 className="text-3xl md:text-4xl font-normal tracking-tight">Order History</h1>
              <p className="text-[#A8A29E] text-sm mt-3 max-w-md leading-relaxed">
                Track and manage all your purchases in one place.
              </p>
            </motion.div>

            {/* Stats Row */}
            {orders.length > 0 && (
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-10"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
              >
                {[
                  { label: "Total Orders", value: (pagination?.total || orders.length).toString() },
                  { label: "Items Purchased", value: orders.reduce((sum, o) => o.items.reduce((s, it) => s + it.qty, 0) + sum, 0).toString() },
                  { label: "Page", value: `${pagination?.page || 1} of ${pagination?.totalPages || 1}` },
                ].map((stat) => (
                  <div key={stat.label} className="border border-white/10 rounded-sm px-4 sm:px-5 py-3 sm:py-4 flex sm:block items-center justify-between">
                    <p className="text-[10px] text-[#A8A29E]/60 tracking-[0.2em] uppercase">{stat.label}</p>
                    <p className="text-lg sm:text-xl mt-0 sm:mt-1 font-light">{stat.value}</p>
                  </div>
                ))}
              </motion.div>
            )}
          </div>
        </div>

        {/* Orders List */}
        <div className="max-w-4xl mx-auto px-6 py-10">
          {orders.length === 0 ? (
            <motion.div
              className="bg-white border border-text/10 text-center py-20 px-6"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="text-4xl mb-4" style={{ fontFamily: "serif" }}>空</div>
              <p className="text-text/60 text-sm tracking-widest uppercase mb-2">No orders yet</p>
              <p className="text-text/40 text-xs mb-8 max-w-xs mx-auto leading-relaxed">
                Your order history will appear here once you make your first purchase.
              </p>
              <Link
                href="/collection"
                className="group relative inline-block px-10 py-3.5 border border-text text-sm tracking-[0.2em] uppercase overflow-hidden"
              >
                <span className="absolute inset-0 bg-text origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
                <span className="relative z-10 group-hover:text-bg transition-colors duration-500">
                  Browse Collection
                </span>
              </Link>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {orders.map((order, i) => {
                const status = statusConfig[order.status] || statusConfig.PENDING;
                const date = new Date(order.createdAt);
                return (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06, duration: 0.5 }}
                  >
                    <Link
                      href={`/account/orders/${order.id}`}
                      className="group block bg-white border border-text/10 hover:border-text/25 transition-all duration-300 hover:shadow-sm overflow-hidden"
                    >
                      {/* Top accent bar on hover */}
                      <div className="h-[2px] bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

                      <div className="p-6">
                        {/* Header row */}
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-5 gap-3">
                          <div className="flex items-center gap-4">
                            {/* Order icon */}
                            <div className="w-10 h-10 bg-[#F5F0EB] rounded-sm flex items-center justify-center flex-shrink-0">
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-text/50">
                                <path d="M20 12V22H4V12" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M22 7H2V12H22V7Z" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M12 22V7" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M12 7H7.5C6.83696 7 6.20107 6.73661 5.73223 6.26777C5.26339 5.79893 5 5.16304 5 4.5C5 3.83696 5.26339 3.20107 5.73223 2.73223C6.20107 2.26339 6.83696 2 7.5 2C11 2 12 7 12 7Z" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M12 7H16.5C17.163 7 17.7989 6.73661 18.2678 6.26777C18.7366 5.79893 19 5.16304 19 4.5C19 3.83696 18.7366 3.20107 18.2678 2.73223C17.7989 2.26339 17.163 2 16.5 2C13 2 12 7 12 7Z" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </div>
                            <div>
                              <p className="text-sm font-medium font-mono text-text/70">
                                #{order.id.slice(0, 8).toUpperCase()}
                              </p>
                              <p className="text-xs text-text/40 mt-0.5">
                                {date.toLocaleDateString("en-IN", {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                })}
                                {" · "}
                                {date.toLocaleTimeString("en-IN", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </p>
                            </div>
                          </div>
                          {/* Status badge */}
                          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${status.bg}`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                            <span className={`text-[10px] tracking-widest uppercase font-medium ${status.text}`}>
                              {status.label}
                            </span>
                          </div>
                        </div>

                        {/* Items */}
                        <div className="space-y-2 mb-5">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex items-center justify-between py-2 px-3 bg-[#F7F6F2]/60 rounded-sm">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-surface rounded-sm flex items-center justify-center text-[10px] text-text/40 font-mono">
                                  {item.qty}x
                                </div>
                                <div>
                                  <p className="text-sm text-text/80">{item.name}</p>
                                  <p className="text-[10px] text-text/40 mt-0.5">
                                    Size: {item.size} · {item.color || "—"}
                                  </p>
                                </div>
                              </div>
                              <p className="text-sm text-text/60">₹{(item.price * item.qty).toLocaleString("en-IN")}</p>
                            </div>
                          ))}
                        </div>

                        {/* Footer */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 border-t border-text/5 gap-3">
                          <div className="flex items-center gap-4 sm:gap-6">
                            <div>
                              <p className="text-[10px] text-text/40 tracking-wider uppercase">Subtotal</p>
                              <p className="text-sm text-text/60 mt-0.5">₹{order.subtotal.toLocaleString("en-IN")}</p>
                            </div>
                            <div>
                              <p className="text-[10px] text-text/40 tracking-wider uppercase">Shipping</p>
                              <p className="text-sm text-text/60 mt-0.5">
                                {order.shipping === 0 ? "Free" : `₹${order.shipping}`}
                              </p>
                            </div>
                            <div>
                              <p className="text-[10px] text-text/40 tracking-wider uppercase">Total</p>
                              <p className="text-sm font-medium mt-0.5">₹{order.total.toLocaleString("en-IN")}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-text/40 group-hover:text-accent transition-colors duration-300">
                            <span>View details</span>
                            <motion.span
                              className="inline-block"
                              initial={{ x: 0 }}
                              whileHover={{ x: 3 }}
                            >
                              &rarr;
                            </motion.span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <motion.div
                  className="flex items-center justify-center gap-2 pt-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.25 }}
                >
                  <button
                    onClick={() => { setPage((p) => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                    disabled={page <= 1}
                    className="px-4 py-2.5 border border-text/10 bg-white text-xs tracking-widest uppercase text-text/50 hover:text-text hover:border-text/25 disabled:opacity-25 disabled:cursor-not-allowed cursor-pointer transition-colors"
                  >
                    &larr; Prev
                  </button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                      .filter((p) => {
                        if (p === 1 || p === pagination!.totalPages) return true;
                        if (Math.abs(p - page) <= 1) return true;
                        return false;
                      })
                      .reduce<(number | "...")[]>((acc, p, i, arr) => {
                        if (i > 0 && p - (arr[i - 1]) > 1) acc.push("...");
                        acc.push(p);
                        return acc;
                      }, [])
                      .map((p, i) =>
                        p === "..." ? (
                          <span key={`dots-${i}`} className="w-9 h-9 flex items-center justify-center text-text/25 text-xs">...</span>
                        ) : (
                          <button
                            key={p}
                            onClick={() => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                            className={`w-9 h-9 flex items-center justify-center text-xs font-medium cursor-pointer transition-colors ${
                              page === p
                                ? "bg-text text-bg"
                                : "bg-white border border-text/10 text-text/50 hover:text-text hover:border-text/25"
                            }`}
                          >
                            {p}
                          </button>
                        )
                      )}
                  </div>
                  <button
                    onClick={() => { setPage((p) => Math.min(pagination!.totalPages, p + 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                    disabled={page >= pagination.totalPages}
                    className="px-4 py-2.5 border border-text/10 bg-white text-xs tracking-widest uppercase text-text/50 hover:text-text hover:border-text/25 disabled:opacity-25 disabled:cursor-not-allowed cursor-pointer transition-colors"
                  >
                    Next &rarr;
                  </button>
                </motion.div>
              )}

              {/* Bottom CTA */}
              <motion.div
                className="text-center pt-8 pb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <p className="text-xs text-text/35 mb-4">Looking for something new?</p>
                <Link
                  href="/collection"
                  className="inline-block text-xs text-text/50 hover:text-accent border-b border-text/20 hover:border-accent pb-0.5 transition-colors"
                >
                  Browse Collection &rarr;
                </Link>
              </motion.div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
