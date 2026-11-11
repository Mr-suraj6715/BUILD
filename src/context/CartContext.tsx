"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export interface CartItem {
  id: string; // unique item id = variantId
  variantId: string;
  productId: string;
  title: string;
  slug: string;
  image: string;
  price: number;
  originalPrice: number;
  size: string;
  color: string;
  quantity: number;
  maxStock: number;
}

export interface AppliedCoupon {
  code: string;
  discountType?: "PERCENTAGE" | "FIXED";
  discountValue?: number;
  discountPercent?: number | null;
  discountAmount?: number | null;
  minOrderValue?: number;
  maxDiscount?: number | null;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, "id">) => void;
  removeFromCart: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  coupon: AppliedCoupon | null;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [coupon, setCoupon] = useState<AppliedCoupon | null>(null);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("bld_cart");
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
      const savedCoupon = localStorage.getItem("bld_coupon");
      if (savedCoupon) {
        setCoupon(JSON.parse(savedCoupon));
      }
    } catch {
      // Ignore storage error
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      try {
        localStorage.setItem("bld_cart", JSON.stringify(cart));
      } catch {}
    }
  }, [cart, mounted]);

  useEffect(() => {
    if (mounted) {
      try {
        if (coupon) {
          localStorage.setItem("bld_coupon", JSON.stringify(coupon));
        } else {
          localStorage.removeItem("bld_coupon");
        }
      } catch {}
    }
  }, [coupon, mounted]);

  const addToCart = (item: Omit<CartItem, "id">) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.variantId === item.variantId);
      if (existing) {
        const newQty = Math.min(existing.quantity + item.quantity, item.maxStock);
        return prev.map((i) =>
          i.variantId === item.variantId ? { ...i, quantity: newQty } : i
        );
      }
      return [...prev, { ...item, id: item.variantId }];
    });
    setIsCartDrawerOpen(true);
  };

  const removeFromCart = (variantId: string) => {
    setCart((prev) => prev.filter((i) => i.variantId !== variantId));
  };

  const updateQuantity = (variantId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(variantId);
      return;
    }
    setCart((prev) =>
      prev.map((i) =>
        i.variantId === variantId
          ? { ...i, quantity: Math.min(quantity, i.maxStock) }
          : i
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    setCoupon(null);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Free shipping above 1499, else 99
  const shippingFee = subtotal === 0 || subtotal >= 1499 ? 0 : 99;

  let discount = 0;
  if (coupon && subtotal >= (coupon.minOrderValue || 0)) {
    if (coupon.discountPercent) {
      discount = Math.round((subtotal * coupon.discountPercent) / 100);
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else if (coupon.discountAmount) {
      discount = Math.min(coupon.discountAmount, subtotal);
    }
  }

  const total = Math.max(0, subtotal - discount + shippingFee);

  const applyCoupon = async (code: string): Promise<{ success: boolean; message: string }> => {
    if (!code || !code.trim()) {
      return { success: false, message: "Please enter a coupon code." };
    }

    try {
      const res = await fetch("/api/checkout/validate-coupon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim(), subtotal }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        return {
          success: false,
          message: data.error || "Invalid or expired coupon code",
        };
      }

      setCoupon(data.coupon);
      return {
        success: true,
        message:
          data.coupon.discountType === "PERCENTAGE"
            ? `Coupon applied successfully! (${data.coupon.discountValue}% OFF)`
            : `Coupon applied successfully! (₹${data.coupon.discountValue} OFF)`,
      };
    } catch (err: any) {
      return {
        success: false,
        message: err.message || "Failed to validate coupon.",
      };
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        discount,
        shippingFee,
        total,
        coupon,
        applyCoupon,
        removeCoupon,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
