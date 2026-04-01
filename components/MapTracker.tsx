"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface MapTrackerProps {
  currentStop: number; // 0-4
  animating: boolean;
  onAnimationDone: () => void;
}

const STOPS = [
  { label: "Circle", x: 20, y: 70 },
  { label: "Lapaz", x: 90, y: 30 },
  { label: "Kaneshie", x: 160, y: 28 },
  { label: "Osu", x: 230, y: 22 },
  { label: "Arrive", x: 295, y: 18 },
];

const ROAD_D =
  "M20 70 C50 65,65 35,90 30 S130 45,160 28 S200 15,230 22 S270 35,295 18";

function cubicEaseInOut(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export default function MapTracker({
  currentStop,
  animating,
  onAnimationDone,
}: MapTrackerProps) {
  const pathRef = useRef<SVGPathElement>(null);
  const [stopLengths, setStopLengths] = useState<number[]>([]);
  const [carPos, setCarPos] = useState<{ x: number; y: number }>({ x: 20, y: 70 });
  const [progressLength, setProgressLength] = useState(0);
  const totalLengthRef = useRef(0);

  // Pre-calculate stop positions on the path
  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;
    const total = path.getTotalLength();
    totalLengthRef.current = total;

    // Find the length at each stop by scanning the path
    const lengths: number[] = [];
    for (const stop of STOPS) {
      let bestLen = 0;
      let bestDist = Infinity;
      const steps = 500;
      for (let i = 0; i <= steps; i++) {
        const len = (i / steps) * total;
        const pt = path.getPointAtLength(len);
        const dist = Math.hypot(pt.x - stop.x, pt.y - stop.y);
        if (dist < bestDist) {
          bestDist = dist;
          bestLen = len;
        }
      }
      lengths.push(bestLen);
    }
    setStopLengths(lengths);

    // Set initial car position
    const startPt = path.getPointAtLength(lengths[0] || 0);
    setCarPos({ x: startPt.x, y: startPt.y });
    setProgressLength(lengths[0] || 0);
  }, []);

  // Animate car from one stop to the next
  const animateCar = useCallback(() => {
    const path = pathRef.current;
    if (!path || stopLengths.length === 0) return;

    const fromIdx = currentStop - 1;
    const toIdx = currentStop;
    if (fromIdx < 0 || toIdx >= stopLengths.length) {
      onAnimationDone();
      return;
    }

    const startLen = stopLengths[fromIdx];
    const endLen = stopLengths[toIdx];
    const duration = 900;
    let startTime: number | null = null;

    function step(timestamp: number) {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const t = Math.min(elapsed / duration, 1);
      const eased = cubicEaseInOut(t);
      const currentLen = startLen + (endLen - startLen) * eased;

      const pt = path!.getPointAtLength(currentLen);
      setCarPos({ x: pt.x, y: pt.y });
      setProgressLength(currentLen);

      if (t < 1) {
        requestAnimationFrame(step);
      } else {
        onAnimationDone();
      }
    }

    requestAnimationFrame(step);
  }, [currentStop, stopLengths, onAnimationDone]);

  useEffect(() => {
    if (animating) {
      animateCar();
    }
  }, [animating, animateCar]);

  const totalLength = totalLengthRef.current || 400;

  return (
    <div
      className="rounded-2xl p-3 mx-1"
      style={{ background: "rgba(0,0,0,0.1)" }}
    >
      <svg viewBox="0 0 310 100" className="w-full">
        {/* Road surface */}
        <path
          d={ROAD_D}
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="16"
          strokeLinecap="round"
          fill="none"
        />

        {/* Lane markings (dashed, animated) */}
        <path
          d={ROAD_D}
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="1.5"
          strokeDasharray="6 4"
          strokeLinecap="round"
          fill="none"
          className="road-dash-animate"
        />

        {/* Hidden path for measurement */}
        <path ref={pathRef} d={ROAD_D} fill="none" stroke="none" />

        {/* Progress trail */}
        <path
          d={ROAD_D}
          stroke="rgba(255,255,255,0.7)"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          strokeDasharray={`${progressLength} ${totalLength}`}
        />

        {/* Stop markers */}
        {STOPS.map((stop, i) => {
          const reached = stopLengths.length > 0 && progressLength >= (stopLengths[i] || 0) - 2;
          return (
            <g key={stop.label}>
              {/* Outer circle */}
              <circle
                cx={stop.x}
                cy={stop.y}
                r={8}
                fill="none"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="1.5"
                opacity={reached ? 1 : 0.3}
              />
              {/* Inner dot */}
              <circle
                cx={stop.x}
                cy={stop.y}
                r={3.5}
                fill={reached ? "white" : "rgba(255,255,255,0.3)"}
              />
              {/* Label */}
              <text
                x={stop.x}
                y={stop.y + (stop.y > 50 ? -14 : 18)}
                fill={reached ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.3)"}
                fontSize="7"
                textAnchor="middle"
                fontWeight={reached ? "600" : "400"}
              >
                {stop.label}
              </text>
            </g>
          );
        })}

        {/* Car */}
        <g>
          {/* Pulse ring */}
          <circle
            cx={carPos.x}
            cy={carPos.y}
            r="10"
            fill="rgba(255,255,255,0.15)"
            className="car-pulse"
          />
          {/* Car body */}
          <rect
            x={carPos.x - 8}
            y={carPos.y - 6}
            width="16"
            height="12"
            rx="4"
            fill="white"
          />
          <text
            x={carPos.x}
            y={carPos.y + 3}
            fontSize="9"
            textAnchor="middle"
          >
            🚗
          </text>
        </g>
      </svg>
    </div>
  );
}
