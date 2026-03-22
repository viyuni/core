import { Cron } from 'croner';

import { ListenerManager } from '../listener';

export abstract class SchedulerService {
  static initialize() {
    return new Cron(
      '0 4 * * *',
      async () => {
        await ListenerManager.restartAll();
        console.log(`Reconnect cron job run at ${new Date().toLocaleString()}...`);
      },
      {
        timezone: 'Asia/Shanghai',
      },
    );
  }
}
