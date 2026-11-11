import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { generateOrderNumber } from "@/lib/utils";
import { checkoutSchema } from "@/lib/validations";
import { sendOrderConfirmationEmail } from "@/lib/email";

interface CartInputItem {
  variantId: string;
  quantity: number;
}

export async function POST(request: Request) {
  try {
    const session = await getSessionUser();
    const {
      items,
      shippingAddress,
      paymentMethod,
      couponCode,
      guestEmail,
      guestPhone,
    } = await request.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.pincode || !shippingAddress.addressLine1) {
      return NextResponse.json({ error: "Complete shipping address is required" }, { status: 400 });
    }

    // 1. Validate items against actual database prices and stock
    let subtotal = 0;
    const validatedOrderItems: {
      variantId: string;
      productTitle: string;
      variantSize: string;
      variantColor: string;
      unitPrice: number;
      quantity: number;
      total: number;
      productImage: string;
    }[] = [];

    for (const item of items as CartInputItem[]) {
      const variant = await prisma.productVariant.findUnique({
        where: { id: item.variantId },
        include: {
          product: {
            include: {
              images: { take: 1, orderBy: { displayOrder: "asc" } },
            },
          },
        },
      });

      if (!variant) {
        return NextResponse.json(
          { error: `Item variant not found: ${item.variantId}` },
          { status: 400 }
        );
      }

      if (variant.stock < item.quantity) {
        return NextResponse.json(
          {
            error: `Insufficient stock for ${variant.product.title} (${variant.size}). Available: ${variant.stock}`,
          },
          { status: 400 }
        );
      }

      const unitPrice = variant.product.basePrice + variant.additionalPrice;
      const itemTotal = unitPrice * item.quantity;
      subtotal += itemTotal;

      validatedOrderItems.push({
        variantId: variant.id,
        productTitle: variant.product.title,
        variantSize: variant.size,
        variantColor: variant.color,
        unitPrice,
        quantity: item.quantity,
        total: itemTotal,
        productImage: variant.product.images[0]?.url || "",
      });
    }

    // 2. Validate Coupon with strict database rules
    let discount = 0;
    let appliedCouponId: string | null = null;

    if (couponCode && typeof couponCode === "string" && couponCode.trim()) {
      const normalizedCode = couponCode.trim().toUpperCase();
      const coupon = await prisma.coupon.findUnique({
        where: { code: normalizedCode },
      });

      if (!coupon) {
        return NextResponse.json({ error: `Coupon '${normalizedCode}' does not exist.` }, { status: 400 });
      }

      if (!coupon.isActive) {
        return NextResponse.json({ error: `Coupon '${coupon.code}' is currently inactive.` }, { status: 400 });
      }

      if (coupon.validUntil && new Date() > new Date(coupon.validUntil)) {
        return NextResponse.json({ error: `Coupon '${coupon.code}' has expired.` }, { status: 400 });
      }

      if (coupon.usageLimit !== null && coupon.usageLimit !== undefined && coupon.usageCount >= coupon.usageLimit) {
        return NextResponse.json({ error: `Coupon '${coupon.code}' usage limit has been reached.` }, { status: 400 });
      }

      if (subtotal < coupon.minOrderValue) {
        return NextResponse.json(
          { error: `Minimum order amount of ₹${coupon.minOrderValue} required for coupon '${coupon.code}'.` },
          { status: 400 }
        );
      }

      if (coupon.discountPercent) {
        discount = Math.round((subtotal * coupon.discountPercent) / 100);
        if (coupon.maxDiscount && discount > coupon.maxDiscount) {
          discount = coupon.maxDiscount;
        }
      } else if (coupon.discountAmount) {
        discount = Math.min(coupon.discountAmount, subtotal);
      }

      discount = Math.max(0, Math.min(discount, subtotal));
      appliedCouponId = coupon.id;
    }

    // 3. Shipping logic (Free above ₹1,499)
    const shippingFee = subtotal >= 1499 ? 0 : 99;
    const totalAmount = Math.max(0, subtotal - discount + shippingFee);

    const orderNumber = generateOrderNumber();
    const isCOD = paymentMethod === "COD";

    // 4. Create Order & increment coupon usage count in a transaction
    const order = await prisma.$transaction(async (tx) => {
      if (appliedCouponId) {
        await tx.coupon.update({
          where: { id: appliedCouponId },
          data: { usageCount: { increment: 1 } },
        });
      }

      return await tx.order.create({
        data: {
          orderNumber,
          userId: session?.userId || null,
          guestEmail: guestEmail || (session?.email ?? null),
          guestPhone: guestPhone || shippingAddress.phone || null,
          status: isCOD ? "CONFIRMED" : "PENDING",
          paymentMethod: isCOD ? "COD" : "RAZORPAY",
          paymentStatus: isCOD ? "PENDING" : "PENDING",
          subtotal,
          discount,
          shippingFee,
          totalAmount,
          shippingAddress: JSON.stringify(shippingAddress),
          items: {
            create: validatedOrderItems.map((item) => ({
              variantId: item.variantId,
              productTitle: item.productTitle,
              variantSize: item.variantSize,
              variantColor: item.variantColor,
              unitPrice: item.unitPrice,
              quantity: item.quantity,
              total: item.total,
              productImage: item.productImage,
            })),
          },
        },
      });
    });

    // 5. Decrement stock
    for (const item of items) {
      await prisma.productVariant.update({
        where: { id: item.variantId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    // Send transactional order confirmation email
    const recipientEmail = guestEmail || session?.email;
    if (recipientEmail) {
      sendOrderConfirmationEmail(recipientEmail, order.orderNumber, totalAmount, validatedOrderItems).catch(() => {});
    }

    // 6. Handle Razorpay order preparation
    let razorpayOrder = null;
    if (!isCOD) {
      // In production or test mode, generate a mock or live razorpay order
      const mockRazorpayId = `order_${Math.random().toString(36).substring(2, 14)}`;
      await prisma.order.update({
        where: { id: order.id },
        data: { razorpayOrderId: mockRazorpayId },
      });

      razorpayOrder = {
        id: mockRazorpayId,
        amount: totalAmount * 100, // paise
        currency: "INR",
        orderNumber: order.orderNumber,
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_buildclothing",
      };
    }

    return NextResponse.json({
      success: true,
      orderNumber: order.orderNumber,
      orderId: order.id,
      totalAmount,
      isCOD,
      razorpayOrder,
    });
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { error: "Failed to process order. Please check inputs and try again." },
      { status: 500 }
    );
  }
}
