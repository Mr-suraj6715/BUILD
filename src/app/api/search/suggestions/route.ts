import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.trim() || "";

    if (!query || query.length < 2) {
      return NextResponse.json({
        suggestions: [
          "Oversized Graphic T-Shirts",
          "280 GSM Tokyo Boxy Tees",
          "Anime Artwork T-Shirts",
          "Cyber Ronin T-Shirts",
          "Custom Printed T-Shirts",
          "Minimalist T-Shirts",
        ],
        categories: [],
        products: [],
      });
    }

    const [matchedProducts, matchedCategories] = await Promise.all([
      prisma.product.findMany({
        where: {
          OR: [
            { title: { contains: query } },
            { description: { contains: query } },
            { fabric: { contains: query } },
            { fit: { contains: query } },
          ],
        },
        take: 5,
        select: {
          id: true,
          title: true,
          slug: true,
          basePrice: true,
          images: { take: 1, select: { url: true } },
        },
      }),
      prisma.category.findMany({
        where: {
          name: { contains: query },
        },
        take: 3,
        select: {
          id: true,
          name: true,
          slug: true,
        },
      }),
    ]);

    const suggestions = matchedProducts.map((p) => p.title);

    return NextResponse.json({
      suggestions,
      categories: matchedCategories,
      products: matchedProducts,
    });
  } catch (error) {
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}

