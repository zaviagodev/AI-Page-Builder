module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['poppins']
      },
      fontSize: {
        'xs': '.75rem',
      },
      colors: {
        brand: {
          light: "#eff1f8",
          DEFAULT: "#ebedf2",
          dark: "#e9ebf3",
          disabled: "#f6f8fb",
        }
      }
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
