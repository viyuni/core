import http from 'node:http';
import path from 'node:path';

import chalk from 'chalk';
import connect from 'connect';
import { glob } from 'tinyglobby';
import { createServer, type ViteDevServer } from 'vite';

const theme = {
  success: chalk.green.bold,
  path: chalk.cyan.underline,
  label: chalk.bgBlue.white.bold,
  dim: chalk.gray,
  highlight: chalk.magentaBright,
};

const viteConfigPaths = await glob('**/vite.config.*', {
  cwd: path.join(process.cwd(), '../apps'),
  absolute: true,
  ignore: ['**/node_modules/**'],
});

const rootApp = connect();

const devServers: ViteDevServer[] = [];

for (const configPath of viteConfigPaths) {
  const server = await createServer({
    configFile: configPath,
    root: path.dirname(configPath),
    server: {
      middlewareMode: true,
      hmr: {
        port: 7210 + viteConfigPaths.indexOf(configPath),
      },
    },
  });

  devServers.push(server);
}

console.log(chalk.bold.blue('\n📦 Monorepo Gateway Dispatcher'));
console.log(theme.dim('────────────────────────────────────────────────────'));

// Sort by base path length, `/` last.
const sortServer = devServers.sort((a, b) => b.config.base.length - a.config.base.length);

for (const server of sortServer) {
  const base = server.config.base;

  rootApp.use(base, (req, res, next) => {
    server.middlewares(req, res, next);
  });

  console.log(
    `${theme.success('  ✔ ')} ${chalk.white('Mapped')} ` +
      `${theme.highlight(base.padEnd(12))} ` +
      `${theme.dim('→ Proxy to Workspace Server')}`,
  );
}

const port = 3000;
http.createServer(rootApp).listen(port, () => {
  console.log(theme.dim('────────────────────────────────────────────────────'));

  console.log(
    `${theme.label(' DONE ')} ${chalk.white('Gateway is live at')} ` +
      `${chalk.cyan.bold(`http://localhost:${port}`)}`,
  );

  console.log(chalk.gray('\n路由列表:'));
  sortServer.forEach((s) => {
    console.log(chalk.gray(`  • http://localhost:${port}${s.config.base}`));
  });
});
