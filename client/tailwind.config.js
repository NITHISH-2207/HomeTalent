/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        teal: {
          primary: '#2A9D8F',
          light: '#4DB6AC',
          dark: '#1F7A70',
          DEFAULT: '#2A9D8F'
        },
        sage: '#87A878',
        terracotta: '#C5705D',
        background: '#FAF8F5',
        card: '#FFFFFF',
        textPrimary: '#1A1A2E',
        textSecondary: '#6B7280',
        border: '#E5E7EB',
        success: '#22C55E',
        warning: '#F59E0B',
        error: '#EF4444'
      },
      fontFamily: {
        heading: ['Poppins', 'sans-serif'],
        body: ['Inter', 'sans-serif']
      },
      borderRadius: {
        'xl': '0.75rem', // Buttons
        '2xl': '1rem',   // Cards
      }
    },
  },
  plugins: [],
}
