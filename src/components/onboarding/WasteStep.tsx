import React from 'react';
import type { OnboardingData } from '../../types';

interface WasteStepProps {
  data: Partial<OnboardingData>;
  update: <K extends keyof OnboardingData>(key: K, value: OnboardingData[K]) => void;
}

export function WasteStep({ data, update }: WasteStepProps) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl" aria-hidden="true">♻️</span>
        <div>
          <h2 className="text-2xl font-bold" style={{ color: '#f0fdf4' }}>Waste</h2>
          <p className="text-sm" style={{ color: '#9ca3af' }}>How green is your bin?</p>
        </div>
      </div>

      <label htmlFor="weekly-waste" className="block text-sm font-medium mb-2" style={{ color: '#86efac' }}>
        Weekly household waste: <strong style={{ color: '#22c55e' }}>{data.weeklyWasteKg} kg</strong>
      </label>
      <input
        id="weekly-waste"
        type="range"
        min={1}
        max={30}
        step={0.5}
        value={data.weeklyWasteKg}
        onChange={(e) => update('weeklyWasteKg', Number(e.target.value))}
        className="w-full mb-6"
      />

      <label htmlFor="recycling-rate" className="block text-sm font-medium mb-2" style={{ color: '#86efac' }}>
        Recycling rate: <strong style={{ color: '#22c55e' }}>{data.recyclingRate}%</strong>
      </label>
      <input
        id="recycling-rate"
        type="range"
        min={0}
        max={100}
        step={5}
        value={data.recyclingRate}
        onChange={(e) => update('recyclingRate', Number(e.target.value))}
        className="w-full mb-6"
      />

      <label className="flex items-center gap-3 p-4 rounded-xl cursor-pointer border border-green-500/10 hover:border-green-500/25 transition-all">
        <input
          type="checkbox"
          checked={data.compostsFood}
          onChange={(e) => update('compostsFood', e.target.checked)}
          aria-label="I compost food scraps"
        />
        <div>
          <p className="text-sm font-medium" style={{ color: '#f0fdf4' }}>🌱 I compost food scraps</p>
          <p className="text-xs" style={{ color: '#9ca3af' }}>Home or community composting</p>
        </div>
      </label>
    </div>
  );
}
