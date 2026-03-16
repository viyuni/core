import { glob } from 'tinyglobby';

export async function findViteConfig(cwd: string) {
  return await glob('**/vite.config.*', {
    cwd,
    absolute: true,
    ignore: ['**/node_modules/**'],
  });
}
