import React from 'react';

interface WelcomeStepProps {
  name: string;
  setName: (v: string) => void;
  nameError: string;
  setNameError: (v: string) => void;
  nextStep: () => void;
}

export function WelcomeStep({ name, setName, nameError, setNameError, nextStep }: WelcomeStepProps) {
  return (
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
  );
}
