/** @type {import('tailwindcss').Config} */
// tailwind.config.js

module.exports = {
 content: ["./App.{js,jsx,ts,tsx}","./screens/**/*.{js,jsx,ts,tsx}","./components/**/*.{js,jsx,ts,tsx}","./routers/**/*.{js,jsx,ts,tsx}"],
    theme: {
      extend: {},
      colors:{"mainCyan":"#77AEBB","mainGreen":"#AEBB77","mainPink":"#BB77AE","white":"#ffffff"}
    },
    plugins: [],
  }