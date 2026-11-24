import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [garments, options] = await Promise.all([
      prisma.studioGarment.findMany({
        where: { isActive: true },
        orderBy: { displayOrder: "asc" },
      }),
      prisma.studioOption.findMany({
        where: { isActive: true },
        orderBy: { displayOrder: "asc" },
      }),
    ]);

    return NextResponse.json({
      success: true,
      garments,
      options,
    });
  } catch (error) {
    console.error("Failed to fetch studio config:", error);
    return NextResponse.json(
      { error: "Failed to fetch custom studio configuration" },
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
    const { action, garment, option } = body;

    if (action === "update-garment" && garment?.id) {
      const updated = await prisma.studioGarment.update({
        where: { id: garment.id },
        data: {
          name: garment.name,
          fit: garment.fit,
          gsm: Number(garment.gsm),
          fabric: garment.fabric,
          basePrice: Number(garment.basePrice),
          description: garment.description,
          isActive: garment.isActive !== undefined ? Boolean(garment.isActive) : true,
          displayOrder: garment.displayOrder ? Number(garment.displayOrder) : undefined,
        },
      });
      return NextResponse.json({ success: true, item: updated });
    }

    if (action === "update-option" && option?.id) {
      const updated = await prisma.studioOption.update({
        where: { id: option.id },
        data: {
          name: option.name,
          extra: Number(option.extra),
          details: option.details,
          isActive: option.isActive !== undefined ? Boolean(option.isActive) : true,
        },
      });
      return NextResponse.json({ success: true, item: updated });
    }

    return NextResponse.json({ error: "Invalid action or payload" }, { status: 400 });
  } catch (error) {
    console.error("Studio update error:", error);
    return NextResponse.json({ error: "Failed to update studio option" }, { status: 500 });
  }
}
