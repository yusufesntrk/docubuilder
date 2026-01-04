/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#248567',
        'primary-hover': '#1d6b53',
        'text-main': '#2f2f2f',
        'text-secondary': '#6b7280',
      },
    },
  },
  plugins: [],
}
