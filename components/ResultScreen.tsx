'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import RiderCard from './RiderCard';
import ShareButtons from './ShareButtons';
import type { RiderResult } from '@/lib/results';
import { TRICYCLE_DISCLAIMER } from '@/lib/results';

interface ResultScreenProps {
  result: RiderResult;
  refCode: string;
  onClaim: () => void;
  onRetake: () => void;
}

const CONFETTI_COLORS = ['#fff', '#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1'];

function Confetti() {
  const pieces = Array.from({ length: 35 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    duration: `${1.5 + Math.random() * 2}s`,
    delay: `${Math.random() * 0.5}s`,
    size: 6 + Math.random() * 6,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {pieces.map((p) => (
        <div
          key={p.id}
          className="confetti-piece"
          style={{
            '--left': p.left,
            '--duration': p.duration,
            '--delay': p.delay,
            left: p.left,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            animationDuration: p.duration,
            animationDelay: p.delay,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

export default function ResultScreen({
  result,
  refCode,
  onClaim,
  onRetake,
}: ResultScreenProps) {
  const [phase, setPhase] = useState<'interstitial' | 'reveal'>('interstitial');

  useEffect(() => {
    const timer = setTimeout(() => setPhase('reveal'), 1600);
    return () => clearTimeout(timer);
  }, []);

  if (phase === 'interstitial') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center min-h-[100dvh] px-6 text-center"
      >
        <div className="text-5xl mb-4">{'\u{1F3C1}'}</div>
        <h2 className="text-[30px] font-bold mb-2">Ride complete!</h2>
        <p className="text-[14px]" style={{ color: 'rgba(255,255,255,0.55)' }}>
          Calculating your Bolt move...
        </p>
        <div className="shimmer-bar w-32 h-1.5 mt-6" />
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center min-h-[100dvh] px-5 py-10"
    >
      <Confetti />

      <p className="text-[13px] mb-1" style={{ color: 'rgba(255,255,255,0.55)' }}>
        Your result is in!
      </p>
      <p className="text-[15px] font-semibold mb-6">{result.category}</p>

      {/* Rider Card with spring animation */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{
          type: 'spring',
          stiffness: 200,
          damping: 15,
          delay: 0.2,
        }}
        className="w-full"
      >
        <RiderCard result={result} />
      </motion.div>

      {/* Tricycle disclaimer */}
      {result.type === 'tricycle' && (
        <div className="mt-3 bg-white/10 rounded-xl px-4 py-2.5 w-full">
          <p className="text-[11px] text-white/80 leading-snug">
            {'\u{1F4A1}'} {TRICYCLE_DISCLAIMER}
          </p>
        </div>
      )}

      {/* More ways to move incentive */}
      <div className="mt-3.5 rounded-2xl px-4 py-3.5 w-full" style={{ background: 'rgba(0,0,0,0.12)' }}>
        <p className="text-[10px] text-white/50 tracking-[2px] uppercase mb-1.5">
          More ways to move
        </p>
        <p className="text-[13px] text-white leading-snug">
          {result.incentive}
        </p>
      </div>

      {/* Share buttons */}
      <ShareButtons result={result} refCode={refCode} onClaim={onClaim} />

      {/* Retake link */}
      <button
        onClick={onRetake}
        className="mt-6 text-[13px] underline underline-offset-4"
        style={{ color: 'rgba(255,255,255,0.55)' }}
      >
        Retake the quiz
      </button>
    </motion.div>
  );
}
