"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  CheckCircle,
  Package,
  Printer,
  Truck,
  RotateCcw,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default function OrderSuccessPage() {
  const params = useParams();
  const orderNumber = params?.orderNumber as string;

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!orderNumber) return;
    fetch(`/api/orders/${orderNumber}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.order) setOrder(data.order);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [orderNumber]);

  const handlePrint = () => {
    window.print();
  };

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel this order?")) return;
    try {
      const res = await fetch(`/api/orders/${orderNumber}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "CANCEL" }),
      });
      const data = await res.json();
      if (res.ok) {
        setOrder(data.order);
        setActionMsg(data.message);
      } else {
        alert(data.error);
      }
    } catch {
      alert("Failed to cancel order");
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center font-mono">
        RETRIEVING ORDER STATUS...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <h2 className="font-display text-4xl uppercase font-bold text-[#151515] mb-2">
          ORDER NOT FOUND
        </h2>
        <Link href="/shop" className="text-xs font-bold uppercase underline">
          Return to Catalog
        </Link>
      </div>
    );
  }

  const shippingAddr = typeof order.shippingAddress === "string"
    ? JSON.parse(order.shippingAddress)
    : order.shippingAddress;

  const steps = [
    { title: "ORDER PLACED", active: true },
    { title: "PROCESSING", active: ["PROCESSING", "SHIPPED", "DELIVERED"].includes(order.status) },
    { title: "SHIPPED", active: ["SHIPPED", "DELIVERED"].includes(order.status) },
    { title: "DELIVERED", active: order.status === "DELIVERED" },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 w-full min-h-screen">
      {/* Top Success Banner */}
      <div className="bg-[#101010] text-[#F5F3EE] p-8 border border-[#262626] text-center mb-8">
        <CheckCircle className="w-14 h-14 text-[#D8FF36] mx-auto mb-3" />
        <span className="text-xs font-mono font-bold tracking-mega text-[#D8FF36] uppercase">
          ORDER CONFIRMED
        </span>
        <h1 className="font-display text-4xl sm:text-6xl uppercase font-black text-[#F5F3EE] mt-1 mb-2">
          THANK YOU FOR YOUR ORDER
        </h1>
        <p className="text-xs sm:text-sm text-[#AAAAAA] max-w-md mx-auto">
          We&apos;re getting your premium streetwear ready for dispatch. A confirmation receipt has been sent to your email.
        </p>

        <div className="mt-6 inline-flex items-center gap-2 bg-[#181818] border border-[#333333] px-4 py-2 text-xs font-mono text-[#D8FF36]">
          <span>ORDER ID:</span>
          <strong className="text-white">{order.orderNumber}</strong>
        </div>
      </div>

      {actionMsg && (
        <div className="p-4 bg-green-100 border border-green-300 text-green-800 text-xs font-bold mb-6">
          {actionMsg}
        </div>
      )}

      {/* Live Order Timeline */}
      <div className="bg-[#E8E5DE] border border-[#D4D0C8] p-6 mb-8">
        <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-[#151515] mb-4">
          DISPATCH TIMELINE
        </h3>
        <div className="grid grid-cols-4 gap-2 text-center">
          {steps.map((st, i) => (
            <div key={st.title} className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-2 ${
                  st.active
                    ? "bg-[#101010] text-[#D8FF36]"
                    : "bg-[#D4D0C8] text-[#777777]"
                }`}
              >
                {i + 1}
              </div>
              <span className={`text-[10px] font-mono uppercase font-bold ${st.active ? "text-[#151515]" : "text-[#777777]"}`}>
                {st.title}
              </span>
            </div>
          ))}
        </div>

        {order.trackingNumber && (
          <div className="mt-6 pt-4 border-t border-[#D4D0C8] flex flex-col sm:flex-row items-center justify-between text-xs font-mono">
            <span>COURIER: <strong>{order.courierName || "Delhivery"}</strong></span>
            <span>TRACKING ID: <strong className="text-blue-700">{order.trackingNumber}</strong></span>
          </div>
        )}
      </div>

      {/* Invoice / Order Receipt Section (Printable) */}
      <div className="bg-[#F5F3EE] border-2 border-[#151515] p-6 sm:p-8 space-y-6 print:border-none print:p-0">
        <div className="flex flex-col sm:flex-row justify-between items-start pb-6 border-b-2 border-[#151515]">
          <div>
            <span className="font-display text-3xl font-black uppercase text-[#151515]">
              BUILD CLOTHING CO.
            </span>
            <p className="text-[11px] font-mono text-[#777777] mt-1">
              Premium Streetwear & Graphic Apparel<br />
              Flagship Studio, Bandra West, Mumbai, 400050<br />
              GSTIN: 27AABCB1234F1Z8
            </p>
          </div>
          <div className="mt-4 sm:mt-0 text-left sm:text-right text-xs font-mono">
            <span className="font-bold text-[#151515]">TAX INVOICE</span>
            <p className="text-[#555555]">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
            <p className="text-[#555555]">Payment: {order.paymentMethod} ({order.paymentStatus})</p>
            <p className="font-bold text-green-700">Status: {order.status}</p>
          </div>
        </div>

        {/* Shipping address & customer details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono pb-6 border-b border-[#D4D0C8]">
          <div>
            <span className="font-bold uppercase text-[#777777]">SHIP TO:</span>
            <p className="font-bold text-[#151515] mt-1">{shippingAddr?.fullName}</p>
            <p className="text-[#555555]">{shippingAddr?.addressLine1}</p>
            {shippingAddr?.addressLine2 && <p className="text-[#555555]">{shippingAddr?.addressLine2}</p>}
            <p className="text-[#555555]">{shippingAddr?.city}, {shippingAddr?.state} - {shippingAddr?.pincode}</p>
            <p className="text-[#555555]">Phone: {shippingAddr?.phone}</p>
          </div>
          <div>
            <span className="font-bold uppercase text-[#777777]">BILLING METHOD:</span>
            <p className="text-[#151515] mt-1 font-bold">
              {order.paymentMethod === "RAZORPAY" ? "Prepaid via Razorpay (UPI/Card)" : "Cash on Delivery (Pay at Doorstep)"}
            </p>
            <p className="text-[#777777] mt-1">Delivery: Express Standard (2-4 Days)</p>
          </div>
        </div>

        {/* Order Items Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono text-left">
            <thead>
              <tr className="border-b border-[#151515] uppercase font-bold text-[#151515]">
                <th className="py-2">Item</th>
                <th className="py-2">Fit/Size</th>
                <th className="py-2">Color</th>
                <th className="py-2 text-center">Qty</th>
                <th className="py-2 text-right">Price</th>
                <th className="py-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E5DE]">
              {order.items?.map((item: any) => (
                <tr key={item.id}>
                  <td className="py-3 font-bold text-[#151515]">{item.productTitle}</td>
                  <td className="py-3">{item.variantSize}</td>
                  <td className="py-3">{item.variantColor}</td>
                  <td className="py-3 text-center">{item.quantity}</td>
                  <td className="py-3 text-right">{formatPrice(item.unitPrice)}</td>
                  <td className="py-3 text-right font-bold">{formatPrice(item.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals Summary */}
        <div className="pt-4 border-t border-[#151515] flex justify-end">
          <div className="w-64 space-y-1.5 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-[#777777]">Subtotal:</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-green-700 font-bold">
                <span>Discount:</span>
                <span>-{formatPrice(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-[#777777]">Express Shipping:</span>
              <span>{order.shippingFee === 0 ? "FREE" : formatPrice(order.shippingFee)}</span>
            </div>
            <div className="flex justify-between text-sm font-black pt-2 border-t border-[#151515]">
              <span>Grand Total:</span>
              <span>{formatPrice(order.totalAmount)}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons for User */}
        <div className="pt-6 border-t border-[#D4D0C8] flex flex-wrap gap-3 items-center justify-between print:hidden">
          <div className="flex gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2.5 bg-[#E8E5DE] border border-[#151515] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 hover:bg-[#D4D0C8]"
            >
              <Printer className="w-4 h-4" />
              <span>Print Tax Invoice</span>
            </button>
            {(order.status === "PENDING" || order.status === "CONFIRMED") && (
              <button
                onClick={handleCancel}
                className="px-4 py-2.5 bg-red-100 border border-red-300 text-red-700 text-xs font-bold uppercase tracking-wider hover:bg-red-200"
              >
                Cancel Order
              </button>
            )}
          </div>

          <Link
            href="/shop"
            className="px-6 py-2.5 bg-[#101010] text-[#D8FF36] text-xs font-bold uppercase tracking-wider hover:bg-black"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

