/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        hikari: {
          primary: "#B91C1C",  // rojo japonés
          surface: "#FFF1F2",  // fondo suave rosado
        },
      },
      fontFamily: {
        japanese: ["NotoSansJP_400Regular"],
      },
      borderRadius: {
        "2xl": 24,
      },
    },
  },
  plugins: [],
};
