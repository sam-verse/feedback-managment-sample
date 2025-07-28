/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        happyfox: {
          orange: '#FF9800', // main orange
          dark: '#F57C00',   // dark orange
          light: '#FFF3E0',  // light/white background
        },
      },
    },
  },
  plugins: [],
}
