/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1e40af', // Blue 700
          light: '#3b82f6', // Blue 500
          dark: '#1e3a8a', // Blue 900
        },
        accent: {
          DEFAULT: '#d97706', // Amber 600
          light: '#f59e0b', // Amber 500
        },
        secondary: '#475569', // Slate 600
      }
    },
  },
  plugins: [],
}
