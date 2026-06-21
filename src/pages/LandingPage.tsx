import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Leaf, TrendingDown, Award, Zap } from 'lucide-react';
import { usePageTitle } from '../hooks/usePageTitle';

const stats = [
  { value: '4.7t', label: 'Global avg CO₂/year', icon: '🌍' },
  { value: '37%', label: 'From transport', icon: '🚗' },
  { value: '2.3t', label: 'Paris target', icon: '🎯' },
  { value: '1B+', label: 'People need to act', icon: '👥' },
];

const features = [
  {
    icon: <Zap size={20} className="text-green-400" />,
    title: 'Smart Carbon Score',
    desc: 'Get your personalized CO₂ footprint in minutes with our science-backed calculator.',
  },
  {
    icon: <Leaf size={20} className="text-green-400" />,
    title: 'AI Recommendations',
    desc: 'Receive curated, habit-based actions tailored to your lifestyle and biggest impact areas.',
  },
  {
    icon: <TrendingDown size={20} className="text-green-400" />,
    title: 'Daily Habit Tracker',
    desc: 'Log eco-actions, build streaks, and watch your carbon footprint shrink over time.',
  },
  {
    icon: <Award size={20} className="text-green-400" />,
    title: 'Gamified Progress',
    desc: 'Earn Green Points, level up from Seedling to Earth Guardian, and unlock achievement badges.',
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: 'easeOut' as const },
  }),
};

export default function LandingPage() {
  usePageTitle('Home');
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #070d0a 0%, #0d1f14 50%, #070d0a 100%)' }}
    >
      {/* Ambient glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full opacity-20 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, #22c55e 0%, transparent 70%)' }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full opacity-10 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, #1a6b47 0%, transparent 70%)' }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Nav */}
        <header className="flex items-center justify-between py-8">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-xl"
              style={{ background: 'linear-gradient(135deg, #1a6b47, #22c55e)' }}
              aria-hidden="true"
            >
              🌿
            </div>
            <span className="font-bold text-lg" style={{ color: '#f0fdf4' }}>EcoPulse AI</span>
          </div>
          <button
            onClick={() => navigate('/onboarding')}
            className="btn-secondary text-sm"
            aria-label="Start your carbon assessment"
          >
            Get Started
          </button>
        </header>

        {/* Hero */}
        <section className="text-center py-20 md:py-32" aria-labelledby="hero-heading">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' as const }}
            className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full text-sm font-medium"
            style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', color: '#4ade80' }}
          >
            <span className="animate-pulse-green w-2 h-2 rounded-full bg-green-400 inline-block" aria-hidden="true" />
            Challenge 3: Carbon Footprint Awareness
          </motion.div>

          <motion.h1
            id="hero-heading"
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="text-5xl md:text-7xl font-black leading-tight mb-6"
            style={{ color: '#f0fdf4' }}
          >
            Small habits.
            <br />
            <span className="gradient-text">Big climate impact.</span>
          </motion.h1>

          <motion.p
            custom={1}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="text-xl md:text-2xl max-w-2xl mx-auto mb-10 leading-relaxed"
            style={{ color: '#86efac' }}
          >
            Turn your daily routines into measurable climate action.
            Discover your footprint, get AI recommendations, and track your progress to a net-zero lifestyle.
          </motion.p>

          <motion.div
            custom={2}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button
              onClick={() => navigate('/onboarding')}
              className="btn-primary text-lg px-8 py-4 rounded-2xl"
              id="cta-start"
              aria-label="Calculate your carbon footprint now"
            >
              Calculate My Footprint
              <ArrowRight size={20} aria-hidden="true" />
            </button>
            <button
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-secondary text-lg px-8 py-4 rounded-2xl"
              aria-label="Learn more about EcoPulse features"
            >
              Learn More
            </button>
          </motion.div>
        </section>

        {/* Stats */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-24"
          aria-label="Climate statistics"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="card p-5 text-center"
            >
              <div className="text-3xl mb-2" aria-hidden="true">{stat.icon}</div>
              <p className="text-2xl font-black gradient-text">{stat.value}</p>
              <p className="text-xs mt-1" style={{ color: '#9ca3af' }}>{stat.label}</p>
            </motion.div>
          ))}
        </motion.section>

        {/* Features */}
        <section id="features" className="pb-32" aria-labelledby="features-heading">
          <motion.h2
            id="features-heading"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold text-center mb-4"
            style={{ color: '#f0fdf4' }}
          >
            Everything you need to
            <span className="gradient-text"> go green</span>
          </motion.h2>
          <p className="text-center mb-12 text-lg" style={{ color: '#9ca3af' }}>
            A complete ecosystem for sustainable living
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="card card-interactive p-6 flex gap-4"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(34,197,94,0.1)' }}
                  aria-hidden="true"
                >
                  {feat.icon}
                </div>
                <div>
                  <h3 className="font-semibold mb-1" style={{ color: '#f0fdf4' }}>{feat.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#9ca3af' }}>{feat.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Banner */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-24 rounded-3xl p-10 text-center relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #0d4a2f 0%, #1a6b47 50%, #16a34a 100%)' }}
          aria-labelledby="cta-heading"
        >
          <div
            className="absolute inset-0 opacity-20 animate-shimmer pointer-events-none"
            aria-hidden="true"
          />
          <h2
            id="cta-heading"
            className="text-3xl md:text-4xl font-black mb-4"
            style={{ color: '#f0fdf4' }}
          >
            Your planet needs you today. 🌍
          </h2>
          <p className="mb-8 text-lg max-w-xl mx-auto" style={{ color: 'rgba(240,253,244,0.8)' }}>
            Join thousands taking action. It takes 5 minutes to know your impact
            and a lifetime to make a difference.
          </p>
          <button
            onClick={() => navigate('/onboarding')}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-lg font-bold transition-all duration-200 hover:shadow-2xl hover:-translate-y-1"
            style={{ background: '#f0fdf4', color: '#0d4a2f' }}
            aria-label="Start your carbon assessment now"
          >
            Start Your Assessment
            <ArrowRight size={20} aria-hidden="true" />
          </button>
        </motion.section>

        {/* Footer */}
        <footer className="text-center pb-12" role="contentinfo">
          <p className="text-sm" style={{ color: '#6b7280' }}>
            © 2025 EcoPulse AI · Built for Hackathon Challenge 3: Carbon Footprint Awareness
          </p>
        </footer>
      </div>
    </div>
  );
}
