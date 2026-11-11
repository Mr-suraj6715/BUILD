import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const categorySlug = searchParams.get("category");
    const collectionSlug = searchParams.get("collection");
    const search = searchParams.get("search");
    const sort = searchParams.get("sort") || "newest";
    const size = searchParams.get("size");
    const color = searchParams.get("color");
    const minPrice = searchParams.get("minPrice") ? parseFloat(searchParams.get("minPrice")!) : undefined;
    const maxPrice = searchParams.get("maxPrice") ? parseFloat(searchParams.get("maxPrice")!) : undefined;
    const badge = searchParams.get("badge");
    const featured = searchParams.get("featured");

    // Build Prisma where clause
    const where: any = {};

    if (categorySlug && categorySlug !== "all-t-shirts") {
      where.category = { slug: categorySlug };
    }

    if (collectionSlug) {
      where.collection = { slug: collectionSlug };
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { fabric: { contains: search } },
      ];
    }

    if (badge) {
      if (badge.toLowerCase() === "new drop" || badge.toLowerCase() === "new") {
        where.isNewDrop = true;
      } else if (badge.toLowerCase() === "bestseller") {
        where.isBestseller = true;
      } else if (badge.toLowerCase() === "limited") {
        where.isLimited = true;
      }
    }

    if (featured === "true") {
      where.isFeatured = true;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.basePrice = {};
      if (minPrice !== undefined) where.basePrice.gte = minPrice;
      if (maxPrice !== undefined) where.basePrice.lte = maxPrice;
    }

    if (size || color) {
      where.variants = {
        some: {
          ...(size ? { size: size } : {}),
          ...(color ? { color: { contains: color } } : {}),
          stock: { gt: 0 },
        },
      };
    }

    // Sorting
    let orderBy: any = { createdAt: "desc" };
    if (sort === "price_asc") {
      orderBy = { basePrice: "asc" };
    } else if (sort === "price_desc") {
      orderBy = { basePrice: "desc" };
    } else if (sort === "rating") {
      orderBy = { rating: "desc" };
    } else if (sort === "popular") {
      orderBy = { reviewCount: "desc" };
    }

    const [products, totalCount, rawCategories, collections, totalAllProducts] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        include: {
          category: true,
          collection: true,
          images: { orderBy: { displayOrder: "asc" } },
          variants: true,
        },
      }),
      prisma.product.count({ where }),
      prisma.category.findMany({ include: { _count: { select: { products: true } } } }),
      prisma.collection.findMany({ include: { _count: { select: { products: true } } } }),
      prisma.product.count(),
    ]);

    const categories = rawCategories.map((c) => {
      if (c.slug === "all-t-shirts") {
        return { ...c, _count: { products: totalAllProducts } };
      }
      return c;
    });

    return NextResponse.json({
      products,
      totalCount,
      categories,
      collections,
    });
  } catch (error) {
    console.error("Products fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}
