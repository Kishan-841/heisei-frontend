"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { api, DashboardData, AdminOrder, ChartPoint, Pagination } from "@/lib/api";
import { useAdminStore } from "@/lib/admin-store";
import AdminGuard from "@/components/AdminGuard";
import Navbar from "@/components/Navbar";

const STATUS_OPTIONS = ["ALL", "PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"] as const;

const statusStyle: Record<string, { bg: string; text: string; dot: string; border: string }> = {
  PENDING: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500", border: "border-amber-200" },
  CONFIRMED: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500", border: "border-blue-200" },
  SHIPPED: { bg: "bg-violet-50", text: "text-violet-700", dot: "bg-violet-500", border: "border-violet-200" },
  DELIVERED: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500", border: "border-emerald-200" },
  CANCELLED: { bg: "bg-red-50", text: "text-red-600", dot: "bg-red-500", border: "border-red-200" },
};

const pipelineConfig = [
  { key: "Pending", color: "#F59E0B", bg: "bg-amber-500", light: "bg-amber-100" },
  { key: "Confirmed", color: "#3B82F6", bg: "bg-blue-500", light: "bg-blue-100" },
  { key: "Shipped", color: "#8B5CF6", bg: "bg-violet-500", light: "bg-violet-100" },
  { key: "Delivered", color: "#10B981", bg: "bg-emerald-500", light: "bg-emerald-100" },
  { key: "Cancelled", color: "#EF4444", bg: "bg-red-500", light: "bg-red-100" },
];

type Tab = "overview" | "orders";
type Period = "7d" | "30d" | "6m" | "all" | "custom";

const PERIOD_LABELS: Record<Period, string> = {
  "7d": "7 Days",
  "30d": "30 Days",
  "6m": "6 Months",
  "all": "All Time",
  "custom": "Custom",
};

