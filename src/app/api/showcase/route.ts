import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const showcase = await prisma.homepageShowcase.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: "asc" },
    });

    return NextResponse.json({
      success: true,
      showcase,
    });
  } catch (error) {
    console.error("Failed to fetch showcase:", error);
    return NextResponse.json(
      { error: "Failed to fetch homepage showcase items" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getSessionUser();
    if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const { item } = body;

    if (!item?.id) {
      return NextResponse.json({ error: "Showcase item ID is required" }, { status: 400 });
    }

    const updated = await prisma.homepageShowcase.update({
      where: { id: item.id },
      data: {
        name: item.name,
        price: Number(item.price),
        originalPrice: Number(item.originalPrice),
        description: item.description,
        campaignImg: item.campaignImg,
        frontImg: item.frontImg,
        backImg: item.backImg,
        hex: item.hex,
        isActive: item.isActive !== undefined ? Boolean(item.isActive) : true,
      },
    });

    return NextResponse.json({ success: true, item: updated });
  } catch (error) {
    console.error("Showcase update error:", error);
    return NextResponse.json({ error: "Failed to update showcase item" }, { status: 500 });
  }
}
