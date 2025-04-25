'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

export default function Home() {
  const [email, setEmail] = useState('');

  return (
    <main className="min-h-screen bg-cyber-black text-cyber-neon relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-scanline opacity-5 pointer-events-none"></div>
      <div className="absolute inset-0 perspective-1000">
        <div className="absolute inset-0 preserve-3d rotate3d">
          <div className="cyber-grid-background"></div>
        </div>
      </div>
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center">
        <div className="container mx-auto px-4 py-20 text-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-12"
          >
            <motion.h1 
              className="text-6xl md:text-8xl font-orbitron mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyber-neon via-cyber-pink to-cyber-purple animate-text-gradient"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ 
                duration: 0.5,
                type: "spring",
                stiffness: 200
              }}
            >
              CYBER<span className="text-cyber-pink animate-flicker">NEWS</span>
            </motion.h1>

            <motion.p 
              className="text-xl md:text-2xl mb-8 font-rajdhani text-gray-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Stay ahead in tech with AI-powered news curation
            </motion.p>

            <motion.div 
              className="flex flex-col md:flex-row gap-6 justify-center items-center max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="cyber-input terminal-text text-lg"
              />
              <motion.button 
                className="cyber-button animate-glow"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 0 25px rgba(0,255,245,0.5)"
                }}
                whileTap={{ scale: 0.95 }}
              >
                GET EARLY ACCESS
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-cyber-dark">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {/* Feature cards using cyber-card class */}
            <div className="cyber-card">
              <h3 className="text-2xl font-bold mb-4 text-glow">AI-Powered Curation</h3>
              <p className="text-gray-300">Advanced algorithms deliver personalized tech news tailored to your interests</p>
            </div>
            <div className="cyber-card">
              <h3 className="text-2xl font-bold mb-4 text-glow">Real-time Updates</h3>
              <p className="text-gray-300">Stay informed with instant notifications on breaking tech news</p>
            </div>
            <div className="cyber-card">
              <h3 className="text-2xl font-bold mb-4 text-glow">Cyberpunk Interface</h3>
              <p className="text-gray-300">Immersive UI with terminal-style commands and retro-futuristic design</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-12">Trusted by Cyber Enthusiasts</h2>
            <div className="flex flex-wrap justify-center gap-8">
              <div className="w-full md:w-auto">
                <p className="text-5xl font-bold text-cyan-400">10K+</p>
                <p className="text-gray-400">Active Users</p>
              </div>
              <div className="w-full md:w-auto">
                <p className="text-5xl font-bold text-pink-500">24/7</p>
                <p className="text-gray-400">News Coverage</p>
              </div>
              <div className="w-full md:w-auto">
                <p className="text-5xl font-bold text-purple-500">99%</p>
                <p className="text-gray-400">Accuracy Rate</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-t from-black to-gray-900">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-4xl font-bold mb-6">Join the Future of Tech News</h2>
            <p className="text-xl text-gray-300 mb-8">
              Be among the first to experience the next generation of tech news delivery
            </p>
            <motion.button 
              className="cyber-button animate-glow"
            >
              CLAIM YOUR SPOT NOW
            </motion.button>
          </motion.div>
        </div>
      </section>
    </main>
  );
}