/* ─── Area Chart (monotone interpolation, no overshoot) ─── */
function AreaChart({ data, period }: { data: ChartPoint[]; period: Period }) {
  const [hovered, setHovered] = useState<number | null>(null);

  const chartW = 600;
  const chartH = 160;
  const padL = 10;
  const padR = 10;
  const padTop = 10;
  const drawW = chartW - padL - padR;
  const areaH = chartH - padTop;
  const baseline = padTop + areaH;

  const maxRevenue = useMemo(() => Math.max(...data.map((d) => d.revenue), 1), [data]);
  const hasData = data.some((d) => d.revenue > 0);

  const points = useMemo(() => {
    if (data.length === 0) return [];
    if (data.length === 1) {
      const x = padL + drawW / 2;
      const y = baseline - (data[0].revenue / maxRevenue) * areaH;
      return [{ x, y, ...data[0] }];
    }
    return data.map((d, i) => {
      const x = padL + (i / (data.length - 1)) * drawW;
      const y = baseline - (d.revenue / maxRevenue) * areaH;
      return { x, y, ...d };
    });
  }, [data, maxRevenue, areaH, baseline, drawW]);

  // Monotone cubic Hermite spline (no overshoot)
  const linePath = useMemo(() => {
    if (points.length <= 1) return "";
    const n = points.length;
    // Compute tangent slopes (finite differences, clamped for monotonicity)
    const dx: number[] = [];
    const dy: number[] = [];
    const m: number[] = [];
    for (let i = 0; i < n - 1; i++) {
      dx.push(points[i + 1].x - points[i].x);
      dy.push(points[i + 1].y - points[i].y);
    }
    const slopes = dx.map((d, i) => dy[i] / d);
    // First point
    m.push(slopes[0]);
    // Interior points
    for (let i = 1; i < n - 1; i++) {
      if (slopes[i - 1] * slopes[i] <= 0) {
        m.push(0); // local extremum — flat tangent prevents overshoot
      } else {
        m.push((slopes[i - 1] + slopes[i]) / 2);
      }
    }
    // Last point
    m.push(slopes[slopes.length - 1]);

    // Clamp tangents to prevent overshoot (Fritsch-Carlson)
    for (let i = 0; i < n - 1; i++) {
      if (Math.abs(slopes[i]) < 1e-10) {
        m[i] = 0;
        m[i + 1] = 0;
      } else {
        const alpha = m[i] / slopes[i];
        const beta = m[i + 1] / slopes[i];
        const mag = Math.sqrt(alpha * alpha + beta * beta);
        if (mag > 3) {
          const tau = 3 / mag;
          m[i] = tau * alpha * slopes[i];
          m[i + 1] = tau * beta * slopes[i];
        }
      }
    }

    // Build cubic bezier segments
    let d = `M${points[0].x},${points[0].y}`;
    for (let i = 0; i < n - 1; i++) {
      const dxi = dx[i] / 3;
      const cp1x = points[i].x + dxi;
      const cp1y = points[i].y + m[i] * dxi;
      const cp2x = points[i + 1].x - dxi;
      const cp2y = points[i + 1].y - m[i + 1] * dxi;
      // Clamp control points so they never go below baseline
      const clampY = (v: number) => Math.min(v, baseline);
      d += ` C${cp1x},${clampY(cp1y)} ${cp2x},${clampY(cp2y)} ${points[i + 1].x},${points[i + 1].y}`;
    }
    return d;
  }, [points, baseline]);

  const areaPath = useMemo(() => {
    if (points.length === 0) return "";
    if (points.length === 1) {
      const p = points[0];
      const hw = Math.min(30, drawW / 4);
      return `M${p.x - hw},${baseline} L${p.x - hw},${p.y} Q${p.x},${p.y - 4} ${p.x + hw},${p.y} L${p.x + hw},${baseline} Z`;
    }
    return `${linePath} L${points[points.length - 1].x},${baseline} L${points[0].x},${baseline} Z`;
  }, [linePath, points, baseline, drawW]);

  const maxLabels = period === "7d" ? 7 : period === "30d" ? 8 : period === "6m" ? 6 : 8;
  const labelStep = Math.max(1, Math.ceil(data.length / maxLabels));

  const fmt = (n: number) => {
    if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
    if (n >= 1000) return `₹${(n / 1000).toFixed(1)}k`;
    return `₹${n}`;
  };

  // Hover column width
  const colW = data.length <= 1 ? chartW : drawW / (data.length - 1);

  return (
    <div className="relative select-none">
      <svg
        viewBox={`0 0 ${chartW} ${chartH + 28}`}
        className="w-full h-auto"
        preserveAspectRatio="xMidYMid meet"
        onMouseLeave={() => setHovered(null)}
      >
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.20" />
            <stop offset="80%" stopColor="#8B5CF6" stopOpacity="0.03" />
            <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
          </linearGradient>
          <clipPath id="chartClip">
            <rect x={padL} y={0} width={drawW} height={baseline + 1} />
          </clipPath>
        </defs>

        {/* Grid lines */}
        {[0.25, 0.5, 0.75].map((pct) => (
          <line
            key={pct}
            x1={padL} y1={padTop + areaH * (1 - pct)} x2={chartW - padR} y2={padTop + areaH * (1 - pct)}
            stroke="#0F0F0F" strokeOpacity={0.04} strokeDasharray="3 6"
          />
        ))}
        {/* Baseline */}
        <line x1={padL} y1={baseline} x2={chartW - padR} y2={baseline} stroke="#0F0F0F" strokeOpacity={0.08} />

        {/* Chart content clipped to prevent any bleed */}
        <g clipPath="url(#chartClip)">
          {hasData && (
            <>
              {/* Area fill */}
              <motion.path
                d={areaPath}
                fill="url(#areaGrad)"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              />
              {/* Line */}
              {points.length > 1 && (
                <motion.path
                  d={linePath}
                  fill="none"
                  stroke="#8B5CF6"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                />
              )}
            </>
          )}
        </g>

        {/* Dots + hover zones (outside clip so dots aren't cut) */}
        {hasData && points.map((p, i) => {
          const colX = data.length <= 1 ? 0 : Math.max(0, p.x - colW / 2);
          const cw = data.length <= 1 ? chartW : colW;
          return (
            <g key={i}>
              <rect
                x={colX} y={0} width={cw} height={chartH + 28}
                fill="transparent"
                onMouseEnter={() => setHovered(i)}
                style={{ cursor: "pointer" }}
              />
              {p.revenue > 0 && (
                <>
                  {hovered === i && (
                    <line
                      x1={p.x} y1={padTop} x2={p.x} y2={baseline}
                      stroke="#8B5CF6" strokeOpacity={0.12} strokeWidth={1} strokeDasharray="3 3"
                    />
                  )}
                  <motion.circle
                    cx={p.x}
                    cy={p.y}
                    r={hovered === i ? 5.5 : 3}
                    fill={hovered === i ? "#8B5CF6" : "white"}
                    stroke="#8B5CF6"
                    strokeWidth={hovered === i ? 2.5 : 2}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 + i * 0.02, type: "spring", stiffness: 300 }}
                  />
                </>
              )}
            </g>
          );
        })}

        {/* X labels */}
        {data.map((d, i) => {
          if (i % labelStep !== 0 && i !== data.length - 1) return null;
          const x = data.length <= 1 ? padL + drawW / 2 : padL + (i / (data.length - 1)) * drawW;
          // Clamp label position so it doesn't overflow
          const clampedX = Math.max(padL + 20, Math.min(chartW - padR - 20, x));
          return (
            <text
              key={i}
              x={clampedX}
              y={baseline + 18}
              textAnchor="middle"
              className="fill-text/30"
              style={{ fontSize: "9.5px" }}
            >
              {d.label}
            </text>
          );
        })}
      </svg>

      {/* Tooltip */}
      <AnimatePresence>
        {hovered !== null && points[hovered] && (
          <motion.div
            className="absolute pointer-events-none bg-[#1A1A2E] text-white px-3.5 py-2 rounded-lg shadow-xl z-10"
            style={{
              left: `${(points[hovered].x / chartW) * 100}%`,
              top: `${Math.max(2, (points[hovered].y / (chartH + 28)) * 100 - 14)}%`,
              transform: "translate(-50%, -100%)",
            }}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.12 }}
          >
            <p className="text-[12px] font-semibold">{fmt(points[hovered].revenue)}</p>
            <p className="text-[9px] text-white/50 mt-0.5">
              {points[hovered].orders} order{points[hovered].orders !== 1 ? "s" : ""} &middot; {points[hovered].label}
            </p>
            <div className="absolute left-1/2 -translate-x-1/2 -bottom-1 w-2 h-2 bg-[#1A1A2E] rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty state */}
      {!hasData && (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-sm text-text/20">No revenue data for this period</p>
        </div>
      )}
    </div>
  );
}

