import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';
import { nitro } from 'nitro/vite';
import { defineConfig } from 'vite';
import vueDevTools from 'vite-plugin-vue-devtools';
import vueRouter from 'vue-router/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [nitro(), vueRouter(), vue(), tailwindcss()],
  resolve: {
    tsconfigPaths: true,
  },
});
