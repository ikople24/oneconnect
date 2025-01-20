/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        primaryTitle: "#000957",
        primaryContent: "#344CB7",
        primarySubcontent: "#FFEB00",
        primaryBase: "#fdfdfd",
        primaryAccent: "#577BC1",
        primaryBg: "#f6f6f6",
      }
    },
  },
  plugins: [],
}