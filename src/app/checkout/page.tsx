"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import { useAuthStore } from "@/lib/auth-store";
import { api, Address } from "@/lib/api";
import { indianStates } from "@/lib/indian-states";
import { useConfetti } from "@/components/SakuraConfetti";
import Navbar from "@/components/Navbar";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const FREE_SHIPPING_THRESHOLD = 4999;
const SHIPPING_COST = 99;

function useRazorpayScript() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined" && window.Razorpay) {
      setLoaded(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setLoaded(true);
    document.body.appendChild(script);
    return () => {
      // Don't remove — Razorpay needs it
    };
  }, []);
  return loaded;
}

export default function CheckoutPage() {
  const { items, totalPrice, totalItems, clearCart } = useCart();
  const user = useAuthStore((s) => s.user);
  const initialized = useAuthStore((s) => s.initialized);
  const router = useRouter();
  const razorpayLoaded = useRazorpayScript();

  // Saved addresses
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [useNewAddress, setUseNewAddress] = useState(false);
  const [loadingAddresses, setLoadingAddresses] = useState(true);

  // Guest fields
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");

  // Shipping address form
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [landmark, setLandmark] = useState("");

  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const fireConfetti = useConfetti();

  const clearFieldError = (field: string) => {
    setFieldErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!user) {
      if (!guestName.trim()) errors.guestName = "Name is required";
      if (guestPhone.length !== 10) errors.guestPhone = "Enter a valid 10-digit phone number";
    }

    if (!fullName.trim()) errors.fullName = "Full name is required";
    if (phone.length !== 10) errors.phone = "Enter a valid 10-digit phone number";
    if (!address1.trim()) errors.address1 = "Address is required";
    if (!city.trim()) errors.city = "City is required";
    if (!state) errors.state = "Please select a state";
    if (pincode.length !== 6) errors.pincode = "Enter a valid 6-digit pincode";

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const shipping = totalPrice >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const orderTotal = totalPrice + shipping;

  // Fetch saved addresses on mount
  useEffect(() => {
    if (!initialized) return;
    if (!user) {
      setLoadingAddresses(false);
      setUseNewAddress(true);
      return;
    }

    api.addresses.list().then((data) => {
      setSavedAddresses(data.addresses);
      if (data.addresses.length > 0) {
        const defaultAddr = data.addresses.find((a) => a.isDefault) || data.addresses[0];
        setSelectedAddressId(defaultAddr.id);
        fillFromAddress(defaultAddr);
      } else {
        setUseNewAddress(true);
        setFullName(user.name || "");
        setPhone(user.phone || "");
      }
      setLoadingAddresses(false);
    }).catch(() => {
      setLoadingAddresses(false);
      setUseNewAddress(true);
    });
  }, [initialized, user]);

  const fillFromAddress = (addr: Address) => {
    setFullName(addr.fullName);
    setPhone(addr.phone);
    setAddress1(addr.addressLine1);
    setAddress2(addr.addressLine2 || "");
    setCity(addr.city);
    setState(addr.state);
    setPincode(addr.pincode);
    setLandmark(addr.landmark || "");
  };

  const clearForm = () => {
    setFullName(user?.name || "");
    setPhone(user?.phone || "");
    setAddress1("");
    setAddress2("");
    setCity("");
    setState("");
    setPincode("");
    setLandmark("");
  };

  const selectAddress = (addr: Address) => {
    setSelectedAddressId(addr.id);
    setUseNewAddress(false);
    fillFromAddress(addr);
  };

  const switchToNewAddress = () => {
    setSelectedAddressId(null);
    setUseNewAddress(true);
    clearForm();
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      setError("Please fix the highlighted fields below");
      return;
    }

    setSubmitting(true);

    try {
      const orderData = {
        shippingName: fullName,
        shippingPhone: phone,
        shippingAddress1: address1,
        shippingAddress2: address2 || undefined,
        shippingCity: city,
        shippingState: state,
        shippingPincode: pincode,
        shippingLandmark: landmark || undefined,
        items: items.map((item) => ({
          productSlug: item.slug,
          size: item.size,
          qty: item.qty,
        })),
        ...(!user && {
          guestName: guestName || fullName,
          guestPhone: guestPhone || phone,
        }),
      };

      // Step 1: Create order + Razorpay order on backend
      const { order, razorpay: rzp } = await api.payment.createOrder(orderData);

      if (!razorpayLoaded || !window.Razorpay) {
        setError("Payment system is loading. Please try again.");
        setSubmitting(false);
        return;
      }

      // Step 2: Open Razorpay checkout
      const options = {
        key: rzp.keyId,
        amount: rzp.amount,
        currency: rzp.currency,
        name: "HEISEI",
        description: `Order #${order.id.slice(0, 8).toUpperCase()}`,
        order_id: rzp.orderId,
        prefill: {
          name: fullName,
          contact: phone,
        },
        theme: {
          color: "#1A1A2E",
        },
        handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          // Step 3: Verify payment on backend
          try {
            await api.payment.verify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: order.id,
            });
            clearCart();
            setOrderPlaced(true);
            fireConfetti();
            setTimeout(() => router.push(`/order-confirmation?id=${order.id}`), 1200);
          } catch {
            setError("Payment verification failed. Please contact support.");
            setSubmitting(false);
          }
        },
        modal: {
          ondismiss: () => {
            // User closed the Razorpay popup without paying
            api.payment.failure(order.id).catch(() => {});
            setError("Payment was cancelled. You can try again.");
            setSubmitting(false);
          },
        },
      };

      const rzpInstance = new window.Razorpay(options);
      rzpInstance.on("payment.failed", (resp: any) => {
        api.payment.failure(order.id).catch(() => {});
        setError(resp.error?.description || "Payment failed. Please try again.");
        setSubmitting(false);
      });
      rzpInstance.open();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to initiate payment");
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-bg flex items-center justify-center px-6 pt-20">
          <div className="text-center">
            <p className="text-muted text-sm tracking-widest uppercase mb-4">Your cart is empty</p>
            <p className="text-xs text-muted mb-8">空</p>
            <Link href="/collection" className="inline-block border border-text px-8 py-3 text-sm tracking-widest hover:bg-text hover:text-bg transition-colors">
              Browse Collection
            </Link>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-bg pt-20 pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-accent text-xs tracking-widest mb-2">チェックアウト</p>
            <h1 className="text-3xl font-normal tracking-tight">Checkout</h1>
          </motion.div>

          <form onSubmit={handlePlaceOrder}>
            <div className="grid md:grid-cols-5 gap-12 md:gap-16">
              {/* LEFT — Form (3 cols) */}
              <motion.div
                className="md:col-span-3 space-y-10"
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                {/* Guest info */}
                {!user && (
                  <div className="space-y-6">
                    <h2 className="text-sm tracking-widest uppercase text-text/50">Contact Information</h2>
                    <div>
                      <label className="text-xs text-text/60 tracking-widest uppercase block mb-2">
                        Name <span className="text-accent">*</span>
                      </label>
                      <input
                        type="text"
                        value={guestName}
                        onChange={(e) => { setGuestName(e.target.value); clearFieldError("guestName"); }}
                        placeholder="Your full name"
                        className={`w-full bg-transparent border-b py-3 text-sm outline-none transition-colors placeholder:text-text/30 ${fieldErrors.guestName ? "border-accent focus:border-accent" : "border-text/20 focus:border-text/60"}`}
                        required
                      />
                      {fieldErrors.guestName && (
                        <p className="text-[11px] text-accent mt-1.5">{fieldErrors.guestName}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-xs text-text/60 tracking-widest uppercase block mb-2">
                        Phone Number <span className="text-accent">*</span>
                      </label>
                      <input
                        type="tel"
                        value={guestPhone}
                        onChange={(e) => { setGuestPhone(e.target.value.replace(/\D/g, "").slice(0, 10)); clearFieldError("guestPhone"); }}
                        placeholder="Enter your phone number"
                        maxLength={10}
                        className={`w-full bg-transparent border-b py-3 text-sm outline-none transition-colors placeholder:text-text/30 ${fieldErrors.guestPhone ? "border-accent focus:border-accent" : "border-text/20 focus:border-text/60"}`}
                        required
                      />
                      {fieldErrors.guestPhone && (
                        <p className="text-[11px] text-accent mt-1.5">{fieldErrors.guestPhone}</p>
                      )}
                    </div>
                    <p className="text-xs text-text/40">
                      Already have an account?{" "}
                      <Link href="/login" className="text-text hover:text-accent transition-colors">Sign in</Link>
                    </p>
                    <div className="h-[1px] bg-text/8" />
                  </div>
                )}

                {/* Shipping Address */}
                <div className="space-y-6">
                  <h2 className="text-sm tracking-widest uppercase text-text/50">Shipping Address</h2>

                  {/* Saved addresses selector */}
                  {!loadingAddresses && savedAddresses.length > 0 && (
                    <div className="space-y-3">
                      <p className="text-[10px] text-text/40 tracking-widest uppercase">Your Saved Addresses</p>

                      {savedAddresses.map((addr) => (
                        <motion.button
                          key={addr.id}
                          type="button"
                          onClick={() => selectAddress(addr)}
                          className={`w-full text-left p-4 border transition-all duration-200 cursor-pointer relative overflow-hidden ${
                            selectedAddressId === addr.id && !useNewAddress
                              ? "border-text bg-white"
                              : "border-text/10 bg-white/50 hover:border-text/20"
                          }`}
                          whileHover={{ y: -1 }}
                        >
                          {selectedAddressId === addr.id && !useNewAddress && (
                            <div className="absolute top-0 left-0 w-[3px] h-full bg-accent" />
                          )}

                          <div className="flex items-start justify-between">
                            <div className="pl-1">
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-medium">{addr.fullName}</p>
                                {addr.isDefault && (
                                  <span className="text-[9px] tracking-widest uppercase text-accent bg-accent/5 px-1.5 py-0.5">
                                    Default
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-text/50 mt-1">{addr.addressLine1}</p>
                              <p className="text-xs text-text/50">
                                {addr.city}, {addr.state} — {addr.pincode}
                              </p>
                              <p className="text-[11px] text-text/35 mt-1">{addr.phone}</p>
                            </div>

                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1 transition-colors ${
                              selectedAddressId === addr.id && !useNewAddress
                                ? "border-text"
                                : "border-text/20"
                            }`}>
                              {selectedAddressId === addr.id && !useNewAddress && (
                                <div className="w-2.5 h-2.5 rounded-full bg-text" />
                              )}
                            </div>
                          </div>
                        </motion.button>
                      ))}

                      <motion.button
                        type="button"
                        onClick={switchToNewAddress}
                        className={`w-full text-left p-4 border transition-all duration-200 cursor-pointer ${
                          useNewAddress
                            ? "border-text bg-white"
                            : "border-text/10 bg-white/50 hover:border-text/20"
                        }`}
                        whileHover={{ y: -1 }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full border border-dashed border-text/25 flex items-center justify-center">
                              <span className="text-text/40 text-lg leading-none">+</span>
                            </div>
                            <span className="text-sm text-text/60">Use a different address</span>
                          </div>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                            useNewAddress ? "border-text" : "border-text/20"
                          }`}>
                            {useNewAddress && <div className="w-2.5 h-2.5 rounded-full bg-text" />}
                          </div>
                        </div>
                      </motion.button>
                    </div>
                  )}

                  {/* Address form */}
                  <AnimatePresence>
                    {(useNewAddress || savedAddresses.length === 0) && !loadingAddresses && (
                      <motion.div
                        className="space-y-6"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div>
                            <label className="text-xs text-text/60 tracking-widest uppercase block mb-2">
                              Full Name <span className="text-accent">*</span>
                            </label>
                            <input
                              type="text"
                              value={fullName}
                              onChange={(e) => { setFullName(e.target.value); clearFieldError("fullName"); }}
                              className={`w-full bg-transparent border-b py-3 text-sm outline-none transition-colors placeholder:text-text/30 ${fieldErrors.fullName ? "border-accent focus:border-accent" : "border-text/20 focus:border-text/60"}`}
                              required
                            />
                            {fieldErrors.fullName && (
                              <p className="text-[11px] text-accent mt-1.5">{fieldErrors.fullName}</p>
                            )}
                          </div>
                          <div>
                            <label className="text-xs text-text/60 tracking-widest uppercase block mb-2">
                              Phone <span className="text-accent">*</span>
                            </label>
                            <input
                              type="tel"
                              value={phone}
                              onChange={(e) => { setPhone(e.target.value.replace(/\D/g, "").slice(0, 10)); clearFieldError("phone"); }}
                              placeholder="Phone number"
                              maxLength={10}
                              className={`w-full bg-transparent border-b py-3 text-sm outline-none transition-colors placeholder:text-text/30 ${fieldErrors.phone ? "border-accent focus:border-accent" : "border-text/20 focus:border-text/60"}`}
                              required
                            />
                            {fieldErrors.phone && (
                              <p className="text-[11px] text-accent mt-1.5">{fieldErrors.phone}</p>
                            )}
                          </div>
                        </div>

                        <div>
                          <label className="text-xs text-text/60 tracking-widest uppercase block mb-2">
                            Address Line 1 <span className="text-accent">*</span>
                          </label>
                          <input
                            type="text"
                            value={address1}
                            onChange={(e) => { setAddress1(e.target.value); clearFieldError("address1"); }}
                            placeholder="House no., Building, Street"
                            className={`w-full bg-transparent border-b py-3 text-sm outline-none transition-colors placeholder:text-text/30 ${fieldErrors.address1 ? "border-accent focus:border-accent" : "border-text/20 focus:border-text/60"}`}
                            required
                          />
                          {fieldErrors.address1 && (
                            <p className="text-[11px] text-accent mt-1.5">{fieldErrors.address1}</p>
                          )}
                        </div>

                        <div>
                          <label className="text-xs text-text/60 tracking-widest uppercase block mb-2">
                            Address Line 2 <span className="text-text/25">(Optional)</span>
                          </label>
                          <input
                            type="text"
                            value={address2}
                            onChange={(e) => setAddress2(e.target.value)}
                            placeholder="Apartment, Area, Colony"
                            className="w-full bg-transparent border-b border-text/20 focus:border-text/60 py-3 text-sm outline-none transition-colors placeholder:text-text/30"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div>
                            <label className="text-xs text-text/60 tracking-widest uppercase block mb-2">
                              City <span className="text-accent">*</span>
                            </label>
                            <input
                              type="text"
                              value={city}
                              onChange={(e) => { setCity(e.target.value); clearFieldError("city"); }}
                              className={`w-full bg-transparent border-b py-3 text-sm outline-none transition-colors placeholder:text-text/30 ${fieldErrors.city ? "border-accent focus:border-accent" : "border-text/20 focus:border-text/60"}`}
                              required
                            />
                            {fieldErrors.city && (
                              <p className="text-[11px] text-accent mt-1.5">{fieldErrors.city}</p>
                            )}
                          </div>
                          <div>
                            <label className="text-xs text-text/60 tracking-widest uppercase block mb-2">
                              State <span className="text-accent">*</span>
                            </label>
                            <select
                              value={state}
                              onChange={(e) => { setState(e.target.value); clearFieldError("state"); }}
                              className={`w-full bg-transparent border-b py-3 text-sm outline-none transition-colors text-text appearance-none cursor-pointer ${fieldErrors.state ? "border-accent focus:border-accent" : "border-text/20 focus:border-text/60"}`}
                              required
                            >
                              <option value="">Select state</option>
                              {indianStates.map((s) => (
                                <option key={s} value={s}>{s}</option>
                              ))}
                            </select>
                            {fieldErrors.state && (
                              <p className="text-[11px] text-accent mt-1.5">{fieldErrors.state}</p>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div>
                            <label className="text-xs text-text/60 tracking-widest uppercase block mb-2">
                              Pincode <span className="text-accent">*</span>
                            </label>
                            <input
                              type="text"
                              value={pincode}
                              onChange={(e) => { setPincode(e.target.value.replace(/\D/g, "").slice(0, 6)); clearFieldError("pincode"); }}
                              placeholder="400001"
                              className={`w-full bg-transparent border-b py-3 text-sm outline-none transition-colors placeholder:text-text/30 ${fieldErrors.pincode ? "border-accent focus:border-accent" : "border-text/20 focus:border-text/60"}`}
                              required
                            />
                            {fieldErrors.pincode && (
                              <p className="text-[11px] text-accent mt-1.5">{fieldErrors.pincode}</p>
                            )}
                          </div>
                          <div>
                            <label className="text-xs text-text/60 tracking-widest uppercase block mb-2">
                              Landmark <span className="text-text/25">(Optional)</span>
                            </label>
                            <input
                              type="text"
                              value={landmark}
                              onChange={(e) => setLandmark(e.target.value)}
                              placeholder="Near..."
                              className="w-full bg-transparent border-b border-text/20 focus:border-text/60 py-3 text-sm outline-none transition-colors placeholder:text-text/30"
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {loadingAddresses && (
                    <div className="flex items-center justify-center py-8">
                      <div className="w-5 h-5 border border-text/20 border-t-text rounded-full animate-spin" />
                    </div>
                  )}
                </div>

                {/* Payment */}
                <div className="space-y-4">
                  <h2 className="text-sm tracking-widest uppercase text-text/50">Payment</h2>
                  <div className="p-4 bg-white border border-text/10">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 border-2 border-text rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-text rounded-full" />
                      </div>
                      <span className="text-sm">Pay Online</span>
                      <span className="text-[10px] text-text/30 tracking-wide">via Razorpay</span>
                    </div>
                    <p className="text-xs text-text/40 mt-2 ml-7">
                      UPI, Cards, Net Banking, Wallets &mdash; all payment methods supported.
                    </p>
                    <div className="flex items-center gap-2 mt-3 ml-7">
                      {["UPI", "Visa", "MC", "RuPay"].map((m) => (
                        <span key={m} className="text-[9px] text-text/30 border border-text/10 px-1.5 py-0.5 rounded">
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {error && (
                  <motion.div
                    className="px-4 py-3 bg-accent/5 border-l-2 border-accent"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <p className="text-sm text-accent">{error}</p>
                  </motion.div>
                )}
              </motion.div>

              {/* RIGHT — Order Summary (2 cols) */}
              <motion.div
                className="md:col-span-2"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="sticky top-24">
                  <h2 className="text-sm tracking-widest uppercase text-text/50 mb-6">Order Summary</h2>

                  <div className="bg-white border border-text/10 p-6">
                    {/* Items */}
                    <div className="space-y-4 mb-6">
                      {items.map((item) => (
                        <div key={`${item.slug}-${item.size}`} className="flex gap-4">
                          <div className="w-16 h-20 bg-surface overflow-hidden flex-shrink-0">
                            <Image
                              src={item.img}
                              alt={item.name}
                              width={64}
                              height={80}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm">{item.color} — {item.name}</p>
                            <p className="text-xs text-text/40 mt-1">
                              Size: {item.size} &middot; Qty: {item.qty}
                            </p>
                            <p className="text-sm mt-1">
                              ₹{(item.price * item.qty).toLocaleString("en-IN")}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="h-[1px] bg-text/8 my-4" />

                    {/* Totals */}
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-text/50">
                          Subtotal ({totalItems} {totalItems === 1 ? "item" : "items"})
                        </span>
                        <span>₹{totalPrice.toLocaleString("en-IN")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text/50">Shipping</span>
                        <span>
                          {shipping === 0 ? (
                            <span className="text-accent">Free</span>
                          ) : (
                            `₹${shipping}`
                          )}
                        </span>
                      </div>
                      {shipping > 0 && (
                        <p className="text-xs text-text/35">Free shipping on orders above ₹4,999</p>
                      )}
                    </div>

                    <div className="h-[1px] bg-text/10 my-4" />

                    <div className="flex justify-between items-center">
                      <span className="text-sm tracking-wide">Total</span>
                      <span className="text-xl">₹{orderTotal.toLocaleString("en-IN")}</span>
                    </div>
                  </div>

                  {/* Place order button */}
                  <button
                    type="submit"
                    disabled={submitting || orderPlaced || !razorpayLoaded}
                    className="group relative w-full py-4 border border-text text-sm tracking-widest cursor-pointer overflow-hidden disabled:opacity-40 disabled:cursor-not-allowed mt-4"
                  >
                    <span className="absolute inset-0 bg-text origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
                    <span className="relative z-10 group-hover:text-bg transition-colors duration-500">
                      {orderPlaced
                        ? "Order Placed!"
                        : submitting
                        ? "Processing..."
                        : `Pay ₹${orderTotal.toLocaleString("en-IN")}`}
                    </span>
                  </button>

                  <div className="flex items-center justify-center gap-2 mt-4">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-text/30">
                      <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
                    </svg>
                    <p className="text-[10px] text-text/30">
                      Secured by Razorpay. Your payment info is encrypted.
                    </p>
                  </div>

                  <p className="text-[10px] text-text/30 text-center mt-2">
                    By placing this order, you agree to our terms of service.
                  </p>
                </div>
              </motion.div>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}
