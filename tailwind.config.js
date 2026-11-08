/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e', // Neon punch rose/red
          600: '#e11d48',
          700: '#be123c',
          800: '#9f1239',
          900: '#881337',
        },
        studio: {
          dark: '#0c0e14',
          card: '#141824',
          border: '#23293d',
          gold: '#f59e0b',
          amber: '#fbbf24',
          paper: '#faf9f6',
          muted: '#8b95a5'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Outfit', 'system-ui', 'sans-serif'],
        serif: ['Instrument Serif', 'Playfair Display', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'glow-rose': '0 0 35px -5px rgba(244, 63, 94, 0.4)',
        'glow-amber': '0 0 35px -5px rgba(245, 158, 11, 0.45)',
        'glow-cyan': '0 0 35px -5px rgba(6, 182, 212, 0.4)',
        'craft': '0 20px 40px -15px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0,0,0,0.04)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        }
      }
    },
  },
  plugins: [],
}
