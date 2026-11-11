import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const coupons = await prisma.coupon.findMany({
      orderBy: { code: "asc" },
    });
    return NextResponse.json({ coupons });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch coupons" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSessionUser();
    if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const {
      code,
      discountType,
      discountValue,
      minOrderValue,
      maxDiscount,
      validUntil,
      usageLimit,
      isActive,
    } = body;

    if (!code || !code.trim()) {
      return NextResponse.json({ error: "Coupon code is required" }, { status: 400 });
    }

    const normalizedCode = code.trim().toUpperCase();

    // Check if code already exists
    const existing = await prisma.coupon.findUnique({
      where: { code: normalizedCode },
    });

    if (existing) {
      return NextResponse.json(
        { error: `Coupon code '${normalizedCode}' already exists.` },
        { status: 409 }
      );
    }

    const parsedDiscountValue = parseFloat(discountValue) || 0;
    const isPercentage = discountType === "PERCENTAGE";

    const created = await prisma.coupon.create({
      data: {
        code: normalizedCode,
        discountPercent: isPercentage ? parsedDiscountValue : null,
        discountAmount: !isPercentage ? parsedDiscountValue : null,
        minOrderValue: minOrderValue ? parseFloat(minOrderValue) : 0,
        maxDiscount: maxDiscount && isPercentage ? parseFloat(maxDiscount) : null,
        validUntil: validUntil ? new Date(validUntil) : null,
        usageLimit: usageLimit ? parseInt(usageLimit, 10) : null,
        isActive: isActive !== undefined ? Boolean(isActive) : true,
      },
    });

    return NextResponse.json({ success: true, coupon: created });
  } catch (error: any) {
    console.error("Admin create coupon error:", error);
    return NextResponse.json({ error: "Failed to create coupon" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getSessionUser();
    if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const { id, isActive, discountPercent, discountAmount, minOrderValue, maxDiscount, validUntil, usageLimit } = body;

    if (!id) {
      return NextResponse.json({ error: "Coupon ID is required" }, { status: 400 });
    }

    const updated = await prisma.coupon.update({
      where: { id },
      data: {
        ...(isActive !== undefined ? { isActive: Boolean(isActive) } : {}),
        ...(discountPercent !== undefined ? { discountPercent: parseFloat(discountPercent) } : {}),
        ...(discountAmount !== undefined ? { discountAmount: parseFloat(discountAmount) } : {}),
        ...(minOrderValue !== undefined ? { minOrderValue: parseFloat(minOrderValue) } : {}),
        ...(maxDiscount !== undefined ? { maxDiscount: maxDiscount ? parseFloat(maxDiscount) : null } : {}),
        ...(validUntil !== undefined ? { validUntil: validUntil ? new Date(validUntil) : null } : {}),
        ...(usageLimit !== undefined ? { usageLimit: usageLimit ? parseInt(usageLimit, 10) : null } : {}),
      },
    });

    return NextResponse.json({ success: true, coupon: updated });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update coupon" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getSessionUser();
    if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Coupon ID required" }, { status: 400 });
    }

    await prisma.coupon.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete coupon" }, { status: 500 });
  }
}
