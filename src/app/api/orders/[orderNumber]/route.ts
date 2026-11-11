import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: { orderNumber: string } }
) {
  try {
    const { orderNumber } = params;

    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: {
        items: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error("Order fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: { orderNumber: string } }
) {
  try {
    const session = await getSessionUser();
    const { orderNumber } = params;
    const { action, reason } = await request.json(); // action = "CANCEL" or "RETURN"

    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: { items: true },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Verify ownership if logged in
    if (session && order.userId && order.userId !== session.userId && session.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (action === "CANCEL") {
      if (order.status !== "PENDING" && order.status !== "CONFIRMED") {
        return NextResponse.json(
          { error: "Order cannot be cancelled at this stage (already processing or shipped)." },
          { status: 400 }
        );
      }

      // Restore inventory
      for (const item of order.items) {
        if (item.variantId) {
          await prisma.productVariant.update({
            where: { id: item.variantId },
            data: { stock: { increment: item.quantity } },
          }).catch(() => {});
        }
      }

      const updated = await prisma.order.update({
        where: { id: order.id },
        data: {
          status: "CANCELLED",
          paymentStatus: order.paymentStatus === "PAID" ? "REFUNDED" : "CANCELLED",
        },
      });

      return NextResponse.json({
        success: true,
        message: "Order cancelled successfully. Any refund will be credited in 3-5 business days.",
        order: updated,
      });
    }

    if (action === "RETURN") {
      if (order.status !== "DELIVERED") {
        return NextResponse.json(
          { error: "Returns can only be requested for delivered orders." },
          { status: 400 }
        );
      }

      const updated = await prisma.order.update({
        where: { id: order.id },
        data: {
          status: "RETURN_REQUESTED",
        },
      });

      return NextResponse.json({
        success: true,
        message: "Return request submitted. Our team will verify and arrange courier pickup.",
        order: updated,
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Order action error:", error);
    return NextResponse.json({ error: "Failed to process order request" }, { status: 500 });
  }
}

