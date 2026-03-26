import { defineConfig } from 'nitro';

export default defineConfig({
  serverDir: './server',
  serverEntry: './server/index.ts',
  preset: 'bun',
});