/* ─── Dashboard ─── */
function DashboardContent() {
  const [tab, setTab] = useState<Tab>("overview");
  const [period, setPeriod] = useState<Period>("30d");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [showCustom, setShowCustom] = useState(false);
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [filter, setFilter] = useState<string>("ALL");
  const [ordersPage, setOrdersPage] = useState(1);
  const [ordersPagination, setOrdersPagination] = useState<Pagination | null>(null);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const admin = useAdminStore((s) => s.admin);

  const fetchDashboard = (p: Period, from?: string, to?: string) => {
    setLoading(true);
    api.admin.dashboard(p, from, to).then((d) => {
      setDashboard(d.dashboard);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchDashboard(period);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handlePeriodChange = (p: Period) => {
    setPeriod(p);
    if (p === "custom") {
      setShowCustom(true);
      return;
    }
    setShowCustom(false);
    fetchDashboard(p);
  };

  const handleCustomApply = () => {
    if (!customFrom || !customTo) return;
    fetchDashboard("custom", customFrom, customTo);
    setShowCustom(false);
  };

  useEffect(() => {
    if (tab !== "orders") return;
    setOrdersLoading(true);
    api.admin.orders(filter, ordersPage).then((d) => {
      setOrders(d.orders);
      setOrdersPagination(d.pagination);
      setOrdersLoading(false);
    });
  }, [filter, tab, ordersPage]);

  // Reset page when filter changes
  useEffect(() => {
    setOrdersPage(1);
  }, [filter]);

  const fmt = (n: number) => `₹${n.toLocaleString("en-IN")}`;

  if (loading && !dashboard) {
    return (
      <div className="min-h-screen bg-[#F8F7F4] flex items-center justify-center">
        <motion.div className="flex flex-col items-center gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="w-6 h-6 border-2 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
          <p className="text-[10px] text-text/40 tracking-[0.3em] uppercase">Loading dashboard</p>
        </motion.div>
      </div>
    );
  }

  if (!dashboard) return null;

  const { stats, revenue, totalCustomers, recentOrders, topProducts, chartData } = dashboard;
  const totalOrders = stats.pending + stats.confirmed + stats.shipped + stats.delivered + stats.cancelled;
  const activeOrders = stats.pending + stats.confirmed + stats.shipped;
  const greeting = new Date().getHours() < 12 ? "morning" : new Date().getHours() < 17 ? "afternoon" : "evening";

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#F8F7F4] text-text">

      {/* Tabs + Period Filter */}
      <div className="bg-white border-b border-text/[0.06]">
        <div className="max-w-[1240px] mx-auto px-5 sm:px-8 flex items-center justify-between">
          <div className="flex gap-0">
            {(["overview", "orders"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`relative text-[11px] tracking-[0.15em] uppercase px-5 py-3.5 cursor-pointer transition-colors ${
                  tab === t ? "text-text" : "text-text/30 hover:text-text/55"
                }`}
              >
                {t === "overview" ? "Overview" : "Orders"}
                {tab === t && (
                  <motion.div
                    className="absolute bottom-0 left-2 right-2 h-[2px] bg-violet-600 rounded-full"
                    layoutId="admin-tab"
                    transition={{ type: "spring", stiffness: 400, damping: 35 }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Period filter */}
          {tab === "overview" && (
            <div className="flex items-center gap-1 relative">
              {(["7d", "30d", "6m", "all", "custom"] as Period[]).map((p) => (
                <button
                  key={p}
                  onClick={() => handlePeriodChange(p)}
                  className={`text-[10px] tracking-[0.05em] px-2.5 py-1.5 rounded-md cursor-pointer transition-all font-medium ${
                    period === p
                      ? "bg-violet-100 text-violet-700"
                      : "text-text/35 hover:text-text/60 hover:bg-text/[0.03]"
                  }`}
                >
                  {PERIOD_LABELS[p]}
                </button>
              ))}

              {/* Custom date dropdown */}
              <AnimatePresence>
                {showCustom && (
                  <motion.div
                    className="absolute right-0 top-full mt-2 bg-white border border-text/10 rounded-xl shadow-xl p-4 z-50 min-w-[280px]"
                    initial={{ opacity: 0, y: -8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                  >
                    <p className="text-[10px] text-text/40 tracking-[0.15em] uppercase mb-3 font-medium">Custom Range</p>
                    <div className="flex gap-2 mb-3">
                      <div className="flex-1">
                        <label className="text-[9px] text-text/40 uppercase tracking-wider block mb-1">From</label>
                        <input
                          type="date"
                          value={customFrom}
                          onChange={(e) => setCustomFrom(e.target.value)}
                          className="w-full text-[12px] border border-text/10 rounded-lg px-3 py-2 outline-none focus:border-violet-400 transition-colors bg-[#FAFAF8]"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="text-[9px] text-text/40 uppercase tracking-wider block mb-1">To</label>
                        <input
                          type="date"
                          value={customTo}
                          onChange={(e) => setCustomTo(e.target.value)}
                          className="w-full text-[12px] border border-text/10 rounded-lg px-3 py-2 outline-none focus:border-violet-400 transition-colors bg-[#FAFAF8]"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowCustom(false)}
                        className="flex-1 text-[10px] text-text/50 py-2 rounded-lg border border-text/10 hover:bg-text/[0.03] cursor-pointer transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleCustomApply}
                        disabled={!customFrom || !customTo}
                        className="flex-1 text-[10px] text-white py-2 rounded-lg bg-violet-600 hover:bg-violet-700 cursor-pointer transition-colors disabled:opacity-40 disabled:cursor-not-allowed font-medium"
                      >
                        Apply
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 py-7">
        {tab === "overview" ? (
          <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            {/* Greeting */}
            <motion.div className="mb-7" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <h1 className="text-[22px] sm:text-[26px] font-light tracking-tight text-text/90">
                Good {greeting}, {admin?.name?.split(" ")[0]}
              </h1>
              <p className="text-[11px] text-text/40 mt-1">Here&apos;s your store at a glance</p>
            </motion.div>

            {/* Revenue Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
              {[
                {
                  label: "Total Revenue",
                  value: fmt(revenue.total),
                  sub: `${totalOrders} orders`,
                  gradient: "from-emerald-500 to-teal-600",
                  iconBg: "bg-white/20",
                  icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></svg>,
                },
                {
                  label: "Today",
                  value: fmt(revenue.today),
                  sub: `${stats.todayOrders} new orders`,
                  gradient: "from-blue-500 to-indigo-600",
                  iconBg: "bg-white/20",
                  icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>,
                },
                {
                  label: "This Month",
                  value: fmt(revenue.month),
                  sub: new Date().toLocaleDateString("en-IN", { month: "long" }),
                  gradient: "from-violet-500 to-purple-600",
                  iconBg: "bg-white/20",
                  icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>,
                },
                {
                  label: "Customers",
                  value: totalCustomers.toString(),
                  sub: "Registered accounts",
                  gradient: "from-amber-500 to-orange-600",
                  iconBg: "bg-white/20",
                  icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" /></svg>,
                },
              ].map((card, i) => (
                <motion.div
                  key={card.label}
                  className={`relative bg-gradient-to-br ${card.gradient} text-white p-4 sm:p-5 rounded-xl overflow-hidden shadow-lg`}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.45 }}
                >
                  <div className="absolute -right-4 -top-4 w-20 h-20 bg-white/[0.07] rounded-full" />
                  <div className="absolute -right-1 -bottom-6 w-16 h-16 bg-white/[0.05] rounded-full" />
                  <div className="relative">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-[9px] sm:text-[10px] text-white/70 tracking-[0.15em] uppercase">{card.label}</p>
                      <div className={`w-8 h-8 ${card.iconBg} rounded-lg flex items-center justify-center`}>
                        {card.icon}
                      </div>
                    </div>
                    <p className="text-[22px] sm:text-[26px] font-semibold tracking-tight">{card.value}</p>
                    <p className="text-[10px] sm:text-[11px] text-white/55 mt-1">{card.sub}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Middle Row */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 mb-6">
              {/* Revenue Chart */}
              <motion.div
                className="lg:col-span-3 bg-white border border-text/[0.06] rounded-xl p-5 sm:p-6"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.4 }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-[10px] text-text/35 tracking-[0.2em] uppercase">Revenue Trend</p>
                    <p className="text-xl font-semibold mt-1.5 tracking-tight">{fmt(revenue.period)}</p>
                  </div>
                  <div className="flex items-center gap-1.5 bg-violet-50 text-violet-600 px-2.5 py-1 rounded-full">
                    <span className="text-[10px] font-medium">{revenue.periodOrders} orders</span>
                  </div>
                </div>
                <AreaChart data={chartData} period={period} />
              </motion.div>

              {/* Order Pipeline */}
              <motion.div
                className="lg:col-span-2 bg-white border border-text/[0.06] rounded-xl p-5 sm:p-6"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] text-text/35 tracking-[0.2em] uppercase">Order Pipeline</p>
                </div>
                <div className="flex items-baseline gap-2 mb-5">
                  <span className="text-2xl font-semibold">{activeOrders}</span>
                  <span className="text-[11px] text-text/40">active orders</span>
                </div>

                {totalOrders > 0 && (
                  <div className="flex h-3 rounded-full overflow-hidden mb-5 gap-[2px]">
                    {pipelineConfig.map((p) => {
                      const count = stats[p.key.toLowerCase() as keyof typeof stats] as number;
                      const pct = (count / totalOrders) * 100;
                      if (count === 0) return null;
                      return (
                        <motion.div
                          key={p.key}
                          className={`${p.bg} rounded-full`}
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ delay: 0.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                          title={`${p.key}: ${count}`}
                        />
                      );
                    })}
                  </div>
                )}

                <div className="space-y-3">
                  {pipelineConfig.map((p, i) => {
                    const count = stats[p.key.toLowerCase() as keyof typeof stats] as number;
                    return (
                      <motion.div
                        key={p.key}
                        className="flex items-center justify-between"
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + i * 0.05 }}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: p.color }} />
                          <span className="text-[12px] text-text/60">{p.key}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-[13px] text-text/80 tabular-nums font-medium">{count}</span>
                          {totalOrders > 0 && (
                            <span className="text-[10px] text-text/25 tabular-nums w-9 text-right">
                              {((count / totalOrders) * 100).toFixed(0)}%
                            </span>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {stats.pending > 0 && (
                  <motion.div className="mt-5 pt-4 border-t border-text/[0.05]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
                    <button
                      onClick={() => { setTab("orders"); setFilter("PENDING"); }}
                      className="flex items-center gap-2 w-full px-3 py-2.5 bg-amber-50 rounded-lg text-[11px] text-amber-700 hover:bg-amber-100 cursor-pointer transition-colors group"
                    >
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                      <span className="font-medium">{stats.pending} pending</span>
                      <span className="text-amber-600/60">need confirmation</span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="ml-auto opacity-40 group-hover:opacity-100 transition-opacity"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                    </button>
                  </motion.div>
                )}
              </motion.div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {/* Top Products */}
              <motion.div
                className="bg-white border border-text/[0.06] rounded-xl overflow-hidden"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
              >
                <div className="px-5 sm:px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>
                    </div>
                    <p className="text-[12px] text-text/70 font-medium">Top Selling</p>
                  </div>
                  <p className="text-[10px] text-text/25">By units</p>
                </div>
                <div className="border-t border-text/[0.04]">
                  {topProducts.length === 0 ? (
                    <div className="px-6 py-12 text-center">
                      <p className="text-sm text-text/25">No sales data yet</p>
                    </div>
                  ) : (
                    topProducts.map((p, i) => {
                      const maxQty = topProducts[0]?.qtySold || 1;
                      const barPct = (p.qtySold / maxQty) * 100;
                      const colors = ["bg-emerald-100", "bg-blue-100", "bg-violet-100", "bg-amber-100", "bg-rose-100"];
                      const textColors = ["text-emerald-700", "text-blue-700", "text-violet-700", "text-amber-700", "text-rose-700"];
                      const dotColors = ["bg-emerald-500", "bg-blue-500", "bg-violet-500", "bg-amber-500", "bg-rose-500"];
                      return (
                        <motion.div
                          key={p.productId}
                          className="relative px-5 sm:px-6 py-3.5 border-b border-text/[0.04] last:border-0"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.5 + i * 0.06 }}
                        >
                          <motion.div
                            className={`absolute inset-y-0 left-0 ${colors[i]} opacity-40`}
                            initial={{ width: 0 }}
                            animate={{ width: `${barPct}%` }}
                            transition={{ delay: 0.6 + i * 0.08, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                          />
                          <div className="relative flex items-center gap-3">
                            <div className={`w-6 h-6 ${colors[i]} rounded-md flex items-center justify-center flex-shrink-0`}>
                              <span className={`text-[10px] font-bold ${textColors[i]}`}>{i + 1}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[13px] text-text/80 truncate">{p.color} &mdash; {p.name}</p>
                            </div>
                            <div className="text-right flex-shrink-0 flex items-center gap-3">
                              <div className="flex items-center gap-1.5">
                                <div className={`w-1.5 h-1.5 rounded-full ${dotColors[i]}`} />
                                <span className="text-[12px] text-text/70 tabular-nums font-medium">{p.qtySold}</span>
                              </div>
                              <span className="text-[11px] text-text/30 tabular-nums hidden sm:block">{fmt(p.revenue)}</span>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })
                  )}
                </div>
              </motion.div>

              {/* Recent Orders */}
              <motion.div
                className="bg-white border border-text/[0.06] rounded-xl overflow-hidden"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.4 }}
              >
                <div className="px-5 sm:px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" /></svg>
                    </div>
                    <p className="text-[12px] text-text/70 font-medium">Recent Orders</p>
                  </div>
                  <button
                    onClick={() => setTab("orders")}
                    className="text-[10px] text-violet-600 hover:text-violet-800 tracking-[0.05em] cursor-pointer transition-colors font-medium"
                  >
                    View all &rarr;
                  </button>
                </div>
                <div className="border-t border-text/[0.04]">
                  {recentOrders.length === 0 ? (
                    <div className="px-6 py-12 text-center">
                      <p className="text-sm text-text/25">No orders yet</p>
                    </div>
                  ) : (
                    recentOrders.map((order, i) => {
                      const style = statusStyle[order.status] || statusStyle.PENDING;
                      const date = new Date(order.createdAt);
                      const itemCount = order.items.reduce((s, it) => s + it.qty, 0);
                      return (
                        <motion.div key={order.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 + i * 0.06 }}>
                          <Link
                            href={`/admin/orders/${order.id}`}
                            className="flex items-center justify-between gap-3 px-5 sm:px-6 py-3.5 border-b border-text/[0.04] last:border-0 hover:bg-[#FAFAF8] transition-colors"
                          >
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2.5">
                                <p className="text-[12px] font-mono text-text/70">#{order.id.slice(0, 8).toUpperCase()}</p>
                                <div className={`flex items-center gap-1 px-2 py-[3px] rounded-md border ${style.bg} ${style.border}`}>
                                  <div className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                                  <span className={`text-[9px] tracking-[0.05em] uppercase font-semibold ${style.text}`}>{order.status}</span>
                                </div>
                              </div>
                              <p className="text-[11px] text-text/30 mt-1 truncate">
                                {order.user.name} &middot; {itemCount} {itemCount === 1 ? "item" : "items"} &middot; {date.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                              </p>
                            </div>
                            <p className="text-[14px] text-text/80 tabular-nums flex-shrink-0 font-semibold">{fmt(order.total)}</p>
                          </Link>
                        </motion.div>
                      );
                    })
                  )}
                </div>
              </motion.div>
            </div>
          </motion.div>
        ) : (
          /* ORDERS TAB */
          <motion.div key="orders" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
              <div>
                <h2 className="text-[22px] font-light tracking-tight text-text/90">All Orders</h2>
                <p className="text-[11px] text-text/40 mt-1">Manage and track every order</p>
              </div>
              <div className="flex items-center gap-3">
                {stats.pending > 0 && (
                  <span className="flex items-center gap-1.5 text-[10px] text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                    {stats.pending} pending
                  </span>
                )}
                {stats.shipped > 0 && (
                  <span className="flex items-center gap-1.5 text-[10px] text-violet-700 bg-violet-50 px-2.5 py-1 rounded-full border border-violet-200 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                    {stats.shipped} in transit
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1.5 mb-5 overflow-x-auto scrollbar-hide pb-1">
              {STATUS_OPTIONS.map((s) => {
                const filterStyles: Record<string, string> = {
                  ALL: "bg-[#1A1A2E] text-white",
                  PENDING: "bg-amber-500 text-white",
                  CONFIRMED: "bg-blue-500 text-white",
                  SHIPPED: "bg-violet-500 text-white",
                  DELIVERED: "bg-emerald-500 text-white",
                  CANCELLED: "bg-red-500 text-white",
                };
                return (
                  <button
                    key={s}
                    onClick={() => setFilter(s)}
                    className={`text-[10px] tracking-[0.1em] uppercase px-3.5 py-2 transition-all cursor-pointer whitespace-nowrap rounded-lg font-medium ${
                      filter === s
                        ? filterStyles[s]
                        : "bg-white border border-text/[0.08] text-text/40 hover:text-text/60 hover:border-text/15"
                    }`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>

            {ordersLoading ? (
              <div className="flex justify-center py-16">
                <div className="w-5 h-5 border-2 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-16 bg-white border border-text/[0.06] rounded-xl">
                <p className="text-text/25 text-sm">No orders found</p>
              </div>
            ) : (
              <div className="bg-white border border-text/[0.06] rounded-xl overflow-hidden">
                <div className="hidden sm:grid grid-cols-[1fr_100px_100px_60px_130px] gap-4 px-5 py-3 border-b border-text/[0.06] bg-[#FAFAF8]">
                  <span className="text-[9px] text-text/30 tracking-[0.2em] uppercase font-medium">Order</span>
                  <span className="text-[9px] text-text/30 tracking-[0.2em] uppercase font-medium">Date</span>
                  <span className="text-[9px] text-text/30 tracking-[0.2em] uppercase font-medium text-right">Amount</span>
                  <span className="text-[9px] text-text/30 tracking-[0.2em] uppercase font-medium text-center">Qty</span>
                  <span className="text-[9px] text-text/30 tracking-[0.2em] uppercase font-medium text-right">Status</span>
                </div>
                {orders.map((order, i) => {
                  const style = statusStyle[order.status] || statusStyle.PENDING;
                  const date = new Date(order.createdAt);
                  const itemCount = order.items.reduce((s, it) => s + it.qty, 0);
                  return (
                    <motion.div key={order.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02, duration: 0.3 }}>
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="group grid grid-cols-1 sm:grid-cols-[1fr_100px_100px_60px_130px] gap-2 sm:gap-4 items-center px-5 py-3.5 border-b border-text/[0.04] last:border-0 hover:bg-[#FAFAF8] transition-colors"
                      >
                        <div>
                          <p className="text-[12px] font-mono text-text/70 group-hover:text-violet-600 transition-colors">
                            #{order.id.slice(0, 8).toUpperCase()}
                          </p>
                          <p className="text-[10px] text-text/30 mt-0.5">{order.user.name} &middot; {order.user.phone}</p>
                        </div>
                        <p className="text-[11px] text-text/40">{date.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</p>
                        <p className="text-[13px] text-text/75 tabular-nums sm:text-right font-medium">{fmt(order.total)}</p>
                        <p className="text-[11px] text-text/35 tabular-nums sm:text-center">{itemCount}</p>
                        <div className="sm:flex sm:justify-end">
                          <div className={`inline-flex items-center gap-1.5 px-2.5 py-[4px] rounded-md border ${style.bg} ${style.border}`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                            <span className={`text-[9px] tracking-[0.08em] uppercase font-semibold ${style.text}`}>{order.status}</span>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* Pagination */}
            {ordersPagination && ordersPagination.totalPages > 1 && (
              <div className="flex items-center justify-between mt-5">
                <p className="text-[11px] text-text/30">
                  Showing {(ordersPagination.page - 1) * ordersPagination.limit + 1}–{Math.min(ordersPagination.page * ordersPagination.limit, ordersPagination.total)} of {ordersPagination.total}
                </p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setOrdersPage((p) => Math.max(1, p - 1))}
                    disabled={ordersPage <= 1}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-text/40 hover:text-text hover:bg-white border border-text/[0.06] disabled:opacity-25 disabled:cursor-not-allowed cursor-pointer transition-colors text-sm"
                  >
                    &larr;
                  </button>
                  {Array.from({ length: ordersPagination.totalPages }, (_, i) => i + 1)
                    .filter((p) => {
                      // Show first, last, current, and neighbors
                      if (p === 1 || p === ordersPagination!.totalPages) return true;
                      if (Math.abs(p - ordersPage) <= 1) return true;
                      return false;
                    })
                    .reduce<(number | "...")[]>((acc, p, i, arr) => {
                      if (i > 0 && p - (arr[i - 1]) > 1) acc.push("...");
                      acc.push(p);
                      return acc;
                    }, [])
                    .map((p, i) =>
                      p === "..." ? (
                        <span key={`dots-${i}`} className="w-8 h-8 flex items-center justify-center text-text/20 text-xs">...</span>
                      ) : (
                        <button
                          key={p}
                          onClick={() => setOrdersPage(p)}
                          className={`w-8 h-8 flex items-center justify-center rounded-lg text-[11px] font-medium cursor-pointer transition-colors ${
                            ordersPage === p
                              ? "bg-[#1A1A2E] text-white"
                              : "text-text/40 hover:text-text hover:bg-white border border-text/[0.06]"
                          }`}
                        >
                          {p}
                        </button>
                      )
                    )}
                  <button
                    onClick={() => setOrdersPage((p) => Math.min(ordersPagination!.totalPages, p + 1))}
                    disabled={ordersPage >= ordersPagination.totalPages}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-text/40 hover:text-text hover:bg-white border border-text/[0.06] disabled:opacity-25 disabled:cursor-not-allowed cursor-pointer transition-colors text-sm"
                  >
                    &rarr;
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
      </main>
    </>
  );
}

export default function AdminDashboard() {
  return (
    <AdminGuard>
      <DashboardContent />
    </AdminGuard>
  );
}
