import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

let auditLogs = [
  {
    id: "log_1",
    action: "RESTOCK_ADJUSTMENT",
    entity: "ProductVariant",
    details: "Adjusted stock for NEO-WASH-XL (+10 units)",
    adminName: "BUILD Admin",
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    ip: "127.0.0.1",
  },
  {
    id: "log_2",
    action: "CMS_MARQUEE_UPDATE",
    entity: "MarqueeMessage",
    details: "Updated infinite marquee text on homepage",
    adminName: "BUILD Admin",
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    ip: "127.0.0.1",
  },
  {
    id: "log_3",
    action: "ORDER_STATUS_CHANGED",
    entity: "Order",
    details: "Advanced order BLD-2505-8821 to DELIVERED",
    adminName: "BUILD Admin",
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    ip: "127.0.0.1",
  },
  {
    id: "log_4",
    action: "COUPON_CREATED",
    entity: "Coupon",
    details: "Created discount code GENZ15 (15% off)",
    adminName: "BUILD Admin",
    timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    ip: "127.0.0.1",
  },
];

export async function GET() {
  return NextResponse.json({ logs: auditLogs });
}

