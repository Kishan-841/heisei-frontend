"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart";

export default function CartDrawer() {
  const { items, removeItem, updateQty, totalItems, totalPrice, isOpen, setIsOpen } =
    useCart();
  const router = useRouter();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* BACKDROP */}
          <motion.div
            className="fixed inset-0 bg-black/30 z-[10001]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          />

          {/* DRAWER */}
          <motion.div
            className="fixed right-0 top-0 bottom-0 w-[95vw] max-w-md bg-bg z-[10002] flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            {/* HEADER */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-text/5">
              <div>
                <h3 className="text-lg tracking-wide">Cart</h3>
                <p className="text-xs text-muted mt-1">
                  {totalItems} {totalItems === 1 ? "item" : "items"}
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-muted hover:text-text transition-colors cursor-pointer text-xl"
              >
                &times;
              </button>
            </div>

            {/* ITEMS */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-muted">
                  <p className="text-sm tracking-widest uppercase">
                    Your cart is empty
                  </p>
                  <p className="text-xs mt-2">空</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {items.map((item) => (
                    <div
                      key={`${item.slug}-${item.size}`}
                      className="flex gap-4"
                    >
                      <div className="w-20 h-24 bg-surface overflow-hidden flex-shrink-0">
                        <Image
                          src={item.img}
                          alt={item.name}
                          width={80}
                          height={96}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <p className="text-sm">
                            {item.color} — {item.name}
                          </p>
                          <p className="text-xs text-muted mt-1">
                            Size: {item.size}
                          </p>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center border border-text/15">
                            <button
                              onClick={() => updateQty(item.slug, item.size, item.qty - 1)}
                              disabled={item.qty <= 1}
                              className="w-7 h-7 text-text/60 hover:text-text transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed text-sm"
                            >
                              −
                            </button>
                            <span className="w-6 text-center text-xs tabular-nums">
                              {item.qty}
                            </span>
                            <button
                              onClick={() => updateQty(item.slug, item.size, item.qty + 1)}
                              className="w-7 h-7 text-text/60 hover:text-text transition-colors cursor-pointer text-sm"
                            >
                              +
                            </button>
                          </div>
                          <p className="text-sm">
                            ₹{(item.price * item.qty).toLocaleString("en-IN")}
                          </p>
                        </div>
                        <button
                          onClick={() => removeItem(item.slug, item.size)}
                          className="text-[11px] text-muted hover:text-accent transition-colors cursor-pointer self-start"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* FOOTER */}
            {items.length > 0 && (
              <div className="px-6 py-5 border-t border-text/5 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted">Subtotal</span>
                  <span className="text-lg">
                    ₹{totalPrice.toLocaleString("en-IN")}
                  </span>
                </div>
                <button
                  onClick={() => { setIsOpen(false); router.push("/checkout"); }}
                  className="group relative w-full py-3.5 bg-bg text-text border border-text text-sm tracking-widest cursor-pointer overflow-hidden"
                >
                  <span className="absolute inset-0 bg-text origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
                  <span className="relative z-10 group-hover:text-bg transition-colors duration-500">
                    Checkout
                  </span>
                </button>
                <p className="text-[10px] text-muted text-center tracking-wide">
                  Free shipping on orders above ₹4,999
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
