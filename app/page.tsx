'use client';

import { useState, useCallback, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import LandingScreen from '@/components/LandingScreen';
import QuizScreen from '@/components/QuizScreen';
import TransitionScreen from '@/components/TransitionScreen';
import ResultScreen from '@/components/ResultScreen';
import RewardScreen from '@/components/RewardScreen';
import { questions } from '@/lib/questions';
import { results, type RiderType } from '@/lib/results';
import { emptyScores, addScore, calculateRiderType, type Scores } from '@/lib/scoring';

type Screen = 'landing' | 'quiz' | 'transition' | 'result' | 'reward';

export default function Home() {
  const [screen, setScreen] = useState<Screen>('landing');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [scores, setScores] = useState<Scores>(emptyScores());
  const [riderType, setRiderType] = useState<RiderType | null>(null);
  const [refCode, setRefCode] = useState('');
  const [referredBy, setReferredBy] = useState<string | null>(null);
  const [referralCount, setReferralCount] = useState(0);

  // Read referral code from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');
    if (ref) setReferredBy(ref);
  }, []);

  const handleStart = useCallback(() => {
    setScreen('quiz');
  }, []);

  const handleAnswer = useCallback(
    (category: string) => {
      const newScores = addScore(scores, category as RiderType);
      setScores(newScores);

      if (questionIndex < questions.length - 1) {
        // Show transition, then next question
        setScreen('transition');
        setTimeout(() => {
          setQuestionIndex((prev) => prev + 1);
          setScreen('quiz');
        }, 1100);
      } else {
        // Quiz complete — calculate with Tricycle filter (Accra default)
        const type = calculateRiderType(newScores, true);
        setRiderType(type);
        setScreen('result');

        // Submit to API
        fetch('/api/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            scores: newScores,
            city: 'accra',
            referred_by: referredBy,
          }),
        })
          .then((r) => r.json())
          .then((data) => {
            if (data.ref_code) setRefCode(data.ref_code);
          })
          .catch(() => {
            setRefCode(Math.random().toString(36).substring(2, 10));
          });
      }
    },
    [scores, questionIndex, referredBy]
  );

  const handleClaim = useCallback(() => {
    setScreen('reward');
  }, []);

  const handleRetake = useCallback(() => {
    setScreen('landing');
    setQuestionIndex(0);
    setScores(emptyScores());
    setRiderType(null);
    setRefCode('');
    setReferralCount(0);
  }, []);

  const handleDone = useCallback(() => {
    setScreen('landing');
  }, []);

  const currentResult = riderType ? results[riderType] : null;

  return (
    <main className="min-h-[100dvh] max-w-md mx-auto w-full relative overflow-x-hidden">
      <AnimatePresence mode="wait">
        {screen === 'landing' && (
          <LandingScreen key="landing" onStart={handleStart} />
        )}

        {screen === 'quiz' && (
          <QuizScreen
            key={`quiz-${questionIndex}`}
            question={questions[questionIndex]}
            questionIndex={questionIndex}
            totalQuestions={questions.length}
            onAnswer={handleAnswer}
          />
        )}

        {screen === 'transition' && (
          <TransitionScreen
            key={`transition-${questionIndex}`}
            nextIndex={questionIndex + 1}
          />
        )}

        {screen === 'result' && currentResult && (
          <ResultScreen
            key="result"
            result={currentResult}
            refCode={refCode}
            onClaim={handleClaim}
            onRetake={handleRetake}
          />
        )}

        {screen === 'reward' && currentResult && (
          <RewardScreen
            key="reward"
            result={currentResult}
            refCode={refCode}
            referralCount={referralCount}
            onDone={handleDone}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
