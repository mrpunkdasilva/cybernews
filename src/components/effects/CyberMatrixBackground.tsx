'use client';

import { useEffect, useRef } from 'react';

export function CyberMatrixBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Ajusta o canvas para tela inteira com densidade de pixels correta
    const adjustCanvas = () => {
      const devicePixelRatio = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      
      canvas.width = rect.width * devicePixelRatio;
      canvas.height = rect.height * devicePixelRatio;
      
      ctx.scale(devicePixelRatio, devicePixelRatio);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
    };

    adjustCanvas();
    window.addEventListener('resize', adjustCanvas);

    // Caracteres para o efeito matrix
    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    const charSize = 14;
    const columns = canvas.width / charSize;
    const drops: number[] = new Array(Math.floor(columns)).fill(0);

    // Cores com gradiente
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#00fff5'); // cyber-neon
    gradient.addColorStop(0.5, '#ff00ff'); // cyber-pink
    gradient.addColorStop(1, '#b900ff'); // cyber-purple

    // Loop de animação
    const draw = () => {
      ctx.fillStyle = 'rgba(10, 10, 10, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = gradient;
      ctx.font = `${charSize}px 'Share Tech Mono'`;

      drops.forEach((y, i) => {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = i * charSize;

        ctx.fillText(char, x, y * charSize);

        if (y * charSize > canvas.height && Math.random() > 0.99) {
          drops[i] = 0;
        }
        drops[i]++;
      });

      requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', adjustCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full -z-10 opacity-50"
    />
  );
}