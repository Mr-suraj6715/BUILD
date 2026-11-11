import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSessionUser();
    if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const variants = await prisma.productVariant.findMany({
      orderBy: { stock: "asc" },
      include: {
        product: {
          select: {
            id: true,
            title: true,
            slug: true,
            basePrice: true,
            images: { take: 1, orderBy: { displayOrder: "asc" } },
          },
        },
      },
    });

    return NextResponse.json({ variants });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch inventory" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getSessionUser();
    if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { variantId, stock } = await request.json();

    if (!variantId || stock === undefined) {
      return NextResponse.json({ error: "Variant ID and new stock required" }, { status: 400 });
    }

    const updated = await prisma.productVariant.update({
      where: { id: variantId },
      data: { stock: Math.max(0, parseInt(stock)) },
    });

    return NextResponse.json({ success: true, variant: updated });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update inventory" }, { status: 500 });
  }
}

