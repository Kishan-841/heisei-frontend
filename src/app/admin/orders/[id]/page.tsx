"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { api, AdminOrder } from "@/lib/api";
import AdminGuard from "@/components/AdminGuard";

const NEXT_STATUS: Record<string, { status: string; label: string }> = {
  PENDING: { status: "CONFIRMED", label: "Confirm Order" },
  CONFIRMED: { status: "SHIPPED", label: "Mark as Shipped" },
  SHIPPED: { status: "DELIVERED", label: "Mark as Delivered" },
};

const statusStyle: Record<string, { bg: string; text: string; dot: string }> = {
  PENDING: { bg: "bg-[#F5F0EB]", text: "text-[#8C7B6B]", dot: "bg-[#8C7B6B]" },
  CONFIRMED: { bg: "bg-[#EBF0F5]", text: "text-[#4A6B8A]", dot: "bg-[#4A6B8A]" },
  SHIPPED: { bg: "bg-accent/10", text: "text-accent", dot: "bg-accent" },
  DELIVERED: { bg: "bg-green-50", text: "text-green-700", dot: "bg-green-600" },
  CANCELLED: { bg: "bg-red-50", text: "text-red-600", dot: "bg-red-500" },
};

const TIMELINE = [
  { key: "PENDING", label: "Order Placed" },
  { key: "CONFIRMED", label: "Confirmed" },
  { key: "SHIPPED", label: "Shipped" },
  { key: "DELIVERED", label: "Delivered" },
];

