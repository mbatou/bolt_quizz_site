import { NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import { supabase } from '@/lib/supabase';
import { results, type RiderType } from '@/lib/results';
import { calculateRiderType, type Scores } from '@/lib/scoring';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { scores, city = 'accra', referred_by } = body as {
      scores: Scores;
      city?: string;
      referred_by?: string;
    };

    const isInAccra = city.toLowerCase() === 'accra';
    const rider_type = calculateRiderType(scores, isInAccra);
    const result = results[rider_type];

    const refCode = nanoid(8);
    const promoCode = result.promoCode;

    // Save quiz result
    const { error: insertError } = await supabase
      .from('quiz_results')
      .insert({
        rider_type,
        scores,
        ref_code: refCode,
        referred_by: referred_by || null,
        promo_code: promoCode,
        city,
      });

    if (insertError) {
      console.error('Insert error:', insertError);
      return NextResponse.json({
        ref_code: refCode,
        promo_code: promoCode,
        rider_type,
      });
    }

    // Create referral progress entry
    await supabase
      .from('referral_progress')
      .insert({ ref_code: refCode, friends_count: 0, bonus_unlocked: false })
      .select();

    // If referred_by exists, update referrer's count
    if (referred_by) {
      const { data: progress } = await supabase
        .from('referral_progress')
        .select('friends_count')
        .eq('ref_code', referred_by)
        .single();

      if (progress) {
        const newCount = progress.friends_count + 1;
        await supabase
          .from('referral_progress')
          .update({
            friends_count: newCount,
            bonus_unlocked: newCount >= 3,
          })
          .eq('ref_code', referred_by);
      }
    }

    return NextResponse.json({
      ref_code: refCode,
      promo_code: promoCode,
      rider_type,
    });
  } catch (error) {
    console.error('Submit error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
