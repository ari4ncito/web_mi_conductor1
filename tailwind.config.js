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
          DEFAULT: '#1B768E', // color principal
          dark: '#012538',    // azul oscuro
        },
        accent: '#FB9833',    // naranja de acento
      },
    },
  },
  plugins: [],
}