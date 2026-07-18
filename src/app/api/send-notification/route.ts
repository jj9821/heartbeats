/**
 * API Route: Send Push Notification (Stubbed temporarily)
 *
 * POST /api/send-notification
 */

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Stubbed during migration
    return NextResponse.json({ success: true, message: "Notification stubbed" });
  } catch (error) {
    console.error("Send notification error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send notification" },
      { status: 500 }
    );
  }
}
