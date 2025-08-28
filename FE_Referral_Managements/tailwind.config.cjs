/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    colors: {
      brand: {
        darkest: "#06141B",
        dark: "#11212D",
        DEFAULT: "#253745",
        medium: "#4A5C6A",
        light: "#9BA8AB",
        lightest: "#CCD0CF",
      },
      // mantieni i colori default di Tailwind
      transparent: "transparent",
      current: "currentColor",
      neutral: require("tailwindcss/colors").neutral, 
      white: "#FFFFFF",
      black: "#000000",
    },
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        heading: ["Poppins", "sans-serif"],
      },
      spacing: {
        72: "18rem",
        84: "21rem",
        96: "24rem",
      },
      boxShadow: {
        brand: "0 4px 14px 0 rgba(37,55,69,0.4)", // brand base shadow
        },
        safelist: ["bg-red-500", "bg-yellow-500", "bg-blue-500", "bg-green-500"],
    },
  },
  plugins: [],
};
