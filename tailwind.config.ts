import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        asphalt: '#111111',
        bruise: '#2A1C26',
        brick: '#7A2E2A',
        marble: '#D8D3C7',
        seedling: '#3F6B45',
        charcoal: '#1C1C1C',
        fog: '#6B6B6B',
      },
      fontFamily: {
        serif: ['Fraunces', 'Georgia', 'serif'],
        mono: ['IBM Plex Mono', 'Courier New', 'monospace'],
      },
    },
  },
  plugins: [],
} satisfies Config
