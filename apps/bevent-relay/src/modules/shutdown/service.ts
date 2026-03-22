type CleanupHandler = () => Promise<void> | void;

export abstract class ShutdownService {
  private static handlers: CleanupHandler[] = [];

  static register(handler: CleanupHandler) {
    this.handlers.push(handler);
  }

  static setup() {
    const shutdown = async () => {
      console.log('\n👋 Shutting down gracefully...');
      for (const handler of this.handlers) {
        await handler?.();
      }
      process.exit(0);
    };

    process.on('SIGINT', () => shutdown());
    process.on('SIGTERM', () => shutdown());

    if (process.stdin.isTTY) {
      process.stdin.setRawMode(true);
      process.stdin.resume();
      process.stdin.on('data', (data) => {
        if (data.toString() === '\u0003') {
          shutdown();
        }
      });
    }
  }
}
