/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['EB Garamond', 'Garamond', 'serif'],
        display: ['Cinzel', 'serif'],
      },
      colors: {
        cream: '#fffdf7',
        parchment: '#f5eddf',
        gold: {
          DEFAULT: '#f3be4a',
          light: '#f7d06e',
          dark: '#c99a2e',
        },
        burgundy: {
          DEFAULT: '#926d47',
          light: '#a8845e',
          dark: '#6b4e30',
        },
        ink: '#1A1208',
      },
      backgroundImage: {
        'cross-pattern': "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f3be4a' fill-opacity='0.06'%3E%3Cpath d='M26 8h8v44h-8zM8 26h44v8H8z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
}
