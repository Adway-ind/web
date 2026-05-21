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
      pulseRing: {
        "0%":  { boxShadow: "0 0 0 0 rgba(124,58,237,0.55), 0 8px 32px rgba(124,58,237,0.45)" },
        "60%": { boxShadow: "0 0 0 14px rgba(124,58,237,0), 0 8px 32px rgba(124,58,237,0.45)" },
        "100%":{ boxShadow: "0 0 0 0 rgba(124,58,237,0), 0 8px 32px rgba(124,58,237,0.45)" },
      },
    },
  },
}
  plugins: [],
}