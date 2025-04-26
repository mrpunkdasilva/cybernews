'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="relative z-10 bg-cyber-black/80 backdrop-blur-sm border-t border-cyber-neon/10">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo & Description */}
          <div className="text-center md:text-left">
            <h3 className="font-orbitron text-2xl mb-4 text-cyber-neon/80">
              CYBER<span className="text-cyber-pink/80">NEWS</span>
            </h3>
            <p className="text-gray-400 font-rajdhani">
              The future of tech news delivery
            </p>
          </div>

          {/* Social Links */}
          <div className="text-center md:text-left">
            <h4 className="font-orbitron text-lg mb-4 text-cyber-neon/70">Connect</h4>
            <div className="flex justify-center md:justify-start space-x-4">
              <motion.a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-cyber-dark/50 border border-cyber-neon/20 flex items-center justify-center group"
                whileHover={{ scale: 1.1, borderColor: 'rgba(0,255,245,0.4)' }}
              >
                <span className="text-cyber-neon/70 group-hover:text-cyber-pink/70 transition-colors">
                  GH
                </span>
              </motion.a>
              <motion.a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-cyber-dark/50 border border-cyber-neon/20 flex items-center justify-center group"
                whileHover={{ scale: 1.1, borderColor: 'rgba(0,255,245,0.4)' }}
              >
                <span className="text-cyber-neon/70 group-hover:text-cyber-pink/70 transition-colors">
                  TW
                </span>
              </motion.a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-4 border-t border-cyber-neon/10 text-center">
          <p className="text-gray-400 font-rajdhani">
            © {new Date().getFullYear()} CYBERNEWS. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}