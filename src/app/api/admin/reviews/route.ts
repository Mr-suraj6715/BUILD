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

    const reviews = await prisma.review.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        product: { select: { id: true, title: true, slug: true } },
      },
    });

    return NextResponse.json({ reviews });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
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
    if (!id) return NextResponse.json({ error: "Review ID required" }, { status: 400 });

    const review = await prisma.review.delete({ where: { id } });

    // Recalculate average rating
    const all = await prisma.review.findMany({
      where: { productId: review.productId },
      select: { rating: true },
    });

    const newAvg = all.length > 0 ? all.reduce((s, r) => s + r.rating, 0) / all.length : 5.0;
    await prisma.product.update({
      where: { id: review.productId },
      data: {
        rating: parseFloat(newAvg.toFixed(1)),
        reviewCount: all.length,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete review" }, { status: 500 });
  }
}

