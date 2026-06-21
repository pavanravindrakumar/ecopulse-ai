import React from 'react';
import { motion } from 'framer-motion';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { getCategoryLabel, getCategoryColor } from '../../utils/carbonCalc';
import type { CategoryScore } from '../../types';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } }),
};

interface EmissionsBreakdownProps {
  chartsMounted: boolean;
  pieData: { name: string; value: number; color: string }[];
  byCategory?: CategoryScore;
}

export function EmissionsBreakdown({ chartsMounted, pieData, byCategory }: EmissionsBreakdownProps) {
  return (
    <motion.div custom={0} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "100px" }} className="card p-6" role="region" aria-label="Emissions breakdown by category">
      <h2 className="text-lg font-bold mb-4" style={{ color: '#f0fdf4' }}>Emissions Breakdown</h2>
      <div className="h-56">
        {chartsMounted && (
          <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={224}>
            <PieChart>
              <Pie
                data={pieData}
                cx="40%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
                dataKey="value"
                aria-label="Carbon emissions by category donut chart"
              >
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} stroke="none" />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: '#0e1a13', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 8, color: '#f0fdf4' }}
                formatter={(val: number) => [`${val} kg/mo`, '']}
              />
              <Legend
                layout="vertical"
                align="right"
                verticalAlign="middle"
                iconType="circle"
                iconSize={8}
                formatter={(val) => <span style={{ color: '#9ca3af', fontSize: '0.75rem' }}>{val}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
      {byCategory && (
        <div className="mt-3 space-y-2">
          {(Object.keys(byCategory) as (keyof CategoryScore)[])
            .sort((a, b) => byCategory[b] - byCategory[a])
            .slice(0, 3)
            .map((cat) => (
              <div key={cat} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: getCategoryColor(cat) }} aria-hidden="true" />
                  <span className="text-xs" style={{ color: '#9ca3af' }}>{getCategoryLabel(cat)}</span>
                </div>
                <span className="text-xs font-medium" style={{ color: '#f0fdf4' }}>{byCategory[cat]} kg/mo</span>
              </div>
            ))}
        </div>
      )}
    </motion.div>
  );
}
