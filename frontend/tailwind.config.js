/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#6366f1",
        accent: "#10b981",
        surface: "rgba(15, 23, 42, 0.6)",
        "game-gold": "#fbbf24",
        "game-blue": "#3b82f6",
        "game-stone": "#1e293b",
        "game-dark": "#020617",
      },
      fontFamily: {
        game: ['"Outfit"', "sans-serif"],
      },
      backgroundImage: {
        "game-gradient": "radial-gradient(circle at 50% 50%, rgba(30, 41, 59, 1) 0%, #020617 100%)",
      },
    },
  },
  plugins: [],
};
