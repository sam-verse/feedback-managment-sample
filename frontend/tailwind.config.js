/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        happyfox: {
          orange: '#ff7b00ff', // main orange
          dark: '#F57C00',   // dark orange
          light: '#FFF3E0',  // light/white background
        },
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        }
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-in-out'
      },
    },
  },
  plugins: [],
}
