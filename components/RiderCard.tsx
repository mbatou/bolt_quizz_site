"use client";

import type { RiderResult } from "@/lib/results";

interface RiderCardProps {
  result: RiderResult;
}

export default function RiderCard({ result }: RiderCardProps) {
  return (
    <div
      id="rider-card"
      className="bg-white rounded-[20px] p-6 w-full max-w-sm mx-auto text-center"
    >
      {/* Emoji */}
      <div className="text-[56px] leading-none mb-3 count-up">
        {result.emoji}
      </div>

      {/* Rider type label */}
      <p
        className="text-[11px] font-bold tracking-[0.15em] uppercase mb-1"
        style={{ color: "#2DB757" }}
      >
        {result.type}
      </p>

      {/* Persona name */}
      <h2 className="text-[34px] font-bold text-black leading-tight mb-2">
        {result.title}
      </h2>

      {/* Description */}
      <p className="text-[14px] text-gray-500 leading-relaxed mb-4">
        {result.description}
      </p>

      {/* Stat box */}
      <div
        className="rounded-xl px-4 py-3 flex items-center gap-2"
        style={{ background: "rgba(45,183,87,0.08)" }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          className="flex-shrink-0"
        >
          <rect x="1" y="9" width="3" height="6" rx="1" fill="#2DB757" />
          <rect x="6" y="5" width="3" height="10" rx="1" fill="#2DB757" />
          <rect x="11" y="1" width="3" height="14" rx="1" fill="#2DB757" />
        </svg>
        <p className="text-[12px] text-left" style={{ color: "#2DB757" }}>
          {result.stat}
        </p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-center gap-2 mt-5 pt-4 border-t border-gray-100">
        <div className="w-5 h-5 rounded-full bg-[#2DB757] flex items-center justify-center">
          <span className="text-white text-[10px] font-bold">B</span>
        </div>
        <span className="text-[11px] text-gray-400">bolt.com.gh/rider</span>
      </div>
    </div>
  );
}
