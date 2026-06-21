import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { Plus, X, Flame, Leaf, CheckCircle2 } from 'lucide-react';
import { useTrackerStore, useGamificationStore } from '../store/useTrackerStore';
import { usePageTitle } from '../hooks/usePageTitle';
import type { HabitCategory } from '../types';

const PRESET_HABITS = [
  { id: 'h1', title: 'Took public transport', category: 'transport' as HabitCategory, co2Saved: 3.5, icon: '🚌' },
  { id: 'h2', title: 'Walked instead of driving', category: 'transport' as HabitCategory, co2Saved: 1.8, icon: '🚶' },
  { id: 'h3', title: 'Cycled to destination', category: 'transport' as HabitCategory, co2Saved: 2.5, icon: '🚴' },
  { id: 'h4', title: 'Turned off standby devices', category: 'energy' as HabitCategory, co2Saved: 0.3, icon: '🔌' },
  { id: 'h5', title: 'Washed at 30°C', category: 'energy' as HabitCategory, co2Saved: 0.5, icon: '👕' },
  { id: 'h6', title: 'Ate plant-based meal', category: 'food' as HabitCategory, co2Saved: 1.5, icon: '🥦' },
  { id: 'h7', title: 'Avoided food waste', category: 'food' as HabitCategory, co2Saved: 0.8, icon: '🍽️' },
  { id: 'h8', title: 'Bought second-hand', category: 'shopping' as HabitCategory, co2Saved: 4.0, icon: '♻️' },
  { id: 'h9', title: 'Recycled correctly', category: 'waste' as HabitCategory, co2Saved: 0.6, icon: '🗂️' },
  { id: 'h10', title: 'Composted food scraps', category: 'waste' as HabitCategory, co2Saved: 0.4, icon: '🌱' },
  { id: 'h11', title: 'Used reusable bag/cup', category: 'waste' as HabitCategory, co2Saved: 0.2, icon: '🛍️' },
  { id: 'h12', title: 'Skipped online delivery', category: 'shopping' as HabitCategory, co2Saved: 0.5, icon: '📦' },
];

const CATEGORY_COLORS: Record<HabitCategory | 'other', string> = {
  transport: '#22c55e',
  energy: '#f59e0b',
  food: '#3b82f6',
  shopping: '#a855f7',
  waste: '#ef4444',
  other: '#9ca3af',
};

const CATEGORY_LABELS: Record<HabitCategory | 'other', string> = {
  transport: 'Transport',
  energy: 'Energy',
  food: 'Food',
  shopping: 'Shopping',
  waste: 'Waste',
  other: 'Other',
};

