import type { OnboardingData, Recommendation, CategoryScore } from '../types';
import { calcTransportScore, calcEnergyScore, calcFoodScore, calcShoppingScore, calcWasteScore } from './carbonCalc';
import { ALL_RECOMMENDATIONS } from '../data/recommendations';

// ─── Recommendation Engine ────────────────────────────────────────────────────

export function generateRecommendations(data: Partial<OnboardingData>): Recommendation[] {
  const scores = {
    transport: calcTransportScore(data),
    energy: calcEnergyScore(data),
    food: calcFoodScore(data),
    shopping: calcShoppingScore(data),
    waste: calcWasteScore(data),
  };

  // Sort categories by impact (worst first)
  const sortedCategories = (Object.keys(scores) as (keyof CategoryScore)[]).sort(
    (a, b) => scores[b] - scores[a]
  );

  // Score each recommendation: higher CO₂ saved & worse user category = higher priority
  const scored = ALL_RECOMMENDATIONS.map((rec) => {
    const categoryRank = sortedCategories.indexOf(rec.category);
    const categoryWeight = (5 - categoryRank) / 5; // 1.0 for worst category
    const co2Weight = rec.co2SavedKgPerYear / 600; // normalize to 0-1
    const difficultyPenalty = (rec.difficulty - 1) * 0.05; // slight penalty for hard tasks
    const score = categoryWeight * 0.6 + co2Weight * 0.4 - difficultyPenalty;
    return { rec, score };
  });

  // Sort by score desc, deduplicate categories (top 2 per category max)
  scored.sort((a, b) => b.score - a.score);

  const categoryCount: Record<string, number> = {};
  const selected: Recommendation[] = [];

  for (const { rec } of scored) {
    const count = categoryCount[rec.category] || 0;
    if (count < 2 && selected.length < 5) {
      selected.push({ ...rec, completed: false });
      categoryCount[rec.category] = count + 1;
    }
    if (selected.length >= 5) break;
  }

  return selected;
}
