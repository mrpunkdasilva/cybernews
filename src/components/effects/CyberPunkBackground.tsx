'use client';

import { useEffect, useRef } from 'react';

export function CyberPunkBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const adjustCanvas = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    adjustCanvas();
    window.addEventListener('resize', adjustCanvas);

    // Efeito de linhas elétricas
    class ElectricLine {
      x: number = 0;
      y: number = 0;
      length: number = 0;
      angle: number = 0;
      speed: number = 0;
      color: string = '';

      constructor() {
        this.reset();
      }

      reset() {
        if (!canvas) return;
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.length = Math.random() * 100 + 50;
        this.angle = Math.random() * Math.PI * 2;
        this.speed = Math.random() * 2 + 1;
        this.color = `hsl(${Math.random() * 60 + 170}, 100%, 50%)`;
      }

      update() {
        if (!canvas) return;
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;

        if (this.x < 0 || this.x > canvas.width || 
            this.y < 0 || this.y > canvas.height) {
          this.reset();
        }
      }

      draw() {
        if (!ctx) return;
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(
          this.x + Math.cos(this.angle) * this.length,
          this.y + Math.sin(this.angle) * this.length
        );
        ctx.stroke();
      }
    }

    // Criar linhas elétricas
    const lines = Array.from({ length: 50 }, () => new ElectricLine());

    // Efeito de glitch
    function createGlitch() {
      if (!canvas || !ctx) return;
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const width = Math.random() * 100 + 50;
      const height = Math.random() * 20 + 10;

      ctx.fillStyle = `rgba(255, 0, ${Math.random() * 255}, ${Math.random() * 0.5})`;
      ctx.fillRect(x, y, width, height);
    }

    // Grid cyberpunk
    function drawGrid() {
      if (!canvas || !ctx) return;
      ctx.strokeStyle = 'rgba(0, 255, 245, 0.1)';
      ctx.lineWidth = 1;

      for (let i = 0; i < canvas.width; i += 30) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }

      for (let i = 0; i < canvas.height; i += 30) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }
    }

    let frame = 0;
    function animate() {
      if (!canvas || !ctx) return;
      frame++;
      
      // Limpa com rastro
      ctx.fillStyle = 'rgba(10, 10, 10, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Desenha grid
      drawGrid();

      // Atualiza e desenha linhas elétricas
      lines.forEach(line => {
        line.update();
        line.draw();
      });

      // Adiciona glitches aleatórios
      if (frame % 10 === 0) {
        for (let i = 0; i < 3; i++) {
          createGlitch();
        }
      }

      // Efeito de scanline
      for (let i = 0; i < canvas.height; i += 4) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, i, canvas.width, 2);
      }

      requestAnimationFrame(animate);
    }

    animate();

    return () => window.removeEventListener('resize', adjustCanvas);
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full -z-10"
      />
      <div className="fixed inset-0 bg-gradient-to-b from-transparent via-cyber-black/50 to-cyber-black pointer-events-none" />
      <div className="fixed inset-0 animate-flicker opacity-[0.02] bg-noise pointer-events-none" />
    </>
  );
}