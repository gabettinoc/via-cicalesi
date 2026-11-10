import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ivory: '#F6F2EC',
        sand: '#EAE2D6',
        stone: '#CFC4B4',
        ink: '#1C1A17',
        mute: '#6B645A',
        bronze: { DEFAULT: '#A5643A', dark: '#8A4F2A', light: '#C98A5E' },
        forest: '#3E4A3D',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      letterSpacing: { eyebrow: '0.22em' },
      boxShadow: { soft: '0 20px 60px -25px rgba(28,26,23,0.35)' },
    },
  },
  plugins: [],
};

export default config;