function OrderDetailContent() {
  const params = useParams();
  const id = params.id as string;
  const [order, setOrder] = useState<AdminOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [advancing, setAdvancing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api.admin.order(id).then(
      (d) => { setOrder(d.order); setLoading(false); },
      () => setLoading(false)
    );
  }, [id]);

  const handleAdvance = async () => {
    if (!order) return;
    const next = NEXT_STATUS[order.status];
    if (!next) return;

    setError("");
    setAdvancing(true);
    try {
      const { order: updated } = await api.admin.advanceStatus(order.id, next.status);
      setOrder(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update status");
    } finally {
      setAdvancing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="w-5 h-5 border border-text/20 border-t-text rounded-full animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center text-muted">
        <div className="text-center">
          <p className="text-sm mb-4">Order not found</p>
          <Link href="/admin" className="text-xs hover:text-text transition-colors">&larr; Dashboard</Link>
        </div>
      </div>
    );
  }

  const style = statusStyle[order.status] || statusStyle.PENDING;
  const next = NEXT_STATUS[order.status];
  const date = new Date(order.createdAt);
  const statusIndex = TIMELINE.findIndex((s) => s.key === order.status);
  const isCancelled = order.status === "CANCELLED";

  return (
    <main className="min-h-screen bg-bg text-text">
      {/* Header */}
      <div className="border-b border-text/8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/admin" className="text-xs text-muted hover:text-text transition-colors">
            &larr; Dashboard
          </Link>
          <span className="text-[10px] text-muted tracking-[0.3em] uppercase">Order Detail</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Order Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-[10px] text-accent tracking-[0.35em] uppercase mb-2">注文詳細</p>
              <h1 className="text-2xl sm:text-3xl font-light tracking-tight">
                #{order.id.slice(0, 8).toUpperCase()}
              </h1>
              <p className="text-sm text-muted mt-2">
                {date.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                {" at "}
                {date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full self-start ${style.bg}`}>
              <div className={`w-2 h-2 rounded-full ${style.dot}`} />
              <span className={`text-xs tracking-widest uppercase font-medium ${style.text}`}>
                {order.status}
              </span>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left: Items + Customer */}
          <motion.div
            className="md:col-span-2 space-y-6"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {/* Customer */}
            <div className="bg-white border border-text/8 p-5">
              <p className="text-[10px] text-muted tracking-[0.25em] uppercase mb-4">Customer</p>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <p className="text-sm">{order.user.name}</p>
                  <p className="text-xs text-muted mt-0.5">{order.user.phone}</p>
                </div>
                <p className="text-xs text-muted">{order.paymentMethod}</p>
              </div>
            </div>

            {/* Items */}
            <div className="bg-white border border-text/8 overflow-hidden">
              <div className="px-5 py-3 border-b border-text/5">
                <p className="text-[10px] text-muted tracking-[0.25em] uppercase">
                  Items ({order.items.reduce((s, it) => s + it.qty, 0)})
                </p>
              </div>
              {order.items.map((item) => (
                <div key={item.id} className="px-5 py-3 border-b border-text/5 last:border-0 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-muted font-mono w-6">{item.qty}x</span>
                    <div>
                      <p className="text-sm">{item.color} — {item.name}</p>
                      <p className="text-[10px] text-muted mt-0.5">Size {item.size}</p>
                    </div>
                  </div>
                  <p className="text-sm">₹{(item.price * item.qty).toLocaleString("en-IN")}</p>
                </div>
              ))}
              <div className="px-5 py-3 bg-surface/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div className="flex items-center gap-6 text-xs text-muted">
                  <span>Subtotal: ₹{order.subtotal.toLocaleString("en-IN")}</span>
                  <span>Shipping: {order.shipping === 0 ? "Free" : `₹${order.shipping}`}</span>
                </div>
                <p className="text-sm font-medium">₹{order.total.toLocaleString("en-IN")}</p>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white border border-text/8 p-5">
              <p className="text-[10px] text-muted tracking-[0.25em] uppercase mb-4">Shipping Address</p>
              <p className="text-sm">{order.shippingName}</p>
              <p className="text-sm text-muted mt-1">{order.shippingAddress1}</p>
              {order.shippingAddress2 && <p className="text-sm text-muted">{order.shippingAddress2}</p>}
              <p className="text-sm text-muted">
                {order.shippingCity}, {order.shippingState} — {order.shippingPincode}
              </p>
              <p className="text-xs text-muted/60 mt-2">{order.shippingPhone}</p>
            </div>
          </motion.div>

          {/* Right: Timeline + Action */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* Status Timeline */}
            <div className="bg-white border border-text/8 p-5">
              <p className="text-[10px] text-muted tracking-[0.25em] uppercase mb-5">Status Timeline</p>
              {isCancelled ? (
                <div className="flex items-center gap-3 px-3 py-3 bg-red-50 rounded-sm">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <p className="text-sm text-red-600">Cancelled</p>
                </div>
              ) : (
                <div className="space-y-0">
                  {TIMELINE.map((step, i) => {
                    const isActive = i <= statusIndex;
                    const isCurrent = i === statusIndex;
                    const isLast = i === TIMELINE.length - 1;
                    return (
                      <div key={step.key} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className={`w-3 h-3 rounded-full flex-shrink-0 border-2 ${
                            isCurrent ? "border-accent bg-accent"
                            : isActive ? "border-text/30 bg-text/30"
                            : "border-text/10 bg-transparent"
                          }`} />
                          {!isLast && (
                            <div className={`w-[1.5px] h-8 ${isActive && i < statusIndex ? "bg-text/20" : "bg-text/8"}`} />
                          )}
                        </div>
                        <div className="pb-4">
                          <p className={`text-sm ${isCurrent ? "font-medium text-text" : isActive ? "text-muted" : "text-text/20"}`}>
                            {step.label}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Advance Status Button */}
            {next && !isCancelled && (
              <div className="bg-white border border-text/8 p-5">
                <p className="text-[10px] text-muted tracking-[0.25em] uppercase mb-4">Update Status</p>
                {error && (
                  <p className="text-xs text-accent mb-3">{error}</p>
                )}
                <button
                  onClick={handleAdvance}
                  disabled={advancing}
                  className="group relative w-full py-3.5 border border-text text-sm tracking-[0.15em] uppercase cursor-pointer overflow-hidden disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <span className="absolute inset-0 bg-text origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
                  <span className="relative z-10 text-text group-hover:text-bg transition-colors duration-500">
                    {advancing ? "Updating..." : next.label}
                  </span>
                </button>
                <p className="text-[10px] text-muted/60 text-center mt-3">
                  {order.status} → {next.status}
                </p>
              </div>
            )}

            {/* Delivered state */}
            {order.status === "DELIVERED" && (
              <div className="bg-green-50 border border-green-200 p-5 text-center">
                <p className="text-green-700 text-sm">Order Complete</p>
                <p className="text-[10px] text-green-600/60 mt-1">Successfully delivered</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </main>
  );
}

export default function AdminOrderDetailPage() {
  return (
    <AdminGuard>
      <OrderDetailContent />
    </AdminGuard>
  );
}
