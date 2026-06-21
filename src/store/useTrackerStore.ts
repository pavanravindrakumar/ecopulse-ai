import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { HabitLog } from '../types';
import {
  calcPointsForLog,
  updateStreak,
  checkBadgeUnlocks,
  getLevelForPoints,
  BADGE_DEFINITIONS,
} from '../utils/gamification';
import { format } from 'date-fns';

// ─── Tracker Store ────────────────────────────────────────────────────────────

interface TrackerStore {
  logs: HabitLog[];
  addLog: (log: Omit<HabitLog, 'id' | 'greenPoints'>) => void;
  removeLog: (id: string) => void;
  getLogsForDate: (date: string) => HabitLog[];
  getLogsForMonth: (month: string) => HabitLog[]; // YYYY-MM
  getTotalCo2Saved: () => number;
  reset: () => void;
}

// ─── Gamification Store ───────────────────────────────────────────────────────

interface GamificationStore {
  greenPoints: number;
  level: string;
  badges: typeof BADGE_DEFINITIONS;
  streak: number;
  longestStreak: number;
  totalCo2Saved: number;
  lastLogDate: string | null;
  categoriesLogged: string[];

  addPointsAndUpdate: (log: HabitLog) => void;
  unlockBadge: (id: string) => void;
  reset: () => void;
}

export const useTrackerStore = create<TrackerStore>()(
  persist(
    (set, get) => ({
      logs: [],

      addLog: (logData) => {
        const points = calcPointsForLog(logData.co2Saved, 0); // streak calc via gamification store
        const newLog: HabitLog = {
          ...logData,
          id: crypto.randomUUID(),
          greenPoints: points,
        };
        set((state) => ({ logs: [newLog, ...state.logs] }));
      },

      removeLog: (id: string) => {
        set((state) => ({ logs: state.logs.filter((l) => l.id !== id) }));
      },

      getLogsForDate: (date: string) => {
        return get().logs.filter((l) => l.date === date);
      },

      getLogsForMonth: (month: string) => {
        return get().logs.filter((l) => l.date.startsWith(month));
      },

      getTotalCo2Saved: () => {
        return get().logs.reduce((sum, l) => sum + l.co2Saved, 0);
      },

      reset: () => set({ logs: [] }),
    }),
    {
      name: 'ecopulse-tracker-v1',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export const useGamificationStore = create<GamificationStore>()(
  persist(
    (set, get) => ({
      greenPoints: 0,
      level: 'seedling',
      badges: BADGE_DEFINITIONS.map((b) => ({ ...b })),
      streak: 0,
      longestStreak: 0,
      totalCo2Saved: 0,
      lastLogDate: null,
      categoriesLogged: [],

      addPointsAndUpdate: (log: HabitLog) => {
        const state = get();
        const today = format(new Date(), 'yyyy-MM-dd');

        // Streak calculation
        const streakResult = updateStreak(state.lastLogDate, today);
        let newStreak = state.streak;
        if (streakResult === 0) {
          // Already logged today, no streak change
        } else if (streakResult === 1) {
          newStreak = state.streak + 1;
        } else {
          newStreak = 1; // streak reset
        }

        const points = calcPointsForLog(log.co2Saved, newStreak);
        const newTotalPoints = state.greenPoints + points;
        const newTotalCo2 = state.totalCo2Saved + log.co2Saved;
        const newLevel = getLevelForPoints(newTotalPoints);
        const newCategoriesLogged = Array.from(
          new Set([...state.categoriesLogged, log.category])
        );

        // Check badges
        const gamState = {
          greenPoints: newTotalPoints,
          level: newLevel,
          badges: state.badges,
          streak: newStreak,
          longestStreak: Math.max(state.longestStreak, newStreak),
          totalCo2Saved: newTotalCo2,
          lastLogDate: today,
        };

        const newBadgeIds = checkBadgeUnlocks(gamState, new Set(newCategoriesLogged));
        const updatedBadges = state.badges.map((b) =>
          newBadgeIds.includes(b.id)
            ? { ...b, unlocked: true, earnedAt: new Date().toISOString() }
            : b
        );

        set({
          greenPoints: newTotalPoints,
          level: newLevel,
          badges: updatedBadges,
          streak: newStreak,
          longestStreak: Math.max(state.longestStreak, newStreak),
          totalCo2Saved: newTotalCo2,
          lastLogDate: streakResult !== 0 ? today : state.lastLogDate,
          categoriesLogged: newCategoriesLogged,
        });
      },

      unlockBadge: (id: string) => {
        set((state) => ({
          badges: state.badges.map((b) =>
            b.id === id ? { ...b, unlocked: true, earnedAt: new Date().toISOString() } : b
          ),
        }));
      },

      reset: () =>
        set({
          greenPoints: 0,
          level: 'seedling',
          badges: BADGE_DEFINITIONS.map((b) => ({ ...b })),
          streak: 0,
          longestStreak: 0,
          totalCo2Saved: 0,
          lastLogDate: null,
          categoriesLogged: [],
        }),
    }),
    {
      name: 'ecopulse-gamification-v1',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
