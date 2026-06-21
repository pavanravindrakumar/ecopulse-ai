import type { CategoryScore } from '../types';

export type CategoryKey = keyof CategoryScore | 'other';

export const CATEGORY_LABELS: Record<CategoryKey, string> = {
  transport: 'Transport',
  energy: 'Energy',
  food: 'Food',
  shopping: 'Shopping',
  waste: 'Waste',
  other: 'Other',
};

export const CATEGORY_LONG_LABELS: Record<CategoryKey, string> = {
  ...CATEGORY_LABELS,
  food: 'Food & Diet',
};

export const CATEGORY_COLORS: Record<CategoryKey, string> = {
  transport: '#22c55e',
  energy: '#f59e0b',
  food: '#3b82f6',
  shopping: '#a855f7',
  waste: '#ef4444',
  other: '#9ca3af',
};
