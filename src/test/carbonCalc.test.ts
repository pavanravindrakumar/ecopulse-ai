import { describe, it, expect } from 'vitest';
import {
  calcTransportScore,
  calcEnergyScore,
  calcFoodScore,
  calcShoppingScore,
  calcWasteScore,
  calculateCarbonScore,
} from '../utils/carbonCalc';
import type { OnboardingData } from '../types';

// ─── Transport Tests ──────────────────────────────────────────────────────────

describe('calcTransportScore', () => {
  it('returns 0 for walking with no flights', () => {
    const score = calcTransportScore({ primaryTransport: 'walking', weeklyKm: 50, flightFrequency: 'never' });
    expect(score).toBe(0);
  });

  it('returns 0 for bicycle with no flights', () => {
    const score = calcTransportScore({ primaryTransport: 'bicycle', weeklyKm: 100, flightFrequency: 'never' });
    expect(score).toBe(0);
  });

  it('car_petrol emits more than car_electric for same distance', () => {
    const petrol = calcTransportScore({ primaryTransport: 'car_petrol', weeklyKm: 100, flightFrequency: 'never' });
    const electric = calcTransportScore({ primaryTransport: 'car_electric', weeklyKm: 100, flightFrequency: 'never' });
    expect(petrol).toBeGreaterThan(electric);
  });

  it('adds flight emissions correctly', () => {
    const withFlights = calcTransportScore({ primaryTransport: 'walking', weeklyKm: 0, flightFrequency: 'often' });
    const noFlights = calcTransportScore({ primaryTransport: 'walking', weeklyKm: 0, flightFrequency: 'never' });
    expect(withFlights).toBeGreaterThan(noFlights);
  });

  it('is proportional to km driven', () => {
    const score100 = calcTransportScore({ primaryTransport: 'car_petrol', weeklyKm: 100, flightFrequency: 'never' });
    const score200 = calcTransportScore({ primaryTransport: 'car_petrol', weeklyKm: 200, flightFrequency: 'never' });
    expect(score200).toBeCloseTo(score100 * 2, 0);
  });

  it('train emits less than bus', () => {
    const train = calcTransportScore({ primaryTransport: 'train', weeklyKm: 100, flightFrequency: 'never' });
    const bus = calcTransportScore({ primaryTransport: 'bus', weeklyKm: 100, flightFrequency: 'never' });
    expect(train).toBeLessThan(bus);
  });
});

// ─── Energy Tests ─────────────────────────────────────────────────────────────

describe('calcEnergyScore', () => {
  it('renewable energy reduces score by 40%', () => {
    const standard = calcEnergyScore({ monthlyElectricityKwh: 200, hasRenewableEnergy: false, hasGasHeating: false });
    const renewable = calcEnergyScore({ monthlyElectricityKwh: 200, hasRenewableEnergy: true, hasGasHeating: false });
    expect(renewable).toBeLessThan(standard);
    expect(renewable / standard).toBeCloseTo(0.6, 1);
  });

  it('gas heating adds to score', () => {
    const noGas = calcEnergyScore({ monthlyElectricityKwh: 200, hasRenewableEnergy: false, hasGasHeating: false });
    const withGas = calcEnergyScore({ monthlyElectricityKwh: 200, hasRenewableEnergy: false, hasGasHeating: true, monthlyGasM3: 30 });
    expect(withGas).toBeGreaterThan(noGas);
  });

  it('higher electricity usage = higher score', () => {
    const low = calcEnergyScore({ monthlyElectricityKwh: 100, hasRenewableEnergy: false, hasGasHeating: false });
    const high = calcEnergyScore({ monthlyElectricityKwh: 400, hasRenewableEnergy: false, hasGasHeating: false });
    expect(high).toBeGreaterThan(low);
  });

  it('returns a positive number for any valid input', () => {
    const score = calcEnergyScore({ monthlyElectricityKwh: 150, hasRenewableEnergy: false, hasGasHeating: false });
    expect(score).toBeGreaterThan(0);
  });
});

// ─── Food Tests ───────────────────────────────────────────────────────────────

describe('calcFoodScore', () => {
  it('vegan diet scores lower than heavy meat diet', () => {
    const vegan = calcFoodScore({ dietType: 'vegan', localFoodPercentage: 0, foodWasteLevel: 3 });
    const meat = calcFoodScore({ dietType: 'heavy_meat', localFoodPercentage: 0, foodWasteLevel: 3 });
    expect(vegan).toBeLessThan(meat);
  });

  it('more local food reduces score', () => {
    const imported = calcFoodScore({ dietType: 'omnivore', localFoodPercentage: 0, foodWasteLevel: 3 });
    const local = calcFoodScore({ dietType: 'omnivore', localFoodPercentage: 80, foodWasteLevel: 3 });
    expect(local).toBeLessThan(imported);
  });

  it('higher food waste increases score', () => {
    const lowWaste = calcFoodScore({ dietType: 'omnivore', localFoodPercentage: 0, foodWasteLevel: 1 });
    const highWaste = calcFoodScore({ dietType: 'omnivore', localFoodPercentage: 0, foodWasteLevel: 5 });
    expect(highWaste).toBeGreaterThan(lowWaste);
  });

  it('diet order: vegan < vegetarian < flexitarian < omnivore < heavy_meat', () => {
    const scores = ['vegan', 'vegetarian', 'flexitarian', 'omnivore', 'heavy_meat'].map(
      (d) => calcFoodScore({ dietType: d as OnboardingData['dietType'], localFoodPercentage: 20, foodWasteLevel: 3 })
    );
    for (let i = 1; i < scores.length; i++) {
      expect(scores[i]).toBeGreaterThanOrEqual(scores[i - 1]);
    }
  });
});

