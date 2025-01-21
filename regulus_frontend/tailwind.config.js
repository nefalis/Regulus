/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'pink-1': '#ffdef3',
        'pink-2': '#d3678e',
      }
    },
  },
  plugins: [],
}

