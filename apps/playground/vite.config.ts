import oklabFunction from '@csstools/postcss-oklab-function';
import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';
import autoprefixer from 'autoprefixer';
import { defineConfig } from 'vite-plus';

// https://vite.dev/config/
export default defineConfig({
  base: '/playground',
  plugins: [vue(), tailwindcss()],
  resolve: {
    conditions: ['dev'],
  },
  css: {
    postcss: {
      plugins: [oklabFunction(), autoprefixer()],
    },
  },
  server: {
    port: 5173,
  },
  preview: {
    port: 5173,
  },
});
