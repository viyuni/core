import { ListenerManager } from './modules/listener';
import { RoomService } from './modules/room';
import { SchedulerService } from './modules/scheduler';
import { ShutdownService } from './modules/shutdown';
import { app } from './server';

async function bootstrap() {
  // await startMigrate();

  ShutdownService.register(() => ListenerManager.stopAll());
  ShutdownService.setup();

  const enabledRoomIds = await RoomService.initialize();
  await ListenerManager.initialize(enabledRoomIds);

  SchedulerService.initialize();

  app.listen(3600, (server) => {
    console.log(`🦊 Viyuni Blive Events Relay is running at ${server?.hostname}:${server?.port}`);
  });
}

await bootstrap().catch((error) => {
  console.error('❌ Failed to start application:', error);
  process.exit(1);
});
