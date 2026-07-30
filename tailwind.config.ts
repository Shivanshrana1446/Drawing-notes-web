import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: '#ffffff',
          muted: '#f5f6f8',
          border: '#e2e4e9',
        },
        accent: {
          DEFAULT: '#4f46e5',
          hover: '#4338ca',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        hand: ['"Comic Sans MS"', '"Segoe Print"', 'cursive'],
      },
      boxShadow: {
        panel: '0 2px 8px 0 rgb(0 0 0 / 0.08), 0 0 0 1px rgb(0 0 0 / 0.04)',
      },
    },
  },
  plugins: [],
}

export default config
