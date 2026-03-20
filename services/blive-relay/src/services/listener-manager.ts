import { createListener } from '@viyuni/blive-ws';
import { createCookieSyncClient } from '@viyuni/cookie-sync-client';

import { env } from '../config/env';
import { insertEvent, insertOtherEvent } from '../db';
import { publishBliveEvent } from '../services/event-publisher';

const listeners = new Map<number, ReturnType<typeof createListener>>();
const cookieClient = createCookieSyncClient(env.LOGIN_SYNC_URL, env.LOGIN_SYNC_PASSWORD);
const roomIds = env.ROOMS;

async function fetchCookie() {
  return await cookieClient.getDecodedCookie().then(
    (cookie) => {
      if (!cookie) console.warn('⚠️ Cookie is invalid, using empty cookie instead.');
      return cookie ?? '';
    },
    () => {
      console.warn('⚠️ Fetching cookie failed, using empty cookie instead.');
      return '';
    },
  );
}

export async function createListenerManager() {
  async function startRoom(roomId: number, cookie: string | null = null) {
    let _cookie = cookie ?? (await fetchCookie());

    const listener = createListener({
      cookie: _cookie ?? '',
      roomId,
    });

    // 监听解析后的事件
    listener.on('event', async (event) => {
      console.log(`[Room ${roomId}] [${event.cmd}] ${event.id}`);

      // 保存到数据库
      await insertEvent(roomId, event);

      // 发布包装后的 B站 事件
      publishBliveEvent(event);
    });

    // 监听未实现的事件
    listener.on('unimplementedEvent', async (cmd, raw) => {
      console.log(`[Room ${roomId}] [UnImplementedEvent] [${cmd}]`);
      await insertOtherEvent({
        cmd,
        raw,
        roomId: String(roomId),
        known: true,
      });
    });

    // 监听未知事件
    listener.on('unknownEvent', async (raw) => {
      const cmd = (raw as any).cmd || 'UNKNOWN';
      console.log(`[Room ${roomId}] [UnknownEvent] [${cmd}]`);
      await insertOtherEvent({
        cmd,
        raw,
        roomId: String(roomId),
        known: false,
      });
    });

    // 启动监听
    await listener.start();

    listeners.set(roomId, listener);
    console.log(`✅ Room ${roomId} listener started`);
  }

  async function startAll() {
    const cookie = await fetchCookie();
    for (const roomId of roomIds) {
      await startRoom(roomId, cookie);
    }
  }

  function stopRoom(roomId: number) {
    const listener = listeners.get(roomId);
    if (listener) {
      listener.stop();
      listeners.delete(roomId);
      console.log(`🛑 Room ${roomId} listener stopped`);
    }
  }

  function stopAll() {
    for (const [roomId, listener] of listeners) {
      listener.stop();
      console.log(`🛑 Room ${roomId} listener stopped`);
    }
    listeners.clear();
  }

  async function restartAll() {
    stopAll();
    startAll();
  }

  function getRoomIds() {
    return Array.from(listeners.keys());
  }

  function getRoomCount() {
    return listeners.size;
  }

  function getListener(roomId: number) {
    return listeners.get(roomId);
  }

  return {
    stopRoom,
    startAll,
    startRoom,
    stopAll,
    restartAll,
    getRoomIds,
    getRoomCount,
    getListener,
  };
}

export type ListenerManager = ReturnType<typeof createListenerManager>;
