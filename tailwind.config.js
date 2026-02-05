/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./pages/**/*.{js,jsx,ts,tsx}",
    "./index.html",
  ],
  theme: {
    extend: {
      colors: {
        background: '#000000',      // Jet black
        surface: '#0a0a0a',          // Dark card bg
        border: '#1a1a1a',          // Dark gray borders
        primary: '#e5e5e5',         // Main text
        secondary: '#a3a3a3',       // Muted text
        accent: '#00ff00',          // Electric green
        success: '#22c55e',         // Success state
        error: '#ef4444',           // Error state
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        DEFAULT: 'none',  // Flat, minimalist design
      },
    },
    borderRadius: {
      DEFAULT: '0px',  // No rounded corners everywhere
    },
  },
  plugins: [],
}
