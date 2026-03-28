import { resolve } from 'node:path';

import prefixer from 'postcss-prefix-selector';
import type { Plugin } from 'vite';

import packageJson from '../package.json' with { type: 'json' };

export interface Options {
  /**
   * @default ./src/index.ts
   */
  entry?: string;
  name: string;
  description?: string;
  author?: string;
  version?: string;
}

export default (options: Options): Plugin => {
  const { entry = './src/index.ts', name } = options;

  const resolvedEntry = resolve(process.cwd(), entry);

  return {
    name: 'vite:viyuni-live-plugin',
    enforce: 'pre',
    config: () => ({
      css: {
        postcss: {
          plugins: [
            prefixer({
              prefix: `.vlp-${name.toLowerCase()}`,
              exclude: [/node_modules/],
            }),
          ],
        },
      },
      build: {
        minify: false,
        lib: {
          entry: resolvedEntry,
          fileName: 'app',
          formats: ['es'],
        },
        rolldownOptions: {
          external: ['vue', 'arktype'],
          output: {
            globals: {
              vue: 'Vue',
              arktype: 'ArkType',
            },
          },
        },
      },
    }),
    buildStart: async () => {
      console.log(
        `[Viyuni Live Plugin] 🚀 Using Spec v${packageJson.version} | Building ${name}...`,
      );
    },
    closeBundle: async () => {
      // ...
    },
  } satisfies Plugin;
};
