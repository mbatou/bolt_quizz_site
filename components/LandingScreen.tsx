'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import BoltLogo from './BoltLogo';

interface LandingScreenProps {
  onStart: () => void;
}

export default function LandingScreen({ onStart }: LandingScreenProps) {
  const [heroError, setHeroError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col justify-between min-h-[100dvh] bg-[#2DB757] px-6 pt-9 pb-8"
    >
      {/* Top: Logo */}
      <div className="flex items-center gap-2 mb-9">
        <BoltLogo className="text-white" size={22} />
        <span className="text-[10px] text-white/50 tracking-widest uppercase">Ghana</span>
      </div>

      {/* Heading */}
      <div>
        <h1 className="text-[46px] font-extrabold text-[#1a1a1a] leading-none tracking-tight">
          Move,
        </h1>
        <h1 className="text-[46px] font-extrabold text-white leading-none tracking-tight mb-5">
          your way.
        </h1>
        <p className="text-sm text-white/85 leading-relaxed max-w-[280px]">
          Take this quick quiz to discover the Bolt category that matches your
          lifestyle, energy, and mood. Share your results for a chance to win
          exciting rewards!
        </p>
      </div>

      {/* Hero image with all 4 vehicles */}
      <div className="my-3 flex justify-center">
        {heroError ? (
          <div className="w-[320px] h-[140px] flex items-center justify-center bg-white/10 rounded-2xl">
            {/* TODO: Replace with /assets/bolt/hero.png */}
            <div className="flex gap-4 text-3xl">
              <span>{'\u{1F697}'}</span>
              <span>{'\u{1F698}'}</span>
              <span>{'\u{1F4E6}'}</span>
              <span>{'\u{1F6FA}'}</span>
            </div>
          </div>
        ) : (
          <Image
            src="/assets/bolt/hero.png"
            alt="Bolt vehicles"
            width={320}
            height={140}
            priority
            style={{ objectFit: 'contain' }}
            onError={() => setHeroError(true)}
          />
        )}
      </div>

      {/* CTA */}
      <div>
        <button
          onClick={onStart}
          className="w-full py-4 bg-white text-black font-semibold text-base rounded-2xl flex items-center justify-center gap-2 active:scale-[0.97] transition-transform"
        >
          Take the quiz
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M10 8l6 4-6 4z" fill="#1a1a1a" />
          </svg>
        </button>
        <p className="text-[11px] text-white/50 text-center mt-3.5">
          7 questions &middot; 90 seconds &middot; 1 perfect ride match
        </p>
      </div>
    </motion.div>
  );
}
