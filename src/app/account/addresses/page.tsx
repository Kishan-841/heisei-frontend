"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import { api, Address } from "@/lib/api";
import { useAuthStore } from "@/lib/auth-store";
import { indianStates } from "@/lib/indian-states";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type FormData = {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
  landmark: string;
  isDefault: boolean;
};

const emptyForm: FormData = {
  fullName: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  pincode: "",
  landmark: "",
  isDefault: false,
};

export default function AddressesPage() {
  const user = useAuthStore((s) => s.user);
  const initialized = useAuthStore((s) => s.initialized);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchAddresses = () => {
    api.addresses.list().then(
      (data) => { setAddresses(data.addresses); setLoading(false); },
      () => setLoading(false)
    );
  };

  useEffect(() => {
    if (!initialized || !user) return;
    fetchAddresses();
  }, [initialized, user]);

  const openNewForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
    setError("");
  };

  const openEditForm = (addr: Address) => {
    setForm({
      fullName: addr.fullName,
      phone: addr.phone,
      addressLine1: addr.addressLine1,
      addressLine2: addr.addressLine2 || "",
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
      landmark: addr.landmark || "",
      isDefault: addr.isDefault,
    });
    setEditingId(addr.id);
    setShowForm(true);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const data = {
      fullName: form.fullName,
      phone: form.phone,
      addressLine1: form.addressLine1,
      addressLine2: form.addressLine2 || undefined,
      city: form.city,
      state: form.state,
      pincode: form.pincode,
      landmark: form.landmark || undefined,
      isDefault: form.isDefault,
    };

    try {
      if (editingId) {
        await api.addresses.update(editingId, data);
      } else {
        await api.addresses.create(data);
      }
      setShowForm(false);
      fetchAddresses();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save address");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.addresses.delete(id);
      fetchAddresses();
    } catch {
      // silent
    }
  };

  const updateField = (field: keyof FormData, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

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
            <p className="text-muted text-sm mb-4">Please sign in to manage addresses</p>
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
      <main className="min-h-screen bg-bg pt-20 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            className="mb-10"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link href="/account" className="text-xs text-muted hover:text-text transition-colors mb-4 inline-block">
              &larr; Account
            </Link>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-accent text-xs tracking-widest mb-2">住所</p>
                <h1 className="text-3xl font-normal tracking-tight">Saved Addresses</h1>
              </div>
              {!showForm && (
                <button
                  onClick={openNewForm}
                  className="text-sm text-muted hover:text-text transition-colors cursor-pointer"
                >
                  + Add New
                </button>
              )}
            </div>
          </motion.div>

          {/* Address Form */}
          <AnimatePresence>
            {showForm && (
              <motion.form
                onSubmit={handleSubmit}
                className="border border-text/10 p-6 mb-8 space-y-5"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-sm tracking-widest uppercase text-muted">
                    {editingId ? "Edit Address" : "New Address"}
                  </h2>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="text-muted hover:text-text text-lg cursor-pointer"
                  >
                    &times;
                  </button>
                </div>

                {error && <p className="text-accent text-sm">{error}</p>}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-xs text-text/60 tracking-widest uppercase block mb-1.5">Full Name</label>
                    <input
                      type="text"
                      value={form.fullName}
                      onChange={(e) => updateField("fullName", e.target.value)}
                      className="w-full bg-transparent border-b border-text/20 focus:border-text/60 py-2 text-sm outline-none transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs text-text/60 tracking-widest uppercase block mb-1.5">Phone</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => updateField("phone", e.target.value.replace(/\D/g, "").slice(0, 10))}
                      placeholder="Phone number"
                      maxLength={10}
                      className="w-full bg-transparent border-b border-text/20 focus:border-text/60 py-2 text-sm outline-none transition-colors"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-text/60 tracking-widest uppercase block mb-1.5">Address Line 1</label>
                  <input
                    type="text"
                    value={form.addressLine1}
                    onChange={(e) => updateField("addressLine1", e.target.value)}
                    className="w-full bg-transparent border-b border-text/20 focus:border-text/60 py-2 text-sm outline-none transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs text-text/60 tracking-widest uppercase block mb-1.5">
                    Address Line 2 <span className="text-muted/40">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={form.addressLine2}
                    onChange={(e) => updateField("addressLine2", e.target.value)}
                    className="w-full bg-transparent border-b border-text/20 focus:border-text/60 py-2 text-sm outline-none transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-xs text-text/60 tracking-widest uppercase block mb-1.5">City</label>
                    <input
                      type="text"
                      value={form.city}
                      onChange={(e) => updateField("city", e.target.value)}
                      className="w-full bg-transparent border-b border-text/20 focus:border-text/60 py-2 text-sm outline-none transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs text-text/60 tracking-widest uppercase block mb-1.5">State</label>
                    <select
                      value={form.state}
                      onChange={(e) => updateField("state", e.target.value)}
                      className="w-full bg-transparent border-b border-text/20 focus:border-text/60 py-2 text-sm outline-none transition-colors appearance-none cursor-pointer"
                      required
                    >
                      <option value="">Select</option>
                      {indianStates.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-xs text-text/60 tracking-widest uppercase block mb-1.5">Pincode</label>
                    <input
                      type="text"
                      value={form.pincode}
                      onChange={(e) => updateField("pincode", e.target.value.replace(/\D/g, "").slice(0, 6))}
                      className="w-full bg-transparent border-b border-text/20 focus:border-text/60 py-2 text-sm outline-none transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs text-text/60 tracking-widest uppercase block mb-1.5">
                      Landmark <span className="text-muted/40">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      value={form.landmark}
                      onChange={(e) => updateField("landmark", e.target.value)}
                      className="w-full bg-transparent border-b border-text/20 focus:border-text/60 py-2 text-sm outline-none transition-colors"
                    />
                  </div>
                </div>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isDefault}
                    onChange={(e) => updateField("isDefault", e.target.checked)}
                    className="accent-text"
                  />
                  <span className="text-xs text-muted">Set as default address</span>
                </label>

                <button
                  type="submit"
                  disabled={saving}
                  className="group relative w-full py-3 border border-text text-sm tracking-widest cursor-pointer overflow-hidden disabled:opacity-40"
                >
                  <span className="absolute inset-0 bg-text origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
                  <span className="relative z-10 group-hover:text-bg transition-colors duration-500">
                    {saving ? "Saving..." : editingId ? "Update Address" : "Save Address"}
                  </span>
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Address List */}
          {addresses.length === 0 && !showForm ? (
            <div className="text-center py-16">
              <p className="text-muted text-sm tracking-widest uppercase mb-4">
                No saved addresses
              </p>
              <button
                onClick={openNewForm}
                className="inline-block border border-text px-8 py-3 text-sm tracking-widest hover:bg-text hover:text-bg transition-colors cursor-pointer"
              >
                Add Your First Address
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {addresses.map((addr, i) => (
                <motion.div
                  key={addr.id}
                  className="border border-text/10 p-6"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.5 }}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <p className="text-sm font-medium">{addr.fullName}</p>
                        {addr.isDefault && (
                          <span className="text-[10px] tracking-widest uppercase text-accent">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted">{addr.addressLine1}</p>
                      {addr.addressLine2 && (
                        <p className="text-sm text-muted">{addr.addressLine2}</p>
                      )}
                      <p className="text-sm text-muted">
                        {addr.city}, {addr.state} — {addr.pincode}
                      </p>
                      {addr.landmark && (
                        <p className="text-xs text-muted/60 mt-1">Near: {addr.landmark}</p>
                      )}
                      <p className="text-xs text-muted mt-2">{addr.phone}</p>
                    </div>
                    <div className="flex gap-4">
                      <button
                        onClick={() => openEditForm(addr)}
                        className="text-xs text-muted hover:text-text transition-colors cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(addr.id)}
                        className="text-xs text-muted hover:text-accent transition-colors cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
