/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      colors: {
        parchment: {
          DEFAULT: "#faf7f2",
          dim: "#f4efe6",
          deep: "#ebe4d6",
        },
        umber: {
          DEFAULT: "#2b1e16",
          deep: "#110703",
        },
        ink: {
          DEFAULT: "#1c1c19",
          soft: "#4e4540",
        },
        saffron: {
          DEFAULT: "#c59b27",
          soft: "#eec14b",
        },
        jade: {
          DEFAULT: "#1b3b36",
          mist: "#2d4c47",
        },
        terracotta: "#b85d38",
        cream: "#f3f0eb",
      },
      fontFamily: {
        display: [
          "var(--font-display)",
          "Playfair Display",
          "Iowan Old Style",
          "Palatino Linotype",
          "serif",
        ],
        body: [
          "var(--font-body)",
          "Plus Jakarta Sans",
          "Gill Sans",
          "Trebuchet MS",
          "sans-serif",
        ],
      },
      letterSpacing: {
        kicker: "0.16em",
      },
    },
  },
  plugins: [],
};
