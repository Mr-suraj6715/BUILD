import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const { orderNumber, razorpayOrderId, razorpayPaymentId, razorpaySignature } = await request.json();

    if (!orderNumber) {
      return NextResponse.json({ error: "Order number is required" }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { orderNumber },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET || "mock_secret_buildclothing_2025";

    // Verify signature if provided, or allow mock test pass in dev
    let isValid = true;
    if (razorpaySignature && razorpayOrderId && !razorpayOrderId.startsWith("order_mock_")) {
      const generatedSignature = crypto
        .createHmac("sha256", secret)
        .update(`${razorpayOrderId}|${razorpayPaymentId}`)
        .digest("hex");
      isValid = generatedSignature === razorpaySignature;
    }

    if (!isValid) {
      await prisma.order.update({
        where: { id: order.id },
        data: { paymentStatus: "FAILED" },
      });
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
    }

    // Update order status
    const updatedOrder = await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentStatus: "PAID",
        status: "CONFIRMED",
        razorpayPaymentId: razorpayPaymentId || "pay_mock_verified_" + Date.now(),
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Payment verified successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

