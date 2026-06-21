import React from 'react';
import type { OnboardingData } from '../../types';
import { TRANSPORT_OPTIONS, FLIGHT_OPTIONS } from './constants';

interface TransportStepProps {
  data: Partial<OnboardingData>;
  update: <K extends keyof OnboardingData>(key: K, value: OnboardingData[K]) => void;
}

export function TransportStep({ data, update }: TransportStepProps) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl" aria-hidden="true">🚗</span>
        <div>
          <h2 className="text-2xl font-bold" style={{ color: '#f0fdf4' }}>Transport</h2>
          <p className="text-sm" style={{ color: '#9ca3af' }}>How do you get around?</p>
        </div>
      </div>

      <fieldset>
        <legend className="text-sm font-medium mb-3" style={{ color: '#86efac' }}>
          Primary mode of transport
        </legend>
        <div className="grid grid-cols-2 gap-2 mb-6">
          {TRANSPORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => update('primaryTransport', opt.value)}
              className={`p-3 rounded-xl text-left transition-all duration-200 border ${
                data.primaryTransport === opt.value
                  ? 'border-green-500 bg-green-500/15'
                  : 'border-green-500/15 hover:border-green-500/30'
              }`}
              aria-pressed={data.primaryTransport === opt.value}
              aria-label={`${opt.label}: ${opt.factor}`}
            >
              <span className="text-lg block mb-1" aria-hidden="true">{opt.icon}</span>
              <span className="text-sm font-medium block" style={{ color: '#f0fdf4' }}>{opt.label}</span>
              <span className="text-xs" style={{ color: '#9ca3af' }}>{opt.factor}</span>
            </button>
          ))}
        </div>
      </fieldset>

      <label htmlFor="weekly-km" className="block text-sm font-medium mb-2" style={{ color: '#86efac' }}>
        Weekly distance: <strong style={{ color: '#22c55e' }}>{data.weeklyKm} km</strong>
      </label>
      <input
        id="weekly-km"
        type="range"
        min={0}
        max={1000}
        step={10}
        value={data.weeklyKm}
        onChange={(e) => update('weeklyKm', Number(e.target.value))}
        className="w-full mb-6"
        aria-valuemin={0}
        aria-valuemax={1000}
        aria-valuenow={data.weeklyKm}
      />

      <fieldset>
        <legend className="text-sm font-medium mb-2" style={{ color: '#86efac' }}>Flight frequency</legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {FLIGHT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => update('flightFrequency', opt.value)}
              className={`p-2 rounded-xl text-left transition-all border ${
                data.flightFrequency === opt.value
                  ? 'border-green-500 bg-green-500/15'
                  : 'border-green-500/10 hover:border-green-500/25'
              }`}
              aria-pressed={data.flightFrequency === opt.value}
            >
              <span className="text-xs font-medium block" style={{ color: '#f0fdf4' }}>{opt.label}</span>
              <span className="text-[11px]" style={{ color: '#9ca3af' }}>{opt.desc}</span>
            </button>
          ))}
        </div>
      </fieldset>
    </div>
  );
}
