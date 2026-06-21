import type { Badge, BadgeId, GamificationState, LevelInfo, UserLevel } from '../types';

// ─── Level Definitions ────────────────────────────────────────────────────────

export const LEVELS: LevelInfo[] = [
  { level: 'seedling', label: 'Seedling', minPoints: 0, maxPoints: 99, icon: '🌱', color: '#86efac' },
  { level: 'sprout', label: 'Sprout', minPoints: 100, maxPoints: 299, icon: '🌿', color: '#4ade80' },
  { level: 'sapling', label: 'Sapling', minPoints: 300, maxPoints: 699, icon: '🪴', color: '#22c55e' },
  { level: 'tree', label: 'Tree', minPoints: 700, maxPoints: 1499, icon: '🌳', color: '#16a34a' },
  { level: 'forest', label: 'Forest', minPoints: 1500, maxPoints: 2999, icon: '🌲', color: '#15803d' },
  { level: 'guardian', label: 'Earth Guardian', minPoints: 3000, maxPoints: Infinity, icon: '🌍', color: '#14532d' },
];

export const BADGE_DEFINITIONS: Badge[] = [
  {
    id: 'first_log',
    title: 'First Steps',
    description: 'Logged your very first green habit',
    icon: '👣',
    unlocked: false,
  },
  {
    id: 'streak_3',
    title: '3-Day Streak',
    description: 'Logged habits 3 days in a row',
    icon: '🔥',
    unlocked: false,
  },
  {
    id: 'streak_7',
    title: 'Week Warrior',
    description: 'Maintained a 7-day logging streak',
    icon: '⚡',
    unlocked: false,
  },
  {
    id: 'streak_30',
    title: 'Monthly Champion',
    description: 'Incredible! 30-day unbroken streak',
    icon: '👑',
    unlocked: false,
  },
  {
    id: 'co2_saver_10',
    title: 'Carbon Cutter',
    description: 'Saved your first 10 kg of CO₂',
    icon: '✂️',
    unlocked: false,
  },
  {
    id: 'co2_saver_50',
    title: 'Impact Maker',
    description: 'Saved 50 kg of CO₂ — that\'s a tree\'s worth!',
    icon: '🌳',
    unlocked: false,
  },
  {
    id: 'co2_saver_100',
    title: 'Climate Hero',
    description: 'Saved 100 kg of CO₂ — remarkable!',
    icon: '🦸',
    unlocked: false,
  },
  {
    id: 'onboarding_complete',
    title: 'Know Yourself',
    description: 'Completed your carbon footprint assessment',
    icon: '📊',
    unlocked: false,
  },
  {
    id: 'all_categories',
    title: 'All Rounder',
    description: 'Logged habits in all 5 categories',
    icon: '🌐',
    unlocked: false,
  },
  {
    id: 'recommendation_accepted',
    title: 'Action Taker',
    description: 'Marked your first AI recommendation as complete',
    icon: '✅',
    unlocked: false,
  },
  {
    id: 'top_reducer',
    title: 'Top Reducer',
    description: 'Reduced footprint by 20% from your starting score',
    icon: '📉',
    unlocked: false,
  },
];

// ─── Gamification Logic ───────────────────────────────────────────────────────

export function getLevelForPoints(points: number): UserLevel {
  const level = LEVELS.slice().reverse().find((l) => points >= l.minPoints);
  return level?.level ?? 'seedling';
}

export function getLevelInfo(level: UserLevel): LevelInfo {
  return LEVELS.find((l) => l.level === level) ?? LEVELS[0];
}

export function getLevelProgress(points: number): number {
  const level = LEVELS.find((l) => points >= l.minPoints && points <= l.maxPoints);
  // At max level (guardian) or no matching level — show 100%
  if (!level || level.maxPoints === Infinity) return 100;
  const range = level.maxPoints - level.minPoints;
  const progress = points - level.minPoints;
  return Math.round((progress / range) * 100);
}

export function checkBadgeUnlocks(
  state: GamificationState,
  categoriesLogged: Set<string>
): BadgeId[] {
  const newBadges: BadgeId[] = [];

  const alreadyUnlocked = new Set(
    state.badges.filter((b) => b.unlocked).map((b) => b.id)
  );

  const check = (id: BadgeId, condition: boolean) => {
    if (condition && !alreadyUnlocked.has(id)) newBadges.push(id);
  };

  const totalLogs = state.totalCo2Saved;

  check('first_log', totalLogs > 0);
  check('streak_3', state.streak >= 3);
  check('streak_7', state.streak >= 7);
  check('streak_30', state.streak >= 30);
  check('co2_saver_10', state.totalCo2Saved >= 10);
  check('co2_saver_50', state.totalCo2Saved >= 50);
  check('co2_saver_100', state.totalCo2Saved >= 100);
  check('all_categories', categoriesLogged.size >= 5);

  return newBadges;
}

export function calcPointsForLog(co2Saved: number, streak: number): number {
  const base = Math.round(co2Saved * 10);
  const streakBonus = streak >= 7 ? 20 : streak >= 3 ? 10 : 0;
  return base + streakBonus + 5; // +5 for showing up
}

export function updateStreak(lastLogDate: string | null, today: string): number {
  if (!lastLogDate) return 1;
  const last = new Date(lastLogDate);
  const now = new Date(today);
  const diffMs = now.getTime() - last.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 0; // Already logged today, no change
  if (diffDays === 1) return 1; // Continue streak
  return -1; // Streak broken
}
