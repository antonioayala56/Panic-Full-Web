/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{vue,js,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./app.vue",
  ],
  theme: {
    extend: {
      colors: {
        neon: {
          blue: "#49D9FF",
          cyan: "#00F6FF",
          purple: "#8A4FFF",
          pink: "#FF2AEF"
        }
      },
      backdropBlur: {
        xs: "2px",
      },
      boxShadow: {
        "neon-blue": "0 0 12px rgba(0, 246, 255, 0.6)",
        "neon-cyan": "0 0 15px rgba(73, 217, 255, 0.8)",
        "neon-purple": "0 0 18px rgba(138, 79, 255, 0.8)",
      },
      animation: {
        "scan": "scan 3s linear infinite",
        "float": "float 4s ease-in-out infinite",
        "pulse-soft": "pulse-soft 2.4s ease-in-out infinite",
      },
      keyframes: {
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(200%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: 0.6 },
          "50%": { opacity: 1 },
        },
      }
    },
  },
  plugins: [],
}
