import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { nanoid } from 'nanoid';
import { calculateRiderType, type Scores } from '@/lib/scoring';
import { results } from '@/lib/results';

// Use service role key for server-side atomic operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: Request) {
  try {
    const body = await request.json() as {
      scores: Scores;
      city?: string;
      referred_by?: string;
    };

    const { scores, city = 'accra', referred_by } = body;
    const isInAccra = city.toLowerCase() === 'accra';
    const rider_type = calculateRiderType(scores, isInAccra);

    const ref_code = nanoid(8);

    // 1. Create quiz_results row
    const { data: quizResult, error: insertError } = await supabase
      .from('quiz_results')
      .insert({
        rider_type,
        scores,
        ref_code,
        referred_by: referred_by || null,
        city,
      })
      .select('id, ref_code')
      .single();

    if (insertError || !quizResult) {
      console.error('Failed to create quiz_result:', insertError);
      // Fallback: return result without DB persistence
      return NextResponse.json({
        ref_code,
        rider_type,
        promo_code: null,
        promo_code_status: 'error' as const,
      });
    }

    // 2. Atomically claim a promo code from the pool
    let promo_code: string | null = null;
    let promo_code_status: 'claimed' | 'exhausted' | 'error' = 'error';

    try {
      const { data: claimedCode, error: claimError } = await supabase
        .rpc('claim_promo_code', {
          target_category: rider_type,
          target_quiz_id: quizResult.id,
        });

      if (claimError) {
        console.error('Failed to claim promo code:', claimError);
        promo_code_status = 'error';
      } else {
        promo_code = claimedCode as string | null;
        promo_code_status = promo_code ? 'claimed' : 'exhausted';
      }
    } catch {
      // claim_promo_code function may not exist yet (pre-migration)
      console.error('claim_promo_code RPC not available');
      promo_code_status = 'error';
    }

    // 3. Link the claimed code back to quiz_results
    if (promo_code) {
      await supabase
        .from('quiz_results')
        .update({ promo_code_id: promo_code })
        .eq('id', quizResult.id);
    }

    // 4. Handle referral tracking
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

    // Create referral progress entry for this user
    await supabase
      .from('referral_progress')
      .insert({ ref_code: quizResult.ref_code, friends_count: 0, bonus_unlocked: false })
      .select();

    return NextResponse.json({
      ref_code: quizResult.ref_code,
      rider_type,
      promo_code,
      promo_code_status,
    });
  } catch (err) {
    console.error('Submit route error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
