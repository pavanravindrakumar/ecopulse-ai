import type {
  OnboardingData,
  CategoryScore,
  CarbonScore,
} from '../types';

// ─── Emission Factors ─────────────────────────────────────────────────────────

const TRANSPORT_FACTORS: Record<string, number> = {
  car_petrol: 0.192,   // kg CO₂e per km
  car_diesel: 0.171,
  car_electric: 0.053,
  motorcycle: 0.114,
  bus: 0.089,
  train: 0.041,
  bicycle: 0,
  walking: 0,
};

const DIET_FACTORS: Record<string, number> = {
  heavy_meat: 320,     // kg CO₂e per month
  omnivore: 230,
  flexitarian: 170,
  vegetarian: 130,
  vegan: 90,
};

const FLIGHT_FACTORS: Record<string, number> = {
  never: 0,
  rarely: 50,          // kg CO₂e per month average
  sometimes: 150,
  often: 350,
  very_often: 600,
};

const GRID_EMISSION_FACTOR = 0.233; // kg CO₂e per kWh (India avg)
const GAS_EMISSION_FACTOR = 2.204;  // kg CO₂e per m³

// ─── Category Calculators ─────────────────────────────────────────────────────

export function calcTransportScore(data: Partial<OnboardingData>): number {
  const weeklyKm = data.weeklyKm ?? 50;
  const mode = data.primaryTransport ?? 'car_petrol';
  const factor = TRANSPORT_FACTORS[mode] ?? 0.192;
  const flightFactor = FLIGHT_FACTORS[data.flightFrequency ?? 'never'];

  const weeklyRoadKg = weeklyKm * factor;
  const monthlyRoadKg = weeklyRoadKg * 4.33;
  return Math.round(monthlyRoadKg + flightFactor);
}

export function calcEnergyScore(data: Partial<OnboardingData>): number {
  const electricity = (data.monthlyElectricityKwh ?? 200) * GRID_EMISSION_FACTOR;
  const renewable = data.hasRenewableEnergy ? 0.6 : 1; // 40% reduction if renewable
  const gas = data.hasGasHeating ? (data.monthlyGasM3 ?? 30) * GAS_EMISSION_FACTOR : 0;
  return Math.round(electricity * renewable + gas);
}

export function calcFoodScore(data: Partial<OnboardingData>): number {
  const baseDiet = DIET_FACTORS[data.dietType ?? 'omnivore'];
  const localDiscount = (data.localFoodPercentage ?? 20) * 0.001 * baseDiet; // up to 10% discount
  const wasteMultiplier = 1 + ((data.foodWasteLevel ?? 3) - 1) * 0.05; // +5% per waste level above 1
  return Math.round((baseDiet - localDiscount) * wasteMultiplier);
}

export function calcShoppingScore(data: Partial<OnboardingData>): number {
  const purchases = data.monthlyOnlinePurchases ?? 3;
  const secondHand = data.buySecondHand ? 0.7 : 1;
  const fashion = data.fastFashionFrequency ?? 2;
  const baseKg = purchases * 3.5 + fashion * 8;
  return Math.round(baseKg * secondHand);
}

export function calcWasteScore(data: Partial<OnboardingData>): number {
  const weeklyWaste = data.weeklyWasteKg ?? 5;
  const recyclingReduction = (data.recyclingRate ?? 30) / 100 * 0.5;
  const compostBonus = data.compostsFood ? 0.15 : 0;
  const monthlyWaste = weeklyWaste * 4.33;
  const emissionFactor = 0.5 * (1 - recyclingReduction - compostBonus);
  return Math.round(monthlyWaste * emissionFactor);
}

// ─── Main Scoring Function ────────────────────────────────────────────────────

export function calculateCarbonScore(data: Partial<OnboardingData>): CarbonScore {
  const byCategory: CategoryScore = {
    transport: calcTransportScore(data),
    energy: calcEnergyScore(data),
    food: calcFoodScore(data),
    shopping: calcShoppingScore(data),
    waste: calcWasteScore(data),
  };

  const total = Object.values(byCategory).reduce((sum, v) => sum + v, 0);
  const annualTons = (total * 12) / 1000;

  // Global avg ~4 tons/year. India avg ~1.9 tons/year
  // Grade on a scale where <1t = A+, <2t = A, <3t = B, <5t = C, <8t = D, >8t = F
  const grade = getGrade(annualTons);
  const percentile = getPercentile(annualTons);

  return { total, byCategory, annualTons, grade, percentile };
}

export function getGrade(annualTons: number): CarbonScore['grade'] {
  if (annualTons < 1) return 'A+';
  if (annualTons < 2) return 'A';
  if (annualTons < 3.5) return 'B';
  if (annualTons < 6) return 'C';
  if (annualTons < 10) return 'D';
  return 'F';
}

function getPercentile(annualTons: number): number {
  // Rough mapping: lower tons = lower percentile (better)
  if (annualTons < 1) return 5;
  if (annualTons < 2) return 15;
  if (annualTons < 3) return 30;
  if (annualTons < 5) return 50;
  if (annualTons < 8) return 70;
  if (annualTons < 12) return 85;
  return 95;
}

// ─── Benchmark Data ───────────────────────────────────────────────────────────

export const GLOBAL_AVERAGE_ANNUAL_TONS = 4.7;
export const PARIS_TARGET_ANNUAL_TONS = 2.3;
export const INDIA_AVERAGE_ANNUAL_TONS = 1.9;

export function getCategoryLabel(category: keyof CategoryScore): string {
  const labels: Record<keyof CategoryScore, string> = {
    transport: 'Transport',
    energy: 'Energy',
    food: 'Food & Diet',
    shopping: 'Shopping',
    waste: 'Waste',
  };
  return labels[category];
}

export function getCategoryColor(category: keyof CategoryScore): string {
  const colors: Record<keyof CategoryScore, string> = {
    transport: '#22c55e',
    energy: '#f59e0b',
    food: '#3b82f6',
    shopping: '#a855f7',
    waste: '#ef4444',
  };
  return colors[category];
}
