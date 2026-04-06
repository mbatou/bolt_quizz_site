'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const STATUS_TEXTS = [
  'Picking up speed...',
  'Navigating Accra traffic...',
  'Taking the scenic route...',
  'Checking the map...',
  'Almost at your destination...',
  'Final stretch...',
];

// Cycle through Bolt vehicle assets between transitions
const VEHICLE_ASSETS = [
  { src: '/assets/bolt/basic.png', alt: 'Bolt Basic' },
  { src: '/assets/bolt/comfort.png', alt: 'Bolt Comfort' },
  { src: '/assets/bolt/send.png', alt: 'Bolt Send' },
  { src: '/assets/bolt/tricycle.png', alt: 'Bolt Tricycle' },
  { src: '/assets/bolt/basic.png', alt: 'Bolt Basic' },
  { src: '/assets/bolt/comfort.png', alt: 'Bolt Comfort' },
];

interface TransitionScreenProps {
  nextIndex: number; // 1-6
}

export default function TransitionScreen({ nextIndex }: TransitionScreenProps) {
  const statusText = STATUS_TEXTS[(nextIndex - 1) % STATUS_TEXTS.length];
  const vehicle = VEHICLE_ASSETS[(nextIndex - 1) % VEHICLE_ASSETS.length];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center"
    >
      <div className="car-bounce mb-6">
        <Image
          src={vehicle.src}
          alt={vehicle.alt}
          width={80}
          height={60}
          style={{ objectFit: 'contain' }}
        />
      </div>
      <p className="text-[18px] font-semibold mb-2">{statusText}</p>
      <p className="text-[13px]" style={{ color: 'rgba(255,255,255,0.55)' }}>
        Question {nextIndex + 1} coming up...
      </p>
      <div className="shimmer-bar w-40 h-1.5 mt-6" />
    </motion.div>
  );
}
