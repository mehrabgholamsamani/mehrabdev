/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/components/desktop/**/*.{ts,tsx}",
  ],
  corePlugins: {
    // Disable Tailwind's CSS reset so it doesn't interfere with the
    // existing portfolio CSS.
    preflight: false,
  },
  theme: {
    extend: {},
  },
  plugins: [],
};
