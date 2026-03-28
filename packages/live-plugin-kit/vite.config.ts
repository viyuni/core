import { defineConfig } from 'vite-plus';

export default defineConfig({
  pack: {
    format: 'esm',
    dts: {
      enabled: true,
      tsgo: true,
    },
    exports: {},
    entry: {
      index: 'src/index.ts',
      vite: 'src/vite.ts',
    },
  },
  lint: {
    options: {
      typeAware: true,
      typeCheck: true,
    },
  },
  fmt: {},
});
