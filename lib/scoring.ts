import type { RiderType } from "./results";

export type Scores = Record<RiderType, number>;

export function emptyScores(): Scores {
  return { premium: 0, bolt: 0, xl: 0, comfort: 0 };
}

export function addScore(scores: Scores, category: RiderType): Scores {
  return { ...scores, [category]: scores[category] + 1 };
}

export function topCategory(scores: Scores): RiderType {
  const entries = Object.entries(scores) as [RiderType, number][];
  entries.sort((a, b) => b[1] - a[1]);
  return entries[0][0];
}
