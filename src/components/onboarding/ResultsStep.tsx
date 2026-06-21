import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

export function ResultsStep() {
  return (
    <div className="text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        className="text-6xl mb-4"
        aria-hidden="true"
      >
        📊
      </motion.div>
      <h2 className="text-2xl font-bold mb-2" style={{ color: '#f0fdf4' }}>You're all set!</h2>
      <p className="mb-6" style={{ color: '#9ca3af' }}>
        We've calculated your carbon footprint and prepared personalized recommendations.
        Let's see your results on the dashboard.
      </p>
      <div className="space-y-2 text-left">
        {[
          '📊 Your personal Carbon Score',
          '🎯 5 AI-powered action recommendations',
          '📈 Live tracking dashboard',
          '🏆 Gamification & achievements',
        ].map((item) => (
          <div key={item} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(34,197,94,0.06)' }}>
            <Check size={16} className="text-green-400 flex-shrink-0" aria-hidden="true" />
            <span className="text-sm" style={{ color: '#d1fae5' }}>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
