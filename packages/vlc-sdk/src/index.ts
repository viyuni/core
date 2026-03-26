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
}

export default (options?: Options): Plugin => {
  const { entry = './src/index.ts', name: componentName = 'ViyuniLiveComponent' } = options ?? {};

  const resolvedEntry = resolve(process.cwd(), entry);

  return {
    name: 'vite-vlc-plugin',
    enforce: 'pre',
    config: () => ({
      css: {
        postcss: {
          plugins: [
            prefixer({
              prefix: `.vlc_${componentName}`,
              exclude: [/node_modules/],
            }),
          ],
        },
      },
      build: {
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
        `[Viyuni VLC] 🚀 Using Spec v${packageJson.version} | Building ${componentName}...`,
      );
    },
    closeBundle: async () => {
      // ...
    },
  } satisfies Plugin;
};
