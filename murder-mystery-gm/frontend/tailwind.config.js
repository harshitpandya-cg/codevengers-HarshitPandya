/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        mystery: {
          bg: '#050505',
          panel: '#0a0a0a',
          panelLight: '#111111',
          hairline: '#222222',
          red: '#8a1c1c',
          brass: '#b8996b',
          text: '#dcd6ce',
          textSecondary: '#6e6559',
        },
      },
      fontFamily: {
        typewriter: ['"Cinzel Decorative"', 'serif'],
        case: ['"Cormorant Garamond"', 'serif'],
      },
      keyframes: {
        blink: {
          '0%, 49%': { opacity: '1' },
          '50%, 100%': { opacity: '0' },
        },
        'stamp-pulse': {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.85' },
          '50%': { transform: 'scale(1.08)', opacity: '1' },
        },
        'dash-fill': {
          '0%, 100%': { opacity: '0.25' },
          '50%': { opacity: '1' },
        },
      },
      animation: {
        blink: 'blink 1s step-end infinite',
        'stamp-pulse': 'stamp-pulse 2s ease-in-out infinite',
        'dash-fill': 'dash-fill 1.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
