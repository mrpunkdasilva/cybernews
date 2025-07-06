'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import AuthButton from '../auth/AuthButton';
import { useSession } from 'next-auth/react';

export function Navigation() {
  const { status } = useSession();

  return (
    <nav className="sticky top-0 z-50 bg-cyber-black/80 backdrop-blur-sm border-b border-cyber-neon/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative w-8 h-8"
            >
              <Image
                src="/favicon.svg"
                alt="CyberNews Logo"
                width={32}
                height={32}
                className="group-hover:animate-pulse"
              />
            </motion.div>
            <motion.span 
              className="text-2xl font-orbitron"
              whileHover={{ scale: 1.05 }}
            >
              CYBER<span className="text-cyber-pink">NEWS</span>
            </motion.span>
          </Link>

          {/* Navigation Items */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="nav-link">Home</Link>
            <Link href="/top" className="nav-link">Top</Link>
            <Link href="/new" className="nav-link">New</Link>
            <Link href="/best" className="nav-link">Best</Link>
            <Link href="/ask" className="nav-link">Ask</Link>
            <Link href="/show" className="nav-link">Show</Link>
            {status === 'authenticated' && (
              <Link href="/favorites" className="nav-link text-cyber-pink">Favorites</Link>
            )}
          </div>

          {/* Auth Button */}
          <div className="flex items-center space-x-4">
            <AuthButton />
          </div>
        </div>
      </div>
    </nav>
  );
}