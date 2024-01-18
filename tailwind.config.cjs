/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["src/**/*.{tsx,ts,jsx,js}", "*.html"],
  theme: {
    extend: {},
    screens: {
      // Common phones top out at 480px
      tablet: { raw: "(min-width: 481px) and (min-height: 481px)" },
    },
  },
  corePlugins: {},
  plugins: [require("@tailwindcss/typography")],
};
