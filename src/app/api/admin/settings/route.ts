import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

// In-memory or persisted store settings with sensible defaults
let storeSettings = {
  storeName: "BUILD CLOTHING CO.",
  tagline: "BUILT DIFFERENT • WEAR YOUR IDENTITY",
  currency: "INR (₹)",
  contactEmail: "buildclothing2026@gmail.com",
  contactPhone: "+91 98765 43210",
  studioAddress: "104, Fashion Avenue, Bandra West, Mumbai, Maharashtra 400050",
  instagramUrl: "https://www.instagram.com/build_clothing?utm_source=ig_web_button_share_sheet&knvt=ZDNlZDc0MzIxNw==",
  twitterUrl: "https://twitter.com/buildclothing",
  freeShippingThreshold: 1499,
  standardShippingFee: 99,
  codEnabled: true,
  taxRatePercent: 12,
  stockWarningThreshold: 5,
  returnWindowDays: 7,
};

export async function GET() {
  return NextResponse.json({ settings: storeSettings });
}

export async function PUT(request: Request) {
  try {
    const session = await getSessionUser();
    if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    storeSettings = { ...storeSettings, ...body };

    return NextResponse.json({ success: true, settings: storeSettings });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}

