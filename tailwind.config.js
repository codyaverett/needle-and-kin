/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
    "./app.vue",
    "./.storybook/**/*.{js,jsx,ts,tsx,vue}",
    "./stories/**/*.{js,jsx,ts,tsx,vue,mdx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        purple: {
          600: '#9333EA',
        },
        pink: {
          600: '#DB2777',
        },
      },
    },
  },
  plugins: [],
}