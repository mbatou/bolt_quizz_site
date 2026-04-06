'use client';

import { motion } from 'framer-motion';

const STATUS_TEXTS = [
  'Picking up speed...',
  'Navigating Accra traffic...',
  'Taking the scenic route...',
  'Checking the map...',
  'Almost at your destination...',
  'Final stretch...',
];

interface TransitionScreenProps {
  nextIndex: number; // 1-6
}

export default function TransitionScreen({ nextIndex }: TransitionScreenProps) {
  const statusText = STATUS_TEXTS[(nextIndex - 1) % STATUS_TEXTS.length];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center"
    >
      <div className="text-5xl car-bounce mb-6">{'\u{1F697}'}</div>
      <p className="text-[18px] font-semibold mb-2">{statusText}</p>
      <p className="text-[13px]" style={{ color: 'rgba(255,255,255,0.55)' }}>
        Question {nextIndex + 1} coming up...
      </p>
      <div className="shimmer-bar w-40 h-1.5 mt-6" />
    </motion.div>
  );
}
