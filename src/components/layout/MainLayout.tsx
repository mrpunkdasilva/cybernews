'use client';

import { CyberPunkBackground } from '../effects/CyberPunkBackground';
import { CyberMatrixBackground } from '../effects/CyberMatrixBackground';
import { Navigation } from './Navigation';
import { Footer } from './Footer';
import { CRTEffect } from "@/components/terminal/CRTEffect";

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-cyber-black relative overflow-hidden">
      {/* Backgrounds */}
      <div className="fixed inset-0 z-0">
        <CyberMatrixBackground />
        <CyberPunkBackground />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <CRTEffect />
        
        <div className="relative z-20">
          <Navigation />
        </div>
        
        <main className="container mx-auto px-4 py-8 flex-grow">
          <div className="relative backdrop-blur-sm bg-cyber-black/30 rounded-lg p-4">
            {children}
          </div>
        </main>
        
        <div className="relative z-20">
          <Footer />
        </div>
      </div>
    </div>
  );
}