import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } }),
};

interface DashboardHeaderProps {
  profileName?: string;
}

export function DashboardHeader({ profileName }: DashboardHeaderProps) {
  return (
    <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible" className="mb-8">
      <h1 className="text-4xl md:text-5xl font-black mb-2" style={{ color: '#f0fdf4' }}>
        Hi, {profileName} 👋
      </h1>
      <p className="text-lg" style={{ color: '#9ca3af' }}>
        Your carbon overview for {format(new Date(), 'MMMM yyyy')}
      </p>
    </motion.div>
  );
}
