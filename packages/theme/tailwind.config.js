/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    function ({ addComponents }) {
      addComponents({
        '.container': {
          maxWidth: '100%',
          '@screen md': {
            maxWidth: '752px',
          },
          '@screen lg': {
            maxWidth: '976px',
          },
          '@screen xl': {
            maxWidth: '1280px',
          },
        }
      })
    },
    function ({ addVariant }) {
      addVariant('mobile-only', "@media screen and (max-width: 767px)"); // instead of hard-coded 640px use sm breakpoint value from config. Or anything
    },
    function ({ addVariant }) {
      addVariant('Tab-only', "@media screen and (min-width: 1025px) and (max-width: 1200px)"); // instead of hard-coded 640px use sm breakpoint value from config. Or anything
    },
  ],
}
