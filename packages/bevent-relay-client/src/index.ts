import { treaty } from '@elysiajs/eden';
import type { App } from '@viyuni/bevent-relay/types';
import type { ViyuniEvent, ViyuniEventType } from '@viyuni/event-types';
import { createNanoEvents } from 'nanoevents';

const SHARED_KEY = 'BEventRelay' as const;
const CHANNEL_MESSAGE_TYPE = 'ViyuniEvent' as const;

export type EventListener = (event: ViyuniEvent) => void;

export interface BeventClientOptions {
  domain: string;
  roomId?: number;
  token?: string;
  /** 需要订阅的事件 */
  events: ViyuniEventType[];
  /** 最大重试次数，默认 20 */
  maxRetryCount?: number;
}

interface BusEvents {
  message: (event: ViyuniEvent) => void;
}

type BroadcastData = {
  type: typeof CHANNEL_MESSAGE_TYPE;
  data: ViyuniEvent;
};

export interface BeventClientHandle {
  start: () => void;
  stop: () => void;
  onMessage: (cb: EventListener) => () => void;
  /** 获取当前重试了多少次 (仅主节点有效) */
  readonly retryCount: number;
}

export interface SharedBeventClientHandle extends BeventClientHandle {
  /** 是否是主节点 */
  readonly isLeader: boolean;
}

export function createBeventClient(options: BeventClientOptions): BeventClientHandle {
  let retryCount = 0;
  const maxRetry = options.maxRetryCount ?? 20;
  const api = treaty<App>(options.domain);
  let emitter: ReturnType<typeof api.ws.subscribe> | null = null;
  let isManualClose = false;

  const bus = createNanoEvents<BusEvents>();

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
    emitter.on('message', ({ data }) => {
      bus.emit('message', data);
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
    onMessage: (cb: EventListener) => bus.on('message', cb),
    /** 获取当前重试了多少次 */
    get retryCount() {
      return retryCount;
    },
  };
}

/**
 * 创建多页面共享 WS 连接的客户端。
 *
 * - 使用 navigator.locks 选举主节点，只有主节点建立 WS 连接
 * - 使用 BroadcastChannel 将主节点收到的消息广播给所有从节点
 * - 主节点页面关闭时自动释放锁，从节点竞争成为新主节点
 * - 新节点自动通过 BroadcastChannel 接收主节点广播的消息
 */
export function createSharedBeventClient(options: BeventClientOptions): SharedBeventClientHandle {
  const lockKey = `${SHARED_KEY}:lock:${options.domain}:${options.roomId ?? '_'}`;
  const channelName = `${SHARED_KEY}:bc:${options.domain}:${options.roomId ?? '_'}`;

  let stopped = true;
  let _isLeader = false;
  let releaseLock: (() => void) | null = null;
  let wsClient: ReturnType<typeof createBeventClient> | null = null;
  let channel: BroadcastChannel | null = null;

  const bus = createNanoEvents<BusEvents>();

  async function elect() {
    if (stopped) return;

    await navigator.locks.request(lockKey, async (lock) => {
      if (!lock || stopped) return;

      _isLeader = true;
      console.log('[SharedWS] Elected as leader');

      wsClient = createBeventClient({
        domain: options.domain,
        roomId: options.roomId,
        token: options.token,
        events: options.events,
        maxRetryCount: options.maxRetryCount,
      });
      wsClient.onMessage((data) => {
        if (stopped) return;
        bus.emit('message', data);
        channel?.postMessage({ type: CHANNEL_MESSAGE_TYPE, data } satisfies BroadcastData);
      });
      wsClient.start();

      // 持有锁直到显式释放 (stop / 页面关闭)
      await new Promise<void>((resolve) => {
        releaseLock = resolve;
      });

      wsClient?.stop();
      wsClient = null;
      _isLeader = false;
      console.log('[SharedWS] Released leadership');
    });

    // 锁意外释放且未手动停止, 重新竞选
    if (!stopped) elect();
  }

  return {
    start() {
      if (!stopped) return;
      stopped = false;

      channel = new BroadcastChannel(channelName);
      channel.onmessage = (e: MessageEvent<BroadcastData>) => {
        if (_isLeader || stopped) return;
        if (e.data.type === CHANNEL_MESSAGE_TYPE) {
          bus.emit('message', e.data.data);
        }
      };

      elect();
    },
    stop() {
      stopped = true;
      releaseLock?.();
      channel?.close();
      channel = null;
    },
    onMessage(cb: EventListener) {
      return bus.on('message', cb);
    },
    get retryCount() {
      return wsClient?.retryCount ?? 0;
    },
    get isLeader() {
      return _isLeader;
    },
  };
}
