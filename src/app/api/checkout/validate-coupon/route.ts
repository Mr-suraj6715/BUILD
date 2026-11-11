import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const rawCode = body.code;
    const subtotal = typeof body.subtotal === "number" ? body.subtotal : parseFloat(body.subtotal || "0");

    if (!rawCode || typeof rawCode !== "string" || !rawCode.trim()) {
      return NextResponse.json(
        { success: false, error: "Please enter a coupon code." },
        { status: 400 }
      );
    }

    const normalizedCode = rawCode.trim().toUpperCase();

    // Query database for coupon
    // In SQLite or Postgres, we can find by exact uppercase code
    const coupon = await prisma.coupon.findUnique({
      where: { code: normalizedCode },
    });

    if (!coupon) {
      return NextResponse.json(
        { success: false, error: `Coupon code '${normalizedCode}' does not exist.` },
        { status: 404 }
      );
    }

    // 1. Active check
    if (!coupon.isActive) {
      return NextResponse.json(
        { success: false, error: `Coupon code '${coupon.code}' is currently inactive.` },
        { status: 400 }
      );
    }

    // 2. Expiration check
    if (coupon.validUntil) {
      const expiry = new Date(coupon.validUntil);
      if (new Date() > expiry) {
        return NextResponse.json(
          { success: false, error: `Coupon code '${coupon.code}' expired on ${expiry.toLocaleDateString()}.` },
          { status: 400 }
        );
      }
    }

    // 3. Usage limit check
    if (coupon.usageLimit !== null && coupon.usageLimit !== undefined) {
      if (coupon.usageCount >= coupon.usageLimit) {
        return NextResponse.json(
          { success: false, error: `Coupon code '${coupon.code}' usage limit has been reached.` },
          { status: 400 }
        );
      }
    }

    // 4. Minimum order value check
    if (subtotal < coupon.minOrderValue) {
      return NextResponse.json(
        {
          success: false,
          error: `Minimum order amount of ₹${coupon.minOrderValue.toLocaleString()} required to apply '${coupon.code}'.`,
        },
        { status: 400 }
      );
    }

    // 5. Server-side discount calculation
    let calculatedDiscount = 0;
    if (coupon.discountPercent) {
      calculatedDiscount = Math.round((subtotal * coupon.discountPercent) / 100);
      if (coupon.maxDiscount && calculatedDiscount > coupon.maxDiscount) {
        calculatedDiscount = coupon.maxDiscount;
      }
    } else if (coupon.discountAmount) {
      calculatedDiscount = Math.min(coupon.discountAmount, subtotal);
    }

    calculatedDiscount = Math.max(0, Math.min(calculatedDiscount, subtotal));

    // Shipping calculations (free above 1499, else 99)
    const shippingFee = subtotal === 0 || subtotal >= 1499 ? 0 : 99;
    const finalTotal = Math.max(0, subtotal - calculatedDiscount + shippingFee);

    return NextResponse.json({
      success: true,
      message: "Coupon applied successfully!",
      coupon: {
        id: coupon.id,
        code: coupon.code,
        discountType: coupon.discountPercent ? "PERCENTAGE" : "FIXED",
        discountValue: coupon.discountPercent || coupon.discountAmount,
        discountPercent: coupon.discountPercent,
        discountAmount: coupon.discountAmount,
        minOrderValue: coupon.minOrderValue,
        maxDiscount: coupon.maxDiscount,
        calculatedDiscount,
      },
      subtotal,
      discount: calculatedDiscount,
      shippingFee,
      total: finalTotal,
    });
  } catch (error: any) {
    console.error("Coupon validation error:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred while validating coupon." },
      { status: 500 }
    );
  }
}

