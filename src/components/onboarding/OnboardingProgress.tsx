import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface OnboardingProgressProps {
  step: number;
  STEPS: { id: string; label: string; emoji: string }[];
  progress: number;
}

export function OnboardingProgress({ step, STEPS, progress }: OnboardingProgressProps) {
  return (
    <div className="w-full max-w-lg mb-6" role="progressbar" aria-valuenow={step} aria-valuemin={0} aria-valuemax={STEPS.length - 1} aria-label={`Step ${step + 1} of ${STEPS.length}`}>
      <div className="flex justify-between mb-3">
        {STEPS.map((s, i) => (
          <div
            key={s.id}
            className={`flex flex-col items-center gap-1 transition-all duration-300 ${i <= step ? 'opacity-100' : 'opacity-30'}`}
          >
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-sm transition-all duration-300"
              style={{
                background: i < step ? '#22c55e' : i === step ? 'linear-gradient(135deg, #1a6b47, #22c55e)' : 'rgba(34,197,94,0.15)',
                border: i === step ? '2px solid #22c55e' : 'none',
              }}
              aria-hidden="true"
            >
              {i < step ? <Check size={12} className="text-white" /> : <span className="text-xs">{s.emoji}</span>}
            </div>
            <span className="text-[9px] hidden sm:block" style={{ color: i <= step ? '#86efac' : '#9ca3af' }}>
              {s.label}
            </span>
          </div>
        ))}
      </div>
      <div className="progress-bar">
        <motion.div
          className="progress-fill"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>
    </div>
  );
}
