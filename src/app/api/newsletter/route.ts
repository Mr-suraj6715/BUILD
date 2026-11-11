import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Please enter a valid email address" }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: "You're on the list. Exclusive drop notifications & 10% coupon will arrive in your inbox.",
    });
  } catch {
    return NextResponse.json({ error: "Subscription failed" }, { status: 500 });
  }
}

