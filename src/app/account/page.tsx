"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Package,
  User,
  MapPin,
  LogOut,
  ExternalLink,
  ShieldAlert,
  Clock,
  CheckCircle,
  Truck,
  RotateCcw,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { formatPrice } from "@/lib/utils";

export default function AccountPage() {
  const router = useRouter();
  const { user, logout, isLoading } = useAuth();

  const [activeTab, setActiveTab] = useState<"orders" | "profile" | "addresses">("orders");
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/login");
      return;
    }

    if (user) {
      fetch("/api/orders")
        .then((res) => res.json())
        .then((data) => {
          if (data.orders) setOrders(data.orders);
        })
        .catch((err) => console.error(err))
        .finally(() => setOrdersLoading(false));
    }
  }, [user, isLoading, router]);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  if (isLoading || !user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center font-mono">
        LOADING ACCOUNT DATA...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full min-h-screen">
      {/* Top Welcome Bar */}
      <div className="border-b border-[#D4D0C8] pb-6 mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold tracking-mega text-[#777777] uppercase">
            MEMBER ARCHIVE
          </span>
          <h1 className="font-display text-4xl sm:text-6xl uppercase font-black tracking-tight text-[#151515]">
            WELCOME, {user.name.toUpperCase()}
          </h1>
          <p className="text-xs font-mono text-[#555555] mt-1">
            {user.email} • ROLE: {user.role}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {(user.role === "ADMIN" || user.role === "SUPER_ADMIN") && (
            <Link
              href="/admin"
              className="bg-[#101010] text-[#D8FF36] px-4 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 hover:bg-black"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Admin Hub</span>
            </Link>
          )}
          <button
            onClick={handleLogout}
            className="border border-[#151515] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-[#151515] hover:bg-[#151515] hover:text-[#D8FF36] transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#D4D0C8] mb-8 space-x-6">
        <button
          onClick={() => setActiveTab("orders")}
          className={`pb-3 text-xs font-bold uppercase tracking-widest transition-all ${
            activeTab === "orders"
              ? "border-b-2 border-[#151515] text-[#151515]"
              : "text-[#777777] hover:text-[#151515]"
          }`}
        >
          My Orders ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab("profile")}
          className={`pb-3 text-xs font-bold uppercase tracking-widest transition-all ${
            activeTab === "profile"
              ? "border-b-2 border-[#151515] text-[#151515]"
              : "text-[#777777] hover:text-[#151515]"
          }`}
        >
          Profile Details
        </button>
      </div>

      {/* Tab: Orders */}
      {activeTab === "orders" && (
        <div className="space-y-6">
          {ordersLoading ? (
            <div className="font-mono text-xs text-[#777777]">Loading order history...</div>
          ) : orders.length === 0 ? (
            <div className="bg-[#E8E5DE] border border-[#D4D0C8] p-12 text-center">
              <Package className="w-12 h-12 text-[#777777] mx-auto mb-3" />
              <h3 className="font-display text-2xl uppercase font-bold text-[#151515] mb-1">
                NO ORDERS PLACED YET
              </h3>
              <p className="text-xs text-[#777777] mb-6">
                When you purchase from BUILD drops, your shipment records will be tracked here.
              </p>
              <Link
                href="/shop"
                className="bg-[#101010] text-[#D8FF36] px-6 py-3 text-xs font-bold uppercase tracking-widest inline-block"
              >
                Shop New Releases
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((ord) => (
                <div
                  key={ord.id}
                  className="bg-[#E8E5DE] border border-[#D4D0C8] p-5 sm:p-6 transition-all hover:border-[#151515]"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#D4D0C8] gap-2">
                    <div>
                      <span className="text-[10px] font-mono text-[#777777] uppercase">ORDER ID</span>
                      <h4 className="font-display text-xl uppercase font-bold text-[#151515]">
                        {ord.orderNumber}
                      </h4>
                      <span className="text-xs font-mono text-[#777777]">
                        Placed on {new Date(ord.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold uppercase px-3 py-1 bg-[#101010] text-[#D8FF36]">
                        {ord.status}
                      </span>
                      <span className="text-sm font-black font-mono text-[#151515]">
                        {formatPrice(ord.totalAmount)}
                      </span>
                    </div>
                  </div>

                  {/* Items in order */}
                  <div className="py-4 space-y-2">
                    {ord.items?.map((item: any) => (
                      <div key={item.id} className="flex items-center justify-between text-xs font-mono">
                        <span className="text-[#151515] font-bold">
                          {item.productTitle} — <span className="text-[#777777]">{item.variantSize}</span>
                        </span>
                        <span>
                          Qty: {item.quantity} • {formatPrice(item.total)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Order Footer Actions */}
                  <div className="pt-4 border-t border-[#D4D0C8] flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="text-[11px] font-mono text-[#555555]">
                      Payment: {ord.paymentMethod} ({ord.paymentStatus})
                    </div>
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/order-success/${ord.orderNumber}`}
                        className="font-bold uppercase text-[#151515] underline flex items-center gap-1 hover:text-black"
                      >
                        <span>View Invoice</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                      <Link
                        href={`/track`}
                        className="px-3 py-1 bg-[#151515] text-[#D8FF36] font-bold uppercase text-[11px] hover:bg-black"
                      >
                        Track Status
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Profile */}
      {activeTab === "profile" && (
        <div className="max-w-xl bg-[#E8E5DE] border border-[#D4D0C8] p-6 space-y-4">
          <h3 className="font-display text-2xl uppercase font-bold text-[#151515] mb-2">
            ACCOUNT DETAILS
          </h3>
          <div className="space-y-3 text-xs font-mono">
            <div>
              <span className="text-[#777777] block text-[10px]">NAME</span>
              <span className="font-bold text-[#151515] text-sm">{user.name}</span>
            </div>
            <div>
              <span className="text-[#777777] block text-[10px]">EMAIL ADDRESS</span>
              <span className="font-bold text-[#151515] text-sm">{user.email}</span>
            </div>
            <div>
              <span className="text-[#777777] block text-[10px]">REGISTERED PHONE</span>
              <span className="font-bold text-[#151515] text-sm">{user.phone || "Not provided"}</span>
            </div>
            <div>
              <span className="text-[#777777] block text-[10px]">ACCESS LEVEL</span>
              <span className="font-bold text-[#101010] bg-[#D8FF36] px-2 py-0.5 inline-block">{user.role}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

