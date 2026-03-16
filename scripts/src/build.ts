import path from 'node:path';

import { build } from 'vite';

import { findViteConfig } from './utils';

const viteConfigPaths = await findViteConfig(path.join(process.cwd(), '../apps'));

for (const configFile of viteConfigPaths) {
  await build({
    configFile,
    root: path.dirname(configFile),
    build: {
      //   outDir: path.join(process.cwd(), '../dist'),
    },
  });
}
