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
      className="rounded-2xl relative overflow-hidden"
      style={{ backgroundColor: '#f5f5f0' }}
    >
      {/* Tiled diamond pattern background from Bolt's map-bg.svg */}
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage: 'url(/assets/bolt/map-bg.svg)',
          backgroundSize: '200px',
          backgroundRepeat: 'repeat',
        }}
      />

      <div className="relative p-3">
        <svg viewBox="0 0 320 110" className="w-full block">
          {/* Faded full route — light green dashed */}
          <path
            ref={pathRef}
            d={ROUTE_PATH}
            stroke="#2DB757"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="6 4"
            opacity="0.3"
          />
          {/* Animated progress trail — solid green */}
          <path
            ref={progressRef}
            d={ROUTE_PATH}
            stroke="#2DB757"
            strokeWidth="4.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="0 1000"
          />
          {/* Destination pin */}
          <g>
            <circle cx="305" cy="35" r="9" fill="#2DB757" />
            <circle cx="305" cy="35" r="4" fill="#fff" />
            <line x1="305" y1="44" x2="305" y2="52" stroke="#2DB757" strokeWidth="2" />
          </g>
          {/* Start dot */}
          <circle cx="15" cy="90" r="5" fill="#2DB757" opacity="0.5" />
          {/* Car — top-view Bolt vehicle */}
          <g ref={carRef} transform="translate(0, 75)">
            <circle cx="15" cy="15" r="14" fill="rgba(45,183,87,0.15)">
              <animate attributeName="r" values="12;20;12" dur="1.5s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.3;0.05;0.3" dur="1.5s" repeatCount="indefinite" />
            </circle>
            <image
              href="/assets/bolt/GreenCircleCarTop.png"
              x="1"
              y="1"
              width="28"
              height="28"
            />
          </g>
        </svg>
      </div>
    </div>
  );
}