// ─── Shopping Tests ───────────────────────────────────────────────────────────

describe('calcShoppingScore', () => {
  it('buying second-hand reduces score', () => {
    const newGoods = calcShoppingScore({ monthlyOnlinePurchases: 5, buySecondHand: false, fastFashionFrequency: 2 });
    const secondHand = calcShoppingScore({ monthlyOnlinePurchases: 5, buySecondHand: true, fastFashionFrequency: 2 });
    expect(secondHand).toBeLessThan(newGoods);
  });

  it('more online purchases increases score', () => {
    const few = calcShoppingScore({ monthlyOnlinePurchases: 1, buySecondHand: false, fastFashionFrequency: 1 });
    const many = calcShoppingScore({ monthlyOnlinePurchases: 20, buySecondHand: false, fastFashionFrequency: 1 });
    expect(many).toBeGreaterThan(few);
  });

  it('fast fashion frequency increases score', () => {
    const rare = calcShoppingScore({ monthlyOnlinePurchases: 2, buySecondHand: false, fastFashionFrequency: 1 });
    const frequent = calcShoppingScore({ monthlyOnlinePurchases: 2, buySecondHand: false, fastFashionFrequency: 5 });
    expect(frequent).toBeGreaterThan(rare);
  });
});

// ─── Waste Tests ──────────────────────────────────────────────────────────────

describe('calcWasteScore', () => {
  it('higher recycling rate reduces score', () => {
    const noRecycling = calcWasteScore({ weeklyWasteKg: 5, recyclingRate: 0, compostsFood: false });
    const highRecycling = calcWasteScore({ weeklyWasteKg: 5, recyclingRate: 90, compostsFood: false });
    expect(highRecycling).toBeLessThan(noRecycling);
  });

  it('composting reduces score', () => {
    const noCompost = calcWasteScore({ weeklyWasteKg: 5, recyclingRate: 30, compostsFood: false });
    const compost = calcWasteScore({ weeklyWasteKg: 5, recyclingRate: 30, compostsFood: true });
    expect(compost).toBeLessThan(noCompost);
  });

  it('more waste increases score', () => {
    const little = calcWasteScore({ weeklyWasteKg: 1, recyclingRate: 30, compostsFood: false });
    const lot = calcWasteScore({ weeklyWasteKg: 20, recyclingRate: 30, compostsFood: false });
    expect(lot).toBeGreaterThan(little);
  });
});

// ─── Full Score Tests ─────────────────────────────────────────────────────────

describe('calculateCarbonScore', () => {
  const ecoProfile: Partial<OnboardingData> = {
    primaryTransport: 'bicycle',
    weeklyKm: 0,
    flightFrequency: 'never',
    monthlyElectricityKwh: 100,
    hasRenewableEnergy: true,
    hasGasHeating: false,
    dietType: 'vegan',
    localFoodPercentage: 80,
    foodWasteLevel: 1,
    monthlyOnlinePurchases: 1,
    buySecondHand: true,
    fastFashionFrequency: 1,
    recyclingRate: 90,
    compostsFood: true,
    weeklyWasteKg: 2,
  };

  const highImpactProfile: Partial<OnboardingData> = {
    primaryTransport: 'car_petrol',
    weeklyKm: 500,
    flightFrequency: 'very_often',
    monthlyElectricityKwh: 600,
    hasRenewableEnergy: false,
    hasGasHeating: true,
    monthlyGasM3: 100,
    dietType: 'heavy_meat',
    localFoodPercentage: 0,
    foodWasteLevel: 5,
    monthlyOnlinePurchases: 20,
    buySecondHand: false,
    fastFashionFrequency: 5,
    recyclingRate: 0,
    compostsFood: false,
    weeklyWasteKg: 20,
  };

  it('eco-friendly profile scores lower than high-impact profile', () => {
    const eco = calculateCarbonScore(ecoProfile);
    const high = calculateCarbonScore(highImpactProfile);
    expect(eco.total).toBeLessThan(high.total);
  });

  it('returns all category scores', () => {
    const score = calculateCarbonScore(ecoProfile);
    expect(score.byCategory).toHaveProperty('transport');
    expect(score.byCategory).toHaveProperty('energy');
    expect(score.byCategory).toHaveProperty('food');
    expect(score.byCategory).toHaveProperty('shopping');
    expect(score.byCategory).toHaveProperty('waste');
  });

  it('eco profile receives A+ or A grade', () => {
    const score = calculateCarbonScore(ecoProfile);
    expect(['A+', 'A']).toContain(score.grade);
  });

  it('high impact profile receives C, D, or F grade', () => {
    const score = calculateCarbonScore(highImpactProfile);
    expect(['C', 'D', 'F']).toContain(score.grade);
  });

  it('annual tons = total * 12 / 1000', () => {
    const score = calculateCarbonScore(ecoProfile);
    expect(score.annualTons).toBeCloseTo(score.total * 12 / 1000, 1);
  });

  it('percentile is between 0 and 100', () => {
    const score = calculateCarbonScore(ecoProfile);
    expect(score.percentile).toBeGreaterThanOrEqual(0);
    expect(score.percentile).toBeLessThanOrEqual(100);
  });

  it('all category scores are non-negative', () => {
    const score = calculateCarbonScore(ecoProfile);
    Object.values(score.byCategory).forEach((v) => {
      expect(v).toBeGreaterThanOrEqual(0);
    });
  });
});
