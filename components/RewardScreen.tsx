"use client";

import { motion } from "framer-motion";
import type { RiderResult } from "@/lib/results";

interface RewardScreenProps {
  result: RiderResult;
  refCode: string;
  referralCount: number;
  onDone: () => void;
}

export default function RewardScreen({
  result,
  refCode,
  referralCount,
  onDone,
}: RewardScreenProps) {
  const shareUrl = `https://bolt.com.gh/rider?ref=${refCode}`;

  const inviteWhatsApp = () => {
    const text = `I just took the Bolt Ghana rider quiz and got a promo! 🚗\n\nTake the quiz and find out what kind of Bolt rider you are 👉 ${shareUrl}`;
    window.open(
      `https://wa.me/?text=${encodeURIComponent(text)}`,
      "_blank"
    );
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
        style={{ background: "rgba(255,255,255,0.12)" }}
      >
        <span className="text-3xl">🎁</span>
      </div>

      <p
        className="text-[11px] font-bold tracking-[0.2em] uppercase mb-2"
        style={{ color: "rgba(255,255,255,0.55)" }}
      >
        YOUR REWARD
      </p>

      <h2 className="text-[22px] font-bold mb-6">{result.reward}</h2>

      {/* Promo code box */}
      <div
        className="w-full max-w-xs py-4 rounded-2xl mb-6"
        style={{ border: "2px dashed rgba(255,255,255,0.35)" }}
      >
        <p className="text-[36px] font-bold tracking-wider font-mono">
          {result.code}
        </p>
      </div>

      {/* Referral progress */}
      <div className="w-full max-w-xs mb-8">
        <p className="text-[13px] mb-3" style={{ color: "rgba(255,255,255,0.55)" }}>
          Share with 3 friends to unlock a FREE ride
        </p>
        <div className="flex gap-2">
          {segments.map((i) => (
            <div
              key={i}
              className="flex-1 h-2 rounded-full transition-all duration-500"
              style={{
                background:
                  i < referralCount
                    ? "white"
                    : "rgba(255,255,255,0.2)",
              }}
            />
          ))}
        </div>
        <p
          className="text-[12px] mt-2"
          style={{ color: "rgba(255,255,255,0.35)" }}
        >
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
        style={{ background: "rgba(255,255,255,0.12)" }}
      >
        Done
      </button>
    </motion.div>
  );
}
