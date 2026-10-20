/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#070711',
        surface: '#0d0d1a',
        violet: '#9b87f5',
        indigo: '#6574ff',
        gold: '#d6b66f',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Manrope', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        handwritten: ['"Segoe Print"', '"Bradley Hand"', 'cursive'],
      },
      boxShadow: {
        glow: '0 0 55px rgba(124, 99, 255, 0.18)',
      },
    },
  },
  plugins: [],
}
