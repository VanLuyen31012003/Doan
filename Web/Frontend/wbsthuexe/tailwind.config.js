/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  
  theme: {
    extend: {
      backgroundImage: {
        banner:"url('https://himoto.vn/wp-content/uploads/2024/01/HR-cover.jpg')"
      },
      colors: {
        cam: "#dd5c36",
        ghi: "#555555",
        trangxam:"#f6f6f6"
      },
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-3px)' },
          '50%': { transform: 'translateX(3px)' },
          '75%': { transform: 'translateX(-3px)' },
        },
      },
      animation: {
        shake: 'shake 0.3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}