export default function TrackerPage() {
  const today = format(new Date(), 'yyyy-MM-dd');
  const { logs, addLog, removeLog, getLogsForDate } = useTrackerStore();
  const { addPointsAndUpdate, streak, greenPoints } = useGamificationStore();
  usePageTitle('Tracker');
  const todayLogs = getLogsForDate(today);
  const [lastLogged, setLastLogged] = useState<string | null>(null);

  const todaySaved = todayLogs.reduce((s, l) => s + l.co2Saved, 0);
  const todayPoints = todayLogs.reduce((s, l) => s + l.greenPoints, 0);

  const handleLog = (habit: (typeof PRESET_HABITS)[0]) => {
    const log = {
      date: today,
      habitId: habit.id,
      habitTitle: habit.title,
      category: habit.category,
      co2Saved: habit.co2Saved,
      notes: '',
    };
    addLog(log);
    addPointsAndUpdate({ ...log, id: '', greenPoints: 0 });
    setLastLogged(habit.title);
    setTimeout(() => setLastLogged(null), 2500);
  };

  const recentLogs = logs.slice(0, 20);

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-black" style={{ color: '#f0fdf4' }}>Daily Tracker</h1>
        <p style={{ color: '#9ca3af' }}>Log eco-habits and watch your impact grow</p>
      </motion.div>

      {/* Today Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card p-5 mb-6 flex flex-wrap gap-6"
        role="region"
        aria-label="Today's summary"
      >
        <div>
          <p className="text-xs font-medium mb-1" style={{ color: '#9ca3af' }}>Today's CO₂ Saved</p>
          <p className="text-2xl font-black gradient-text">{todaySaved.toFixed(1)} kg</p>
        </div>
        <div>
          <p className="text-xs font-medium mb-1" style={{ color: '#9ca3af' }}>Points Earned Today</p>
          <p className="text-2xl font-black" style={{ color: '#86efac' }}>+{todayPoints}</p>
        </div>
        <div>
          <p className="text-xs font-medium mb-1" style={{ color: '#9ca3af' }}>Current Streak</p>
          <div className="flex items-center gap-2">
            <Flame size={18} className="text-amber-400" aria-hidden="true" />
            <p className="text-2xl font-black" style={{ color: '#fbbf24' }}>{streak} days</p>
          </div>
        </div>
        <div className="ml-auto flex items-center">
          <button
            onClick={() => {}}
            className="btn-primary"
            id="log-habit-btn"
            aria-label="Log a new habit"
          >
            <Plus size={18} aria-hidden="true" />
            Log Habit
          </button>
        </div>
      </motion.div>

      {/* Toast notification */}
      <AnimatePresence>
        {lastLogged && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl"
            style={{ background: '#0d4a2f', border: '1px solid rgba(34,197,94,0.3)', color: '#f0fdf4' }}
            role="status"
            aria-live="polite"
            aria-label={`Logged: ${lastLogged}`}
          >
            <CheckCircle2 size={18} className="text-green-400" aria-hidden="true" />
            <span className="text-sm font-medium">Logged: {lastLogged}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Log Grid */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-8">
        <h2 className="text-lg font-bold mb-4" style={{ color: '#f0fdf4' }}>Quick Log</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {PRESET_HABITS.map((habit) => {
            const alreadyLogged = todayLogs.some((l) => l.habitId === habit.id);
            return (
              <button
                key={habit.id}
                onClick={() => !alreadyLogged && handleLog(habit)}
                disabled={alreadyLogged}
                className={`card card-interactive p-4 text-left transition-all ${alreadyLogged ? 'opacity-50 cursor-not-allowed' : ''}`}
                aria-pressed={alreadyLogged}
                aria-label={`${habit.title}: saves ${habit.co2Saved} kg CO₂. ${alreadyLogged ? 'Already logged today' : 'Tap to log'}`}
              >
                <span className="text-2xl block mb-2" aria-hidden="true">{habit.icon}</span>
                <p className="text-sm font-medium leading-snug mb-2" style={{ color: '#f0fdf4' }}>{habit.title}</p>
                <div className="flex items-center justify-between">
                  <span
                    className="badge badge-green text-xs"
                    style={{ color: CATEGORY_COLORS[habit.category], borderColor: `${CATEGORY_COLORS[habit.category]}40`, background: `${CATEGORY_COLORS[habit.category]}15` }}
                  >
                    {CATEGORY_LABELS[habit.category]}
                  </span>
                  <span className="text-xs font-bold" style={{ color: '#22c55e' }}>-{habit.co2Saved}kg</span>
                </div>
                {alreadyLogged && (
                  <div className="flex items-center gap-1 mt-2">
                    <CheckCircle2 size={12} className="text-green-400" aria-hidden="true" />
                    <span className="text-xs" style={{ color: '#22c55e' }}>Done today!</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Recent Logs */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <h2 className="text-lg font-bold mb-4" style={{ color: '#f0fdf4' }}>Recent Activity</h2>
        {recentLogs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card p-10 text-center border border-dashed border-green-500/30"
            style={{ background: 'rgba(34,197,94,0.02)' }}
          >
            <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4" style={{ background: 'rgba(34,197,94,0.1)' }}>
              <Leaf size={32} className="text-green-500" aria-hidden="true" />
            </div>
            <p className="text-lg font-bold mb-1" style={{ color: '#f0fdf4' }}>No habits logged yet</p>
            <p className="text-sm" style={{ color: '#9ca3af' }}>Tap any habit above to start tracking your impact</p>
          </motion.div>
        ) : (
          <div className="space-y-2" role="list" aria-label="Recent habit logs">
            {recentLogs.map((log) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="card flex items-center gap-4 px-4 py-3"
                role="listitem"
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
                  style={{ background: `${CATEGORY_COLORS[log.category]}15` }}
                  aria-hidden="true"
                >
                  {PRESET_HABITS.find((h) => h.id === log.habitId)?.icon ?? '🌱'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: '#f0fdf4' }}>{log.habitTitle}</p>
                  <p className="text-xs" style={{ color: '#9ca3af' }}>{format(new Date(log.date), 'MMM d, yyyy')}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold" style={{ color: '#22c55e' }}>-{log.co2Saved}kg</p>
                  <p className="text-xs" style={{ color: '#86efac' }}>+{log.greenPoints}pts</p>
                </div>
                <button
                  onClick={() => removeLog(log.id)}
                  className="btn-ghost p-1 ml-1"
                  aria-label={`Remove log: ${log.habitTitle}`}
                >
                  <X size={14} aria-hidden="true" />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
