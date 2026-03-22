import { treaty, type Treaty } from '@elysiajs/eden';
import type { App } from '@viyuni/bevent-relay/types';
import type { ViyuniEvent, ViyuniEventType } from '@viyuni/event-types';

export type OnMessage = (event: Treaty.OnMessage<ViyuniEvent>) => void;

export interface BeventClientOptions {
  domain: string;
  roomId?: number;
  token?: string;
  events: ViyuniEventType[];
  /** 最大重试次数，默认 20 */
  maxRetryCount?: number;
  onMessage?: OnMessage | OnMessage[];
}

export function createBeventClient(options: BeventClientOptions) {
  let retryCount = 0;
  const maxRetry = options.maxRetryCount ?? 20;
  const api = treaty<App>(options.domain);
  let emitter: ReturnType<typeof api.ws.subscribe> | null = null;
  let isManualClose = false;

  const listeners = new Set<(event: Treaty.OnMessage<ViyuniEvent>) => void>(
    options.onMessage
      ? Array.isArray(options.onMessage)
        ? options.onMessage
        : [options.onMessage]
      : [],
  );

  function start() {
    isManualClose = false;
    emitter = api.ws.subscribe({
      query: {
        accessToken: options.token,
      },
    });

    emitter.on('open', () => {
      console.log('Successfully connected to relay');
      retryCount = 0; // 重置计数
      emitter?.send({
        type: 'subscribe',
        roomId: options.roomId,
        events: options.events,
      });
    });

    // 恢复订阅
    emitter.on('message', (event) => {
      listeners.forEach((cb) => cb(event));
    });

    emitter.on('close', () => {
      if (isManualClose) return;

      if (retryCount >= maxRetry) {
        console.error(`Reached max retry limit (${maxRetry}). Stopping.`);
        return;
      }

      retryCount++;
      // 指数退避, 1s, 2s, 4s, 8s... max 30s
      const delay = Math.min(Math.pow(2, retryCount) * 1000, 30 * 1000);

      console.warn(`Attempt ${retryCount}/${maxRetry}: Retrying in ${delay / 1000}s...`);

      setTimeout(() => {
        if (!isManualClose) start();
      }, delay);
    });

    emitter.on('error', (err) => console.error('WS Error:', err));
  }

  function stop() {
    isManualClose = true;
    emitter?.close();
    emitter = null;
  }

  return {
    start,
    stop,
    /** 获取当前重试了多少次 */
    getRetryCount: () => retryCount,
  };
}
