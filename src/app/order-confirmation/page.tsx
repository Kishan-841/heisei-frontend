"use client";

import { motion } from "framer-motion";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { api, Order } from "@/lib/api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!orderId) return;
    api.orders.get(orderId).then(
      (data) => setOrder(data.order),
      () => setError("Could not load order details")
    );
  }, [orderId]);

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-muted text-sm">{error}</p>
        <Link
          href="/"
          className="inline-block mt-6 border border-text px-8 py-3 text-sm tracking-widest hover:bg-text hover:text-bg transition-colors"
        >
          Return Home
        </Link>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-5 h-5 border border-text/20 border-t-text rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Success banner */}
      <motion.div
        className="bg-[#0F0F0F] text-[#F7F6F2] p-10 md:p-16 mb-10 relative overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        {/* Decorative */}
        <motion.div
          className="absolute top-[5%] right-[5%] text-[200px] font-light select-none pointer-events-none leading-none hidden md:block"
          style={{ fontFamily: "serif" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.04 }}
          transition={{ duration: 2, delay: 0.3 }}
        >
          完
        </motion.div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6 md:gap-10">
          <motion.div
            className="w-16 h-16 rounded-full border-2 border-[#F7F6F2] flex items-center justify-center flex-shrink-0"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </motion.div>
          <div>
            <p className="text-accent text-[10px] tracking-[0.35em] uppercase mb-2">ご注文確認</p>
            <h1 className="text-3xl md:text-4xl font-light tracking-tight">Order Confirmed</h1>
            <p className="text-[#A8A29E] text-sm mt-3 max-w-md leading-relaxed">
              Thank you for your order. We&apos;ll start preparing it right away. You&apos;ll receive updates on your phone.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Order info grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-8">
        <motion.div
          className="bg-white border border-text/10 p-6"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <p className="text-[10px] text-text/55 tracking-[0.25em] uppercase">Order ID</p>
          <p className="text-lg font-mono mt-2">#{order.id.slice(0, 8).toUpperCase()}</p>
          <p className="text-[10px] text-accent tracking-widest mt-1">注文番号</p>
        </motion.div>
        <motion.div
          className="bg-white border border-text/10 p-6"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <p className="text-[10px] text-text/55 tracking-[0.25em] uppercase">Status</p>
          <p className="text-lg mt-2">{order.status}</p>
          <p className="text-[10px] text-accent tracking-widest mt-1">状態</p>
        </motion.div>
        <motion.div
          className="bg-white border border-text/10 p-6"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-[10px] text-text/55 tracking-[0.25em] uppercase">Payment</p>
          <p className="text-lg mt-2">Paid Online</p>
          <p className="text-[10px] text-accent tracking-widest mt-1">支払い</p>
        </motion.div>
      </div>

      {/* Main content grid */}
      <motion.div
        className="grid md:grid-cols-5 gap-8"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        {/* Items & totals (3 cols) */}
        <div className="md:col-span-3 bg-white border border-text/10 p-6 md:p-8">
          <p className="text-[10px] text-text/55 tracking-[0.25em] uppercase mb-6">Items Ordered</p>

          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between py-3 border-b border-text/5 last:border-0">
                <div className="flex items-center gap-4">
                  {item.product?.img ? (
                    <div className="w-12 h-14 bg-surface overflow-hidden flex-shrink-0">
                      <img
                        src={item.product.img}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-14 bg-surface flex-shrink-0" />
                  )}
                  <div>
                    <p className="text-sm">{item.color} — {item.name}</p>
                    <p className="text-xs text-text/55 mt-0.5">Size {item.size} &middot; Qty {item.qty}</p>
                  </div>
                </div>
                <p className="text-sm">₹{(item.price * item.qty).toLocaleString("en-IN")}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-text/8 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-text/55">Subtotal</span>
              <span>₹{order.subtotal.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text/55">Shipping</span>
              <span>{order.shipping === 0 ? <span className="text-accent">Free</span> : `₹${order.shipping}`}</span>
            </div>
            <div className="flex justify-between text-lg pt-3 border-t border-text/5">
              <span>Total</span>
              <span>₹{order.total.toLocaleString("en-IN")}</span>
            </div>
          </div>
        </div>

        {/* Shipping info (2 cols) */}
        <div className="md:col-span-2 space-y-4">
          <div className="bg-white border border-text/10 p-6">
            <p className="text-[10px] text-text/55 tracking-[0.25em] uppercase mb-4">Shipping To</p>
            <p className="text-sm font-medium">{order.shippingName}</p>
            <p className="text-sm text-text/60 mt-1">{order.shippingAddress1}</p>
            {order.shippingAddress2 && <p className="text-sm text-text/60">{order.shippingAddress2}</p>}
            <p className="text-sm text-text/60">
              {order.shippingCity}, {order.shippingState} — {order.shippingPincode}
            </p>
            {order.shippingLandmark && <p className="text-xs text-text/45 mt-2">Near: {order.shippingLandmark}</p>}
            <p className="text-xs text-text/60 mt-3">{order.shippingPhone}</p>
          </div>

          {/* What's next */}
          <div className="bg-white border border-text/10 p-6">
            <p className="text-[10px] text-text/55 tracking-[0.25em] uppercase mb-4">What&apos;s Next</p>
            <div className="space-y-4">
              {[
                { step: "01", text: "Order received and being processed" },
                { step: "02", text: "Items packed with care" },
                { step: "03", text: "Shipped and on the way to you" },
                { step: "04", text: "Delivered to your door" },
              ].map((s, i) => (
                <div key={s.step} className="flex items-start gap-3">
                  <span className={`text-[10px] font-mono mt-0.5 ${i === 0 ? "text-accent" : "text-text/35"}`}>
                    {s.step}
                  </span>
                  <p className={`text-xs leading-relaxed ${i === 0 ? "text-text" : "text-text/45"}`}>
                    {s.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Actions */}
      <motion.div
        className="flex flex-col sm:flex-row gap-4 mt-10"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Link
          href="/collection"
          className="group relative flex-1 text-center py-4 border border-text text-sm tracking-[0.15em] overflow-hidden"
        >
          <span className="absolute inset-0 bg-text origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
          <span className="relative z-10 group-hover:text-bg transition-colors duration-500">
            Continue Shopping
          </span>
        </Link>
        <Link
          href="/account/orders"
          className="flex-1 text-center py-4 bg-white border border-text/15 text-sm tracking-[0.15em] text-text/70 hover:border-text/40 hover:text-text transition-colors"
        >
          View All Orders
        </Link>
      </motion.div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-bg pt-20 pb-20 px-6">
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-20">
              <div className="w-5 h-5 border border-text/20 border-t-text rounded-full animate-spin" />
            </div>
          }
        >
          <OrderConfirmationContent />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
