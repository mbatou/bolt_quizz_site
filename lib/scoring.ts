import { RiderType } from './results';

export type Scores = Record<RiderType, number>;

export function emptyScores(): Scores {
  return { basic: 0, comfort: 0, send: 0, tricycle: 0 };
}

export function addScore(scores: Scores, category: RiderType): Scores {
  return { ...scores, [category]: scores[category] + 1 };
}

/**
 * Calculate the rider type from quiz scores.
 * If the user is in Accra and Tricycle wins, fall back to the second-highest category.
 */
export function calculateRiderType(scores: Scores, isInAccra: boolean = true): RiderType {
  const sorted = (Object.entries(scores) as [RiderType, number][])
    .sort((a, b) => b[1] - a[1]);

  const winner = sorted[0][0];

  if (winner === 'tricycle' && isInAccra) {
    const runnerUp = sorted.find(([type]) => type !== 'tricycle');
    return runnerUp ? runnerUp[0] : 'basic';
  }

  return winner;
}

/**
 * Detect if user is likely in Accra.
 * For now, default to true since this is launching in Accra.
 * TODO: Wire up to a real geolocation API.
 */
export async function isUserInAccra(): Promise<boolean> {
  return true;
}
