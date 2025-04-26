'use client';

export function CRTEffect() {
  return (
    <div className="pointer-events-none fixed inset-0 z-50">
      {/* Scanlines */}
      <div className="absolute inset-0 bg-scanline animate-scanline" />
      
      {/* CRT Flicker */}
      <div className="absolute inset-0 animate-crt-flicker bg-gradient-to-b from-transparent to-cyber-neon/5" />
      
      {/* Screen Curvature */}
      <div className="absolute inset-0 rounded-lg shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]" />
      
      {/* Removed the pulsing neon glow effect */}
    </div>
  );
}