import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { useUserStore } from '../store/useUserStore';
import { useGamificationStore } from '../store/useTrackerStore';
import { usePageTitle } from '../hooks/usePageTitle';
import type { OnboardingData, TransportMode, DietType, FlightFrequency } from '../types';

// ─── Step Definitions ─────────────────────────────────────────────────────────
const STEPS = [
  { id: 'welcome', label: 'Welcome', emoji: '👋' },
  { id: 'transport', label: 'Transport', emoji: '🚗' },
  { id: 'energy', label: 'Energy', emoji: '⚡' },
  { id: 'food', label: 'Food', emoji: '🥗' },
  { id: 'shopping', label: 'Shopping', emoji: '🛍️' },
  { id: 'waste', label: 'Waste', emoji: '♻️' },
  { id: 'results', label: 'Results', emoji: '📊' },
];

const TRANSPORT_OPTIONS: { value: TransportMode; label: string; icon: string; factor: string }[] = [
  { value: 'car_petrol', label: 'Petrol Car', icon: '⛽', factor: '192g/km' },
  { value: 'car_diesel', label: 'Diesel Car', icon: '🚗', factor: '171g/km' },
  { value: 'car_electric', label: 'Electric Car', icon: '⚡', factor: '53g/km' },
  { value: 'motorcycle', label: 'Motorcycle', icon: '🏍️', factor: '114g/km' },
  { value: 'bus', label: 'Bus', icon: '🚌', factor: '89g/km' },
  { value: 'train', label: 'Train', icon: '🚆', factor: '41g/km' },
  { value: 'bicycle', label: 'Bicycle', icon: '🚴', factor: '0g/km' },
  { value: 'walking', label: 'Walking', icon: '🚶', factor: '0g/km' },
];

const DIET_OPTIONS: { value: DietType; label: string; icon: string; desc: string }[] = [
  { value: 'vegan', label: 'Vegan', icon: '🌱', desc: 'No animal products' },
  { value: 'vegetarian', label: 'Vegetarian', icon: '🥦', desc: 'No meat or fish' },
  { value: 'flexitarian', label: 'Flexitarian', icon: '🥗', desc: 'Mostly plant-based' },
  { value: 'omnivore', label: 'Omnivore', icon: '🍽️', desc: 'Balanced diet' },
  { value: 'heavy_meat', label: 'Meat-heavy', icon: '🥩', desc: 'Meat at most meals' },
];

const FLIGHT_OPTIONS: { value: FlightFrequency; label: string; desc: string }[] = [
  { value: 'never', label: 'Never', desc: 'I don\'t fly' },
  { value: 'rarely', label: 'Rarely', desc: '1-2 short flights/year' },
  { value: 'sometimes', label: 'Sometimes', desc: '3-5 flights/year' },
  { value: 'often', label: 'Often', desc: '6-10 flights/year' },
  { value: 'very_often', label: 'Very Often', desc: 'Monthly or more' },
];

