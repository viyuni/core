import http from 'node:http';
import path from 'node:path';

import chalk from 'chalk';
import connect from 'connect';
import { createServer, type ViteDevServer } from 'vite';

import { findViteConfig } from './utils';

const theme = {
  success: chalk.green.bold,
  path: chalk.cyan.underline,
  label: chalk.bgBlue.white.bold,
  dim: chalk.gray,
  highlight: chalk.magentaBright,
};

const viteConfigPaths = await findViteConfig(path.join(process.cwd(), '../apps'));

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
    req.url = req.originalUrl;
    server.middlewares(req, res, next);
  });

  console.log(
    `${theme.success('  ✔ ')} ${chalk.white('Mapped')} ` +
      `${theme.highlight(base.padEnd(12))} ` +
      `${theme.dim('→ Proxy to Workspace Server')}`,
  );
}

const port = process.env?.SERVER_PORT ?? 3690;
const rootServer = http.createServer(rootApp).listen(port, () => {
  console.log(theme.dim('────────────────────────────────────────────────────'));

  console.log(
    `${theme.label(' DONE ')} ${chalk.white('Gateway is live at')} ` +
      `${chalk.cyan.bold(`http://localhost:${port}`)}`,
  );

  console.log(chalk.gray('\nRoutes:'));
  sortServer.forEach((s) => {
    console.log(chalk.gray(`  • http://localhost:${port}${s.config.base}`));
  });
});

let isShuttingDown = false;

async function closeAllServers() {
  if (isShuttingDown) return;
  isShuttingDown = true;

  console.log(theme.dim('\n────────────────────────────────────────────────────'));
  console.log(chalk.bold.yellow('Shutting down safely, please wait...'));

  // Set a failsafe for forced exit (force kill if not closed after 3 seconds)
  const forceExitTimeout = setTimeout(() => {
    console.log(chalk.red('\nSome services timed out, forcing exit.'));
    process.exit(1);
  }, 3000);

  try {
    // Stop the gateway from accepting new connections first
    rootServer.close();

    // Concurrently close all Vite dev servers (much faster than a for loop)
    await Promise.all(devServers.map((s) => s.close()));

    clearTimeout(forceExitTimeout);
    console.log(theme.success(' ✔ All services successfully closed.'));
    process.exit(0);
  } catch (err) {
    console.error(chalk.red('Error occurred during shutdown:'), err);
    process.exit(1);
  }
}

if (process.stdin.isTTY) {
  process.stdin.setRawMode(true);
  process.stdin.resume();
  process.stdin.on('data', async (data) => {
    // Detect Ctrl+C (Hex: 03)
    if (data.toString() === '\u0003') {
      await closeAllServers();
    }
  });
}

process.on('SIGTERM', async () => {
  await closeAllServers();
});
