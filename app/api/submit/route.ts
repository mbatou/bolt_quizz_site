import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { supabase } from "@/lib/supabase";
import { results, type RiderType } from "@/lib/results";

const VALID_TYPES = new Set<string>(["premium", "bolt", "xl", "comfort"]);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { rider_type, scores, referred_by } = body;

    if (!rider_type || !VALID_TYPES.has(rider_type)) {
      return NextResponse.json(
        { error: "Invalid rider type" },
        { status: 400 }
      );
    }

    const refCode = nanoid(8);
    const promoCode = results[rider_type as RiderType].code;

    // Save quiz result
    const { error: insertError } = await supabase
      .from("quiz_results")
      .insert({
        rider_type,
        scores,
        ref_code: refCode,
        referred_by: referred_by || null,
        promo_code: promoCode,
      });

    if (insertError) {
      console.error("Insert error:", insertError);
      // Return fallback data even if DB insert fails
      return NextResponse.json({
        ref_code: refCode,
        promo_code: promoCode,
        rider_type,
      });
    }

    // Create referral progress entry
    await supabase
      .from("referral_progress")
      .insert({ ref_code: refCode, friends_count: 0, bonus_unlocked: false })
      .select();

    // If referred_by exists, update referrer's count
    if (referred_by) {
      const { data: progress } = await supabase
        .from("referral_progress")
        .select("friends_count")
        .eq("ref_code", referred_by)
        .single();

      if (progress) {
        const newCount = progress.friends_count + 1;
        await supabase
          .from("referral_progress")
          .update({
            friends_count: newCount,
            bonus_unlocked: newCount >= 3,
          })
          .eq("ref_code", referred_by);
      }
    }

    return NextResponse.json({
      ref_code: refCode,
      promo_code: promoCode,
      rider_type,
    });
  } catch (error) {
    console.error("Submit error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
