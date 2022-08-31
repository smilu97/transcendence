/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    colors: {
      primary700: 'rgb(28, 12, 91)',
      primary500: 'rgb(61, 44, 141)',
      primary300: 'rgb(145, 107, 191)',
      primary100: 'rgb(201, 150, 204)',
    },
    extend: {},
  },
  plugins: [],
}
