/** @type {import('tailwindcss').Config} */
const { fontFamily } = require("tailwindcss/defaultTheme");

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'roboto': ['Roboto', ...fontFamily.sans],
        'roboto-condensed': ['Roboto Condensed', ...fontFamily.sans],
        'poppins': ["Poppins", ...fontFamily.sans]
      }
    },
  },
  plugins: [],
}