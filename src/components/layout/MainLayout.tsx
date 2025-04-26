'use client';

import { motion } from 'framer-motion';
import { CyberBackground } from '../effects/CyberBackground';
import { Navigation } from './Navigation';
import { Footer } from './Footer';

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-cyber-black text-cyber-neon relative">
      <CyberBackground />
      <Navigation />
      <main className="container mx-auto px-4 py-8 relative z-10">
        {children}
      </main>
      <Footer />
    </div>
  );
}