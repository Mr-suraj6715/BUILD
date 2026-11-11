import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const session = await getSessionUser();
    const { productId, rating, comment, userName } = await request.json();

    if (!productId || !comment || !rating) {
      return NextResponse.json({ error: "Product, rating, and review comment are required" }, { status: 400 });
    }

    const review = await prisma.review.create({
      data: {
        productId,
        userId: session?.userId || null,
        userName: userName?.trim() || session?.name || "Verified Customer",
        rating: Math.min(5, Math.max(1, parseInt(rating))),
        comment: comment.trim(),
      },
    });

    // Update product rating average and count
    const allReviews = await prisma.review.findMany({
      where: { productId },
      select: { rating: true },
    });

    const avg = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    await prisma.product.update({
      where: { id: productId },
      data: {
        rating: parseFloat(avg.toFixed(1)),
        reviewCount: allReviews.length,
      },
    });

    return NextResponse.json({ success: true, review });
  } catch (error) {
    console.error("Create review error:", error);
    return NextResponse.json({ error: "Failed to post review" }, { status: 500 });
  }
}

