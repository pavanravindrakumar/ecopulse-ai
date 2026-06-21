import type { TransportMode, DietType, FlightFrequency } from '../../types';

export const STEPS = [
  { id: 'welcome', label: 'Welcome', emoji: '👋' },
  { id: 'transport', label: 'Transport', emoji: '🚗' },
  { id: 'energy', label: 'Energy', emoji: '⚡' },
  { id: 'food', label: 'Food', emoji: '🥗' },
  { id: 'shopping', label: 'Shopping', emoji: '🛍️' },
  { id: 'waste', label: 'Waste', emoji: '♻️' },
  { id: 'results', label: 'Results', emoji: '📊' },
];

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
