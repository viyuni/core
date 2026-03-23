import { defineConfig } from 'rolldown';

export default defineConfig({
  tsconfig: true,
  platform: 'node',
  input: 'src/index.ts',
  treeshake: false,
  output: {
    dir: '.output',
    format: 'esm',
  },
});
