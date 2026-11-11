import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        collection: true,
        images: { orderBy: { displayOrder: "asc" } },
        variants: true,
        reviews: {
          orderBy: { createdAt: "desc" },
          take: 10,
        },
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Fetch related products for recommendations
    const relatedProducts = await prisma.product.findMany({
      where: {
        id: { not: product.id },
        OR: [
          { categoryId: product.categoryId },
          { collectionId: product.collectionId },
        ],
      },
      take: 4,
      include: {
        images: { orderBy: { displayOrder: "asc" } },
        variants: true,
      },
    });

    return NextResponse.json({
      product,
      relatedProducts,
    });
  } catch (error) {
    console.error("Product detail error:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}
