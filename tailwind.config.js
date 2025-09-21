/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      // tes couleurs, fonts, radius, etc.
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
