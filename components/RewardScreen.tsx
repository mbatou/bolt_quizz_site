'use client';

import { motion } from 'framer-motion';
import type { RiderResult } from '@/lib/results';

type PromoStatus = 'pending' | 'claimed' | 'exhausted' | 'error';

interface RewardScreenProps {
  result: RiderResult;
  refCode: string;
  promoCode: string | null;
  promoStatus: PromoStatus;
  referralCount: number;
  onDone: () => void;
}

export default function RewardScreen({
  result,
  refCode,
  promoCode,
  promoStatus,
  referralCount,
  onDone,
}: RewardScreenProps) {
  const shareUrl = `https://bolt.com.gh/rider?ref=${refCode}`;

  const inviteWhatsApp = () => {
    const text = `I just took the Bolt Ghana quiz and got a promo! \u{1F697}\n\nTake the quiz and find out your Bolt move \u{1F449} ${shareUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const segments = [0, 1, 2];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center min-h-[100dvh] px-6 py-12 text-center"
    >
      {/* Gift icon */}
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
        style={{ background: 'rgba(255,255,255,0.12)' }}
      >
        <span className="text-3xl">{'\u{1F381}'}</span>
      </div>

      <p
        className="text-[11px] font-bold tracking-[0.2em] uppercase mb-2"
        style={{ color: 'rgba(255,255,255,0.55)' }}
      >
        YOUR REWARD
      </p>

      <h2 className="text-[22px] font-bold mb-6">{result.incentive.split('.')[0]}</h2>

      {/* Promo code box */}
      {promoStatus === 'claimed' && promoCode ? (
        <div
          className="w-full max-w-xs py-4 rounded-2xl mb-6"
          style={{ border: '2px dashed rgba(255,255,255,0.35)' }}
        >
          <p className="text-[36px] font-bold tracking-wider font-mono">
            {promoCode}
          </p>
          <p className="text-[10px] mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Single use &middot; Apply on your next Bolt ride
          </p>
        </div>
      ) : promoStatus === 'exhausted' ? (
        <div className="w-full max-w-xs rounded-2xl px-4 py-4 mb-6" style={{ backgroundColor: '#0C2C1C' }}>
          <p className="text-[14px] font-semibold mb-1">All codes claimed {'\u{1F389}'}</p>
          <p className="text-[12px] text-white/70 leading-snug">
            Follow{' '}
            <a href="https://instagram.com/bolt_ghana" target="_blank" rel="noopener noreferrer"
              className="font-semibold underline" style={{ color: '#2A9C64' }}>
              @bolt_ghana
            </a>{' '}
            for the next drop!
          </p>
        </div>
      ) : promoStatus === 'pending' ? (
        <div className="w-full max-w-xs rounded-2xl px-4 py-6 mb-6" style={{ backgroundColor: '#0C2C1C' }}>
          <div className="shimmer-bar w-3/4 h-8 mx-auto" />
          <p className="text-[10px] text-white/50 mt-2">Loading your code...</p>
        </div>
      ) : (
        <div className="w-full max-w-xs rounded-2xl px-4 py-4 mb-6" style={{ backgroundColor: '#0C2C1C' }}>
          <p className="text-[12px] font-semibold mb-1">Couldn&apos;t load your code</p>
          <p className="text-[11px] text-white/70">
            DM <a href="https://instagram.com/bolt_ghana" target="_blank" rel="noopener noreferrer"
              className="font-semibold underline" style={{ color: '#2A9C64' }}>@bolt_ghana</a>{' '}
            with ref <span className="font-mono">{refCode}</span>
          </p>
        </div>
      )}

      {/* Referral progress */}
      <div className="w-full max-w-xs mb-8">
        <p className="text-[13px] mb-3" style={{ color: 'rgba(255,255,255,0.55)' }}>
          Share with 3 friends to unlock a FREE ride
        </p>
        <div className="flex gap-2">
          {segments.map((i) => (
            <div
              key={i}
              className="flex-1 h-2 rounded-full transition-all duration-500"
              style={{
                background: i < referralCount ? 'white' : 'rgba(255,255,255,0.2)',
              }}
            />
          ))}
        </div>
        <p className="text-[12px] mt-2" style={{ color: 'rgba(255,255,255,0.35)' }}>
          {referralCount}/3 friends invited
        </p>
      </div>

      {/* WhatsApp invite CTA */}
      <button
        onClick={inviteWhatsApp}
        className="w-full max-w-xs bg-white text-black font-semibold text-[15px] py-3.5 rounded-2xl active:scale-[0.98] transition-transform mb-3"
      >
        Invite friends via WhatsApp
      </button>

      {/* Done button */}
      <button
        onClick={onDone}
        className="w-full max-w-xs font-semibold text-[14px] py-3 rounded-2xl active:scale-[0.98] transition-transform"
        style={{ background: 'rgba(255,255,255,0.12)' }}
      >
        Done
      </button>
    </motion.div>
  );
}
