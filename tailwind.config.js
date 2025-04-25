/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        orbitron: ['var(--font-orbitron)'],
        'share-tech': ['var(--font-share-tech-mono)'],
        rajdhani: ['var(--font-rajdhani)'],
      },
      colors: {
        'cyber': {
          'black': '#0a0a0a',
          'dark': '#1a1a1a',
          'neon': '#00fff5',
          'pink': '#ff00ff',
          'purple': '#b900ff',
          'grid': '#1a1a1a',
          'orange': '#ff9800',
          'yellow': '#ffeb3b',
        }
      },
      backgroundImage: {
        'cyber-city': "linear-gradient(rgba(10, 10, 10, 0.8), rgba(10, 10, 10, 0.8)), url('/images/cyber-city.jpg')",
        'cyber-pattern': `
          linear-gradient(rgba(10, 10, 10, 0.9), rgba(10, 10, 10, 0.9)),
          repeating-linear-gradient(
            45deg,
            var(--cyber-grid) 0px,
            var(--cyber-grid) 2px,
            transparent 2px,
            transparent 10px
          )
        `,
        'cyber-rays': `
          linear-gradient(rgba(0, 255, 245, 0.1) -50%, transparent 90%),
          radial-gradient(circle at 50% 50%, rgba(255, 0, 255, 0.1), transparent 70%)
        `,
        'grid': `
          linear-gradient(to right, var(--cyber-grid) 2px, transparent 2px),
          linear-gradient(to bottom, var(--cyber-grid) 2px, transparent 2px),
          linear-gradient(to bottom, rgba(0, 255, 245, 0.1) 1px, transparent 1px),
          linear-gradient(to right, rgba(0, 255, 245, 0.1) 1px, transparent 1px)
        `,
        'grid-small': `
          linear-gradient(to right, var(--cyber-grid) 1px, transparent 1px),
          linear-gradient(to bottom, var(--cyber-grid) 1px, transparent 1px)
        `,
        'cyber-gradient': 'linear-gradient(45deg, var(--cyber-dark) 0%, var(--cyber-black) 100%)',
        'scanline': 'repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.2) 0px, rgba(0, 0, 0, 0.2) 1px, transparent 1px, transparent 2px)',
      },
      animation: {
        'text-gradient': 'text-gradient 3s ease infinite',
        'grid-pulse': 'grid-pulse 2s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'scanline': 'scanline 10s linear infinite',
        'flicker': 'flicker 0.5s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
        'grid-flow': 'grid-flow 20s linear infinite',
        'cyber-pulse': 'cyber-pulse 4s ease-in-out infinite',
        'cyber-float': 'cyber-float 6s ease-in-out infinite',
      },
      keyframes: {
        'text-gradient': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center',
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center',
          },
        },
        'grid-pulse': {
          '0%, 100%': { opacity: 0.4 },
          '50%': { opacity: 0.2 },
        },
        'glow': {
          '0%, 100%': { filter: 'brightness(100%) blur(0px)' },
          '50%': { filter: 'brightness(150%) blur(2px)' },
        },
        'scanline': {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(100%)' },
        },
        'flicker': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.8 },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'grid-flow': {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(100%)' },
        },
        'cyber-pulse': {
          '0%, 100%': { opacity: 0.8 },
          '50%': { opacity: 0.4 },
        },
        'cyber-float': {
          '0%, 100%': { transform: 'translateY(0) scale(1)' },
          '50%': { transform: 'translateY(-20px) scale(1.05)' },
        },
      },
    },
  },
  plugins: [],
}