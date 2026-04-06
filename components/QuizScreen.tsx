'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import MapTracker from './MapTracker';
import type { QuizQuestion } from '@/lib/questions';

interface QuizScreenProps {
  question: QuizQuestion;
  questionIndex: number;
  totalQuestions: number;
  onAnswer: (category: string) => void;
}

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

    // After 300ms, trigger the answer (car animation handles itself via currentStop change)
    setTimeout(() => {
      setMapAnimating(true);
      // Give the map animation time, then transition
      setTimeout(() => {
        setMapAnimating(false);
        onAnswer(question.options[idx].category);
      }, 950);
    }, 300);
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
        totalStops={totalQuestions}
        isAnimating={mapAnimating}
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
                    ? 'white'
                    : i < questionIndex
                    ? 'rgba(255,255,255,0.8)'
                    : 'rgba(255,255,255,0.25)',
              }}
            />
          ))}
        </div>
        <span className="text-[13px]" style={{ color: 'rgba(255,255,255,0.55)' }}>
          {questionIndex + 1}/{totalQuestions}
        </span>
      </div>

      {/* Question number label */}
      <p className="text-[11px] font-semibold tracking-widest uppercase mt-5 mb-2" style={{ color: 'rgba(255,255,255,0.45)' }}>
        {question.number}
      </p>

      {/* Question */}
      <h2 className="text-[22px] font-bold leading-tight mb-5">
        {question.title}
      </h2>

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
                  ? 'rgba(255,255,255,0.3)'
                  : 'rgba(255,255,255,0.1)',
                border: isSelected
                  ? '1.5px solid white'
                  : '1.5px solid rgba(255,255,255,0.15)',
                opacity: hasSelection && !isSelected ? 0.25 : 1,
              }}
            >
              <span className="text-[20px] flex-shrink-0">{opt.emoji}</span>
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
