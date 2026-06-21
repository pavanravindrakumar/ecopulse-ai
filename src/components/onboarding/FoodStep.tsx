import React from 'react';
import type { OnboardingData } from '../../types';
import { DIET_OPTIONS } from './constants';

interface FoodStepProps {
  data: Partial<OnboardingData>;
  update: <K extends keyof OnboardingData>(key: K, value: OnboardingData[K]) => void;
}

export function FoodStep({ data, update }: FoodStepProps) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl" aria-hidden="true">🥗</span>
        <div>
          <h2 className="text-2xl font-bold" style={{ color: '#f0fdf4' }}>Food & Diet</h2>
          <p className="text-sm" style={{ color: '#9ca3af' }}>What you eat matters</p>
        </div>
      </div>

      <fieldset className="mb-6">
        <legend className="text-sm font-medium mb-3" style={{ color: '#86efac' }}>Diet type</legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {DIET_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => update('dietType', opt.value)}
              className={`p-3 rounded-xl text-left transition-all border ${
                data.dietType === opt.value
                  ? 'border-green-500 bg-green-500/15'
                  : 'border-green-500/10 hover:border-green-500/25'
              }`}
              aria-pressed={data.dietType === opt.value}
            >
              <span className="text-xl block mb-1" aria-hidden="true">{opt.icon}</span>
              <span className="text-xs font-medium block" style={{ color: '#f0fdf4' }}>{opt.label}</span>
              <span className="text-[11px]" style={{ color: '#9ca3af' }}>{opt.desc}</span>
            </button>
          ))}
        </div>
      </fieldset>

      <label htmlFor="local-food" className="block text-sm font-medium mb-2" style={{ color: '#86efac' }}>
        Local/seasonal food: <strong style={{ color: '#22c55e' }}>{data.localFoodPercentage}%</strong>
      </label>
      <input
        id="local-food"
        type="range"
        min={0}
        max={100}
        step={5}
        value={data.localFoodPercentage}
        onChange={(e) => update('localFoodPercentage', Number(e.target.value))}
        className="w-full mb-6"
      />

      <label htmlFor="food-waste" className="block text-sm font-medium mb-2" style={{ color: '#86efac' }}>
        Food waste level: <strong style={{ color: data.foodWasteLevel! <= 2 ? '#22c55e' : data.foodWasteLevel! <= 3 ? '#f59e0b' : '#ef4444' }}>
          {['', 'Very low', 'Low', 'Moderate', 'High', 'Very high'][data.foodWasteLevel!]}
        </strong>
      </label>
      <input
        id="food-waste"
        type="range"
        min={1}
        max={5}
        step={1}
        value={data.foodWasteLevel}
        onChange={(e) => update('foodWasteLevel', Number(e.target.value))}
        className="w-full"
      />
    </div>
  );
}
