/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./screens/**/*.{js,jsx,ts,tsx}",
    "./routers/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        mainCyan: "#77AEBB",
        mainGreen: "#AEBB77",
        mainPink: "#BB77AE",
        goldenrod: "#DAA520",
      },
    },
  },
  plugins: [],
}
