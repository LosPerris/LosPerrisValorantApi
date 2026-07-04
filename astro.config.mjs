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
    assetsPrefix: 'https://vlr.losperris.dev'
  },
  output: 'server',
  adapter: vercel()
});
