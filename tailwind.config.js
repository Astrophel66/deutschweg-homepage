/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        sans: ['"DM Sans"', 'sans-serif'],
      },
      colors: {
        cream: '#FAF8F4',
        charcoal: '#1C1C1E',
        'warm-gray': '#8A8680',
        border: '#E8E4DE',
        'red-brand': '#C0392B',
        'red-muted': '#E8D5D3',
        'gold-brand': '#B8860B',
        'gold-light': '#F5EDD6',
      },
    },
  },
  plugins: [],
}
