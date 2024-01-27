/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");

export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {},
    colors: {
      spblack: "#000B3F",
      spblue1: "#00DCF4",
      spblue2: "#008CFF",
      white: "#FFFFFF",
      black: "#000000",
      gray: colors.gray,
      "accent-1": "#FAFAFA",
      "accent-2": "#EAEAEA",
      "accent-7": "#333",
      success: "#0070f3",
      cyan: "#79FFE1",
      "blue-500": "#2276FC",
      "yellow-100": "#fef7da",
    },
    fontFamily: {
      poppins: ['"Poppins"', "sans-serif"],
    },
  },
  plugins: [],
};
