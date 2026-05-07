"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { api, Order } from "@/lib/api";
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

const timelineSteps = [
  { key: "PENDING", label: "Order Placed", desc: "Your order has been received" },
  { key: "CONFIRMED", label: "Confirmed", desc: "Order confirmed by our team" },
  { key: "SHIPPED", label: "Shipped", desc: "On its way to you" },
  { key: "DELIVERED", label: "Delivered", desc: "Successfully delivered" },
];

export default function OrderDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState("");
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (!id) return;
    api.orders.get(id).then(
      (data) => { setOrder(data.order); setLoading(false); },
      () => setLoading(false)
    );
  }, [id]);

  const handleCancel = async () => {
    if (!order) return;
    setCancelError("");
    setCancelling(true);
    try {
      const { order: updated } = await api.orders.cancel(order.id);
      setOrder(updated);
    } catch (err) {
      setCancelError(err instanceof Error ? err.message : "Failed to cancel order");
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-bg flex items-center justify-center">
          <div className="w-5 h-5 border border-text/20 border-t-text rounded-full animate-spin" />
        </main>
      </>
    );
  }

  if (!order) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-[#ECECEC] flex items-center justify-center">
          <div className="text-center">
            <div className="text-3xl mb-3" style={{ fontFamily: "serif" }}>無</div>
            <p className="text-text/50 text-sm">Order not found</p>
            <Link href="/account/orders" className="text-xs text-text/40 hover:text-accent mt-4 inline-block transition-colors">
              &larr; Back to orders
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const status = statusConfig[order.status] || statusConfig.PENDING;
  const date = new Date(order.createdAt);
  const statusIndex = timelineSteps.findIndex((s) => s.key === order.status);
  const isCancelled = order.status === "CANCELLED";
  const totalItems = order.items.reduce((sum, it) => sum + it.qty, 0);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#ECECEC]">
        {/* Dark Banner */}
        <div className="relative bg-[#0F0F0F] text-[#F7F6F2] overflow-hidden">
          <motion.div
            className="absolute top-[8%] right-[6%] text-[220px] font-light select-none pointer-events-none leading-none"
            style={{ fontFamily: "serif" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.03 }}
            transition={{ duration: 2 }}
          >
            詳
          </motion.div>
          <motion.div
            className="absolute top-0 left-[30%] w-[1px] h-full bg-white"
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: 1, opacity: 0.04 }}
            transition={{ duration: 2, delay: 0.3 }}
            style={{ transformOrigin: "top" }}
          />
          <motion.div
            className="absolute top-[70%] left-0 w-full h-[1px] bg-white"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 0.03 }}
            transition={{ duration: 2, delay: 0.5 }}
            style={{ transformOrigin: "left" }}
          />

          <div className="max-w-4xl mx-auto px-6 pt-28 pb-14 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Link href="/account/orders" className="text-xs text-[#A8A29E]/60 hover:text-[#A8A29E] transition-colors mb-6 inline-block">
                &larr; All Orders
              </Link>
              <p className="text-[#C23B22] text-[10px] tracking-[0.35em] uppercase mb-3">注文詳細</p>
              <h1 className="text-3xl md:text-4xl font-normal tracking-tight">
                Order #{order.id.slice(0, 8).toUpperCase()}
              </h1>
              <p className="text-[#A8A29E] text-sm mt-3">
                Placed on{" "}
                {date.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                {" at "}
                {date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
              </p>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 mt-10"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <div className="border border-white/10 rounded-sm px-5 py-4">
                <p className="text-[10px] text-[#A8A29E]/60 tracking-[0.2em] uppercase">Status</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <div className={`w-2 h-2 rounded-full ${status.dot}`} />
                  <p className="text-sm font-light">{status.label}</p>
                </div>
              </div>
              <div className="border border-white/10 rounded-sm px-5 py-4">
                <p className="text-[10px] text-[#A8A29E]/60 tracking-[0.2em] uppercase">Items</p>
                <p className="text-xl mt-1 font-light">{totalItems}</p>
              </div>
              <div className="border border-white/10 rounded-sm px-5 py-4">
                <p className="text-[10px] text-[#A8A29E]/60 tracking-[0.2em] uppercase">Total</p>
                <p className="text-xl mt-1 font-light">₹{order.total.toLocaleString("en-IN")}</p>
              </div>
              <div className="border border-white/10 rounded-sm px-5 py-4 hidden md:block">
                <p className="text-[10px] text-[#A8A29E]/60 tracking-[0.2em] uppercase">Payment</p>
                <p className="text-sm mt-1.5 font-light">{order.paymentMethod === "RAZORPAY" ? "Paid Online" : order.paymentMethod}</p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-6 py-10">
          <div className="grid md:grid-cols-5 gap-6">

            {/* Left Column — Items + Totals (3/5) */}
            <motion.div
              className="md:col-span-3 space-y-6"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {/* Items Card */}
              <div className="bg-white border border-text/10 overflow-hidden">
                <div className="px-6 py-4 border-b border-text/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#F5F0EB] rounded-sm flex items-center justify-center">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-text/50">
                        <path d="M20 12V22H4V12" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M22 7H2V12H22V7Z" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 22V7" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <p className="text-[10px] text-text/50 tracking-[0.25em] uppercase">Order Items</p>
                  </div>
                  <span className="text-[10px] text-text/35">{totalItems} item{totalItems !== 1 ? "s" : ""}</span>
                </div>

                <div className="divide-y divide-text/5">
                  {order.items.map((item) => (
                    <div key={item.id} className="px-6 py-4 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        {item.product?.img ? (
                          <div className="w-12 h-14 bg-[#F7F6F2] rounded-sm overflow-hidden flex-shrink-0">
                            <img src={item.product.img} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="w-12 h-14 bg-[#F7F6F2] rounded-sm flex items-center justify-center flex-shrink-0">
                            <span className="text-[10px] text-text/30 font-mono">{item.qty}x</span>
                          </div>
                        )}
                        <div>
                          <p className="text-sm text-text/80">{item.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            {item.color && (
                              <span className="text-[10px] text-text/40 px-2 py-0.5 bg-text/3 rounded-sm">{item.color}</span>
                            )}
                            <span className="text-[10px] text-text/40 px-2 py-0.5 bg-text/3 rounded-sm">Size {item.size}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-medium">₹{(item.price * item.qty).toLocaleString("en-IN")}</p>
                        {item.qty > 1 && (
                          <p className="text-[10px] text-text/35 mt-0.5">₹{item.price.toLocaleString("en-IN")} each</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="px-6 py-4 bg-[#F7F6F2]/50 border-t border-text/5 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-text/40">Subtotal</span>
                    <span className="text-text/60">₹{order.subtotal.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text/40">Shipping</span>
                    <span className={order.shipping === 0 ? "text-green-600 text-xs" : "text-text/60"}>
                      {order.shipping === 0 ? "Free" : `₹${order.shipping}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-medium pt-2 border-t border-text/5">
                    <span>Total</span>
                    <span>₹{order.total.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </div>

              {/* Payment Card (mobile) */}
              <div className="bg-white border border-text/10 p-6 md:hidden">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-[#F5F0EB] rounded-sm flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-text/50">
                      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                      <line x1="1" y1="10" x2="23" y2="10" />
                    </svg>
                  </div>
                  <p className="text-[10px] text-text/50 tracking-[0.25em] uppercase">Payment</p>
                </div>
                <p className="text-sm">{order.paymentMethod === "RAZORPAY" ? "Paid Online" : order.paymentMethod}</p>
              </div>
            </motion.div>

            {/* Right Column — Address + Timeline (2/5) */}
            <motion.div
              className="md:col-span-2 space-y-6"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {/* Shipping Address Card */}
              <div className="bg-white border border-text/10 overflow-hidden">
                <div className="px-6 py-4 border-b border-text/5 flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#F5F0EB] rounded-sm flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-text/50">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  <p className="text-[10px] text-text/50 tracking-[0.25em] uppercase">Shipping Address</p>
                </div>
                <div className="px-6 py-5 space-y-1.5">
                  <p className="text-sm font-medium">{order.shippingName}</p>
                  <p className="text-sm text-text/50">{order.shippingAddress1}</p>
                  {order.shippingAddress2 && (
                    <p className="text-sm text-text/50">{order.shippingAddress2}</p>
                  )}
                  <p className="text-sm text-text/50">
                    {order.shippingCity}, {order.shippingState} — {order.shippingPincode}
                  </p>
                  <div className="pt-3 mt-3 border-t border-text/5 flex items-center gap-2">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-text/30">
                      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="text-sm text-text/50">{order.shippingPhone}</span>
                  </div>
                </div>
              </div>

              {/* Order Timeline */}
              <div className="bg-white border border-text/10 overflow-hidden">
                <div className="px-6 py-4 border-b border-text/5 flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#F5F0EB] rounded-sm flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-text/50">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <p className="text-[10px] text-text/50 tracking-[0.25em] uppercase">Order Timeline</p>
                </div>
                <div className="px-6 py-5">
                  {isCancelled ? (
                    <div className="flex items-center gap-3 px-3 py-3 bg-red-50 rounded-sm">
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                      <div>
                        <p className="text-sm text-red-600 font-medium">Cancelled</p>
                        <p className="text-[10px] text-red-400 mt-0.5">This order has been cancelled</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-0">
                      {timelineSteps.map((step, i) => {
                        const isActive = i <= statusIndex;
                        const isCurrent = i === statusIndex;
                        const isLast = i === timelineSteps.length - 1;
                        return (
                          <div key={step.key} className="flex gap-4">
                            {/* Line + Dot */}
                            <div className="flex flex-col items-center">
                              <div className={`w-3 h-3 rounded-full flex-shrink-0 border-2 transition-colors ${
                                isCurrent
                                  ? "border-accent bg-accent"
                                  : isActive
                                    ? "border-text/40 bg-text/40"
                                    : "border-text/15 bg-transparent"
                              }`} />
                              {!isLast && (
                                <div className={`w-[1.5px] h-8 transition-colors ${isActive && i < statusIndex ? "bg-text/25" : "bg-text/8"}`} />
                              )}
                            </div>
                            {/* Text */}
                            <div className={`pb-4 ${!isLast ? "" : ""}`}>
                              <p className={`text-sm ${isCurrent ? "font-medium" : isActive ? "text-text/60" : "text-text/30"}`}>
                                {step.label}
                              </p>
                              <p className={`text-[10px] mt-0.5 ${isCurrent ? "text-text/50" : "text-text/25"}`}>
                                {step.desc}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Cancel Order */}
              {(order.status === "PENDING" || order.status === "CONFIRMED") && (
                <div className="bg-white border border-text/10 p-6">
                  <p className="text-[10px] text-text/50 tracking-[0.25em] uppercase mb-3">Cancel Order</p>
                  <p className="text-xs text-text/40 leading-relaxed mb-4">
                    You can cancel this order while it hasn&apos;t been shipped yet.
                  </p>
                  {cancelError && (
                    <p className="text-xs text-accent mb-3">{cancelError}</p>
                  )}
                  <button
                    onClick={handleCancel}
                    disabled={cancelling}
                    className="text-xs text-accent hover:text-accent/70 border-b border-accent/30 hover:border-accent pb-0.5 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {cancelling ? "Cancelling..." : "Cancel this order"}
                  </button>
                </div>
              )}

              {/* Need Help */}
              <div className="bg-white border border-text/10 p-6">
                <p className="text-[10px] text-text/50 tracking-[0.25em] uppercase mb-3">Need Help?</p>
                <p className="text-xs text-text/40 leading-relaxed mb-4">
                  If you have questions about your order, reach out to us and we&apos;ll be happy to assist.
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 text-xs text-text/50 hover:text-accent border-b border-text/15 hover:border-accent pb-0.5 transition-colors"
                >
                  Contact Support &rarr;
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Bottom nav */}
          <motion.div
            className="flex items-center justify-between mt-10 pt-6 border-t border-text/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Link href="/account/orders" className="text-xs text-text/40 hover:text-text transition-colors">
              &larr; Back to all orders
            </Link>
            <Link
              href="/collection"
              className="text-xs text-text/40 hover:text-accent border-b border-text/15 hover:border-accent pb-0.5 transition-colors"
            >
              Continue Shopping &rarr;
            </Link>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
