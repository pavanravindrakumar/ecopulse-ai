// ─── Onboarding ─────────────────────────────────────────────────────────────

export type TransportMode =
  | 'car_petrol'
  | 'car_diesel'
  | 'car_electric'
  | 'motorcycle'
  | 'bus'
  | 'train'
  | 'bicycle'
  | 'walking';

export type DietType = 'vegan' | 'vegetarian' | 'flexitarian' | 'omnivore' | 'heavy_meat';

export type FlightFrequency = 'never' | 'rarely' | 'sometimes' | 'often' | 'very_often';

export interface OnboardingData {
  // Transport
  primaryTransport: TransportMode;
  weeklyKm: number;
  flightFrequency: FlightFrequency;
  // Energy
  monthlyElectricityKwh: number;
  hasRenewableEnergy: boolean;
  hasGasHeating: boolean;
  monthlyGasM3: number;
  // Food
  dietType: DietType;
  localFoodPercentage: number; // 0-100
  foodWasteLevel: number; // 1-5 scale
  // Shopping
  monthlyOnlinePurchases: number;
  buySecondHand: boolean;
  fastFashionFrequency: number; // 1-5
  // Waste
  recyclingRate: number; // 0-100
  compostsFood: boolean;
  weeklyWasteKg: number;
}

// ─── Carbon Scores ───────────────────────────────────────────────────────────

export interface CategoryScore {
  transport: number;
  energy: number;
  food: number;
  shopping: number;
  waste: number;
}

export interface CarbonScore {
  total: number; // kg CO₂e per month
  byCategory: CategoryScore;
  percentile: number; // 0-100, lower is better
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  annualTons: number;
}

// ─── Recommendations ─────────────────────────────────────────────────────────

export type DifficultyLevel = 1 | 2 | 3 | 4 | 5;
export type ImpactLevel = 'low' | 'medium' | 'high' | 'very_high';

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  category: keyof CategoryScore;
  co2SavedKgPerYear: number;
  difficulty: DifficultyLevel;
  impact: ImpactLevel;
  weeklyGoal: string;
  icon: string;
  completed?: boolean;
}

// ─── Daily Habit Tracking ─────────────────────────────────────────────────────

export type HabitCategory = 'transport' | 'energy' | 'food' | 'shopping' | 'waste' | 'other';

export interface HabitLog {
  id: string;
  date: string; // ISO date string YYYY-MM-DD
  habitId: string;
  habitTitle: string;
  category: HabitCategory;
  co2Saved: number; // kg
  notes?: string;
  greenPoints: number;
}

export interface Habit {
  id: string;
  title: string;
  description: string;
  category: HabitCategory;
  co2SavedPerOccurrence: number;
  pointsPerOccurrence: number;
  icon: string;
}

// ─── Gamification ────────────────────────────────────────────────────────────

export type BadgeId =
  | 'first_log'
  | 'streak_3'
  | 'streak_7'
  | 'streak_30'
  | 'co2_saver_10'
  | 'co2_saver_50'
  | 'co2_saver_100'
  | 'onboarding_complete'
  | 'all_categories'
  | 'recommendation_accepted'
  | 'top_reducer';

export interface Badge {
  id: BadgeId;
  title: string;
  description: string;
  icon: string;
  earnedAt?: string;
  unlocked: boolean;
}

export type UserLevel =
  | 'seedling'
  | 'sprout'
  | 'sapling'
  | 'tree'
  | 'forest'
  | 'guardian';

export interface LevelInfo {
  level: UserLevel;
  label: string;
  minPoints: number;
  maxPoints: number;
  icon: string;
  color: string;
}

export interface GamificationState {
  greenPoints: number;
  level: UserLevel;
  badges: Badge[];
  streak: number;
  longestStreak: number;
  totalCo2Saved: number;
  lastLogDate: string | null;
}

// ─── User Profile ─────────────────────────────────────────────────────────────

export interface UserProfile {
  id: string;
  name: string;
  onboardingCompleted: boolean;
  carbonScore: CarbonScore | null;
  recommendations: Recommendation[];
  createdAt: string;
}

// ─── Insights ────────────────────────────────────────────────────────────────

export interface MonthlyInsight {
  month: string; // YYYY-MM
  totalCo2Saved: number;
  topCategory: keyof CategoryScore;
  logsCount: number;
  streakDays: number;
  pointsEarned: number;
  topHabit: string;
}

export interface TrendDataPoint {
  date: string;
  footprint: number;
  saved: number;
}
