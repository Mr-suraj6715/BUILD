import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { sendShippingUpdateEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const session = await getSessionUser();
    if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const where: any = {};
    if (status && status !== "ALL") {
      where.status = status;
    }

    const orders = await prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        items: true,
        user: { select: { id: true, name: true, email: true, phone: true } },
      },
    });

    return NextResponse.json({ orders });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getSessionUser();
    if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { orderId, status, trackingNumber, courierName, paymentStatus } = await request.json();

    if (!orderId) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }

    const updateData: any = {};
    if (status) updateData.status = status;
    if (trackingNumber !== undefined) updateData.trackingNumber = trackingNumber;
    if (courierName !== undefined) updateData.courierName = courierName;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;

    const updated = await prisma.order.update({
      where: { id: orderId },
      data: updateData,
      include: { items: true, user: true },
    });

    if (status === "SHIPPED" && trackingNumber) {
      const recipient = updated.user?.email || updated.guestEmail;
      if (recipient) {
        sendShippingUpdateEmail(recipient, updated.orderNumber, courierName || "Delhivery Express", trackingNumber).catch(() => {});
      }
    }

    return NextResponse.json({ success: true, order: updated });
  } catch (error) {
    console.error("Update order error:", error);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}
