"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import MapTracker from "./MapTracker";
import type { QuizQuestion } from "@/lib/questions";

interface QuizScreenProps {
  question: QuizQuestion;
  questionIndex: number;
  totalQuestions: number;
  onAnswer: (category: string) => void;
}

const LOCATION_LABELS = [
  "Circle, Accra",
  "Lapaz traffic",
  "Kaneshie",
  "Osu, Oxford Street",
  "Almost there",
];

export default function QuizScreen({
  question,
  questionIndex,
  totalQuestions,
  onAnswer,
}: QuizScreenProps) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [mapAnimating, setMapAnimating] = useState(false);

  const handleSelect = (idx: number) => {
    if (selectedIdx !== null) return;
    setSelectedIdx(idx);

    // After 300ms, start car animation
    setTimeout(() => {
      setMapAnimating(true);
    }, 300);
  };

  const handleMapDone = () => {
    setMapAnimating(false);
    const cat = question.options[selectedIdx!].category;
    onAnswer(cat);
  };

  return (
    <motion.div
      key={`q-${questionIndex}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.35 }}
      className="flex flex-col min-h-[100dvh] px-4 pt-4 pb-8"
    >
      {/* Map tracker */}
      <MapTracker
        currentStop={mapAnimating ? questionIndex + 1 : questionIndex}
        animating={mapAnimating}
        onAnimationDone={handleMapDone}
      />

      {/* Progress dots */}
      <div className="flex items-center justify-between mt-4 px-1">
        <div className="flex items-center gap-1.5">
          {Array.from({ length: totalQuestions }).map((_, i) => (
            <div
              key={i}
              className="h-2 rounded-full transition-all duration-300"
              style={{
                width: i === questionIndex ? 22 : 8,
                background:
                  i === questionIndex
                    ? "white"
                    : i < questionIndex
                    ? "rgba(255,255,255,0.8)"
                    : "rgba(255,255,255,0.25)",
              }}
            />
          ))}
        </div>
        <span className="text-[13px]" style={{ color: "rgba(255,255,255,0.55)" }}>
          {questionIndex + 1}/{totalQuestions}
        </span>
      </div>

      {/* Location pill */}
      <div className="mt-5 mb-3">
        <span
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium"
          style={{ background: "rgba(255,255,255,0.12)" }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M6 1C4.067 1 2.5 2.567 2.5 4.5C2.5 7.25 6 11 6 11s3.5-3.75 3.5-6.5C9.5 2.567 7.933 1 6 1z"
              fill="white"
            />
            <circle cx="6" cy="4.5" r="1.5" fill="#2DB757" />
          </svg>
          {LOCATION_LABELS[questionIndex]}
        </span>
      </div>

      {/* Question */}
      <h2 className="text-[22px] font-bold leading-tight mb-1">
        {question.title}
      </h2>
      <p className="text-[13px] mb-5" style={{ color: "rgba(255,255,255,0.35)" }}>
        {question.subtitle}
      </p>

      {/* Options */}
      <div className="flex flex-col gap-3">
        {question.options.map((opt, i) => {
          const isSelected = selectedIdx === i;
          const hasSelection = selectedIdx !== null;

          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={hasSelection}
              className="flex items-center gap-3 px-4 py-3.5 rounded-[14px] text-left transition-all duration-200"
              style={{
                background: isSelected
                  ? "rgba(255,255,255,0.3)"
                  : "rgba(255,255,255,0.1)",
                border: isSelected
                  ? "1.5px solid white"
                  : "1.5px solid rgba(255,255,255,0.15)",
                opacity: hasSelection && !isSelected ? 0.25 : 1,
              }}
            >
              <span className="text-[20px] flex-shrink-0">{opt.icon}</span>
              <span className="text-[14px] font-medium flex-1">{opt.text}</span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                className="flex-shrink-0 opacity-40"
              >
                <path
                  d="M6 4l4 4-4 4"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}
