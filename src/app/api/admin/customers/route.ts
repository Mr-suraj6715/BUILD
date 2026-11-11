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

    const customers = await prisma.user.findMany({
      where: { role: "CUSTOMER" },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true,
        orders: {
          select: {
            id: true,
            totalAmount: true,
            status: true,
            paymentStatus: true,
          },
        },
        addresses: {
          take: 1,
          select: {
            city: true,
            state: true,
            pincode: true,
          },
        },
      },
    });

    const formatted = customers.map((c) => {
      const paidOrders = c.orders.filter((o) => o.paymentStatus === "PAID" || o.status === "DELIVERED");
      const totalSpent = paidOrders.reduce((acc, curr) => acc + curr.totalAmount, 0);

      return {
        id: c.id,
        name: c.name,
        email: c.email,
        phone: c.phone || "N/A",
        ordersCount: c.orders.length,
        totalSpent,
        location: c.addresses[0] ? `${c.addresses[0].city}, ${c.addresses[0].state}` : "India",
        joinedDate: c.createdAt,
      };
    });

    return NextResponse.json({ customers: formatted });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 });
  }
}

