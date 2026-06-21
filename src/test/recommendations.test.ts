import { describe, it, expect } from 'vitest';
import { generateRecommendations } from '../utils/recommendations';
import type { OnboardingData } from '../types';

describe('generateRecommendations', () => {
  const baseProfile: Partial<OnboardingData> = {
    primaryTransport: 'car_petrol',
    weeklyKm: 200,
    flightFrequency: 'sometimes',
    monthlyElectricityKwh: 300,
    hasRenewableEnergy: false,
    hasGasHeating: false,
    dietType: 'omnivore',
    localFoodPercentage: 20,
    foodWasteLevel: 3,
    monthlyOnlinePurchases: 5,
    buySecondHand: false,
    fastFashionFrequency: 3,
    recyclingRate: 30,
    compostsFood: false,
    weeklyWasteKg: 7,
  };

  it('returns exactly 5 recommendations', () => {
    const recs = generateRecommendations(baseProfile);
    expect(recs).toHaveLength(5);
  });

  it('all recommendations have required fields', () => {
    const recs = generateRecommendations(baseProfile);
    recs.forEach((rec) => {
      expect(rec).toHaveProperty('id');
      expect(rec).toHaveProperty('title');
      expect(rec).toHaveProperty('description');
      expect(rec).toHaveProperty('category');
      expect(rec).toHaveProperty('co2SavedKgPerYear');
      expect(rec).toHaveProperty('difficulty');
      expect(rec).toHaveProperty('impact');
      expect(rec).toHaveProperty('weeklyGoal');
      expect(rec).toHaveProperty('icon');
    });
  });

  it('co2SavedKgPerYear is positive for all recommendations', () => {
    const recs = generateRecommendations(baseProfile);
    recs.forEach((rec) => {
      expect(rec.co2SavedKgPerYear).toBeGreaterThan(0);
    });
  });

  it('difficulty is between 1 and 5', () => {
    const recs = generateRecommendations(baseProfile);
    recs.forEach((rec) => {
      expect(rec.difficulty).toBeGreaterThanOrEqual(1);
      expect(rec.difficulty).toBeLessThanOrEqual(5);
    });
  });

  it('no duplicate recommendation IDs', () => {
    const recs = generateRecommendations(baseProfile);
    const ids = recs.map((r) => r.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('for vegan+cyclist profile, no transport food recs should dominate', () => {
    const ecoProfile: Partial<OnboardingData> = {
      ...baseProfile,
      primaryTransport: 'bicycle',
      weeklyKm: 0,
      flightFrequency: 'never',
      dietType: 'vegan',
    };
    const recs = generateRecommendations(ecoProfile);
    // Should still return 5
    expect(recs).toHaveLength(5);
    // Transport and food categories should not both be top recommendations
    const transportCount = recs.filter((r) => r.category === 'transport').length;
    const foodCount = recs.filter((r) => r.category === 'food').length;
    expect(transportCount + foodCount).toBeLessThanOrEqual(4);
  });

  it('heavy car user gets transport recommendations', () => {
    const heavyCarProfile: Partial<OnboardingData> = {
      ...baseProfile,
      primaryTransport: 'car_petrol',
      weeklyKm: 800,
      flightFrequency: 'very_often',
    };
    const recs = generateRecommendations(heavyCarProfile);
    const hasTransport = recs.some((r) => r.category === 'transport');
    expect(hasTransport).toBe(true);
  });

  it('completed field defaults to false', () => {
    const recs = generateRecommendations(baseProfile);
    recs.forEach((rec) => {
      expect(rec.completed).toBe(false);
    });
  });

  it('works with empty/default profile', () => {
    const recs = generateRecommendations({});
    expect(recs).toHaveLength(5);
  });

  it('impact is one of valid values', () => {
    const validImpacts = ['low', 'medium', 'high', 'very_high'];
    const recs = generateRecommendations(baseProfile);
    recs.forEach((rec) => {
      expect(validImpacts).toContain(rec.impact);
    });
  });
});
