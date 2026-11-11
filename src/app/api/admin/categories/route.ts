import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [categories, collections] = await Promise.all([
      prisma.category.findMany({
        include: { _count: { select: { products: true } } },
        orderBy: { name: "asc" },
      }),
      prisma.collection.findMany({
        include: { _count: { select: { products: true } } },
        orderBy: { name: "asc" },
      }),
    ]);

    return NextResponse.json({ categories, collections });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSessionUser();
    if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { type, name, description, image, badge, isFeatured } = await request.json();

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    // STRICT T-SHIRT BRAND RESTRICTION
    const prohibitedCategories = [
      "hoodie", "sweatshirt", "jacket", "jeans", "trouser", "pant", "short",
      "shoe", "sneaker", "slipper", "sandal", "cap", "hat", "bag", "sock", "watch"
    ];
    for (const p of prohibitedCategories) {
      if (name.toLowerCase().includes(p)) {
        return NextResponse.json(
          { error: `BUILD CLOTHING is strictly an exclusive T-shirt brand. Categories or capsules for '${p}' are prohibited.` },
          { status: 400 }
        );
      }
    }

    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    if (type === "COLLECTION") {
      const collection = await prisma.collection.create({
        data: {
          name,
          slug,
          description: description || null,
          image: image || "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1000&q=80",
          badge: badge || "FEATURED CAPSULE",
          isFeatured: isFeatured ?? true,
        },
      });
      return NextResponse.json({ success: true, item: collection });
    } else {
      const category = await prisma.category.create({
        data: {
          name,
          slug,
          description: description || null,
          image: image || "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80",
        },
      });
      return NextResponse.json({ success: true, item: category });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create" }, { status: 500 });
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
    const type = searchParams.get("type");

    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    if (type === "COLLECTION") {
      await prisma.collection.delete({ where: { id } });
    } else {
      await prisma.category.delete({ where: { id } });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}

