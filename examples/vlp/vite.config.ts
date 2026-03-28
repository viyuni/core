import { fileURLToPath, URL } from 'node:url';

import vue from '@vitejs/plugin-vue';
import vlcPlugin from '@viyuni/live-plugin-kit/vite';
import vueDevTools from 'vite-plugin-vue-devtools';
import { defineConfig } from 'vite-plus';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vlcPlugin({
      name: 'vlp-example',
    }),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
