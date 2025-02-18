/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			primaryTitle: '#000957',
  			primaryContent: '#344CB7',
  			primarySubcontent: '#FFEB00',
  			primaryBase: '#fdfdfd',
  			primaryAccent: '#577BC1',
  			primaryBg: '#f6f6f6',
			greenBg: '#024950',
			white: '#ffffff',
			greenLight: '#0FA4AF',
			greenSoft: '#AFDDE5',
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
}