'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface LandingScreenProps {
  onStart: () => void;
}

export default function LandingScreen({ onStart }: LandingScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col justify-between min-h-[100dvh] bg-[#2A9C64] px-6 pt-9 pb-8"
    >
      {/* Top: Official Bolt logo */}
      <div className="flex items-center gap-2.5 mb-9">
        <Image
          src="/assets/bolt/Logo.png"
          alt="Bolt"
          width={60}
          height={22}
          priority
          style={{ objectFit: 'contain' }}
        />
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

      {/* Hero — show all 4 vehicle assets in a row, aligned at bottom */}
      <div className="my-4 flex items-end justify-center gap-1">
        {[
          { src: '/assets/bolt/basic.png', alt: 'Bolt Basic' },
          { src: '/assets/bolt/comfort.png', alt: 'Bolt Comfort' },
          { src: '/assets/bolt/send.png', alt: 'Bolt Send' },
          { src: '/assets/bolt/tricycle.png', alt: 'Bolt Tricycle' },
        ].map((v, i) => (
          <motion.div
            key={v.alt}
            className="w-[80px] h-[65px] relative flex items-end justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.1, duration: 0.4 }}
          >
            <Image
              src={v.src}
              alt={v.alt}
              width={80}
              height={65}
              style={{ objectFit: 'contain', objectPosition: 'bottom' }}
              priority
            />
          </motion.div>
        ))}
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
        <p className="text-[9px] text-white/30 text-center mt-4">
          Built by{' '}
          <a href="https://www.lupandu.org" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
            Lupandu
          </a>
        </p>
      </div>
    </motion.div>
  );
}
