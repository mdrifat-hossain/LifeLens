/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#5fd068",
        secondary: "#4b8673", 
        accent: "#4b8673",
        background: "#0e1f0f",
        text: "#f7fcf7",
        whiteBg: "#f7fcf7"
      },
    },
  },
  plugins: [],
}