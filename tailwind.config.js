/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
      "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary-blue": "#A259FF",
        "primary-green": "#0FA958",
        "secondary-green": "#17303D",
        "secondary-light-green-1": "#9DFACD",
        "secondary-light-green-2": "#279292",
        'shimmer-dark': '#f0f0f0',
        'shimmer-light': '#e0e0e0',
      }
    },
  },
  plugins: [],
}
