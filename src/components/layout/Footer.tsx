'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="relative z-10 bg-cyber-black border-t border-cyber-neon/20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo & Description */}
          <div className="text-center md:text-left">
            <h3 className="font-orbitron text-2xl mb-4 text-cyber-neon">
              CYBER<span className="text-cyber-pink">NEWS</span>
            </h3>
            <p className="text-gray-400 font-rajdhani">
              The future of tech news delivery
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-center md:text-left">
            <h4 className="font-orbitron text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/top" className="text-gray-400 hover:text-cyber-neon transition-colors">
                  Top Stories
                </Link>
              </li>
              <li>
                <Link href="/new" className="text-gray-400 hover:text-cyber-neon transition-colors">
                  Latest News
                </Link>
              </li>
              <li>
                <Link href="/best" className="text-gray-400 hover:text-cyber-neon transition-colors">
                  Best Stories
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="text-center md:text-left">
            <h4 className="font-orbitron text-lg mb-4">Connect</h4>
            <div className="flex justify-center md:justify-start space-x-4">
              <motion.a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-cyber-dark border border-cyber-neon/30 flex items-center justify-center group"
                whileHover={{ scale: 1.1, borderColor: 'rgba(0,255,245,0.8)' }}
              >
                <span className="text-cyber-neon group-hover:text-cyber-pink transition-colors">
                  GH
                </span>
              </motion.a>
              <motion.a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-cyber-dark border border-cyber-neon/30 flex items-center justify-center group"
                whileHover={{ scale: 1.1, borderColor: 'rgba(0,255,245,0.8)' }}
              >
                <span className="text-cyber-neon group-hover:text-cyber-pink transition-colors">
                  TW
                </span>
              </motion.a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-cyber-neon/20 text-center">
          <p className="text-gray-400 font-rajdhani">
            © {new Date().getFullYear()} CYBERNEWS. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}