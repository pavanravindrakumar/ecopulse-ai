import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Map } from 'lucide-react';
import { usePageTitle } from '../hooks/usePageTitle';

export default function NotFoundPage() {
  usePageTitle('Page Not Found');
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-6 text-center" style={{ background: '#070d0a' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card p-10 max-w-md w-full"
      >
        <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6" style={{ background: 'rgba(34,197,94,0.1)' }}>
          <Map size={40} className="text-green-500" />
        </div>
        <h1 className="text-3xl font-black mb-3" style={{ color: '#f0fdf4' }}>Lost in the Woods?</h1>
        <p className="text-sm mb-8 leading-relaxed" style={{ color: '#9ca3af' }}>
          We couldn't find the page you're looking for. It might have been moved or deleted.
        </p>
        <button
          onClick={() => navigate('/')}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          <ArrowLeft size={18} />
          Back to Safety
        </button>
      </motion.div>
    </div>
  );
}
