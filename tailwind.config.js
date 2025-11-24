/** @type {import('tailwindcss').Config} */
module.exports = {
  // Importante: Esto busca tus clases en app y src
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        hikari: {
          primary: '#B91C1C', 
          surface: '#FFF1F2', 
        }
      },
      fontFamily: {
        japanese: ['NotoSansJP_400Regular'], 
      }
    },
  },
  plugins: [],
}