import { motion } from 'framer-motion';

export default function LoadingScreen() {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ background: '#070d0a' }}
      role="status"
      aria-label="Loading EcoPulse AI"
    >
      <div className="flex flex-col items-center gap-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
          style={{ background: 'linear-gradient(135deg, #1a6b47, #22c55e)' }}
          aria-hidden="true"
        >
          🌿
        </motion.div>
        <div className="flex gap-1" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full"
              style={{ background: '#22c55e' }}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </div>
        <p className="text-sm" style={{ color: '#9ca3af' }}>Loading EcoPulse AI…</p>
      </div>
    </div>
  );
}
