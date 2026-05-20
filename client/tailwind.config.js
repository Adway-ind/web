/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  extend: {
    animation: {
      marqueeRight: 'marqueeRight 22s linear infinite',
      float: 'float 3s ease-in-out infinite',
    },
    keyframes: {
      marqueeRight: {
        '0%': {
          transform: 'translateX(-50%)',
        },
        '100%': {
          transform: 'translateX(0)',
        },
      },
      float: {
        '0%, 100%': {
          transform: 'translateY(0px)',
        },
        '50%': {
          transform: 'translateY(-6px)',
        },
      },
    },
  },
}
  plugins: [],
}