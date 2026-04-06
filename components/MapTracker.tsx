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

const CAR_SIZE = 28;
const CAR_CENTER = CAR_SIZE / 2;

/** Get the angle (in degrees) of the path at a given length */
function getAngleAtLength(path: SVGPathElement, len: number, totalLen: number): number {
  const delta = 0.5;
  const l1 = Math.max(0, len - delta);
  const l2 = Math.min(totalLen, len + delta);
  const p1 = path.getPointAtLength(l1);
  const p2 = path.getPointAtLength(l2);
  // atan2 gives angle from positive X axis; the car image points "up" by default,
  // so we offset by -90 to align forward direction with the path tangent
  return (Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180) / Math.PI;
}

export default function MapTracker({ currentStop, totalStops, isAnimating }: MapTrackerProps) {
  const pathRef = useRef<SVGPathElement>(null);
  const progressRef = useRef<SVGPathElement>(null);
  const carRef = useRef<SVGGElement>(null);
  const [pathLength, setPathLength] = useState(0);
  const [stopLengths, setStopLengths] = useState<number[]>([]);

  // Pre-calculate stop positions on mount and set initial car pose
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

    // Set initial car position and rotation at the start point
    if (carRef.current && lengths.length > 0) {
      const startLen = lengths[0];
      const pt = pathRef.current.getPointAtLength(startLen);
      const angle = getAngleAtLength(pathRef.current, startLen, total);
      carRef.current.setAttribute(
        'transform',
        `translate(${pt.x - CAR_CENTER}, ${pt.y - CAR_CENTER}) rotate(${angle}, ${CAR_CENTER}, ${CAR_CENTER})`
      );
    }
  }, []);

  // Animate car along path with rotation following the tangent
  useEffect(() => {
    if (!pathRef.current || !carRef.current || !progressRef.current || stopLengths.length === 0) return;

    const path = pathRef.current;
    const car = carRef.current;
    const progress = progressRef.current;
    const total = pathLength;

    const fromLen = stopLengths[Math.max(0, currentStop - 1)] || 0;
    const toLen = stopLengths[currentStop] || 0;
    const duration = 900;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      // Cubic ease-in-out
      const ease = t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
      const currentLen = fromLen + (toLen - fromLen) * ease;

      const pt = path.getPointAtLength(currentLen);
      const angle = getAngleAtLength(path, currentLen, total);

      car.setAttribute(
        'transform',
        `translate(${pt.x - CAR_CENTER}, ${pt.y - CAR_CENTER}) rotate(${angle}, ${CAR_CENTER}, ${CAR_CENTER})`
      );
      progress.style.strokeDasharray = `${currentLen} ${total}`;

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
        <svg viewBox="0 0 320 110" className="w-full block" overflow="visible">
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
          {/* Car — top-view Bolt vehicle, rotates to follow path */}
          <g ref={carRef} transform="translate(0, 75)">
            <circle cx={CAR_CENTER} cy={CAR_CENTER} r="14" fill="rgba(45,183,87,0.15)">
              <animate attributeName="r" values="12;20;12" dur="1.5s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.3;0.05;0.3" dur="1.5s" repeatCount="indefinite" />
            </circle>
            <image
              href="/assets/bolt/GreenCircleCarTop.png"
              x="0"
              y="0"
              width={CAR_SIZE}
              height={CAR_SIZE}
            />
          </g>
        </svg>
      </div>
    </div>
  );
}
