'use client';

import { motion } from 'framer-motion';

export function CyberBackground() {
  return (
    <>
      {/* Background Layers */}
      <div className="fixed inset-0 bg-cyber-pattern opacity-30" />
      <div className="fixed inset-0 bg-cyber-rays animate-cyber-pulse" />
      
      {/* Grid Background */}
      <div className="fixed inset-0 bg-scanline opacity-5 pointer-events-none" />
      <div className="fixed inset-0 perspective-1000">
        <div className="absolute inset-0 preserve-3d rotate3d">
          <div className="cyber-grid-background" />
        </div>
      </div>

      {/* Floating Particles */}
      <div className="fixed inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyber-neon rounded-full"
            initial={{ opacity: 0.3 }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: Math.random() * 2 + 1,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>
    </>
  );
}