/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        quickSand: ["Quicksand", "sans-serif"],
        eduAU: ["Edu AU VIC WA NT Pre", "cursive"],
        kode: ["Kode Mono", "monospace"],
      },
    },
  },
  plugins: [],
}

