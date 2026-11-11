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

    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        category: true,
        collection: true,
        variants: true,
        images: true,
      },
    });

    return NextResponse.json({ products });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
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
      title,
      slug,
      description,
      fabric,
      gsm,
      fit,
      printType,
      printPlacement,
      artwork,
      basePrice,
      originalPrice,
      categoryId,
      collectionId,
      isFeatured,
      isBestseller,
      isNewDrop,
      isLimited,
      images, // array of { url, alt, isPrimary }
      variants, // array of { size, color, colorHex, sku, stock }
    } = body;

    if (!title || !basePrice || !categoryId) {
      return NextResponse.json({ error: "Title, price and category are required" }, { status: 400 });
    }

    // STRICT CATALOG VALIDATION: T-SHIRTS ONLY
    const prohibitedKeywords = [
      "hoodie", "sweatshirt", "jacket", "jeans", "trouser", "pant", "short",
      "shoe", "sneaker", "slipper", "sandal", "cap", "hat", "bag", "sock", "watch"
    ];
    const textToCheck = `${title} ${description || ""} ${fit || ""}`.toLowerCase();
    for (const badWord of prohibitedKeywords) {
      if (textToCheck.includes(badWord)) {
        return NextResponse.json(
          { error: `BUILD CLOTHING is strictly an exclusive T-shirt brand. Non-T-shirt products (${badWord}) are strictly prohibited.` },
          { status: 400 }
        );
      }
    }

    // Verify category is an authorized T-Shirt category
    const category = await prisma.category.findUnique({ where: { id: categoryId } });
    if (!category) {
      return NextResponse.json({ error: "Invalid category selected" }, { status: 400 });
    }

    const productSlug =
      slug ||
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

    const newProduct = await prisma.product.create({
      data: {
        title,
        slug: productSlug,
        description: description || "",
        fabric: fabric || "100% Combed Ringspun Cotton (240 GSM)",
        gsm: gsm ? parseInt(gsm) : 240,
        fit: fit || "Oversized Boxy Fit",
        printType: printType || "High-Density Screen Print",
        printPlacement: printPlacement || "Front & Back",
        artwork: artwork || `${title} Signature Graphic`,
        basePrice: parseFloat(basePrice),
        originalPrice: originalPrice ? parseFloat(originalPrice) : parseFloat(basePrice),
        categoryId,
        collectionId: collectionId || null,
        isFeatured: Boolean(isFeatured),
        isBestseller: Boolean(isBestseller),
        isNewDrop: Boolean(isNewDrop),
        isLimited: Boolean(isLimited),
        images: {
          create: (images || []).map((img: any, idx: number) => ({
            url: img.url,
            alt: img.alt || title,
            isPrimary: img.isPrimary || idx === 0,
            displayOrder: idx,
          })),
        },
        variants: {
          create: (variants || []).map((v: any) => ({
            size: v.size,
            color: v.color,
            colorHex: v.colorHex || "#151515",
            sku: v.sku || `${productSlug.slice(0, 4).toUpperCase()}-${v.size}-${Math.floor(100 + Math.random() * 900)}`,
            stock: v.stock !== undefined ? parseInt(v.stock) : 20,
            additionalPrice: v.additionalPrice ? parseFloat(v.additionalPrice) : 0,
          })),
        },
      },
      include: {
        images: true,
        variants: true,
      },
    });

    return NextResponse.json({ success: true, product: newProduct });
  } catch (error) {
    console.error("Create product error:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
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
      return NextResponse.json({ error: "Product ID required" }, { status: 400 });
    }

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Product deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
