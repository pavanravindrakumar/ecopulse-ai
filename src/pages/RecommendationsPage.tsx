import { motion } from 'framer-motion';
import { useUserStore } from '../store/useUserStore';
import { useGamificationStore } from '../store/useTrackerStore';
import { CheckCircle2, Circle, Zap, TrendingDown } from 'lucide-react';
import { usePageTitle } from '../hooks/usePageTitle';

const DIFFICULTY_LABELS = ['', 'Very Easy', 'Easy', 'Moderate', 'Hard', 'Very Hard'];
const DIFFICULTY_COLORS = ['', '#22c55e', '#4ade80', '#f59e0b', '#f97316', '#ef4444'];
const IMPACT_COLORS = { low: '#9ca3af', medium: '#f59e0b', high: '#22c55e', very_high: '#4ade80' };
const IMPACT_LABELS = { low: 'Low Impact', medium: 'Medium Impact', high: 'High Impact', very_high: 'Very High Impact' };

export default function RecommendationsPage() {
  usePageTitle('AI Actions');
  const profile = useUserStore((s) => s.profile);
  const markComplete = useUserStore((s) => s.markRecommendationComplete);
  const unlockBadge = useGamificationStore((s) => s.unlockBadge);
  const addPoints = useGamificationStore((s) => s.addPointsAndUpdate);

  const recommendations = profile?.recommendations ?? [];

  const handleToggle = (id: string) => {
    const rec = recommendations.find((r) => r.id === id);
    if (!rec?.completed) {
      // First time completing
      unlockBadge('recommendation_accepted');
      addPoints({
        id: '',
        date: new Date().toISOString().split('T')[0],
        habitId: id,
        habitTitle: rec?.title ?? '',
        category: rec?.category ?? 'other',
        co2Saved: rec ? rec.co2SavedKgPerYear / 52 : 1, // weekly equivalent
        notes: '',
        greenPoints: 0,
      });
    }
    markComplete(id);
  };

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(34,197,94,0.1)' }} aria-hidden="true">
            <Zap size={20} className="text-green-400" />
          </div>
          <div>
            <h1 className="text-3xl font-black" style={{ color: '#f0fdf4' }}>AI Actions</h1>
            <p style={{ color: '#9ca3af' }}>Personalized for your lifestyle</p>
          </div>
        </div>
      </motion.div>

      {/* Summary bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card p-4 mb-6 flex flex-wrap gap-6"
        role="region"
        aria-label="Recommendations summary"
      >
        <div>
          <p className="text-xs" style={{ color: '#9ca3af' }}>Total Potential Saving</p>
          <p className="text-xl font-black gradient-text">
            {recommendations.reduce((s, r) => s + r.co2SavedKgPerYear, 0).toLocaleString()} kg/year
          </p>
        </div>
        <div>
          <p className="text-xs" style={{ color: '#9ca3af' }}>Completed</p>
          <p className="text-xl font-black" style={{ color: '#86efac' }}>
            {recommendations.filter((r) => r.completed).length}/{recommendations.length}
          </p>
        </div>
        <div>
          <p className="text-xs" style={{ color: '#9ca3af' }}>CO₂ Saved This Week</p>
          <p className="text-xl font-black" style={{ color: '#4ade80' }}>
            {recommendations
              .filter((r) => r.completed)
              .reduce((s, r) => s + Math.round(r.co2SavedKgPerYear / 52), 0)} kg
          </p>
        </div>
      </motion.div>

      {/* Recommendations List */}
      <div className="space-y-4" role="list" aria-label="AI recommendations list">
        {recommendations.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card p-12 text-center mt-6 border border-dashed border-green-500/30"
            style={{ background: 'rgba(34,197,94,0.02)' }}
          >
            <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6" style={{ background: 'rgba(34,197,94,0.1)' }}>
              <Zap size={40} className="text-green-500" aria-hidden="true" />
            </div>
            <p className="text-xl font-bold mb-2" style={{ color: '#f0fdf4' }}>No recommendations yet</p>
            <p className="text-sm" style={{ color: '#9ca3af' }}>Complete the onboarding assessment to unlock your personalized eco-action plan.</p>
          </motion.div>
        ) : (
          recommendations.map((rec, i) => (
            <motion.div
              key={rec.id}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className={`card p-5 transition-all duration-200 ${rec.completed ? 'opacity-70' : ''}`}
              role="listitem"
            >
              <div className="flex gap-4">
                {/* Icon */}
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ background: rec.completed ? 'rgba(34,197,94,0.15)' : 'rgba(34,197,94,0.08)' }}
                  aria-hidden="true"
                >
                  {rec.icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3
                      className="font-bold leading-snug"
                      style={{ color: rec.completed ? '#9ca3af' : '#f0fdf4', textDecoration: rec.completed ? 'line-through' : 'none' }}
                    >
                      {rec.title}
                    </h3>
                    <button
                      onClick={() => handleToggle(rec.id)}
                      className={`flex-shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold transition-all duration-200 border ${
                        rec.completed
                          ? 'border-gray-700 text-gray-500 hover:text-gray-400 hover:bg-gray-800/50'
                          : 'border-green-500/30 text-green-400 hover:bg-green-500/10'
                      }`}
                      aria-label={rec.completed ? `Mark ${rec.title} as incomplete` : `Mark ${rec.title} as complete`}
                      aria-pressed={rec.completed}
                    >
                      {rec.completed ? (
                        <>
                          <CheckCircle2 size={16} aria-hidden="true" />
                          Done
                        </>
                      ) : (
                        <>
                          <Circle size={16} aria-hidden="true" />
                          Do it
                        </>
                      )}
                    </button>
                  </div>

                  <p className="text-sm mb-3 leading-relaxed" style={{ color: '#9ca3af' }}>{rec.description}</p>

                  {/* Weekly goal */}
                  <div className="p-2 rounded-lg mb-3" style={{ background: 'rgba(34,197,94,0.06)', borderLeft: '3px solid rgba(34,197,94,0.4)' }}>
                    <p className="text-xs font-medium" style={{ color: '#86efac' }}>
                      📅 This week: {rec.weeklyGoal}
                    </p>
                  </div>

                  {/* Meta tags */}
                  <div className="flex flex-wrap gap-2">
                    <span className="badge" style={{ background: `${IMPACT_COLORS[rec.impact]}15`, color: IMPACT_COLORS[rec.impact], border: `1px solid ${IMPACT_COLORS[rec.impact]}40` }}>
                      <TrendingDown size={10} aria-hidden="true" />
                      {IMPACT_LABELS[rec.impact]}
                    </span>
                    <span className="badge" style={{ background: `${DIFFICULTY_COLORS[rec.difficulty]}15`, color: DIFFICULTY_COLORS[rec.difficulty], border: `1px solid ${DIFFICULTY_COLORS[rec.difficulty]}40` }}>
                      {DIFFICULTY_LABELS[rec.difficulty]}
                    </span>
                    <span className="badge badge-green">
                      💚 {rec.co2SavedKgPerYear} kg/year
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Motivational footer */}
      {recommendations.filter((r) => r.completed).length === recommendations.length && recommendations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-6 card p-6 text-center"
          style={{ background: 'linear-gradient(135deg, rgba(22,163,74,0.1), rgba(74,222,128,0.05))' }}
          role="status"
          aria-live="polite"
        >
          <p className="text-3xl mb-2" aria-hidden="true">🎉</p>
          <p className="font-bold text-lg" style={{ color: '#f0fdf4' }}>All actions complete!</p>
          <p className="text-sm mt-1" style={{ color: '#9ca3af' }}>You're making a real difference. Check back tomorrow for new challenges.</p>
        </motion.div>
      )}
    </div>
  );
}
