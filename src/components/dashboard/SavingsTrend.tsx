import React from 'react';
import { motion } from 'framer-motion';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } }),
};

interface SavingsTrendProps {
  chartsMounted: boolean;
  trendData: { date: string; saved: number; cumulative: number }[];
}

export function SavingsTrend({ chartsMounted, trendData }: SavingsTrendProps) {
  return (
    <motion.div custom={0} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "100px" }} className="card p-6 mb-8" role="region" aria-label="CO2 savings trend over 30 days">
      <h2 className="text-lg font-bold mb-6" style={{ color: '#f0fdf4' }}>30-Day CO₂ Savings Trend</h2>
      <div className="h-48">
        {chartsMounted && (
          <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={192}>
            <AreaChart data={trendData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="co2gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22c55e" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(34,197,94,0.08)" />
              <XAxis
                dataKey="date"
                tick={{ fill: '#9ca3af', fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                interval={6}
              />
              <YAxis tick={{ fill: '#9ca3af', fontSize: 10 }} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ background: '#0e1a13', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 8, color: '#f0fdf4' }}
                formatter={(val: number) => [`${val} kg`, 'CO₂ Saved']}
              />
              <Area
                type="monotone"
                dataKey="cumulative"
                stroke="#22c55e"
                strokeWidth={2}
                fill="url(#co2gradient)"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </motion.div>
  );
}
