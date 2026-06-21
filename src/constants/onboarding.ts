import type { DietType, FlightFrequency, OnboardingData, TransportMode } from '../types';

export const ONBOARDING_STEPS = [
  { id: 'welcome', label: 'Welcome', emoji: '👋' },
  { id: 'transport', label: 'Transport', emoji: '🚗' },
  { id: 'energy', label: 'Energy', emoji: '⚡' },
  { id: 'food', label: 'Food', emoji: '🥗' },
  { id: 'shopping', label: 'Shopping', emoji: '🛍️' },
  { id: 'waste', label: 'Waste', emoji: '♻️' },
  { id: 'results', label: 'Results', emoji: '📊' },
] as const;

export const TRANSPORT_OPTIONS: { value: TransportMode; label: string; icon: string; factor: string }[] = [
  { value: 'car_petrol', label: 'Petrol Car', icon: '⛽', factor: '192g/km' },
  { value: 'car_diesel', label: 'Diesel Car', icon: '🚗', factor: '171g/km' },
  { value: 'car_electric', label: 'Electric Car', icon: '⚡', factor: '53g/km' },
  { value: 'motorcycle', label: 'Motorcycle', icon: '🏍️', factor: '114g/km' },
  { value: 'bus', label: 'Bus', icon: '🚌', factor: '89g/km' },
  { value: 'train', label: 'Train', icon: '🚆', factor: '41g/km' },
  { value: 'bicycle', label: 'Bicycle', icon: '🚴', factor: '0g/km' },
  { value: 'walking', label: 'Walking', icon: '🚶', factor: '0g/km' },
];

export const DIET_OPTIONS: { value: DietType; label: string; icon: string; desc: string }[] = [
  { value: 'vegan', label: 'Vegan', icon: '🌱', desc: 'No animal products' },
  { value: 'vegetarian', label: 'Vegetarian', icon: '🥦', desc: 'No meat or fish' },
  { value: 'flexitarian', label: 'Flexitarian', icon: '🥗', desc: 'Mostly plant-based' },
  { value: 'omnivore', label: 'Omnivore', icon: '🍽️', desc: 'Balanced diet' },
  { value: 'heavy_meat', label: 'Meat-heavy', icon: '🥩', desc: 'Meat at most meals' },
];

export const FLIGHT_OPTIONS: { value: FlightFrequency; label: string; desc: string }[] = [
  { value: 'never', label: 'Never', desc: 'I don\'t fly' },
  { value: 'rarely', label: 'Rarely', desc: '1-2 short flights/year' },
  { value: 'sometimes', label: 'Sometimes', desc: '3-5 flights/year' },
  { value: 'often', label: 'Often', desc: '6-10 flights/year' },
  { value: 'very_often', label: 'Very Often', desc: 'Monthly or more' },
];

export const DEFAULT_ONBOARDING_DATA: Partial<OnboardingData> = {
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

const VALID_NAME_PATTERN = /^[\w\s\-'.]+$/;

export function validateProfileName(name: string): string | null {
  const trimmed = name.trim();
  if (!trimmed || trimmed.length < 2) return 'Please enter your name (at least 2 characters)';
  if (trimmed.length > 50) return 'Name must be 50 characters or less';
  if (!VALID_NAME_PATTERN.test(trimmed)) return 'Name contains invalid characters';
  return null;
}
