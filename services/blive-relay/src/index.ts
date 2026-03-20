import { Cron } from 'croner';

import { app } from './server';
import { createListenerManager } from './services/listener-manager';

async function bootstrap() {
  app.listen(3600, (server) => {
    console.log(`🦊 Viyuni Bilibili Relay is running at ${server?.hostname}:${server?.port}`);
  });

  const listenerManager = await createListenerManager();

  await listenerManager.startAll();

  console.log(
    `✅ Started listening to ${listenerManager.getRoomCount()} room(s): ${listenerManager.getRoomIds().join(', ')}`,
  );

  const _cronJob = new Cron(
    '0 4 * * *',
    async () => {
      await listenerManager.restartAll();

      console.log(`🕐 Listening restarting....`);
    },
    { timezone: 'Asia/Shanghai' },
  );

  setupGracefulShutdown(() => {
    listenerManager.stopAll();
  });
}

function setupGracefulShutdown(handleClose?: () => Promise<void> | void) {
  const shutdown = async () => {
    console.log('\n👋 Shutting down gracefully...');
    await handleClose?.();
    process.exit(0);
  };

  process.on('SIGINT', () => shutdown());
  process.on('SIGTERM', () => shutdown());

  if (process.stdin.isTTY) {
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.on('data', (data) => {
      // 检测 Ctrl+C (Hex: 03)
      if (data.toString() === '\u0003') {
        shutdown();
      }
    });
  }
}

await bootstrap().catch((error) => {
  console.error('❌ Failed to start application:', error);
  process.exit(1);
});
