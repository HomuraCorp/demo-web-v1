/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#188200',
          dark: '#004B23'
        },
        secondary: '#F08C00',
        bg: '#F7F5F0',
        content: '#1A1A1A',
        muted: '#6B7280'
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        jakarta: ['Plus Jakarta Sans', 'sans-serif'],
      },
      animation: {
        'float': 'floatUp 1s ease-out forwards',
        'subtle-float': 'subtleFloat 3s ease-in-out infinite',
      },
      keyframes: {
        floatUp: {
          '0%': { opacity: '1', transform: 'translateY(0)' },
          '100%': { opacity: '0', transform: 'translateY(-50px)' },
        },
        subtleFloat: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        }
      }
    },
  },
  plugins: [],
}
