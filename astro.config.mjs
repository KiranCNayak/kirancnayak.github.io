// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://knayak.fyi',
  integrations: [react(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
  redirects: {
    '/posts/': '/blog/',
    '/posts/hello-world-its-kcn/': '/blog/hello-world-its-kcn/',
  },
});
