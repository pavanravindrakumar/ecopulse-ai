import React from 'react';
import type { OnboardingData } from '../../types';

interface ShoppingStepProps {
  data: Partial<OnboardingData>;
  update: <K extends keyof OnboardingData>(key: K, value: OnboardingData[K]) => void;
}

export function ShoppingStep({ data, update }: ShoppingStepProps) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl" aria-hidden="true">🛍️</span>
        <div>
          <h2 className="text-2xl font-bold" style={{ color: '#f0fdf4' }}>Shopping</h2>
          <p className="text-sm" style={{ color: '#9ca3af' }}>Consumption patterns</p>
        </div>
      </div>

      <label htmlFor="online-purchases" className="block text-sm font-medium mb-2" style={{ color: '#86efac' }}>
        Monthly online orders: <strong style={{ color: '#22c55e' }}>{data.monthlyOnlinePurchases}</strong>
      </label>
      <input
        id="online-purchases"
        type="range"
        min={0}
        max={30}
        step={1}
        value={data.monthlyOnlinePurchases}
        onChange={(e) => update('monthlyOnlinePurchases', Number(e.target.value))}
        className="w-full mb-6"
      />

      <label htmlFor="fast-fashion" className="block text-sm font-medium mb-2" style={{ color: '#86efac' }}>
        Fast fashion frequency: <strong style={{ color: data.fastFashionFrequency! <= 2 ? '#22c55e' : data.fastFashionFrequency! <= 3 ? '#f59e0b' : '#ef4444' }}>
          {['', 'Rarely', 'Occasionally', 'Monthly', 'Often', 'Very often'][data.fastFashionFrequency!]}
        </strong>
      </label>
      <input
        id="fast-fashion"
        type="range"
        min={1}
        max={5}
        step={1}
        value={data.fastFashionFrequency}
        onChange={(e) => update('fastFashionFrequency', Number(e.target.value))}
        className="w-full mb-6"
      />

      <label className="flex items-center gap-3 p-4 rounded-xl cursor-pointer border border-green-500/10 hover:border-green-500/25 transition-all">
        <input
          type="checkbox"
          checked={data.buySecondHand}
          onChange={(e) => update('buySecondHand', e.target.checked)}
          aria-label="I regularly buy second-hand items"
        />
        <div>
          <p className="text-sm font-medium" style={{ color: '#f0fdf4' }}>♻️ I buy second-hand regularly</p>
          <p className="text-xs" style={{ color: '#9ca3af' }}>Charity shops, eBay, Vinted, etc.</p>
        </div>
      </label>
    </div>
  );
}
