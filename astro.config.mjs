import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()]
  },
  build: {
    assetsPrefix: 'https://los-perris-valorant-api.vercel.app'
  },
  output: 'server',
  adapter: vercel()
});
