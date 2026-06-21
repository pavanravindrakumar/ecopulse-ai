import React from 'react';
import { motion } from 'framer-motion';
import { GLOBAL_AVERAGE_ANNUAL_TONS, PARIS_TARGET_ANNUAL_TONS } from '../../utils/carbonCalc';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } }),
};

interface CarbonScoreCardProps {
  carbonScore?: {
    grade: string;
    annualTons: number;
    total: number;
    byCategory: any;
  };
  gradeColors: Record<string, string>;
}

export function CarbonScoreCard({ carbonScore, gradeColors }: CarbonScoreCardProps) {
  return (
    <motion.div custom={4} variants={fadeUp} initial="hidden" animate="visible" className="card p-8 border border-green-500/20" style={{ background: 'linear-gradient(180deg, rgba(34,197,94,0.05) 0%, rgba(7,13,10,0) 100%)' }} role="region" aria-label="Carbon score card">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2" style={{ color: '#f0fdf4' }}>
        🌍 Your Annual Footprint
      </h2>
      {carbonScore ? (
        <div className="flex items-center gap-6">
          <div className="relative flex-shrink-0">
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-black border-4"
              style={{
                borderColor: gradeColors[carbonScore.grade] ?? '#22c55e',
                color: gradeColors[carbonScore.grade] ?? '#22c55e',
                background: `${gradeColors[carbonScore.grade] ?? '#22c55e'}15`,
              }}
              role="img"
              aria-label={`Carbon grade: ${carbonScore.grade}`}
            >
              {carbonScore.grade}
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-baseline gap-2">
              <p className="text-5xl font-black gradient-text tracking-tight">
                {carbonScore.annualTons.toFixed(1)}t
              </p>
              <p className="text-sm font-medium" style={{ color: '#9ca3af' }}>CO₂e / year</p>
            </div>
            <div className="mt-4 space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1" style={{ color: '#9ca3af' }}>
                  <span>vs Global avg ({GLOBAL_AVERAGE_ANNUAL_TONS}t)</span>
                  <span style={{ color: carbonScore.annualTons < GLOBAL_AVERAGE_ANNUAL_TONS ? '#22c55e' : '#ef4444' }}>
                    {carbonScore.annualTons < GLOBAL_AVERAGE_ANNUAL_TONS ? '✓ Below avg' : '↑ Above avg'}
                  </span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${Math.min((carbonScore.annualTons / GLOBAL_AVERAGE_ANNUAL_TONS) * 100, 100)}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1" style={{ color: '#9ca3af' }}>
                  <span>Paris target ({PARIS_TARGET_ANNUAL_TONS}t)</span>
                  <span style={{ color: carbonScore.annualTons <= PARIS_TARGET_ANNUAL_TONS ? '#22c55e' : '#f59e0b' }}>
                    {carbonScore.annualTons <= PARIS_TARGET_ANNUAL_TONS ? '🎯 On track!' : '⚠ Not yet'}
                  </span>
                </div>
                <div className="progress-bar">
                  <div
                    style={{
                      height: '100%',
                      background: carbonScore.annualTons <= PARIS_TARGET_ANNUAL_TONS
                        ? 'linear-gradient(90deg, #16a34a, #22c55e)'
                        : 'linear-gradient(90deg, #b45309, #f59e0b)',
                      borderRadius: '999px',
                      width: `${Math.min((carbonScore.annualTons / PARIS_TARGET_ANNUAL_TONS) * 100, 100)}%`,
                      transition: 'width 0.8s ease',
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p style={{ color: '#9ca3af' }}>Complete onboarding to see your score.</p>
      )}
    </motion.div>
  );
}
