/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        'bg-color': '#09090b',
        'card-bg': '#131316',
        'accent-color': '#ff4655',
        'accent-glow': 'rgba(255, 70, 85, 0.4)',
        'text-color': '#f4f4f5',
        'text-muted': '#a1a1aa',
        'card-border': '#27272a',
        'success': '#4ade80',
        'danger': '#ef4444',
      },
      fontFamily: {
        main: ['Outfit', 'sans-serif'],
        header: ['Outfit', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
