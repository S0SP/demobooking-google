// src/app/api/send-booking-emails/route.ts
// DEPRECATED: Email sending is now handled automatically via Razorpay webhooks.

import { NextResponse } from "next/server";

export async function POST(): Promise<NextResponse> {
  return NextResponse.json({ success: true, message: "This endpoint is deprecated. Emails are now sent via Razorpay webhooks." }, { status: 200 });
}
