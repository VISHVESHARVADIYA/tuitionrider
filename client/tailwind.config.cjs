/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f4f2ff",
          100: "#ede9fe",
          200: "#ddd6fe",
          300: "#c4b5fd",
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#6d4bff",
          700: "#5b3bd6",
          800: "#43308f",
          900: "#2f255e",
        },
        skyplay: "#63c9ff",
        lemon: "#fff4a8",
        peach: "#ffd5c2",
        mint: "#d1fae5",
      },
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
      },
      boxShadow: {
        playful: "0 20px 45px -25px rgba(91, 59, 214, 0.45)",
      },
      backgroundImage: {
        "hero-gradient":
          "radial-gradient(circle at top left, rgba(255,255,255,0.95) 0%, rgba(215,236,255,0.92) 25%, rgba(237,233,254,0.92) 60%, rgba(255,224,240,0.95) 100%)",
      },
      animation: {
        floaty: "floaty 3.2s ease-in-out infinite",
      },
      keyframes: {
        floaty: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
    },
  },
  plugins: [],
};
