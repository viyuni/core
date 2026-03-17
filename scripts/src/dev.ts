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
    server.middlewares(req, res, next);
  });

  console.log(
    `${theme.success('  ✔ ')} ${chalk.white('Mapped')} ` +
      `${theme.highlight(base.padEnd(12))} ` +
      `${theme.dim('→ Proxy to Workspace Server')}`,
  );
}

const port = 3000;
const rootServer = http.createServer(rootApp).listen(port, () => {
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

let isShuttingDown = false;

async function closeAllServers() {
  if (isShuttingDown) return;
  isShuttingDown = true;

  console.log(theme.dim('\n────────────────────────────────────────────────────'));
  console.log(chalk.bold.yellow('正在安全退出，请稍候...'));

  // 设置一个强制退出的保险（3秒后如果还没关掉，强制自杀）
  const forceExitTimeout = setTimeout(() => {
    console.log(chalk.red('\n部分服务响应超时，强制退出。'));
    process.exit(1);
  }, 3000);

  try {
    // 先停止网关接收新连接
    rootServer.close();

    // 并发关闭所有 Vite 开发服务器（比 for 循环快得多）
    await Promise.all(devServers.map((s) => s.close()));

    clearTimeout(forceExitTimeout);
    console.log(theme.success(' ✔ 所有服务已成功关闭。'));
    process.exit(0);
  } catch (err) {
    console.error(chalk.red('关闭过程中出现错误:'), err);
    process.exit(1);
  }
}

if (process.stdin.isTTY) {
  process.stdin.setRawMode(true);
  process.stdin.resume();
  process.stdin.on('data', async (data) => {
    // 检测 Ctrl+C (Hex: 03)
    if (data.toString() === '\u0003') {
      await closeAllServers();
    }
  });
}

process.on('SIGTERM', async () => {
  await closeAllServers();
});
