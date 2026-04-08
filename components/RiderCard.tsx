'use client';
import Image from 'next/image';
import { useState } from 'react';
import { RiderResult } from '@/lib/results';

interface RiderCardProps {
  result: RiderResult;
}

export default function RiderCard({ result }: RiderCardProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      id="rider-card"
      className="relative overflow-hidden rounded-3xl border-2 border-white/20"
      style={{ backgroundColor: '#2A9C64' }}
    >
      <div className="px-6 pt-7 relative z-10">
        <p className="text-[13px] text-white/85 font-medium leading-tight">
          Your move:
        </p>
        <h3 className="text-[26px] font-extrabold text-black leading-[1.1] mt-0.5">
          {result.move}.
        </h3>
        <h2 className="text-[26px] font-extrabold text-white leading-[1.1]">
          {result.category}
        </h2>
      </div>

      <div className="text-center py-4">
        <div className="relative inline-block w-[180px] h-[140px]">
          {imgError ? (
            <div className="w-full h-full flex flex-col items-center justify-center bg-white/10 rounded-2xl">
              <span className="text-4xl mb-1">
                {result.type === 'basic' && '\u{1F697}'}
                {result.type === 'comfort' && '\u{1F698}'}
                {result.type === 'send' && '\u{1F4E6}'}
                {result.type === 'tricycle' && '\u{1F6FA}'}
              </span>
              <span className="text-[10px] text-white/50">{result.category}</span>
            </div>
          ) : (
            <Image
              src={result.asset}
              alt={result.category}
              fill
              sizes="180px"
              style={{
                objectFit: 'contain',
                filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.18))',
              }}
              priority
              onError={() => setImgError(true)}
            />
          )}
        </div>
      </div>

      <div className="px-6 pb-4">
        <p className="text-lg font-bold text-black leading-tight mb-4">
          {result.tagline}
        </p>
        <div className="flex items-center justify-between border-t border-white/20 pt-3.5">
          <Image src="/assets/bolt/Logo.png" alt="Bolt" width={50} height={18} style={{ objectFit: 'contain' }} />
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-white/70">Move your way</span>
            <span className="w-1 h-1 bg-white/50 rounded-full" />
            <span className="text-[10px] text-white/90 font-semibold">
              {result.category.replace('Bolt ', '')}
            </span>
          </div>
        </div>
      </div>

      {/* Contest hook — baked into the shareable image */}
      <div className="px-6 py-3 border-t border-white/10" style={{ backgroundColor: '#0C2C1C' }}>
        <p className="text-[10px] text-white/90 text-center leading-snug">
          Tag <span style={{ color: '#2A9C64' }} className="font-bold">@bolt_ghana</span> to win exciting prizes {'\u{1F381}'}
        </p>
      </div>
    </div>
  );
}
