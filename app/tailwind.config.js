/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./app/**/*.{js,ts,jsx,tsx,mdx}",
      "./pages/**/*.{js,ts,jsx,tsx,mdx}",
      "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
      extend: {
        colors: {
          maroon: {
            100: '#f2e1e1',
            200: '#e5c3c3',
            300: '#d8a5a5',
            400: '#cb8787',
            500: '#be6969',
            600: '#b14b4b',
            700: '#8f3c3c',
            800: '#6d2e2e',
            900: '#4b1f1f',
          },
        },
      },
    },
    plugins: [],
  }