// ─── Slide animation ──────────────────────────────────────────────────────────
const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
  exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0, transition: { duration: 0.25 } }),
};

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { initProfile, updateOnboardingData, completeOnboarding, onboardingData } = useUserStore();
  const gamBadge = useGamificationStore((s) => s.unlockBadge);
  usePageTitle('Onboarding');

  const stepContainerRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState('');
  const [data, setData] = useState<Partial<OnboardingData>>({
    primaryTransport: 'car_petrol',
    weeklyKm: 100,
    flightFrequency: 'rarely',
    monthlyElectricityKwh: 200,
    hasRenewableEnergy: false,
    hasGasHeating: false,
    monthlyGasM3: 30,
    dietType: 'omnivore',
    localFoodPercentage: 20,
    foodWasteLevel: 3,
    monthlyOnlinePurchases: 4,
    buySecondHand: false,
    fastFashionFrequency: 2,
    recyclingRate: 30,
    compostsFood: false,
    weeklyWasteKg: 5,
  });

  const update = <K extends keyof OnboardingData>(key: K, value: OnboardingData[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const nextStep = () => {
    if (step === 0) {
      // Validate name
      const trimmed = name.trim();
      if (!trimmed || trimmed.length < 2) {
        setNameError('Please enter your name (at least 2 characters)');
        return;
      }
      if (trimmed.length > 50) {
        setNameError('Name must be 50 characters or less');
        return;
      }
      // Sanitize: allow only alphanumeric, spaces, hyphens
      if (!/^[\w\s\-'.]+$/.test(trimmed)) {
        setNameError('Name contains invalid characters');
        return;
      }
      setNameError('');
      initProfile(trimmed);
    }
    setDirection(1);
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const prevStep = () => {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 0));
  };

  // Focus management for accessibility
  useEffect(() => {
    if (stepContainerRef.current) {
      stepContainerRef.current.focus();
    }
  }, [step]);

  const finish = () => {
    updateOnboardingData(data);
    completeOnboarding();
    gamBadge('onboarding_complete');
    navigate('/dashboard');
  };

  const progress = ((step) / (STEPS.length - 1)) * 100;

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-8 relative"
      style={{ background: 'linear-gradient(160deg, #070d0a 0%, #0d1f14 100%)' }}
    >
      {/* Background glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full opacity-15 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, #22c55e 0%, transparent 70%)' }}
        aria-hidden="true"
      />

      {/* Logo */}
      <div className="flex items-center gap-2 mb-8">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center text-lg"
          style={{ background: 'linear-gradient(135deg, #1a6b47, #22c55e)' }}
          aria-hidden="true"
        >
          🌿
        </div>
        <span className="font-bold" style={{ color: '#f0fdf4' }}>EcoPulse AI</span>
      </div>

      {/* Progress */}
      <div className="w-full max-w-lg mb-6" role="progressbar" aria-valuenow={step} aria-valuemin={0} aria-valuemax={STEPS.length - 1} aria-label={`Step ${step + 1} of ${STEPS.length}`}>
        <div className="flex justify-between mb-3">
          {STEPS.map((s, i) => (
            <div
              key={s.id}
              className={`flex flex-col items-center gap-1 transition-all duration-300 ${i <= step ? 'opacity-100' : 'opacity-30'}`}
            >
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-sm transition-all duration-300"
                style={{
                  background: i < step ? '#22c55e' : i === step ? 'linear-gradient(135deg, #1a6b47, #22c55e)' : 'rgba(34,197,94,0.15)',
                  border: i === step ? '2px solid #22c55e' : 'none',
                }}
                aria-hidden="true"
              >
                {i < step ? <Check size={12} className="text-white" /> : <span className="text-xs">{s.emoji}</span>}
              </div>
              <span className="text-[9px] hidden sm:block" style={{ color: i <= step ? '#86efac' : '#9ca3af' }}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
        <div className="progress-bar">
          <motion.div
            className="progress-fill"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>

      {/* Card */}
      <div 
        className="w-full max-w-lg relative outline-none" 
        style={{ minHeight: 480 }}
        ref={stepContainerRef}
        tabIndex={-1}
        aria-live="polite"
      >
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={step}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="glass rounded-3xl p-8"
          >
            {/* Step 0: Welcome */}
            {step === 0 && (
              <div>
                <h1 className="text-3xl font-black mb-2" style={{ color: '#f0fdf4' }}>
                  Welcome to <span className="gradient-text">EcoPulse AI</span>
                </h1>
                <p className="mb-8" style={{ color: '#9ca3af' }}>
                  Let's calculate your personal carbon footprint and build a plan to reduce it.
                </p>
                <label htmlFor="user-name" className="block text-sm font-medium mb-2" style={{ color: '#86efac' }}>
                  What should we call you?
                </label>
                <input
                  id="user-name"
                  type="text"
                  className="input-field"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => { setName(e.target.value); setNameError(''); }}
                  onKeyDown={(e) => e.key === 'Enter' && nextStep()}
                  maxLength={50}
                  autoComplete="name"
                  aria-describedby={nameError ? 'name-error' : undefined}
                  aria-invalid={!!nameError}
                />
                {nameError && (
                  <p id="name-error" className="mt-2 text-sm" style={{ color: '#ef4444' }} role="alert">
                    {nameError}
                  </p>
                )}
                <div className="mt-6 grid grid-cols-3 gap-3">
                  {[{ icon: '⏱️', label: '5 min setup' }, { icon: '🔒', label: 'Private data' }, { icon: '🌱', label: 'Science-backed' }].map((i) => (
                    <div key={i.label} className="text-center p-3 rounded-xl" style={{ background: 'rgba(34,197,94,0.06)' }}>
                      <div className="text-xl mb-1" aria-hidden="true">{i.icon}</div>
                      <p className="text-xs" style={{ color: '#9ca3af' }}>{i.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 1: Transport */}
            {step === 1 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-3xl" aria-hidden="true">🚗</span>
                  <div>
                    <h2 className="text-2xl font-bold" style={{ color: '#f0fdf4' }}>Transport</h2>
                    <p className="text-sm" style={{ color: '#9ca3af' }}>How do you get around?</p>
                  </div>
                </div>

                <fieldset>
                  <legend className="text-sm font-medium mb-3" style={{ color: '#86efac' }}>
                    Primary mode of transport
                  </legend>
                  <div className="grid grid-cols-2 gap-2 mb-6">
                    {TRANSPORT_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => update('primaryTransport', opt.value)}
                        className={`p-3 rounded-xl text-left transition-all duration-200 border ${
                          data.primaryTransport === opt.value
                            ? 'border-green-500 bg-green-500/15'
                            : 'border-green-500/15 hover:border-green-500/30'
                        }`}
                        aria-pressed={data.primaryTransport === opt.value}
                        aria-label={`${opt.label}: ${opt.factor}`}
                      >
                        <span className="text-lg block mb-1" aria-hidden="true">{opt.icon}</span>
                        <span className="text-sm font-medium block" style={{ color: '#f0fdf4' }}>{opt.label}</span>
                        <span className="text-xs" style={{ color: '#9ca3af' }}>{opt.factor}</span>
                      </button>
                    ))}
                  </div>
                </fieldset>

                <label htmlFor="weekly-km" className="block text-sm font-medium mb-2" style={{ color: '#86efac' }}>
                  Weekly distance: <strong style={{ color: '#22c55e' }}>{data.weeklyKm} km</strong>
                </label>
                <input
                  id="weekly-km"
                  type="range"
                  min={0}
                  max={1000}
                  step={10}
                  value={data.weeklyKm}
                  onChange={(e) => update('weeklyKm', Number(e.target.value))}
                  className="w-full mb-6"
                  aria-valuemin={0}
                  aria-valuemax={1000}
                  aria-valuenow={data.weeklyKm}
                />

                <fieldset>
                  <legend className="text-sm font-medium mb-2" style={{ color: '#86efac' }}>Flight frequency</legend>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {FLIGHT_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => update('flightFrequency', opt.value)}
                        className={`p-2 rounded-xl text-left transition-all border ${
                          data.flightFrequency === opt.value
                            ? 'border-green-500 bg-green-500/15'
                            : 'border-green-500/10 hover:border-green-500/25'
                        }`}
                        aria-pressed={data.flightFrequency === opt.value}
                      >
                        <span className="text-xs font-medium block" style={{ color: '#f0fdf4' }}>{opt.label}</span>
                        <span className="text-[11px]" style={{ color: '#9ca3af' }}>{opt.desc}</span>
                      </button>
                    ))}
                  </div>
                </fieldset>
              </div>
            )}

            {/* Step 2: Energy */}
            {step === 2 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-3xl" aria-hidden="true">⚡</span>
                  <div>
                    <h2 className="text-2xl font-bold" style={{ color: '#f0fdf4' }}>Energy</h2>
                    <p className="text-sm" style={{ color: '#9ca3af' }}>Home energy usage</p>
                  </div>
                </div>

                <label htmlFor="electricity-kwh" className="block text-sm font-medium mb-2" style={{ color: '#86efac' }}>
                  Monthly electricity: <strong style={{ color: '#22c55e' }}>{data.monthlyElectricityKwh} kWh</strong>
                </label>
                <input
                  id="electricity-kwh"
                  type="range"
                  min={50}
                  max={800}
                  step={10}
                  value={data.monthlyElectricityKwh}
                  onChange={(e) => update('monthlyElectricityKwh', Number(e.target.value))}
                  className="w-full mb-2"
                  aria-valuemin={50}
                  aria-valuemax={800}
                  aria-valuenow={data.monthlyElectricityKwh}
                />
                <div className="flex justify-between text-xs mb-6" style={{ color: '#9ca3af' }}>
                  <span>50 kWh (low)</span><span>800 kWh (high)</span>
                </div>

                <div className="space-y-3 mb-6">
                  <label className="flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all border border-green-500/10 hover:border-green-500/25">
                    <input
                      type="checkbox"
                      checked={data.hasRenewableEnergy}
                      onChange={(e) => update('hasRenewableEnergy', e.target.checked)}
                      aria-label="I use renewable energy (solar, wind)"
                    />
                    <div>
                      <p className="text-sm font-medium" style={{ color: '#f0fdf4' }}>🌞 Renewable energy</p>
                      <p className="text-xs" style={{ color: '#9ca3af' }}>Solar panels or green tariff</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all border border-green-500/10 hover:border-green-500/25">
                    <input
                      type="checkbox"
                      checked={data.hasGasHeating}
                      onChange={(e) => update('hasGasHeating', e.target.checked)}
                      aria-label="I use gas heating"
                    />
                    <div>
                      <p className="text-sm font-medium" style={{ color: '#f0fdf4' }}>🔥 Gas heating</p>
                      <p className="text-xs" style={{ color: '#9ca3af' }}>Natural gas for heating/cooking</p>
                    </div>
                  </label>
                </div>

                {data.hasGasHeating && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                    <label htmlFor="gas-m3" className="block text-sm font-medium mb-2" style={{ color: '#86efac' }}>
                      Monthly gas usage: <strong style={{ color: '#22c55e' }}>{data.monthlyGasM3} m³</strong>
                    </label>
                    <input
                      id="gas-m3"
                      type="range"
                      min={0}
                      max={200}
                      step={5}
                      value={data.monthlyGasM3}
                      onChange={(e) => update('monthlyGasM3', Number(e.target.value))}
                      className="w-full"
                    />
                  </motion.div>
                )}
              </div>
            )}

            {/* Step 3: Food */}
            {step === 3 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-3xl" aria-hidden="true">🥗</span>
                  <div>
                    <h2 className="text-2xl font-bold" style={{ color: '#f0fdf4' }}>Food & Diet</h2>
                    <p className="text-sm" style={{ color: '#9ca3af' }}>What you eat matters</p>
                  </div>
                </div>

                <fieldset className="mb-6">
                  <legend className="text-sm font-medium mb-3" style={{ color: '#86efac' }}>Diet type</legend>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {DIET_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => update('dietType', opt.value)}
                        className={`p-3 rounded-xl text-left transition-all border ${
                          data.dietType === opt.value
                            ? 'border-green-500 bg-green-500/15'
                            : 'border-green-500/10 hover:border-green-500/25'
                        }`}
                        aria-pressed={data.dietType === opt.value}
                      >
                        <span className="text-xl block mb-1" aria-hidden="true">{opt.icon}</span>
                        <span className="text-xs font-medium block" style={{ color: '#f0fdf4' }}>{opt.label}</span>
                        <span className="text-[11px]" style={{ color: '#9ca3af' }}>{opt.desc}</span>
                      </button>
                    ))}
                  </div>
                </fieldset>

                <label htmlFor="local-food" className="block text-sm font-medium mb-2" style={{ color: '#86efac' }}>
                  Local/seasonal food: <strong style={{ color: '#22c55e' }}>{data.localFoodPercentage}%</strong>
                </label>
                <input
                  id="local-food"
                  type="range"
                  min={0}
                  max={100}
                  step={5}
                  value={data.localFoodPercentage}
                  onChange={(e) => update('localFoodPercentage', Number(e.target.value))}
                  className="w-full mb-6"
                />

                <label htmlFor="food-waste" className="block text-sm font-medium mb-2" style={{ color: '#86efac' }}>
                  Food waste level: <strong style={{ color: data.foodWasteLevel! <= 2 ? '#22c55e' : data.foodWasteLevel! <= 3 ? '#f59e0b' : '#ef4444' }}>
                    {['', 'Very low', 'Low', 'Moderate', 'High', 'Very high'][data.foodWasteLevel!]}
                  </strong>
                </label>
                <input
                  id="food-waste"
                  type="range"
                  min={1}
                  max={5}
                  step={1}
                  value={data.foodWasteLevel}
                  onChange={(e) => update('foodWasteLevel', Number(e.target.value))}
                  className="w-full"
                />
              </div>
            )}

            {/* Step 4: Shopping */}
            {step === 4 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-3xl" aria-hidden="true">🛍️</span>
                  <div>
                    <h2 className="text-2xl font-bold" style={{ color: '#f0fdf4' }}>Shopping</h2>
                    <p className="text-sm" style={{ color: '#9ca3af' }}>Consumption patterns</p>
                  </div>
                </div>

                <label htmlFor="online-purchases" className="block text-sm font-medium mb-2" style={{ color: '#86efac' }}>
                  Monthly online orders: <strong style={{ color: '#22c55e' }}>{data.monthlyOnlinePurchases}</strong>
                </label>
                <input
                  id="online-purchases"
                  type="range"
                  min={0}
                  max={30}
                  step={1}
                  value={data.monthlyOnlinePurchases}
                  onChange={(e) => update('monthlyOnlinePurchases', Number(e.target.value))}
                  className="w-full mb-6"
                />

                <label htmlFor="fast-fashion" className="block text-sm font-medium mb-2" style={{ color: '#86efac' }}>
                  Fast fashion frequency: <strong style={{ color: data.fastFashionFrequency! <= 2 ? '#22c55e' : data.fastFashionFrequency! <= 3 ? '#f59e0b' : '#ef4444' }}>
                    {['', 'Rarely', 'Occasionally', 'Monthly', 'Often', 'Very often'][data.fastFashionFrequency!]}
                  </strong>
                </label>
                <input
                  id="fast-fashion"
                  type="range"
                  min={1}
                  max={5}
                  step={1}
                  value={data.fastFashionFrequency}
                  onChange={(e) => update('fastFashionFrequency', Number(e.target.value))}
                  className="w-full mb-6"
                />

                <label className="flex items-center gap-3 p-4 rounded-xl cursor-pointer border border-green-500/10 hover:border-green-500/25 transition-all">
                  <input
                    type="checkbox"
                    checked={data.buySecondHand}
                    onChange={(e) => update('buySecondHand', e.target.checked)}
                    aria-label="I regularly buy second-hand items"
                  />
                  <div>
                    <p className="text-sm font-medium" style={{ color: '#f0fdf4' }}>♻️ I buy second-hand regularly</p>
                    <p className="text-xs" style={{ color: '#9ca3af' }}>Charity shops, eBay, Vinted, etc.</p>
                  </div>
                </label>
              </div>
            )}

            {/* Step 5: Waste */}
            {step === 5 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-3xl" aria-hidden="true">♻️</span>
                  <div>
                    <h2 className="text-2xl font-bold" style={{ color: '#f0fdf4' }}>Waste</h2>
                    <p className="text-sm" style={{ color: '#9ca3af' }}>How green is your bin?</p>
                  </div>
                </div>

                <label htmlFor="weekly-waste" className="block text-sm font-medium mb-2" style={{ color: '#86efac' }}>
                  Weekly household waste: <strong style={{ color: '#22c55e' }}>{data.weeklyWasteKg} kg</strong>
                </label>
                <input
                  id="weekly-waste"
                  type="range"
                  min={1}
                  max={30}
                  step={0.5}
                  value={data.weeklyWasteKg}
                  onChange={(e) => update('weeklyWasteKg', Number(e.target.value))}
                  className="w-full mb-6"
                />

                <label htmlFor="recycling-rate" className="block text-sm font-medium mb-2" style={{ color: '#86efac' }}>
                  Recycling rate: <strong style={{ color: '#22c55e' }}>{data.recyclingRate}%</strong>
                </label>
                <input
                  id="recycling-rate"
                  type="range"
                  min={0}
                  max={100}
                  step={5}
                  value={data.recyclingRate}
                  onChange={(e) => update('recyclingRate', Number(e.target.value))}
                  className="w-full mb-6"
                />

                <label className="flex items-center gap-3 p-4 rounded-xl cursor-pointer border border-green-500/10 hover:border-green-500/25 transition-all">
                  <input
                    type="checkbox"
                    checked={data.compostsFood}
                    onChange={(e) => update('compostsFood', e.target.checked)}
                    aria-label="I compost food scraps"
                  />
                  <div>
                    <p className="text-sm font-medium" style={{ color: '#f0fdf4' }}>🌱 I compost food scraps</p>
                    <p className="text-xs" style={{ color: '#9ca3af' }}>Home or community composting</p>
                  </div>
                </label>
              </div>
            )}

            {/* Step 6: Results */}
            {step === 6 && (
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  className="text-6xl mb-4"
                  aria-hidden="true"
                >
                  📊
                </motion.div>
                <h2 className="text-2xl font-bold mb-2" style={{ color: '#f0fdf4' }}>You're all set!</h2>
                <p className="mb-6" style={{ color: '#9ca3af' }}>
                  We've calculated your carbon footprint and prepared personalized recommendations.
                  Let's see your results on the dashboard.
                </p>
                <div className="space-y-2 text-left">
                  {[
                    '📊 Your personal Carbon Score',
                    '🎯 5 AI-powered action recommendations',
                    '📈 Live tracking dashboard',
                    '🏆 Gamification & achievements',
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(34,197,94,0.06)' }}>
                      <Check size={16} className="text-green-400 flex-shrink-0" aria-hidden="true" />
                      <span className="text-sm" style={{ color: '#d1fae5' }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Buttons */}
      <div className="w-full max-w-lg flex gap-3 mt-6">
        {step > 0 && (
          <button
            onClick={prevStep}
            className="btn-secondary flex-1"
            aria-label="Go to previous step"
          >
            <ChevronLeft size={18} aria-hidden="true" />
            Back
          </button>
        )}
        {step < STEPS.length - 1 ? (
          <button
            onClick={nextStep}
            className="btn-primary flex-1"
            aria-label="Go to next step"
          >
            {step === 0 ? 'Get Started' : 'Continue'}
            <ChevronRight size={18} aria-hidden="true" />
          </button>
        ) : (
          <button
            onClick={finish}
            className="btn-primary flex-1"
            aria-label="View your results on the dashboard"
          >
            See My Dashboard
            <ChevronRight size={18} aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  );
}
