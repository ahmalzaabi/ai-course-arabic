/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        arabic: ['"Tajawal"', '"IBM Plex Sans Arabic"', 'system-ui', 'sans-serif'],
        display: ['"Cairo"', '"Tajawal"', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50:  '#eef7ff',
          100: '#d9ecff',
          200: '#bcdfff',
          300: '#8ecaff',
          400: '#59abff',
          500: '#2f8bff',
          600: '#1a6df0',
          700: '#1656c4',
          800: '#16489c',
          900: '#173f7c',
        },
        ink: {
          50:  '#f5f7fa',
          100: '#e4e8ef',
          200: '#cad2dd',
          300: '#a3b0c2',
          400: '#7587a0',
          500: '#566986',
          600: '#43536d',
          700: '#374459',
          800: '#2f394b',
          900: '#0f1626',
          950: '#070b16',
        },
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(47,139,255,0.25), 0 10px 30px -10px rgba(47,139,255,0.45)',
      },
      backgroundImage: {
        'grid-fade': 'radial-gradient(ellipse at top, rgba(47,139,255,0.18), transparent 60%)',
      },
    },
  },
  plugins: [],
}
