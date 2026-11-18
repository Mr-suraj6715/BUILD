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
      frontImage,
      hoverImage,
      images, // array of { url, alt, isPrimary }
      variants, // array of { size, color, colorHex, sku, stock }
    } = body;

    if (!title || !basePrice || !categoryId) {
      return NextResponse.json({ error: "Title, price and category are required" }, { status: 400 });
    }

    // STRICT CATALOG VALIDATION: T-SHIRTS ONLY
    const prohibitedKeywords = [
      "hoodie", "sweatshirt", "jacket", "jeans", "trouser", "pant", "shoe", "sneaker", "slipper", "sandal", "cap", "hat", "bag", "sock", "watch"
    ];
    const textToCheck = `${title} ${description || ""} ${fit || ""}`;
    for (const badWord of prohibitedKeywords) {
      const wordRegex = new RegExp(`\\b${badWord}s?\\b`, "i");
      if (wordRegex.test(textToCheck)) {
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

    const resolvedImages = [];
    if (frontImage) {
      resolvedImages.push({
        url: frontImage,
        alt: `${title} Front View`,
        isPrimary: true,
        displayOrder: 0,
      });
    }
    if (hoverImage) {
      resolvedImages.push({
        url: hoverImage,
        alt: `${title} Hover / Alternate Angle`,
        isPrimary: false,
        displayOrder: 1,
      });
    }
    if (resolvedImages.length === 0 && Array.isArray(images) && images.length > 0) {
      images.forEach((img: any, idx: number) => {
        resolvedImages.push({
          url: img.url,
          alt: img.alt || (idx === 0 ? `${title} Front View` : `${title} Hover View`),
          isPrimary: img.isPrimary !== undefined ? img.isPrimary : idx === 0,
          displayOrder: idx,
        });
      });
    }

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
          create: resolvedImages,
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
        images: { orderBy: { displayOrder: "asc" } },
        variants: true,
      },
    });

    return NextResponse.json({ success: true, product: newProduct });
  } catch (error) {
    console.error("Create product error:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getSessionUser();
    if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const {
      id,
      title,
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
      frontImage,
      hoverImage,
      images,
      variants,
    } = body;

    if (!id) {
      return NextResponse.json({ error: "Product ID is required for editing" }, { status: 400 });
    }

    // Catalog validation: T-shirts only
    if (title || description || fit) {
      const prohibitedKeywords = [
        "hoodie", "sweatshirt", "jacket", "jeans", "trouser", "pant", "shoe", "sneaker", "slipper", "sandal", "cap", "hat", "bag", "sock", "watch"
      ];
      const textToCheck = `${title || ""} ${description || ""} ${fit || ""}`;
      for (const badWord of prohibitedKeywords) {
        const wordRegex = new RegExp(`\\b${badWord}s?\\b`, "i");
        if (wordRegex.test(textToCheck)) {
          return NextResponse.json(
            { error: `BUILD CLOTHING is strictly an exclusive T-shirt brand. Non-T-shirt products (${badWord}) are strictly prohibited.` },
            { status: 400 }
          );
        }
      }
    }

    // Resolve images
    const resolvedImages: Array<{ url: string; alt: string; isPrimary: boolean; displayOrder: number }> = [];
    if (frontImage) {
      resolvedImages.push({
        url: frontImage,
        alt: `${title || "Product"} Front View`,
        isPrimary: true,
        displayOrder: 0,
      });
    }
    if (hoverImage) {
      resolvedImages.push({
        url: hoverImage,
        alt: `${title || "Product"} Hover / Alternate Angle`,
        isPrimary: false,
        displayOrder: 1,
      });
    }
    if (resolvedImages.length === 0 && Array.isArray(images) && images.length > 0) {
      images.forEach((img: any, idx: number) => {
        resolvedImages.push({
          url: img.url,
          alt: img.alt || (idx === 0 ? "Front View" : "Hover View"),
          isPrimary: img.isPrimary !== undefined ? img.isPrimary : idx === 0,
          displayOrder: idx,
        });
      });
    }

    // Update product fields
    const updateData: any = {};
    if (title) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (fabric) updateData.fabric = fabric;
    if (gsm) updateData.gsm = parseInt(gsm);
    if (fit) updateData.fit = fit;
    if (printType !== undefined) updateData.printType = printType;
    if (printPlacement !== undefined) updateData.printPlacement = printPlacement;
    if (artwork !== undefined) updateData.artwork = artwork;
    if (basePrice !== undefined) updateData.basePrice = parseFloat(basePrice);
    if (originalPrice !== undefined) updateData.originalPrice = parseFloat(originalPrice);
    if (categoryId) updateData.categoryId = categoryId;
    if (collectionId !== undefined) updateData.collectionId = collectionId || null;
    if (isFeatured !== undefined) updateData.isFeatured = Boolean(isFeatured);
    if (isBestseller !== undefined) updateData.isBestseller = Boolean(isBestseller);
    if (isNewDrop !== undefined) updateData.isNewDrop = Boolean(isNewDrop);
    if (isLimited !== undefined) updateData.isLimited = Boolean(isLimited);

    // If new images provided, replace existing images
    if (resolvedImages.length > 0) {
      await prisma.productImage.deleteMany({
        where: { productId: id },
      });
      updateData.images = {
        create: resolvedImages,
      };
    }

    const updated = await prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        images: { orderBy: { displayOrder: "asc" } },
        variants: true,
        category: true,
        collection: true,
      },
    });

    return NextResponse.json({ success: true, product: updated });
  } catch (error: any) {
    console.error("Update product error:", error);
    return NextResponse.json({ error: error.message || "Failed to update product" }, { status: 500 });
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
