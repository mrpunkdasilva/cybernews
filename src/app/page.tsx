'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

export default function Home() {
  const [email, setEmail] = useState('');

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <main className="min-h-screen bg-cyber-black text-cyber-neon">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-b from-cyber-black to-cyber-dark">
        <div className="absolute inset-0 grid-bg animate-grid-pulse"></div>
        <div className="container mx-auto px-4 text-center z-10">
          <motion.h1 
            {...fadeIn}
            className="text-6xl md:text-8xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyber-neon to-cyber-purple animate-text-gradient"
          >
            CYBER<span className="text-cyber-pink">NEWS</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl mb-8 text-gray-300"
          >
            Stay ahead in tech with AI-powered news curation
          </motion.p>
          <motion.div 
            className="flex flex-col md:flex-row gap-4 justify-center items-center max-w-md mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="cyber-input"
            />
            <motion.button 
              className="cyber-button animate-glow"
            >
              GET EARLY ACCESS
            </motion.button>
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