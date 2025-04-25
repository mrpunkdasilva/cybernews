/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'cyber': {
          'black': '#0a0a0a',
          'darker': '#000000',
          'dark': '#1a1a1a',
          'neon': '#00fff5',
          'pink': '#ff00ff',
          'purple': '#b026ff',
        }
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'grid-pulse': 'gridPulse 4s infinite',
        'text-gradient': 'gradientFlow 3s linear infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 10px #00fff5' },
          '100%': { boxShadow: '0 0 20px #00fff5, 0 0 30px #00fff5' }
        },
        gridPulse: {
          '0%, 100%': { opacity: '0.1' },
          '50%': { opacity: '0.2' }
        },
        gradientFlow: {
          '0%': { backgroundPosition: '0% center' },
          '100%': { backgroundPosition: '200% center' }
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'cyber-grid': 'linear-gradient(to right, rgba(0, 255, 245, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 255, 245, 0.1) 1px, transparent 1px)',
      },
      backgroundSize: {
        'grid': '50px 50px',
      },
    },
  },
  plugins: [],
}