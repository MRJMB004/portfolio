/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: "#0B1120",
          soft: "#111827",
        },
        accent: {
          blue: "#3B82F6",
          violet: "#8B5CF6",
        },
        ink: {
          DEFAULT: "#FFFFFF",
          muted: "#94A3B8",
        },
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      backgroundImage: {
        "gradient-brand": "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)",
        "grid-glow":
          "radial-gradient(circle at 20% 20%, rgba(59,130,246,0.15), transparent 40%), radial-gradient(circle at 80% 30%, rgba(139,92,246,0.15), transparent 40%)",
      },
      boxShadow: {
        glow: "0 0 40px rgba(139,92,246,0.35)",
        "glow-blue": "0 0 40px rgba(59,130,246,0.35)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: 0.5, transform: "scale(1)" },
          "50%": { opacity: 0.9, transform: "scale(1.05)" },
        },
        blink: {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0 },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "float-slow": "float 9s ease-in-out infinite",
        pulseGlow: "pulseGlow 4s ease-in-out infinite",
        blink: "blink 1s step-end infinite",
        marquee: "marquee 30s linear infinite",
      },
    },
  },
  plugins: [],
};
