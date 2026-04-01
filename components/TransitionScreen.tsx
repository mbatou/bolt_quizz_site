"use client";

import { motion } from "framer-motion";

const STATUS_TEXTS = [
  "Picking up speed...",
  "Navigating Accra traffic...",
  "Taking the scenic route...",
  "Almost at your destination...",
];

const LOCATIONS = ["Lapaz traffic", "Kaneshie", "Osu, Oxford Street", "Almost there"];

interface TransitionScreenProps {
  nextIndex: number; // 1-4
}

export default function TransitionScreen({ nextIndex }: TransitionScreenProps) {
  const statusText = STATUS_TEXTS[nextIndex - 1] || STATUS_TEXTS[0];
  const nextLocation = LOCATIONS[nextIndex - 1] || LOCATIONS[0];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center"
    >
      <div className="text-5xl car-bounce mb-6">🚗</div>
      <p className="text-[18px] font-semibold mb-2">{statusText}</p>
      <p className="text-[13px]" style={{ color: "rgba(255,255,255,0.55)" }}>
        Next stop: {nextLocation}
      </p>
      <div className="shimmer-bar w-40 h-1.5 mt-6" />
    </motion.div>
  );
}
