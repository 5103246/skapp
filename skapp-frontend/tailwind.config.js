/** @type {import('tailwindcss').Config} */
//const { fontFamily } = require('tailwindcss/defaultTheme');

export default {
    content: [
      './index.html',
      './src/**/*.{js,jsx,ts,tsx}',
      './node_modules/@shadcn/ui/dist/**/*.{js,jsx,ts,tsx}',
    ],
    theme: {
      extend: {},
    },
    plugins: [],
  }