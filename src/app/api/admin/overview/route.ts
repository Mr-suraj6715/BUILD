import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getSessionUser();
    if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Unauthorized: Admin access required" }, { status: 403 });
    }

    const [
      orders,
      totalCustomers,
      products,
      variants,
      categories,
    ] = await Promise.all([
      prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        include: { items: true },
      }),
      prisma.user.count({ where: { role: "CUSTOMER" } }),
      prisma.product.findMany({
        include: {
          category: true,
          variants: true,
        },
      }),
      prisma.productVariant.findMany({
        include: { product: true },
      }),
      prisma.category.findMany(),
    ]);

    // Calculate KPIs
    const totalOrders = orders.length;
    const paidOrders = orders.filter((o) => o.paymentStatus === "PAID" || o.status === "DELIVERED");
    const totalRevenue = paidOrders.reduce((acc, curr) => acc + curr.totalAmount, 0);
    const averageOrderValue = paidOrders.length > 0 ? Math.round(totalRevenue / paidOrders.length) : 0;
    const pendingOrders = orders.filter((o) => o.status === "PENDING" || o.status === "CONFIRMED").length;
    const deliveredOrders = orders.filter((o) => o.status === "DELIVERED").length;
    const lowStockVariants = variants.filter((v) => v.stock <= 5);
    const refundRequests = orders.filter((o) => o.status === "RETURN_REQUESTED").length;

    // Order status breakdown
    const statusCounts: Record<string, number> = {
      PENDING: 0,
      CONFIRMED: 0,
      PROCESSING: 0,
      SHIPPED: 0,
      DELIVERED: 0,
      CANCELLED: 0,
      RETURN_REQUESTED: 0,
    };
    orders.forEach((o) => {
      statusCounts[o.status] = (statusCounts[o.status] || 0) + 1;
    });

    // Recent 10 orders
    const recentOrders = orders.slice(0, 10);

    // Sales by Category / Color from actual order items
    const categoryRevenueMap: Record<string, number> = {};
    orders.forEach((o) => {
      if (o.paymentStatus === "PAID" || o.status === "DELIVERED") {
        o.items.forEach((item) => {
          const groupName = item.variantColor || "Core";
          categoryRevenueMap[groupName] = (categoryRevenueMap[groupName] || 0) + item.total;
        });
      }
    });

    // Daily Revenue (Last 7 Days) calculated from real database orders
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const now = new Date();
    const last7DaysMap: Record<string, { day: string; revenue: number; orders: number }> = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dayName = days[d.getDay()];
      const key = d.toISOString().split("T")[0];
      last7DaysMap[key] = { day: dayName, revenue: 0, orders: 0 };
    }
    orders.forEach((o) => {
      const orderDate = new Date(o.createdAt).toISOString().split("T")[0];
      if (last7DaysMap[orderDate]) {
        last7DaysMap[orderDate].orders += 1;
        if (o.paymentStatus === "PAID" || o.status === "DELIVERED") {
          last7DaysMap[orderDate].revenue += o.totalAmount;
        }
      }
    });
    const dailyRevenue = Object.values(last7DaysMap);

    // Bestselling products ranking calculated from real order items
    const productSalesMap: Record<string, { id: string; title: string; price: number; unitsSold: number; revenue: number }> = {};
    orders.forEach((o) => {
      o.items.forEach((item) => {
        if (!productSalesMap[item.productTitle]) {
          productSalesMap[item.productTitle] = {
            id: item.variantId || item.id,
            title: item.productTitle,
            price: item.unitPrice,
            unitsSold: 0,
            revenue: 0,
          };
        }
        productSalesMap[item.productTitle].unitsSold += item.quantity;
        productSalesMap[item.productTitle].revenue += item.total;
      });
    });
    const bestsellers = Object.values(productSalesMap).sort((a, b) => b.unitsSold - a.unitsSold).slice(0, 5);

    return NextResponse.json({
      kpis: {
        totalRevenue,
        totalOrders,
        totalCustomers,
        averageOrderValue,
        pendingOrders,
        deliveredOrders,
        lowStockCount: lowStockVariants.length,
        totalProducts: products.length,
        refundRequests,
      },
      statusCounts,
      recentOrders,
      dailyRevenue,
      bestsellers,
      categoryRevenue: Object.entries(categoryRevenueMap).map(([name, rev]) => ({ name, revenue: rev })),
      lowStockVariants: lowStockVariants.map((v) => ({
        id: v.id,
        productTitle: v.product.title,
        size: v.size,
        color: v.color,
        sku: v.sku,
        stock: v.stock,
      })),
      totalCategories: categories.length,
    });
  } catch (error) {
    console.error("Admin overview error:", error);
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 });
  }
}
