const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./src/**/*.{njk,html,js,md}"],
  theme: {
    extend: {
      colors: {
        skate: {
          // Core palette — concrete & asphalt tones
          primary: "#1a1a2e",    // Deep navy-black (backgrounds)
          surface: "#16213e",    // Slightly lighter (cards, nav)
          elevated: "#1f2b47",   // Elevated surfaces (modals, dropdowns)
          muted: "#2a3454",      // Muted backgrounds

          // Accent — VHS-era vibrant
          accent: "#e94560",     // Primary accent (hot coral-red)
          "accent-hover": "#ff5a7a",
          "accent-muted": "#e9456033",

          // Secondary accents
          gold: "#f5c518",       // Wheels, ratings, highlights
          "gold-muted": "#f5c51833",
          teal: "#0abde3",       // Info, links, secondary actions
          "teal-muted": "#0abde333",
          lime: "#a8e06c",       // Success, open status
          "lime-muted": "#a8e06c33",
          orange: "#ff9f43",     // Warnings, medium difficulty
          "orange-muted": "#ff9f4333",

          // Text hierarchy
          text: "#eaeaea",       // Primary text
          "text-secondary": "#a0a0b8",  // Secondary/muted text
          "text-dim": "#7a7a8e",        // Disabled/hint text

          // Spot type badge colors
          "badge-park": "#0abde3",
          "badge-street": "#e94560",
          "badge-diy": "#ff9f43",
          "badge-transition": "#a55eea",
          "badge-flatground": "#a8e06c",

          // Difficulty rating
          "diff-easy": "#a8e06c",
          "diff-medium": "#ff9f43",
          "diff-hard": "#e94560",
          "diff-pro": "#a55eea",

          // Borders
          border: "#2a3454",
          "border-accent": "#e9456050",
        },
      },
      fontFamily: {
        // Bebas Neue — bold display (90s skate poster vibe)
        display: ['"Bebas Neue"', ...defaultTheme.fontFamily.sans],
        // Inter — clean sans-serif body
        body: ['"Inter"', ...defaultTheme.fontFamily.sans],
        sans: ['"Inter"', ...defaultTheme.fontFamily.sans],
      },
      fontSize: {
        "hero": ["4.5rem", { lineHeight: "1", letterSpacing: "0.04em" }],
        "hero-sm": ["2.75rem", { lineHeight: "1.1", letterSpacing: "0.03em" }],
      },
      borderRadius: {
        "card": "0.75rem",
      },
      boxShadow: {
        "card": "0 4px 24px rgba(0, 0, 0, 0.3)",
        "card-hover": "0 8px 32px rgba(233, 69, 96, 0.15)",
        "glow": "0 0 20px rgba(233, 69, 96, 0.25)",
        "glow-gold": "0 0 20px rgba(245, 197, 24, 0.25)",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
