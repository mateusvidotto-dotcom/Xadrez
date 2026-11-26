import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'node:path';

export default defineConfig({
  // GitHub Pages serves this project from /Xadrez/, not from the domain root.
  // Read process.env directly because loadEnv() only loads .env files.
  base: process.env.GITHUB_PAGES === 'true' ? '/Xadrez/' : '/',
  plugins: [react(), tailwindcss()],
  // Keep the Vite source HTML separate: index.html at the repository root
  // is the generated static page consumed by branch-based GitHub Pages.
  build: {
    rollupOptions: {
      input: {
        index: resolve(process.cwd(), 'app-source.html'),
      },
    },
  },
});
