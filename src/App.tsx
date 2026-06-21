import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useUserStore } from './store/useUserStore';
import Layout from './components/Layout';
import LoadingScreen from './components/ui/LoadingScreen';

// Lazy-load pages for performance
const LandingPage = React.lazy(() => import('./pages/LandingPage'));
const OnboardingPage = React.lazy(() => import('./pages/OnboardingPage'));
const DashboardPage = React.lazy(() => import('./pages/DashboardPage'));
const TrackerPage = React.lazy(() => import('./pages/TrackerPage'));
const RecommendationsPage = React.lazy(() => import('./pages/RecommendationsPage'));
const InsightsPage = React.lazy(() => import('./pages/InsightsPage'));
const GamificationPage = React.lazy(() => import('./pages/GamificationPage'));
const NotFoundPage = React.lazy(() => import('./pages/NotFoundPage'));

function RequireOnboarding({ children }: { children: React.ReactNode }) {
  const isOnboarded = useUserStore((s) => s.isOnboarded);
  if (!isOnboarded) return <Navigate to="/onboarding" replace />;
  return <>{children}</>;
}

function RequireNoOnboarding({ children }: { children: React.ReactNode }) {
  const isOnboarded = useUserStore((s) => s.isOnboarded);
  if (isOnboarded) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          {/* Public */}
          <Route path="/" element={<RequireNoOnboarding><LandingPage /></RequireNoOnboarding>} />
          <Route path="/onboarding" element={<RequireNoOnboarding><OnboardingPage /></RequireNoOnboarding>} />

          {/* Protected — require onboarding */}
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<RequireOnboarding><DashboardPage /></RequireOnboarding>} />
            <Route path="/tracker" element={<RequireOnboarding><TrackerPage /></RequireOnboarding>} />
            <Route path="/recommendations" element={<RequireOnboarding><RecommendationsPage /></RequireOnboarding>} />
            <Route path="/insights" element={<RequireOnboarding><InsightsPage /></RequireOnboarding>} />
            <Route path="/achievements" element={<RequireOnboarding><GamificationPage /></RequireOnboarding>} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
