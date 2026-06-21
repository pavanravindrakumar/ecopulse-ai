import React from 'react';
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } }),
};

interface LevelProgressCardProps {
  levelInfo: {
    label: string;
    icon: string;
    color: string;
    minPoints: number;
    maxPoints: number;
  };
  levelProgress: number;
  greenPoints: number;
}

export function LevelProgressCard({ levelInfo, levelProgress, greenPoints }: LevelProgressCardProps) {
  return (
    <motion.div custom={0} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "100px" }} className="card p-6" role="region" aria-label="Level progress">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold" style={{ color: '#f0fdf4' }}>Your Level</h2>
        <span className="text-2xl" aria-hidden="true">{levelInfo.icon}</span>
      </div>
      <div className="flex items-center gap-4 mb-4">
        <div>
          <p className="text-xl font-black" style={{ color: levelInfo.color }}>{levelInfo.label}</p>
          <p className="text-sm" style={{ color: '#9ca3af' }}>{greenPoints} / {levelInfo.maxPoints === Infinity ? '∞' : levelInfo.maxPoints} pts</p>
        </div>
      </div>
      <div className="progress-bar mb-2">
        <motion.div
          className="progress-fill"
          initial={{ width: 0 }}
          animate={{ width: `${levelProgress}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          role="progressbar"
          aria-valuenow={levelProgress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Level progress: ${levelProgress}%`}
        />
      </div>
      <div className="flex justify-between text-xs" style={{ color: '#9ca3af' }}>
        <span>{levelInfo.label}</span>
        <span>{levelProgress}% to next level</span>
      </div>
    </motion.div>
  );
}
