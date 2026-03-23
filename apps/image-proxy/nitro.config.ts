import { defineConfig } from 'nitro';

export default defineConfig({
  compatibilityDate: '2024-09-19',
  preset: 'cloudflare_module',
  cloudflare: {
    deployConfig: true,
    nodeCompat: true,
  },
  serverDir: './server',
  handlers: [
    {
      route: '/**',
      handler: 'server/api/index.ts',
    },
  ],
});
