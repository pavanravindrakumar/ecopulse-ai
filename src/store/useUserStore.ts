import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { UserProfile, OnboardingData, CarbonScore, Recommendation } from '../types';
import { calculateCarbonScore } from '../utils/carbonCalc';
import { generateRecommendations } from '../utils/recommendations';

// ─── User Store ───────────────────────────────────────────────────────────────

interface UserStore {
  profile: UserProfile | null;
  isOnboarded: boolean;
  currentOnboardingStep: number;
  onboardingData: Partial<OnboardingData>;

  // Actions
  initProfile: (name: string) => void;
  updateOnboardingData: (data: Partial<OnboardingData>) => void;
  setOnboardingStep: (step: number) => void;
  completeOnboarding: () => void;
  updateProfile: (partial: Partial<UserProfile>) => void;
  markRecommendationComplete: (id: string) => void;
  reset: () => void;
}

const defaultOnboardingData: Partial<OnboardingData> = {
  primaryTransport: 'car_petrol',
  weeklyKm: 100,
  flightFrequency: 'rarely',
  monthlyElectricityKwh: 200,
  hasRenewableEnergy: false,
  hasGasHeating: false,
  monthlyGasM3: 30,
  dietType: 'omnivore',
  localFoodPercentage: 20,
  foodWasteLevel: 3,
  monthlyOnlinePurchases: 4,
  buySecondHand: false,
  fastFashionFrequency: 2,
  recyclingRate: 30,
  compostsFood: false,
  weeklyWasteKg: 5,
};

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      profile: null,
      isOnboarded: false,
      currentOnboardingStep: 0,
      onboardingData: { ...defaultOnboardingData },

      initProfile: (name: string) => {
        const profile: UserProfile = {
          id: crypto.randomUUID(),
          name: name.trim().slice(0, 50), // sanitize length
          onboardingCompleted: false,
          onboardingData: {},
          carbonScore: null,
          recommendations: [],
          createdAt: new Date().toISOString(),
        };
        set({ profile });
      },

      updateOnboardingData: (data: Partial<OnboardingData>) => {
        set((state) => ({
          onboardingData: { ...state.onboardingData, ...data },
        }));
      },

      setOnboardingStep: (step: number) => {
        set({ currentOnboardingStep: step });
      },

      completeOnboarding: () => {
        const { profile, onboardingData } = get();
        if (!profile) return;

        const carbonScore: CarbonScore = calculateCarbonScore(onboardingData);
        const recommendations: Recommendation[] = generateRecommendations(onboardingData);

        const updatedProfile: UserProfile = {
          ...profile,
          onboardingCompleted: true,
          onboardingData,
          carbonScore,
          recommendations,
        };

        set({ profile: updatedProfile, isOnboarded: true });
      },

      updateProfile: (partial: Partial<UserProfile>) => {
        set((state) => ({
          profile: state.profile ? { ...state.profile, ...partial } : null,
        }));
      },

      markRecommendationComplete: (id: string) => {
        const { profile } = get();
        if (!profile) return;
        const updated = profile.recommendations.map((r) =>
          r.id === id ? { ...r, completed: !r.completed } : r
        );
        set({ profile: { ...profile, recommendations: updated } });
      },

      reset: () => {
        set({
          profile: null,
          isOnboarded: false,
          currentOnboardingStep: 0,
          onboardingData: { ...defaultOnboardingData },
        });
      },
    }),
    {
      name: 'ecopulse-user-v1',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
