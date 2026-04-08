'use client';
import { useState } from 'react';
import { RiderResult } from '@/lib/results';
import { captureRiderCard } from '@/lib/captureCard';
import { shareToInstagramStories } from '@/lib/shareToInstagram';

interface ShareButtonsProps {
  result: RiderResult;
  refCode: string;
  onClaim: () => void;
}

export default function ShareButtons({ result, refCode, onClaim }: ShareButtonsProps) {
  const [isSharing, setIsSharing] = useState(false);

  const shareUrl = `https://bolt.com.gh/rider?ref=${refCode}`;

  const handleWhatsApp = () => {
    const text = `I\u2019m a ${result.move}! ${result.category} is my ride match.\n\nWhat\u2019s your move? Take the Bolt Ghana quiz: ${shareUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleInstagram = async () => {
    if (isSharing) return;
    setIsSharing(true);
    try {
      const blob = await captureRiderCard('rider-card', result);
      if (!blob) {
        alert('Could not capture the card. Please try again.');
        return;
      }
      await shareToInstagramStories(
        blob,
        'Image downloaded! Open Instagram, upload it to your Story, and tag @bolt_ghana!'
      );
    } finally {
      setIsSharing(false);
    }
  };

  const handleTwitter = () => {
    const text = `I\u2019m a ${result.move}! ${result.category} is my ride match. What\u2019s yours? Take the quiz:`;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`,
      '_blank'
    );
  };

  return (
    <div className="flex flex-col gap-2 w-full mt-6">
      {/* Primary: Instagram Stories */}
      <button
        onClick={handleInstagram}
        disabled={isSharing}
        className="w-full py-3.5 bg-white text-[#0C2C1C] font-semibold text-[15px] rounded-2xl flex items-center justify-center gap-2 active:scale-[0.97] transition-transform disabled:opacity-60"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <defs>
            <linearGradient id="ig-grad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FEDA77" />
              <stop offset="50%" stopColor="#F58529" />
              <stop offset="100%" stopColor="#DD2A7B" />
            </linearGradient>
          </defs>
          <rect x="2" y="2" width="20" height="20" rx="5" fill="url(#ig-grad)" />
          <circle cx="12" cy="12" r="4" fill="none" stroke="#fff" strokeWidth="2" />
          <circle cx="17.5" cy="6.5" r="1.2" fill="#fff" />
        </svg>
        {isSharing ? 'Preparing...' : 'Share to Instagram Stories'}
      </button>

      {/* Secondary: WhatsApp + X */}
      <div className="flex gap-2">
        <button
          onClick={handleWhatsApp}
          className="flex-1 py-3 rounded-2xl text-[13px] font-semibold flex items-center justify-center gap-1.5 active:scale-[0.97] transition-transform border border-white/20"
          style={{ background: 'rgba(255,255,255,0.12)' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#25D366">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          WhatsApp
        </button>
        <button
          onClick={handleTwitter}
          className="flex-1 py-3 rounded-2xl text-[13px] font-semibold flex items-center justify-center gap-1.5 active:scale-[0.97] transition-transform border border-white/20"
          style={{ background: 'rgba(255,255,255,0.12)' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          Post
        </button>
      </div>

      {/* Claim reward */}
      <button
        onClick={onClaim}
        className="w-full py-3.5 bg-white text-[#0C2C1C] font-semibold text-[15px] rounded-2xl active:scale-[0.97] transition-transform mt-1"
      >
        {'\u{1F381}'} Claim your reward
      </button>
    </div>
  );
}
