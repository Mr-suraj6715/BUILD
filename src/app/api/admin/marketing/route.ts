import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

let campaignList = [
  {
    id: "camp_1",
    name: "CYBER ARCHIVE DROP 009 VIP EARLY ACCESS",
    type: "EMAIL_BLAST",
    recipientCount: 428,
    status: "SCHEDULED",
    scheduledAt: "2026-11-15T18:00:00.000Z",
    discountCode: "BUILD10",
  },
  {
    id: "camp_2",
    name: "MONSOON HEAVYWEIGHT OVERSIZED TEE CAPSULE",
    type: "VIP_SMS",
    recipientCount: 310,
    status: "SENT",
    scheduledAt: "2026-11-01T12:00:00.000Z",
    discountCode: "GENZ15",
  },
];

let subscribers = [
  { id: "sub_1", email: "aarav.streetwear@gmail.com", joinedAt: "2026-11-08", source: "Drop Countdown Modal" },
  { id: "sub_2", email: "rhea.kapoor@outlook.com", joinedAt: "2026-11-07", source: "Footer Subscription" },
  { id: "sub_3", email: "dev.sharma@gmail.com", joinedAt: "2026-11-05", source: "VIP Modal" },
  { id: "sub_4", email: "kunal.designs@yahoo.in", joinedAt: "2026-11-02", source: "Footer Subscription" },
];

export async function GET() {
  return NextResponse.json({ campaigns: campaignList, subscribers });
}

export async function POST(request: Request) {
  try {
    const session = await getSessionUser();
    if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { name, type, discountCode } = await request.json();
    if (!name) return NextResponse.json({ error: "Campaign name required" }, { status: 400 });

    const newCamp = {
      id: `camp_${Date.now()}`,
      name,
      type: type || "EMAIL_BLAST",
      recipientCount: subscribers.length + 150,
      status: "SENT",
      scheduledAt: new Date().toISOString(),
      discountCode: discountCode || "BUILD10",
    };

    campaignList.unshift(newCamp);
    return NextResponse.json({ success: true, campaign: newCamp });
  } catch (error) {
    return NextResponse.json({ error: "Failed to dispatch campaign" }, { status: 500 });
  }
}

