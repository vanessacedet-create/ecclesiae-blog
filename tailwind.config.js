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
        cream: '#FAF7F2',
        parchment: '#F0E9DC',
        gold: {
          DEFAULT: '#B8943F',
          light: '#D4AF6A',
          dark: '#8B6914',
        },
        burgundy: {
          DEFAULT: '#5C1E1E',
          light: '#7D2E2E',
          dark: '#3D1010',
        },
        ink: '#1A1208',
      },
      backgroundImage: {
        'cross-pattern': "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23B8943F' fill-opacity='0.06'%3E%3Cpath d='M26 8h8v44h-8zM8 26h44v8H8z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
}
