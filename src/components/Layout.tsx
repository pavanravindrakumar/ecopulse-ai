import { useState, useRef } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Leaf, Lightbulb, BarChart3, Trophy, LogOut, Download, Upload, AlertCircle } from 'lucide-react';
import ConfirmModal from './ui/ConfirmModal';
import { useUserStore } from '../store/useUserStore';
import { useGamificationStore } from '../store/useTrackerStore';
import { getLevelInfo } from '../utils/gamification';


const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/tracker', icon: Leaf, label: 'Tracker' },
  { to: '/recommendations', icon: Lightbulb, label: 'Actions' },
  { to: '/insights', icon: BarChart3, label: 'Insights' },
  { to: '/achievements', icon: Trophy, label: 'Badges' },
];

export default function Layout() {
  const profile = useUserStore((s) => s.profile);
  const reset = useUserStore((s) => s.reset);
  const gamReset = useGamificationStore((s) => s.reset);
  const { greenPoints, level } = useGamificationStore();
  const navigate = useNavigate();

  const levelInfo = getLevelInfo(level);

  const [showResetModal, setShowResetModal] = useState(false);
  const [errorToast, setErrorToast] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogout = () => {
    reset();
    gamReset();
    setShowResetModal(false);
    navigate('/');
  };

  const handleExport = () => {
    const data = {
      user: localStorage.getItem('ecopulse-user-v1'),
      tracker: localStorage.getItem('ecopulse-tracker-v1'),
      gamification: localStorage.getItem('ecopulse-gamification-v1'),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ecopulse-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.user) localStorage.setItem('ecopulse-user-v1', data.user);
        if (data.tracker) localStorage.setItem('ecopulse-tracker-v1', data.tracker);
        if (data.gamification) localStorage.setItem('ecopulse-gamification-v1', data.gamification);
        window.location.reload();
      } catch (err) {
        setErrorToast('Invalid backup file. Please ensure you are uploading a valid EcoPulse AI export.');
        setTimeout(() => setErrorToast(null), 3000);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="flex min-h-screen" style={{ background: '#070d0a' }}>
      {/* Sidebar */}
      <aside
        className="hidden md:flex flex-col w-64 glass-strong border-r border-green-500/10 fixed h-full z-40"
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <div className="px-6 py-6 border-b border-green-500/10">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-xl animate-float"
              style={{ background: 'linear-gradient(135deg, #1a6b47, #22c55e)' }}
              aria-hidden="true"
            >
              🌿
            </div>
            <div>
              <p className="font-bold text-sm" style={{ color: '#f0fdf4' }}>EcoPulse AI</p>
              <p className="text-xs" style={{ color: '#9ca3af' }}>Carbon Tracker</p>
            </div>
          </div>
        </div>

        {/* User Level Badge */}
        <div className="px-4 py-4 border-b border-green-500/10">
          <div className="card p-3 flex items-center gap-3">
            <span className="text-2xl" aria-hidden="true">{levelInfo.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate" style={{ color: '#86efac' }}>
                {profile?.name ?? 'Eco User'}
              </p>
              <p className="text-xs" style={{ color: '#9ca3af' }}>{levelInfo.label}</p>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-xs font-bold" style={{ color: '#22c55e' }}>
                  {greenPoints.toLocaleString()}
                </span>
                <span className="text-xs" style={{ color: '#9ca3af' }}>pts</span>
              </div>
            </div>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              aria-label={label}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-green-500/15 text-green-400 border border-green-500/25'
                    : 'text-gray-400 hover:bg-green-500/8 hover:text-green-300'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={18} aria-hidden="true" className={isActive ? 'text-green-400' : ''} />
                  {label}
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="ml-auto w-1.5 h-1.5 rounded-full bg-green-400"
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Actions */}
        <div className="px-3 py-4 border-t border-green-500/10 space-y-1">
          <button
            onClick={handleExport}
            className="btn-ghost w-full justify-start text-sm text-gray-400"
            aria-label="Export data"
          >
            <Download size={16} aria-hidden="true" />
            Export Data
          </button>
          
          <input
            type="file"
            accept=".json"
            ref={fileInputRef}
            onChange={handleImport}
            className="hidden"
            aria-hidden="true"
            tabIndex={-1}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="btn-ghost w-full justify-start text-sm text-gray-400"
            aria-label="Import data"
          >
            <Upload size={16} aria-hidden="true" />
            Import Data
          </button>

          <button
            onClick={() => setShowResetModal(true)}
            className="btn-ghost w-full justify-start text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 mt-2"
            aria-label="Reset data and start over"
          >
            <LogOut size={16} aria-hidden="true" />
            Reset Data
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass-strong border-t border-green-500/10"
        role="navigation"
        aria-label="Mobile navigation"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="flex">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              aria-label={label}
              className={({ isActive }) =>
                `flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-all duration-200 ${
                  isActive ? 'text-green-400' : 'text-gray-500'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={20} aria-hidden="true" className={isActive ? 'text-green-400' : ''} />
                  <span className="text-[10px]">{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main
        className="flex-1 md:ml-64 pb-20 md:pb-0 min-h-screen"
        id="main-content"
        aria-label="Main content"
      >
        <Outlet />
      </main>
      <ConfirmModal
        isOpen={showResetModal}
        title="Reset All Data?"
        message="This will permanently delete all your logged habits, points, and carbon score. This action cannot be undone."
        confirmText="Yes, reset data"
        onConfirm={handleLogout}
        onCancel={() => setShowResetModal(false)}
      />

      {/* Error Toast notification */}
      <AnimatePresence>
        {errorToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl"
            style={{ background: '#450a0a', border: '1px solid rgba(239,68,68,0.3)', color: '#fef2f2' }}
            role="alert"
            aria-live="assertive"
          >
            <AlertCircle size={18} className="text-red-400" aria-hidden="true" />
            <span className="text-sm font-medium">{errorToast}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
