/**
 * API Route: Pair two users
 *
 * POST /api/pair
 * Body: { inviteCode: string }
 *
 * Looks up the user by invite code, validates, and pairs both users using Supabase.
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabaseServer";

export async function POST(request: NextRequest) {
  try {
    const { inviteCode } = await request.json();

    if (!inviteCode || inviteCode.length !== 6) {
      return NextResponse.json(
        { success: false, error: "Invalid invite code" },
        { status: 400 }
      );
    }

    // Get the current user's UID from the request header
    const authHeader = request.headers.get("x-user-uid");
    if (!authHeader) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const supabase = await createClient();

    // Find user with this invite code
    const { data: partnerData, error: findErr } = await supabase
      .from("users")
      .select("id, name, partner_id")
      .eq("invite_code", inviteCode.toUpperCase())
      .maybeSingle();

    if (findErr || !partnerData) {
      return NextResponse.json(
        { success: false, error: "No user found with this code" },
        { status: 404 }
      );
    }

    // Can't pair with yourself
    if (partnerData.id === authHeader) {
      return NextResponse.json(
        { success: false, error: "You can't pair with yourself!" },
        { status: 400 }
      );
    }

    // Check if partner is already paired
    if (partnerData.partner_id) {
      return NextResponse.json(
        { success: false, error: "This person is already paired with someone" },
        { status: 400 }
      );
    }

    // Check if current user is already paired
    const { data: currentUserData, error: curErr } = await supabase
      .from("users")
      .select("partner_id")
      .eq("id", authHeader)
      .single();

    if (curErr || !currentUserData) {
      return NextResponse.json(
        { success: false, error: "Current user profile not found" },
        { status: 404 }
      );
    }

    if (currentUserData.partner_id) {
      return NextResponse.json(
        { success: false, error: "You are already paired with someone" },
        { status: 400 }
      );
    }

    // Pair both users
    const { error: err1 } = await supabase
      .from("users")
      .update({ partner_id: partnerData.id })
      .eq("id", authHeader);

    if (err1) throw err1;

    const { error: err2 } = await supabase
      .from("users")
      .update({ partner_id: authHeader })
      .eq("id", partnerData.id);

    if (err2) throw err2;

    return NextResponse.json({
      success: true,
      partnerName: partnerData.name,
    });
  } catch (error) {
    console.error("Pairing error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to pair" },
      { status: 500 }
    );
  }
}
