import { motion } from 'framer-motion';
import { useTrackerStore } from '../store/useTrackerStore';
import { useGamificationStore } from '../store/useTrackerStore';
import { useUserStore } from '../store/useUserStore';
import { getCategoryLabel, getCategoryColor } from '../utils/carbonCalc';
import type { CategoryScore } from '../types';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { format, subMonths } from 'date-fns';
import { TrendingDown, Calendar, Target } from 'lucide-react';
import { usePageTitle } from '../hooks/usePageTitle';

export default function InsightsPage() {
  usePageTitle('Insights');
  const logs = useTrackerStore((s) => s.logs);
  const { greenPoints, streak, totalCo2Saved, badges } = useGamificationStore();
  const carbonScore = useUserStore((s) => s.profile?.carbonScore);

  // Monthly data for last 6 months
  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const monthDate = subMonths(new Date(), 5 - i);
    const monthStr = format(monthDate, 'yyyy-MM');
    const monthLogs = logs.filter((l) => l.date.startsWith(monthStr));
    const saved = monthLogs.reduce((s, l) => s + l.co2Saved, 0);
    const points = monthLogs.reduce((s, l) => s + l.greenPoints, 0);
    return {
      month: format(monthDate, 'MMM'),
      saved: Math.round(saved * 10) / 10,
      logs: monthLogs.length,
      points,
    };
  });

  // Category breakdown from logs
  const categoryTotals: Record<string, number> = {};
  logs.forEach((l) => {
    categoryTotals[l.category] = (categoryTotals[l.category] || 0) + l.co2Saved;
  });
  const categoryData = Object.entries(categoryTotals)
    .map(([cat, total]) => ({
      name: getCategoryLabel(cat as keyof CategoryScore),
      value: Math.round(total * 10) / 10,
      color: getCategoryColor(cat as keyof CategoryScore),
    }))
    .sort((a, b) => b.value - a.value);

  // Best month
  const bestMonth = monthlyData.reduce((best, m) => (m.saved > best.saved ? m : best), monthlyData[0]);

  // Top emission category
  const byCategory = carbonScore?.byCategory;
  const topEmitter = byCategory
    ? (Object.keys(byCategory) as (keyof CategoryScore)[]).reduce((a, b) => (byCategory[a] > byCategory[b] ? a : b))
    : null;

  const unlockedBadges = badges.filter((b) => b.unlocked).length;

  const kpiCards = [
    { label: 'Total CO₂ Saved', value: `${totalCo2Saved.toFixed(1)} kg`, icon: '🌱', color: '#22c55e' },
    { label: 'Longest Streak', value: `${streak} days`, icon: '🔥', color: '#f59e0b' },
    { label: 'Total Green Points', value: greenPoints.toLocaleString(), icon: '⭐', color: '#86efac' },
    { label: 'Badges Earned', value: `${unlockedBadges}`, icon: '🏆', color: '#a855f7' },
  ];

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-black" style={{ color: '#f0fdf4' }}>Insights</h1>
        <p style={{ color: '#9ca3af' }}>Your sustainability story at a glance</p>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8" role="region" aria-label="Key performance indicators">
        {kpiCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="card p-5 text-center"
            aria-label={`${card.label}: ${card.value}`}
          >
            <div className="text-3xl mb-2" aria-hidden="true">{card.icon}</div>
            <p className="text-2xl font-black" style={{ color: card.color }}>{card.value}</p>
            <p className="text-xs mt-1" style={{ color: '#9ca3af' }}>{card.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Spotlight Cards */}
      <div className="grid md:grid-cols-3 gap-4 mb-8" role="region" aria-label="Key findings">
        {topEmitter && byCategory && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card p-5">
            <div className="flex items-center gap-2 mb-3">
              <Target size={16} className="text-red-400" aria-hidden="true" />
              <span className="text-xs font-medium" style={{ color: '#9ca3af' }}>Top Emitter</span>
            </div>
            <p className="text-xl font-black" style={{ color: '#ef4444' }}>
              {getCategoryLabel(topEmitter)}
            </p>
            <p className="text-sm mt-1" style={{ color: '#9ca3af' }}>
              {byCategory[topEmitter]} kg/mo · Focus here first
            </p>
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="card p-5">
          <div className="flex items-center gap-2 mb-3">
            <TrendingDown size={16} className="text-green-400" aria-hidden="true" />
            <span className="text-xs font-medium" style={{ color: '#9ca3af' }}>Best Month</span>
          </div>
          <p className="text-xl font-black gradient-text">{bestMonth?.month ?? '—'}</p>
          <p className="text-sm mt-1" style={{ color: '#9ca3af' }}>
            {bestMonth?.saved ?? 0} kg saved · {bestMonth?.logs ?? 0} logs
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="card p-5">
          <div className="flex items-center gap-2 mb-3">
            <Calendar size={16} className="text-blue-400" aria-hidden="true" />
            <span className="text-xs font-medium" style={{ color: '#9ca3af' }}>Annual Projection</span>
          </div>
          <p className="text-xl font-black" style={{ color: '#3b82f6' }}>
            {(totalCo2Saved / Math.max(logs.length, 1) * 365).toFixed(0)} kg
          </p>
          <p className="text-sm mt-1" style={{ color: '#9ca3af' }}>estimated yearly savings</p>
        </motion.div>
      </div>

      {/* Monthly Savings Bar Chart */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="card p-6 mb-6" role="region" aria-label="Monthly CO2 savings chart">
        <h2 className="text-lg font-bold mb-6" style={{ color: '#f0fdf4' }}>Monthly CO₂ Saved (kg)</h2>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={208}>
            <BarChart data={monthlyData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(34,197,94,0.08)" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: '#9ca3af', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#0e1a13', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 8, color: '#f0fdf4' }}
                formatter={(val: number) => [`${val} kg`, 'CO₂ Saved']}
              />
              <Bar dataKey="saved" fill="#22c55e" radius={[4, 4, 0, 0]} maxBarSize={48} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Category Breakdown */}
      {categoryData.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="card p-6" role="region" aria-label="CO2 saved by category">
          <h2 className="text-lg font-bold mb-4" style={{ color: '#f0fdf4' }}>Savings by Category</h2>
          <div className="space-y-4">
            {categoryData.map((cat) => {
              const max = categoryData[0].value;
              return (
                <div key={cat.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span style={{ color: '#d1fae5' }}>{cat.name}</span>
                    <span className="font-medium" style={{ color: cat.color }}>{cat.value} kg saved</span>
                  </div>
                  <div className="progress-bar">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(cat.value / max) * 100}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      style={{ height: '100%', background: cat.color, borderRadius: '999px' }}
                      role="progressbar"
                      aria-valuenow={Math.round((cat.value / max) * 100)}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`${cat.name}: ${cat.value} kg`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {logs.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card p-12 text-center mt-6 border border-dashed border-green-500/30"
          style={{ background: 'rgba(34,197,94,0.02)' }}
        >
          <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6" style={{ background: 'rgba(34,197,94,0.1)' }}>
            <TrendingDown size={40} className="text-green-500" aria-hidden="true" />
          </div>
          <p className="text-xl font-bold mb-2" style={{ color: '#f0fdf4' }}>Your Journey Starts Here</p>
          <p className="text-sm" style={{ color: '#9ca3af' }}>Log your first eco-habit in the Tracker to start generating personalized insights and charts.</p>
        </motion.div>
      )}
    </div>
  );
}
