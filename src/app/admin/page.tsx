"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import { api, AdminOrder, AdminStats } from "@/lib/api";
import { useAdminStore } from "@/lib/admin-store";
import AdminGuard from "@/components/AdminGuard";

const STATUS_OPTIONS = ["ALL", "PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"] as const;

const statusStyle: Record<string, { bg: string; text: string; dot: string }> = {
  PENDING: { bg: "bg-[#F5F0EB]", text: "text-[#8C7B6B]", dot: "bg-[#8C7B6B]" },
  CONFIRMED: { bg: "bg-[#EBF0F5]", text: "text-[#4A6B8A]", dot: "bg-[#4A6B8A]" },
  SHIPPED: { bg: "bg-accent/10", text: "text-accent", dot: "bg-accent" },
  DELIVERED: { bg: "bg-green-50", text: "text-green-700", dot: "bg-green-600" },
  CANCELLED: { bg: "bg-red-50", text: "text-red-600", dot: "bg-red-500" },
};

function DashboardContent() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [filter, setFilter] = useState<string>("ALL");
  const [loading, setLoading] = useState(true);
  const admin = useAdminStore((s) => s.admin);
  const logout = useAdminStore((s) => s.logout);

  useEffect(() => {
    api.admin.stats().then((d) => setStats(d.stats));
  }, []);

  useEffect(() => {
    setLoading(true);
    api.admin.orders(filter).then((d) => {
      setOrders(d.orders);
      setLoading(false);
    });
  }, [filter]);

  return (
    <main className="min-h-screen bg-bg text-text">
      {/* Header */}
      <div className="border-b border-text/8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-lg font-medium tracking-[0.15em]">HEISEI</span>
            <span className="text-[10px] text-muted tracking-[0.3em] uppercase">Admin</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted">{admin?.name}</span>
            <button
              onClick={logout}
              className="text-[10px] text-muted hover:text-accent tracking-widest uppercase cursor-pointer transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Stats */}
        {stats && (
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mb-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {[
              { label: "Pending", value: stats.pending, color: "border-[#8C7B6B]" },
              { label: "Confirmed", value: stats.confirmed, color: "border-[#4A6B8A]" },
              { label: "Shipped", value: stats.shipped, color: "border-accent" },
              { label: "Delivered", value: stats.delivered, color: "border-green-600" },
              { label: "Cancelled", value: stats.cancelled, color: "border-red-500" },
              { label: "Today", value: stats.todayOrders, color: "border-text/20" },
            ].map((s) => (
              <div key={s.label} className={`border-l-2 ${s.color} bg-white border border-text/8 px-4 py-3`}>
                <p className="text-[10px] text-muted tracking-widest uppercase">{s.label}</p>
                <p className="text-2xl font-light mt-1">{s.value}</p>
              </div>
            ))}
          </motion.div>
        )}

        {/* Filters */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto scrollbar-hide pb-1">
          {STATUS_OPTIONS.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`text-[10px] tracking-widest uppercase px-4 py-2 border transition-colors cursor-pointer whitespace-nowrap ${
                filter === s
                  ? "border-text text-text"
                  : "border-text/10 text-muted hover:border-text/25"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-5 h-5 border border-text/20 border-t-text rounded-full animate-spin" />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted text-sm">No orders found</p>
          </div>
        ) : (
          <div className="space-y-2">
            {orders.map((order, i) => {
              const style = statusStyle[order.status] || statusStyle.PENDING;
              const date = new Date(order.createdAt);
              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03, duration: 0.4 }}
                >
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white border border-text/8 hover:border-text/20 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-sm font-mono text-text/80">
                          #{order.id.slice(0, 8).toUpperCase()}
                        </p>
                        <p className="text-[10px] text-muted mt-0.5">
                          {order.user.name} &middot; {order.user.phone}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 sm:gap-6">
                      <p className="text-xs text-muted">
                        {date.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                      </p>
                      <p className="text-sm">
                        ₹{order.total.toLocaleString("en-IN")}
                      </p>
                      <span className="text-xs text-muted">
                        {order.items.reduce((s, it) => s + it.qty, 0)} items
                      </span>
                      <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${style.bg}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                        <span className={`text-[10px] tracking-widest uppercase ${style.text}`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

export default function AdminDashboard() {
  return (
    <AdminGuard>
      <DashboardContent />
    </AdminGuard>
  );
}
