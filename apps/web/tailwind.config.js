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
        // Primary colors - Jet black theme
        bg: {
          primary: '#000000',
          secondary: '#0a0a0a',
          tertiary: '#0f0f0f',
          hover: '#141414',
        },
        border: {
          DEFAULT: '#1a1a1a',
          hover: '#2a2a2a',
        },
        text: {
          primary: '#e5e5e5',
          secondary: '#a3a3a3',
          muted: '#737373',
        },
        accent: {
          DEFAULT: '#00ff00',
          dim: 'rgba(0, 255, 0, 0.1)',
          dimmer: 'rgba(0, 255, 0, 0.05)',
        },
        status: {
          success: '#22c55e',
          error: '#ef4444',
          warning: '#eab308',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        none: '0',
      },
      spacing: {
        '4': '4px',
        '8': '8px',
        '16': '16px',
        '24': '24px',
        '32': '32px',
      },
      borderWidth: {
        '1': '1px',
      },
      boxShadow: {
        none: 'none',
      },
    },
  },
  plugins: [],
}
