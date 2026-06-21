import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGamificationStore } from '../store/useTrackerStore';
import { LEVELS, getLevelInfo, getLevelProgress } from '../utils/gamification';
import { Lock, Share2, CheckCircle2 } from 'lucide-react';
import { usePageTitle } from '../hooks/usePageTitle';


export default function GamificationPage() {
  const { greenPoints, level, badges, longestStreak, totalCo2Saved } = useGamificationStore();
  usePageTitle('Achievements');
  const levelInfo = getLevelInfo(level);
  const levelProgress = getLevelProgress(greenPoints);
  const unlockedBadges = badges.filter((b) => b.unlocked);
  const lockedBadges = badges.filter((b) => !b.unlocked);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black" style={{ color: '#f0fdf4' }}>Achievements</h1>
          <p style={{ color: '#9ca3af' }}>Your eco-warrior journey</p>
        </div>
        <button
          onClick={() => {
            const text = `I just reached ${levelInfo.label} on EcoPulse AI! 🌿 I've saved ${totalCo2Saved.toFixed(0)}kg of CO₂. Join me!`;
            if (navigator.share) {
              navigator.share({ title: 'EcoPulse AI', text }).catch(() => {});
            } else {
              navigator.clipboard.writeText(text);
              setToastMessage('Copied to clipboard!');
              setTimeout(() => setToastMessage(null), 2500);
            }
          }}
          className="btn-secondary flex items-center gap-2 text-sm px-4 py-2"
          aria-label="Share your progress"
        >
          <Share2 size={16} aria-hidden="true" />
          Share
        </button>
      </motion.div>

      {/* Toast notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl"
            style={{ background: '#0d4a2f', border: '1px solid rgba(34,197,94,0.3)', color: '#f0fdf4' }}
            role="status"
            aria-live="polite"
          >
            <CheckCircle2 size={18} className="text-green-400" aria-hidden="true" />
            <span className="text-sm font-medium">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Level Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-3xl p-8 mb-8 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0d4a2f 0%, #1a6b47 50%, #0d4a2f 100%)' }}
        role="region"
        aria-label="Current level and progress"
      >
        <div className="absolute inset-0 animate-shimmer opacity-30 pointer-events-none" aria-hidden="true" />
        <div className="relative z-10 flex items-center gap-6">
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="text-6xl"
            aria-hidden="true"
          >
            {levelInfo.icon}
          </motion.div>
          <div className="flex-1">
            <p className="text-sm font-medium mb-1" style={{ color: 'rgba(240,253,244,0.6)' }}>Current Level</p>
            <h2 className="text-3xl font-black mb-1" style={{ color: '#f0fdf4' }}>{levelInfo.label}</h2>
            <p className="text-lg font-bold" style={{ color: '#86efac' }}>{greenPoints.toLocaleString()} Green Points</p>
            <div className="mt-4">
              <div className="h-2 rounded-full mb-2" style={{ background: 'rgba(255,255,255,0.1)' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${levelProgress}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="h-full rounded-full"
                  style={{ background: 'linear-gradient(90deg, #86efac, #22c55e)' }}
                  role="progressbar"
                  aria-valuenow={levelProgress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`Level progress: ${levelProgress}%`}
                />
              </div>
              <p className="text-xs" style={{ color: 'rgba(240,253,244,0.5)' }}>
                {levelProgress}% to next level
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4 mb-8" role="region" aria-label="Achievement statistics">
        {[
          { label: 'Best Streak', value: `${longestStreak}d`, icon: '🔥' },
          { label: 'CO₂ Saved', value: `${totalCo2Saved.toFixed(0)}kg`, icon: '🌍' },
          { label: 'Badges', value: `${unlockedBadges.length}/${badges.length}`, icon: '🏅' },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.05 }}
            className="card p-4 text-center"
            aria-label={`${s.label}: ${s.value}`}
          >
            <p className="text-2xl mb-1" aria-hidden="true">{s.icon}</p>
            <p className="text-xl font-black gradient-text">{s.value}</p>
            <p className="text-xs mt-1" style={{ color: '#9ca3af' }}>{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Level Progression */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card p-6 mb-8"
        role="region"
        aria-label="Level progression"
      >
        <h2 className="text-lg font-bold mb-4" style={{ color: '#f0fdf4' }}>Level Progression</h2>
        <div className="flex items-center justify-between gap-2">
          {LEVELS.map((lvl, i) => {
            const isCurrentOrPast = LEVELS.findIndex((l) => l.level === level) >= i;
            const isCurrent = lvl.level === level;
            return (
              <div key={lvl.level} className="flex flex-col items-center gap-2 flex-1" aria-label={`Level ${lvl.label}${isCurrent ? ' (current)' : ''}`}>
                <motion.div
                  animate={isCurrent ? { scale: [1, 1.15, 1] } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-2xl"
                  aria-hidden="true"
                >
                  {isCurrentOrPast ? lvl.icon : '🔒'}
                </motion.div>
                <div
                  className={`w-full h-1 rounded-full transition-all duration-500 ${i < LEVELS.length - 1 ? '' : 'hidden'}`}
                  style={{ background: isCurrentOrPast ? '#22c55e' : 'rgba(34,197,94,0.15)' }}
                />
                <p className="text-[10px] text-center font-medium" style={{ color: isCurrent ? lvl.color : '#9ca3af' }}>
                  {lvl.label}
                </p>
                <p className="text-[9px]" style={{ color: '#6b7280' }}>{lvl.minPoints}pt</p>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Unlocked Badges */}
      {unlockedBadges.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
          role="region"
          aria-label="Unlocked badges"
        >
          <h2 className="text-lg font-bold mb-4" style={{ color: '#f0fdf4' }}>
            🏆 Earned Badges ({unlockedBadges.length})
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {unlockedBadges.map((badge, i) => (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * i, type: 'spring', stiffness: 200 }}
                className="card p-4 text-center"
                style={{ border: '1px solid rgba(34,197,94,0.3)', background: 'rgba(34,197,94,0.05)' }}
                role="img"
                aria-label={`${badge.title}: ${badge.description}`}
              >
                <div className="text-3xl mb-2" aria-hidden="true">{badge.icon}</div>
                <p className="text-sm font-bold mb-1" style={{ color: '#f0fdf4' }}>{badge.title}</p>
                <p className="text-xs leading-snug" style={{ color: '#9ca3af' }}>{badge.description}</p>
                {badge.earnedAt && (
                  <p className="text-[10px] mt-2" style={{ color: '#374151' }}>
                    {new Date(badge.earnedAt).toLocaleDateString()}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Locked Badges */}
      {lockedBadges.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          role="region"
          aria-label="Locked badges"
        >
          <h2 className="text-lg font-bold mb-4" style={{ color: '#f0fdf4' }}>
            🔒 Locked Badges ({lockedBadges.length})
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {lockedBadges.map((badge) => (
              <div
                key={badge.id}
                className="card p-4 text-center opacity-40"
                aria-label={`Locked badge: ${badge.title}. ${badge.description}`}
              >
                <div className="relative inline-block" aria-hidden="true">
                  <span className="text-3xl grayscale filter">{badge.icon}</span>
                  <Lock size={12} className="absolute -bottom-1 -right-1 text-gray-500" />
                </div>
                <p className="text-sm font-bold mb-1 mt-2" style={{ color: '#9ca3af' }}>{badge.title}</p>
                <p className="text-xs leading-snug" style={{ color: '#9ca3af' }}>{badge.description}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
