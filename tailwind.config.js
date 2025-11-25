/** @type {import('tailwindcss').Config} */
module.exports = {
  // Importante: esto busca tus clases en app y src
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        hikari: {
          primary: '#B91C1C',  // rojo japonés
          surface: '#FFF1F2',  // fondo suave rosado
        },
      },
      fontFamily: {
        japanese: ['NotoSansJP_400Regular'],
      },
      borderRadius: {
        '2xl': 24,
      },
    },
  },
  plugins: [],
};
