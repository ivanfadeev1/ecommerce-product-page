/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        totalBlack: "#000000",
        black: "#1D2026",
        grayDark: "#69707D",
        gray: "#B6BCC8",
        grayLight: "#E4E9F2",
        grayLighter: "#F6F8FD",
        orange: "#FF7E1B",
        orangeLight: "#FFEEE2",
        orangeHover: "#FFAB6A",
      },
      fontFamily: {
        sans: ["Kumbh Sans", "sans-serif"],
      },
      boxShadow: {
        button: "0 20px 50px -20px rgba(255, 126, 27)",
        cart: "0 20px 50px -20px rgba(29, 32, 38, 0.5)",
      },
    },
    screens: {
      sm: "640px",
      md: "880px",
    },
  },
  plugins: [],
};
