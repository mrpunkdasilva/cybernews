'use client';

export function CyberBackground() {
  return (
    <>
      {/* Minimal gray grid texture */}
      <div className="fixed inset-0 bg-minimal-pattern opacity-[0.02]" />
      
      {/* Subtle depth effect */}
      <div className="fixed inset-0 perspective-1000">
        <div className="absolute inset-0 preserve-3d rotate3d opacity-[0.01]">
          <div className="minimal-grid" />
        </div>
      </div>
    </>
  );
}