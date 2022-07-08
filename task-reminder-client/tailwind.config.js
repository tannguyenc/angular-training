/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./apps/**/*.html",
    "./apps/**/*.ts",
    "./libs/**/*.html",
    "./libs/**/*.ts"
  ],
  theme: {
    extend: {
      colors: {
        'regal-blue': '#00bcd4',
        'regal-blue-hover': '#00aec5',
        'regal-blue-hover-border': '#008697',
      },
    },
  },
  plugins: [],
}
