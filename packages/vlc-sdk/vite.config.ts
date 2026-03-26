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
      config: 'src/config.ts',
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
