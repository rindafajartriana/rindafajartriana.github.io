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
      },
      keyframes: {
        scaleIn: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      animation: {
        scaleIn: 'scaleIn 0.5s ease-out forwards',
      },
    },
  },
  plugins: [],
}