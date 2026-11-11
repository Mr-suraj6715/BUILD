import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getSessionUser();
    if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        orderNumber: true,
        guestEmail: true,
        user: { select: { email: true, name: true } },
        paymentMethod: true,
        paymentStatus: true,
        razorpayOrderId: true,
        razorpayPaymentId: true,
        totalAmount: true,
        createdAt: true,
      },
    });

    const payments = orders.map((o) => ({
      id: o.id,
      orderNumber: o.orderNumber,
      customerEmail: o.user?.email || o.guestEmail || "Guest",
      customerName: o.user?.name || "Customer",
      method: o.paymentMethod,
      status: o.paymentStatus,
      transactionId: o.razorpayPaymentId || `TXN-${o.orderNumber.replace("BLD-", "")}`,
      gatewayOrderId: o.razorpayOrderId || "N/A",
      amount: o.totalAmount,
      currency: "INR",
      date: o.createdAt,
    }));

    return NextResponse.json({ payments });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch payments" }, { status: 500 });
  }
}

