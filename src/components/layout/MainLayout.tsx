'use client';

import { CyberPunkBackground } from '../effects/CyberPunkBackground';
import { Navigation } from './Navigation';
import { Footer } from './Footer';

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-cyber-black relative overflow-hidden">
      <div className="relative z-20">
        <Navigation />
      </div>
      
      <CyberPunkBackground />
      
      <main className="container mx-auto px-4 py-8 relative z-10 flex-grow">
        <div className="relative backdrop-blur-[2px]">
          {children}
        </div>
      </main>
      
      <div className="relative z-20">
        <Footer />
      </div>
    </div>
  );
}