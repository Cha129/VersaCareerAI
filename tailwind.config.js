/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: { DEFAULT: '#0c0c0e', soft: '#141416', card: '#1a1a1c', elev: '#222226' },
        border: { DEFAULT: '#2a2a2e', soft: '#3a3a3e' },
        text: { DEFAULT: '#e8e4dc', muted: '#9a948a', faint: '#5c5852' },
        primary: { DEFAULT: '#c9a227', hover: '#d4af37', soft: '#3a2e0e' },
        accent: { DEFAULT: '#7a8b6f', hover: '#8a9b7f' },
        success: { DEFAULT: '#7a8b6f', soft: '#2e3a28' },
        warning: { DEFAULT: '#d4af37', soft: '#3a2e0e' },
        error: { DEFAULT: '#c0392b', soft: '#3a1a16' },
      },
      fontFamily: {
        sans: ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
        display: ['Fraunces', 'Georgia', 'serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '2px',
        lg: '2px',
        xl: '3px',
        '2xl': '4px',
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.02)',
        glow: '0 0 24px rgba(201,162,39,0.18)',
        brass: '0 0 12px rgba(201,162,39,0.12)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(12px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        pulseSoft: { '0%,100%': { opacity: '0.6' }, '50%': { opacity: '1' } },
      },
    },
  },
  plugins: [],
}
