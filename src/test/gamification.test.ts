import { describe, it, expect } from 'vitest';
import {
  getLevelForPoints,
  getLevelInfo,
  getLevelProgress,
  calcPointsForLog,
  updateStreak,
  checkBadgeUnlocks,
  LEVELS,
  BADGE_DEFINITIONS,
} from '../utils/gamification';
import type { GamificationState } from '../types';

// ─── Level Tests ──────────────────────────────────────────────────────────────

describe('getLevelForPoints', () => {
  it('returns seedling for 0 points', () => {
    expect(getLevelForPoints(0)).toBe('seedling');
  });

  it('returns sprout for 100 points', () => {
    expect(getLevelForPoints(100)).toBe('sprout');
  });

  it('returns sapling for 300 points', () => {
    expect(getLevelForPoints(300)).toBe('sapling');
  });

  it('returns tree for 700 points', () => {
    expect(getLevelForPoints(700)).toBe('tree');
  });

  it('returns forest for 1500 points', () => {
    expect(getLevelForPoints(1500)).toBe('forest');
  });

  it('returns guardian for 3000+ points', () => {
    expect(getLevelForPoints(3000)).toBe('guardian');
    expect(getLevelForPoints(99999)).toBe('guardian');
  });

  it('stays within valid levels for any input', () => {
    const validLevels = LEVELS.map((l) => l.level);
    for (const points of [0, 50, 99, 100, 299, 300, 699, 700, 1499, 1500, 2999, 3000]) {
      expect(validLevels).toContain(getLevelForPoints(points));
    }
  });
});

describe('getLevelInfo', () => {
  it('returns correct icon for each level', () => {
    expect(getLevelInfo('seedling').icon).toBe('🌱');
    expect(getLevelInfo('guardian').icon).toBe('🌍');
  });

  it('returns level with minPoints <= maxPoints', () => {
    LEVELS.forEach((l) => {
      expect(l.minPoints).toBeLessThan(l.maxPoints);
    });
  });
});

describe('getLevelProgress', () => {
  it('returns 0 for start of seedling level', () => {
    expect(getLevelProgress(0)).toBe(0);
  });

  it('returns 100 for guardian level (no cap)', () => {
    expect(getLevelProgress(5000)).toBe(100);
  });

  it('returns intermediate value for mid-level points', () => {
    // Sprout: 100-299, range=199. At 200, progress = (200-100)/199*100 ≈ 50
    const progress = getLevelProgress(200);
    expect(progress).toBeGreaterThan(0);
    expect(progress).toBeLessThan(100);
  });

  it('is always between 0 and 100', () => {
    [0, 50, 100, 200, 500, 1000, 2000, 5000].forEach((pts) => {
      const progress = getLevelProgress(pts);
      expect(progress).toBeGreaterThanOrEqual(0);
      expect(progress).toBeLessThanOrEqual(100);
    });
  });
});

// ─── Points Tests ─────────────────────────────────────────────────────────────

describe('calcPointsForLog', () => {
  it('returns at least 5 points (base) for any log', () => {
    const pts = calcPointsForLog(0, 0);
    expect(pts).toBeGreaterThanOrEqual(5);
  });

  it('gives streak bonus for 3+ day streak', () => {
    const noBonus = calcPointsForLog(1, 2);
    const withBonus = calcPointsForLog(1, 3);
    expect(withBonus).toBeGreaterThan(noBonus);
  });

  it('gives higher streak bonus for 7+ day streak', () => {
    const bonus3 = calcPointsForLog(1, 3);
    const bonus7 = calcPointsForLog(1, 7);
    expect(bonus7).toBeGreaterThan(bonus3);
  });

  it('scales with co2Saved amount', () => {
    const small = calcPointsForLog(0.5, 0);
    const large = calcPointsForLog(5.0, 0);
    expect(large).toBeGreaterThan(small);
  });

  it('returns integer', () => {
    const pts = calcPointsForLog(2.3, 5);
    expect(Number.isInteger(pts)).toBe(true);
  });
});

// ─── Streak Tests ─────────────────────────────────────────────────────────────

describe('updateStreak', () => {
  const today = '2025-06-15';
  const yesterday = '2025-06-14';
  const twoDaysAgo = '2025-06-13';

  it('returns 1 for first log ever (null lastDate)', () => {
    expect(updateStreak(null, today)).toBe(1);
  });

  it('returns 1 to extend streak when logged yesterday', () => {
    expect(updateStreak(yesterday, today)).toBe(1);
  });

  it('returns 0 when already logged today', () => {
    expect(updateStreak(today, today)).toBe(0);
  });

  it('returns -1 when streak broken (gap > 1 day)', () => {
    expect(updateStreak(twoDaysAgo, today)).toBe(-1);
  });
});

// ─── Badge Tests ──────────────────────────────────────────────────────────────

describe('checkBadgeUnlocks', () => {
  const baseState: GamificationState = {
    greenPoints: 0,
    level: 'seedling',
    badges: BADGE_DEFINITIONS.map((b) => ({ ...b, unlocked: false })),
    streak: 0,
    longestStreak: 0,
    totalCo2Saved: 0,
    lastLogDate: null,
  };

  it('unlocks first_log when totalCo2Saved > 0', () => {
    const state = { ...baseState, totalCo2Saved: 1 };
    const unlocked = checkBadgeUnlocks(state, new Set(['transport']));
    expect(unlocked).toContain('first_log');
  });

  it('unlocks streak_3 when streak >= 3', () => {
    const state = { ...baseState, totalCo2Saved: 1, streak: 3 };
    const unlocked = checkBadgeUnlocks(state, new Set(['transport']));
    expect(unlocked).toContain('streak_3');
  });

  it('unlocks streak_7 when streak >= 7', () => {
    const state = { ...baseState, totalCo2Saved: 1, streak: 7 };
    const unlocked = checkBadgeUnlocks(state, new Set(['transport']));
    expect(unlocked).toContain('streak_7');
  });

  it('unlocks co2_saver_10 when 10kg saved', () => {
    const state = { ...baseState, totalCo2Saved: 10 };
    const unlocked = checkBadgeUnlocks(state, new Set(['food']));
    expect(unlocked).toContain('co2_saver_10');
  });

  it('unlocks all_categories when all 5 categories logged', () => {
    const state = { ...baseState, totalCo2Saved: 1 };
    const cats = new Set(['transport', 'energy', 'food', 'shopping', 'waste']);
    const unlocked = checkBadgeUnlocks(state, cats);
    expect(unlocked).toContain('all_categories');
  });

  it('does not re-unlock already unlocked badges', () => {
    const state: GamificationState = {
      ...baseState,
      totalCo2Saved: 1,
      badges: BADGE_DEFINITIONS.map((b) =>
        b.id === 'first_log' ? { ...b, unlocked: true } : { ...b, unlocked: false }
      ),
    };
    const unlocked = checkBadgeUnlocks(state, new Set(['transport']));
    expect(unlocked).not.toContain('first_log');
  });

  it('returns empty array when no conditions met', () => {
    const unlocked = checkBadgeUnlocks(baseState, new Set());
    expect(unlocked).toHaveLength(0);
  });
});
