/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        RussianViolet: '#32174D', 
        hoverColor:  ' #523968',
        buttonColor: '#32174D',
        hoverButtonColor: '#735d85',
        underlineHome: '#C77DFF',
        inputTextColor: '#240046'
      },
    },
  },
  plugins: [],
}

