module.exports = {
  content: ["./src/**/*.{njk,html,js,md}"],
  theme: {
    extend: {
      colors: {
        skate: {
          primary: "#1a1a2e",
          accent: "#e94560",
          surface: "#16213e",
          text: "#eaeaea"
        }
      }
    }
  },
  plugins: [require("@tailwindcss/typography")]
};
