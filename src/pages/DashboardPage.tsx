import { useUserStore } from '../store/useUserStore';
import { useGamificationStore, useTrackerStore } from '../store/useTrackerStore';
import { getCategoryLabel, getCategoryColor } from '../utils/carbonCalc';
import { getLevelInfo, getLevelProgress } from '../utils/gamification';
import type { CategoryScore } from '../types';
import { format, subDays } from 'date-fns';
import { TrendingDown, Award, Flame, Leaf } from 'lucide-react';
import { usePageTitle } from '../hooks/usePageTitle';
import { useMemo, useState, useEffect } from 'react';

import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { DashboardStats } from '../components/dashboard/DashboardStats';
import { CarbonScoreCard } from '../components/dashboard/CarbonScoreCard';
import { EmissionsBreakdown } from '../components/dashboard/EmissionsBreakdown';
import { SavingsTrend } from '../components/dashboard/SavingsTrend';
import { LevelProgressCard } from '../components/dashboard/LevelProgressCard';

export default function DashboardPage() {
  usePageTitle('Dashboard');
  const profile = useUserStore((s) => s.profile);
  const { greenPoints, level, streak, totalCo2Saved } = useGamificationStore();
  const logs = useTrackerStore((s) => s.logs);
  const levelInfo = getLevelInfo(level);
  const levelProgress = getLevelProgress(greenPoints);

  const carbonScore = profile?.carbonScore;
  const byCategory = carbonScore?.byCategory;

  const [chartsMounted, setChartsMounted] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setChartsMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const pieData = useMemo(() => byCategory
    ? (Object.keys(byCategory) as (keyof CategoryScore)[]).map((cat) => ({
        name: getCategoryLabel(cat),
        value: byCategory[cat],
        color: getCategoryColor(cat),
      }))
    : [], [byCategory]);

  const trendData = useMemo(() => Array.from({ length: 30 }, (_, i) => {
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
  })), [logs]);

  const gradeColors: Record<string, string> = {
    'A+': '#22c55e', A: '#4ade80', B: '#86efac', C: '#f59e0b', D: '#f97316', F: '#ef4444',
  };

  const stats = useMemo(() => [
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
  ], [carbonScore, totalCo2Saved, streak, greenPoints, levelInfo.label]);

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      <DashboardHeader profileName={profile?.name} />
      <DashboardStats stats={stats} />
      
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <CarbonScoreCard carbonScore={carbonScore} gradeColors={gradeColors} />
        <EmissionsBreakdown chartsMounted={chartsMounted} pieData={pieData} byCategory={byCategory} />
      </div>

      <SavingsTrend chartsMounted={chartsMounted} trendData={trendData} />
      <LevelProgressCard levelInfo={levelInfo} levelProgress={levelProgress} greenPoints={greenPoints} />
    </div>
  );
}
