import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { useUserStore } from '../store/useUserStore';
import { useGamificationStore } from '../store/useTrackerStore';
import { usePageTitle } from '../hooks/usePageTitle';
import type { OnboardingData } from '../types';

import { STEPS } from '../components/onboarding/constants';
import { WelcomeStep } from '../components/onboarding/WelcomeStep';
import { TransportStep } from '../components/onboarding/TransportStep';
import { EnergyStep } from '../components/onboarding/EnergyStep';
import { FoodStep } from '../components/onboarding/FoodStep';
import { ShoppingStep } from '../components/onboarding/ShoppingStep';
import { WasteStep } from '../components/onboarding/WasteStep';
import { ResultsStep } from '../components/onboarding/ResultsStep';
import { OnboardingProgress } from '../components/onboarding/OnboardingProgress';

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1, transition: { duration: 0.35, ease: 'easeOut' as const } },
  exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0, transition: { duration: 0.25 } }),
};

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { initProfile, updateOnboardingData, completeOnboarding } = useUserStore();
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
      const trimmed = name.trim();
      if (!trimmed || trimmed.length < 2) {
        setNameError('Please enter your name (at least 2 characters)');
        return;
      }
      if (trimmed.length > 50) {
        setNameError('Name must be 50 characters or less');
        return;
      }
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

  const progress = (step / (STEPS.length - 1)) * 100;

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-8 relative"
      style={{ background: 'linear-gradient(160deg, #070d0a 0%, #0d1f14 100%)' }}
    >
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full opacity-15 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, #22c55e 0%, transparent 70%)' }}
        aria-hidden="true"
      />

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

      <OnboardingProgress step={step} STEPS={STEPS} progress={progress} />

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
            {step === 0 && <WelcomeStep name={name} setName={setName} nameError={nameError} setNameError={setNameError} nextStep={nextStep} />}
            {step === 1 && <TransportStep data={data} update={update} />}
            {step === 2 && <EnergyStep data={data} update={update} />}
            {step === 3 && <FoodStep data={data} update={update} />}
            {step === 4 && <ShoppingStep data={data} update={update} />}
            {step === 5 && <WasteStep data={data} update={update} />}
            {step === 6 && <ResultsStep />}
          </motion.div>
        </AnimatePresence>
      </div>

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
