'use client';
import { useEffect, useRef, useState } from 'react';

interface MapTrackerProps {
  currentStop: number; // 0-7
  totalStops: number;  // 7
  isAnimating: boolean;
}

// 8 waypoints for 7 questions (start + 7 stops)
const ROUTE_PATH = "M15 90 L45 60 L75 75 L100 45 L130 65 L160 25 L190 70 L220 40 L250 60 L280 25 L305 35";
const WAYPOINTS = [
  { x: 15, y: 90 },
  { x: 75, y: 75 },
  { x: 100, y: 45 },
  { x: 160, y: 25 },
  { x: 190, y: 70 },
  { x: 220, y: 40 },
  { x: 250, y: 60 },
  { x: 305, y: 35 },
];

export default function MapTracker({ currentStop, totalStops, isAnimating }: MapTrackerProps) {
  const pathRef = useRef<SVGPathElement>(null);
  const progressRef = useRef<SVGPathElement>(null);
  const carRef = useRef<SVGGElement>(null);
  const [pathLength, setPathLength] = useState(0);
  const [stopLengths, setStopLengths] = useState<number[]>([]);

  useEffect(() => {
    if (!pathRef.current) return;
    const total = pathRef.current.getTotalLength();
    setPathLength(total);

    const lengths: number[] = [];
    for (const wp of WAYPOINTS) {
      let bestLen = 0;
      let bestDist = Infinity;
      for (let t = 0; t <= 500; t++) {
        const len = (t / 500) * total;
        const pt = pathRef.current.getPointAtLength(len);
        const d = Math.hypot(pt.x - wp.x, pt.y - wp.y);
        if (d < bestDist) {
          bestDist = d;
          bestLen = len;
        }
      }
      lengths.push(bestLen);
    }
    setStopLengths(lengths);
  }, []);

  useEffect(() => {
    if (!pathRef.current || !carRef.current || !progressRef.current || stopLengths.length === 0) return;

    const fromLen = stopLengths[Math.max(0, currentStop - 1)] || 0;
    const toLen = stopLengths[currentStop] || 0;
    const duration = 900;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      const ease = t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
      const currentLen = fromLen + (toLen - fromLen) * ease;
      const pt = pathRef.current!.getPointAtLength(currentLen);

      carRef.current!.setAttribute('transform', `translate(${pt.x - 15}, ${pt.y - 15})`);
      progressRef.current!.style.strokeDasharray = `${currentLen} ${pathLength}`;

      if (t < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [currentStop, stopLengths, pathLength]);

  return (
    <div
      className="rounded-2xl p-3 relative overflow-hidden"
      style={{
        backgroundColor: 'rgba(0,0,0,0.08)',
        backgroundImage:
          'repeating-linear-gradient(45deg, rgba(255,255,255,0.04) 0, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 22px), ' +
          'repeating-linear-gradient(-45deg, rgba(255,255,255,0.04) 0, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 22px)',
      }}
    >
      <svg viewBox="0 0 320 110" className="w-full block">
        {/* Faded full route */}
        <path
          ref={pathRef}
          d={ROUTE_PATH}
          stroke="rgba(255,255,255,0.18)"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="6 4"
        />
        {/* Animated progress trail */}
        <path
          ref={progressRef}
          d={ROUTE_PATH}
          stroke="#ffffff"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="0 1000"
        />
        {/* Destination pin */}
        <g>
          <circle cx="305" cy="35" r="9" fill="#fff" />
          <circle cx="305" cy="35" r="5" fill="#2DB757" />
          <line x1="305" y1="44" x2="305" y2="52" stroke="#fff" strokeWidth="2" />
        </g>
        {/* Car */}
        <g ref={carRef} transform="translate(0, 75)">
          <circle cx="15" cy="15" r="14" fill="rgba(255,255,255,0.2)">
            <animate attributeName="r" values="12;20;12" dur="1.5s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.3;0.05;0.3" dur="1.5s" repeatCount="indefinite" />
          </circle>
          <rect x="3" y="3" width="24" height="24" rx="7" fill="#fff" />
          <text x="15" y="20" textAnchor="middle" fontSize="14">{'\u{1F697}'}</text>
        </g>
      </svg>
    </div>
  );
}
