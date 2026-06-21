import { motion } from 'framer-motion';
import { useUserStore } from '../store/useUserStore';
import { useGamificationStore } from '../store/useTrackerStore';
import { useTrackerStore } from '../store/useTrackerStore';
import { getCategoryLabel, getCategoryColor, GLOBAL_AVERAGE_ANNUAL_TONS, PARIS_TARGET_ANNUAL_TONS } from '../utils/carbonCalc';
import { getLevelInfo, getLevelProgress } from '../utils/gamification';
import type { CategoryScore, UserLevel } from '../types';
import {
  ResponsiveContainer,
  PieChart, Pie, Cell, Tooltip, Legend,
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import { format, subDays } from 'date-fns';
import { TrendingDown, Award, Flame, Leaf } from 'lucide-react';
import { usePageTitle } from '../hooks/usePageTitle';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } }),
};

export default function DashboardPage() {
  usePageTitle('Dashboard');
  const profile = useUserStore((s) => s.profile);
  const { greenPoints, level, streak, totalCo2Saved } = useGamificationStore();
  const logs = useTrackerStore((s) => s.logs);
  const levelInfo = getLevelInfo(level as UserLevel);
  const levelProgress = getLevelProgress(greenPoints);

  const carbonScore = profile?.carbonScore;
  const byCategory = carbonScore?.byCategory;

  // Pie chart data
  const pieData = byCategory
    ? (Object.keys(byCategory) as (keyof CategoryScore)[]).map((cat) => ({
        name: getCategoryLabel(cat),
        value: byCategory[cat],
        color: getCategoryColor(cat),
      }))
    : [];

  // Trend data — simulate last 30 days of progress
  const trendData = Array.from({ length: 30 }, (_, i) => {
    const date = subDays(new Date(), 29 - i);
    const dateStr = format(date, 'yyyy-MM-dd');
    const dayLogs = logs.filter((l) => l.date === dateStr);
    const saved = dayLogs.reduce((s, l) => s + l.co2Saved, 0);
    return {
      date: format(date, 'MMM d'),
      saved: Math.round(saved * 10) / 10,
      cumulative: 0,
    };
  }).map((d, i, arr) => ({
    ...d,
    cumulative: Math.round(arr.slice(0, i + 1).reduce((s, x) => s + x.saved, 0) * 10) / 10,
  }));

  const gradeColors: Record<string, string> = {
    'A+': '#22c55e', A: '#4ade80', B: '#86efac', C: '#f59e0b', D: '#f97316', F: '#ef4444',
  };

  const stats = [
    {
      icon: <TrendingDown size={20} aria-hidden="true" />,
      label: 'Monthly Footprint',
      value: carbonScore ? `${carbonScore.total.toLocaleString()} kg` : '—',
      sub: 'CO₂e per month',
      color: '#22c55e',
    },
    {
      icon: <Leaf size={20} aria-hidden="true" />,
      label: 'CO₂ Saved',
      value: `${totalCo2Saved.toFixed(1)} kg`,
      sub: 'through tracked habits',
      color: '#4ade80',
    },
    {
      icon: <Flame size={20} aria-hidden="true" />,
      label: 'Current Streak',
      value: `${streak} days`,
      sub: streak > 0 ? 'Keep it up!' : 'Start logging today',
      color: '#f59e0b',
    },
    {
      icon: <Award size={20} aria-hidden="true" />,
      label: 'Green Points',
      value: greenPoints.toLocaleString(),
      sub: `${levelInfo.label} level`,
      color: '#86efac',
    },
  ];

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible" className="mb-8">
        <h1 className="text-4xl md:text-5xl font-black mb-2" style={{ color: '#f0fdf4' }}>
          Hi, {profile?.name} 👋
        </h1>
        <p className="text-lg" style={{ color: '#9ca3af' }}>
          Your carbon overview for {format(new Date(), 'MMMM yyyy')}
        </p>
      </motion.div>

      {/* Stats Grid */}
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

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Carbon Score Card */}
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

        {/* Breakdown Donut */}
        <motion.div custom={5} variants={fadeUp} initial="hidden" animate="visible" className="card p-6" role="region" aria-label="Emissions breakdown by category">
          <h2 className="text-lg font-bold mb-4" style={{ color: '#f0fdf4' }}>Emissions Breakdown</h2>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
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
      </div>

      {/* Progress Trend Chart */}
      <motion.div custom={6} variants={fadeUp} initial="hidden" animate="visible" className="card p-6 mb-8" role="region" aria-label="CO2 savings trend over 30 days">
        <h2 className="text-lg font-bold mb-6" style={{ color: '#f0fdf4' }}>30-Day CO₂ Savings Trend</h2>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
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
        </div>
      </motion.div>

      {/* Level Progress */}
      <motion.div custom={7} variants={fadeUp} initial="hidden" animate="visible" className="card p-6" role="region" aria-label="Level progress">
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
    </div>
  );
}
