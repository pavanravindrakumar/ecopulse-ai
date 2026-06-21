import React from 'react';
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } }),
};

export interface StatItem {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub: string;
  color: string;
}

interface DashboardStatsProps {
  stats: StatItem[];
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8" role="region" aria-label="Key statistics">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          custom={i}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="card p-5"
          aria-label={`${stat.label}: ${stat.value}`}
        >
          <div className="flex items-center gap-2 mb-3" style={{ color: stat.color }}>
            {stat.icon}
            <span className="text-xs font-medium" style={{ color: '#9ca3af' }}>{stat.label}</span>
          </div>
          <p className="text-2xl font-black" style={{ color: stat.color }}>{stat.value}</p>
          <p className="text-xs mt-1" style={{ color: '#9ca3af' }}>{stat.sub}</p>
        </motion.div>
      ))}
    </div>
  );
}
