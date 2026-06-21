import React from 'react';
import { motion } from 'framer-motion';
import type { OnboardingData } from '../../types';

interface EnergyStepProps {
  data: Partial<OnboardingData>;
  update: <K extends keyof OnboardingData>(key: K, value: OnboardingData[K]) => void;
}

export function EnergyStep({ data, update }: EnergyStepProps) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl" aria-hidden="true">⚡</span>
        <div>
          <h2 className="text-2xl font-bold" style={{ color: '#f0fdf4' }}>Energy</h2>
          <p className="text-sm" style={{ color: '#9ca3af' }}>Home energy usage</p>
        </div>
      </div>

      <label htmlFor="electricity-kwh" className="block text-sm font-medium mb-2" style={{ color: '#86efac' }}>
        Monthly electricity: <strong style={{ color: '#22c55e' }}>{data.monthlyElectricityKwh} kWh</strong>
      </label>
      <input
        id="electricity-kwh"
        type="range"
        min={50}
        max={800}
        step={10}
        value={data.monthlyElectricityKwh}
        onChange={(e) => update('monthlyElectricityKwh', Number(e.target.value))}
        className="w-full mb-2"
        aria-valuemin={50}
        aria-valuemax={800}
        aria-valuenow={data.monthlyElectricityKwh}
      />
      <div className="flex justify-between text-xs mb-6" style={{ color: '#9ca3af' }}>
        <span>50 kWh (low)</span><span>800 kWh (high)</span>
      </div>

      <div className="space-y-3 mb-6">
        <label className="flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all border border-green-500/10 hover:border-green-500/25">
          <input
            type="checkbox"
            checked={data.hasRenewableEnergy}
            onChange={(e) => update('hasRenewableEnergy', e.target.checked)}
            aria-label="I use renewable energy (solar, wind)"
          />
          <div>
            <p className="text-sm font-medium" style={{ color: '#f0fdf4' }}>🌞 Renewable energy</p>
            <p className="text-xs" style={{ color: '#9ca3af' }}>Solar panels or green tariff</p>
          </div>
        </label>
        <label className="flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all border border-green-500/10 hover:border-green-500/25">
          <input
            type="checkbox"
            checked={data.hasGasHeating}
            onChange={(e) => update('hasGasHeating', e.target.checked)}
            aria-label="I use gas heating"
          />
          <div>
            <p className="text-sm font-medium" style={{ color: '#f0fdf4' }}>🔥 Gas heating</p>
            <p className="text-xs" style={{ color: '#9ca3af' }}>Natural gas for heating/cooking</p>
          </div>
        </label>
      </div>

      {data.hasGasHeating && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <label htmlFor="gas-m3" className="block text-sm font-medium mb-2" style={{ color: '#86efac' }}>
            Monthly gas usage: <strong style={{ color: '#22c55e' }}>{data.monthlyGasM3} m³</strong>
          </label>
          <input
            id="gas-m3"
            type="range"
            min={0}
            max={200}
            step={5}
            value={data.monthlyGasM3}
            onChange={(e) => update('monthlyGasM3', Number(e.target.value))}
            className="w-full"
          />
        </motion.div>
      )}
    </div>
  );
}
