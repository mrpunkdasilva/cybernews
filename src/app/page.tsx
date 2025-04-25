'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

export default function Home() {
  const [email, setEmail] = useState('');

  return (
    <main className="min-h-screen bg-cyber-black text-cyber-neon relative overflow-hidden">
      {/* Cyberpunk Background Layers */}
      <div className="fixed inset-0 bg-cyber-city bg-cover bg-center bg-no-repeat" />
      <div className="fixed inset-0 bg-cyber-pattern opacity-30" />
      <div className="fixed inset-0 bg-cyber-rays animate-cyber-pulse" />
      
      {/* Animated Grid Background */}
      <div className="fixed inset-0 bg-scanline opacity-5 pointer-events-none" />
      <div className="fixed inset-0 perspective-1000">
        <div className="absolute inset-0 preserve-3d rotate3d">
          <div className="cyber-grid-background" />
        </div>
      </div>

      {/* Floating Particles Effect */}
      <div className="fixed inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyber-neon rounded-full animate-cyber-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              opacity: 0.3,
            }}
          />
        ))}
      </div>

      {/* Hero Section with Glassmorphism */}
      <section className="relative min-h-screen flex items-center justify-center px-4">
        <div className="container mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto backdrop-blur-sm bg-cyber-black/30 p-8 rounded-lg border border-cyber-neon/30 shadow-[0_0_50px_rgba(0,255,245,0.1)]"
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
              className="text-xl md:text-2xl mb-12 font-rajdhani text-gray-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Stay ahead in tech with AI-powered news curation
            </motion.p>

            <motion.div 
              className="flex flex-col md:flex-row gap-6 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="cyber-input terminal-text text-lg w-full md:w-auto"
              />
              <motion.button 
                className="cyber-button animate-glow w-full md:w-auto"
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
      <section className="relative z-10 py-20 bg-black">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="relative z-20"
          >
            <h2 className="text-4xl font-bold mb-12 cyber-text-glow">Trusted by Cyber Enthusiasts</h2>
            <div className="flex flex-wrap justify-center gap-8">
              <div className="w-full md:w-auto cyber-container p-6">
                <p className="text-5xl font-bold text-cyan-400 animate-pulse">10K+</p>
                <p className="text-gray-400">Active Users</p>
              </div>
              <div className="w-full md:w-auto cyber-container p-6">
                <p className="text-5xl font-bold text-pink-500 animate-pulse">24/7</p>
                <p className="text-gray-400">News Coverage</p>
              </div>
              <div className="w-full md:w-auto cyber-container p-6">
                <p className="text-5xl font-bold text-purple-500 animate-pulse">99%</p>
                <p className="text-gray-400">Accuracy Rate</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20 bg-gradient-to-t from-black to-gray-900">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto relative z-20"
          >
            <h2 className="text-4xl font-bold mb-6 cyber-text-glow">Join the Future of Tech News</h2>
            <p className="text-xl text-gray-300 mb-8">
              Be among the first to experience the next generation of tech news delivery
            </p>
            <motion.button 
              className="cyber-button animate-glow"
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 0 25px rgba(0,255,245,0.5)"
              }}
              whileTap={{ scale: 0.95 }}
            >
              CLAIM YOUR SPOT NOW
            </motion.button>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
