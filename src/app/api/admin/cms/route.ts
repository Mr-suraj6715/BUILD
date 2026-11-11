import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  try {
    const [announcements, marquees, dropCountdown] = await Promise.all([
      prisma.announcement.findMany({ orderBy: { priority: "asc" } }),
      prisma.marqueeMessage.findMany(),
      prisma.dropCountdown.findFirst({ where: { isActive: true } }),
    ]);

    return NextResponse.json({
      announcements,
      marquees,
      dropCountdown,
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch CMS data" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSessionUser();
    if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { type, payload } = await request.json();

    if (type === "ANNOUNCEMENT") {
      const { text, link, priority } = payload;
      const created = await prisma.announcement.create({
        data: { text, link, priority: priority || 1 },
      });
      return NextResponse.json({ success: true, item: created });
    }

    if (type === "MARQUEE") {
      const { text } = payload;
      let marquee = await prisma.marqueeMessage.findFirst();
      if (marquee) {
        marquee = await prisma.marqueeMessage.update({
          where: { id: marquee.id },
          data: { text },
        });
      } else {
        marquee = await prisma.marqueeMessage.create({
          data: { text },
        });
      }
      return NextResponse.json({ success: true, item: marquee });
    }

    if (type === "DROP_COUNTDOWN") {
      const { title, subtitle, description, targetDate, imageUrl, badge } = payload;
      let drop = await prisma.dropCountdown.findFirst();
      if (drop) {
        drop = await prisma.dropCountdown.update({
          where: { id: drop.id },
          data: {
            title,
            subtitle,
            description,
            targetDate: new Date(targetDate),
            imageUrl,
            badge: badge || "NEXT DROP",
            isActive: true,
          },
        });
      } else {
        drop = await prisma.dropCountdown.create({
          data: {
            title,
            subtitle,
            description,
            targetDate: new Date(targetDate),
            imageUrl,
            badge: badge || "NEXT DROP",
            isActive: true,
          },
        });
      }
      return NextResponse.json({ success: true, item: drop });
    }

    return NextResponse.json({ error: "Invalid CMS type" }, { status: 400 });
  } catch (error) {
    console.error("CMS update error:", error);
    return NextResponse.json({ error: "Failed to update CMS" }, { status: 500 });
  }
}

