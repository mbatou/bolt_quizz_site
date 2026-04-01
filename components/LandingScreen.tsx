"use client";

import { motion } from "framer-motion";

interface LandingScreenProps {
  onStart: () => void;
}

function PreviewPath() {
  return (
    <svg
      viewBox="0 0 280 60"
      className="w-full max-w-[280px] mx-auto my-8"
      fill="none"
    >
      {/* Dashed road line */}
      <path
        d="M20 40 Q70 20 140 30 Q210 40 260 20"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="2"
        strokeDasharray="6 4"
      />
      {/* 5 stop dots */}
      {[
        { x: 20, y: 40 },
        { x: 80, y: 26 },
        { x: 140, y: 30 },
        { x: 200, y: 34 },
        { x: 260, y: 20 },
      ].map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r={i === 0 || i === 4 ? 6 : 4}
          fill={i === 0 || i === 4 ? "white" : "rgba(255,255,255,0.5)"}
        />
      ))}
      {/* Labels */}
      <text x="20" y="56" fill="rgba(255,255,255,0.55)" fontSize="9" textAnchor="middle">
        Start
      </text>
      <text x="260" y="12" fill="rgba(255,255,255,0.55)" fontSize="9" textAnchor="middle">
        Your type
      </text>
    </svg>
  );
}

export default function LandingScreen({ onStart }: LandingScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col justify-between min-h-[100dvh] px-6 py-12"
    >
      {/* Top content */}
      <div>
        <p className="text-xs font-semibold tracking-[0.2em] uppercase" style={{ color: "rgba(255,255,255,0.55)" }}>
          BOLT GHANA
        </p>
        <h1 className="text-[48px] font-bold leading-[1.05] mt-3">
          Move,
          <br />
          your way.
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
          5 real Accra moments. Your answers reveal what kind of Bolt rider you
          are.
        </p>

        <PreviewPath />
      </div>

      {/* Bottom CTA */}
      <div className="mt-auto">
        <p className="text-[13px] mb-4" style={{ color: "rgba(255,255,255,0.35)" }}>
          5 stops. 2 minutes. 1 truth about you.
        </p>
        <button
          onClick={onStart}
          className="w-full bg-white text-black font-semibold text-[16px] py-4 rounded-2xl active:scale-[0.98] transition-transform"
        >
          Start the ride &rarr;
        </button>
      </div>
    </motion.div>
  );
}
