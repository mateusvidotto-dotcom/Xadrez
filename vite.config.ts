import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'node:path';

export default defineConfig({
  // GitHub Pages serves this project from /Xadrez/, not from the domain root.
  base: process.env.GITHUB_PAGES === 'true' ? '/Xadrez/' : '/',
  plugins: [react(), tailwindcss()],
  // Keep the source template inside src/. The root index.html is generated output.
  build: {
    rollupOptions: {
      input: {
        index: resolve(process.cwd(), 'src/site-template.html'),
      },
    },
  },
});
