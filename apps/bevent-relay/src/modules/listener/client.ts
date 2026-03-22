import { createListener } from '@viyuni/blive-ws';
import { ParserEventStatus } from '@viyuni/blive-ws/types';

import { fetchCookie } from '../../lib/cookie-provider';
import { parseChannel } from '../../lib/utils';
import { publishEvent } from '../../server';
import { EventService } from '../event';
import { OtherEventService } from '../other-event';
import { RECONNECT_CONFIG } from './config';
import { RoomClientStatus, type RoomClient, type RoomClientInstance } from './types';
import { calculateBackoffDelay } from './utils';

export abstract class RoomClientFactory {
  private static bindBusinessEvents(listener: RoomClient, roomId: number) {
    listener.on('event', async (event) => {
      publishEvent(parseChannel(event.type), event);
      publishEvent(parseChannel(event.type, event.roomId), event);
      await EventService.insert(roomId, event);
    });

    listener.on(ParserEventStatus.Unimplemented, async (cmd, raw) => {
      await OtherEventService.insert({
        cmd,
        raw,
        roomId: String(roomId),
        status: ParserEventStatus.Unimplemented,
      });
    });

    listener.on(ParserEventStatus.Unknown, async (raw) => {
      const cmd = (raw as any).cmd || 'UNKNOWN';
      await OtherEventService.insert({
        cmd,
        raw,
        roomId: String(roomId),
        status: ParserEventStatus.Unknown,
      });
    });

    listener.on(ParserEventStatus.ParsingFailed, async (cmd, raw, error) => {
      const err = error as Error;
      await OtherEventService.insert({
        cmd,
        raw,
        roomId: String(roomId),
        status: ParserEventStatus.ParsingFailed,
        extra: { error: err?.message ?? 'Unknown Error', stack: err?.stack ?? '' },
      });
    });
  }

  static create(roomId: number): RoomClientInstance {
    let wsListener: RoomClient | null = null;
    let retryCount = 0;
    let retryTimer: NodeJS.Timeout | null = null;
    let healthCheckTimer: NodeJS.Timeout | null = null;
    let isIntentionallyStopped = false;
    let status: RoomClientStatus = RoomClientStatus.Idle;

    const clearTimers = () => {
      if (retryTimer) clearTimeout(retryTimer);
      if (healthCheckTimer) clearTimeout(healthCheckTimer);
      retryTimer = null;
      healthCheckTimer = null;
    };

    const scheduleReconnect = async (reason: string, currentCookie: string) => {
      if (isIntentionallyStopped) return;
      // 防止重复调度：已在连接中时不重复调度
      if (status === RoomClientStatus.Connecting) {
        console.log(`⚠️ Room ${roomId} is already connecting, skipping reconnect`);
        return;
      }
      status = RoomClientStatus.Reconnecting;

      if (retryCount >= RECONNECT_CONFIG.MAX_RETRIES) {
        console.error(
          `❌ Room ${roomId} exceeded max retries (${RECONNECT_CONFIG.MAX_RETRIES}). Stopping.`,
        );
        return;
      }

      const delay = calculateBackoffDelay(retryCount);
      console.warn(
        `[Room ${roomId}] ${reason}. Retrying in ${delay}ms... (Attempt ${retryCount + 1}/${RECONNECT_CONFIG.MAX_RETRIES})`,
      );

      retryCount++;
      clearTimers();

      retryTimer = setTimeout(async () => await start(currentCookie), delay);
    };

    const start = async (initialCookie?: string | null) => {
      // 防止重复启动：已在连接中或已连接时不重复启动
      if (status === RoomClientStatus.Connecting || status === RoomClientStatus.Connected) {
        console.log(`⚠️ Room ${roomId} is already ${status}, skipping start`);
        return;
      }

      isIntentionallyStopped = false;
      status = RoomClientStatus.Connecting;
      clearTimers();

      if (wsListener) {
        wsListener.stop();
        wsListener = null;
      }

      const cookie = initialCookie ?? (await fetchCookie());
      wsListener = createListener({ cookie, roomId });

      RoomClientFactory.bindBusinessEvents(wsListener, roomId);

      wsListener.on('close', () => scheduleReconnect('Connection closed', cookie));
      wsListener.on('error', (err) => {
        console.error(`[Room ${roomId}] WebSocket Error:`, err);
        scheduleReconnect('Connection error', cookie);
      });

      try {
        await wsListener.start();
        status = RoomClientStatus.Connected;
        console.log(`✅ Room ${roomId} client started`);

        healthCheckTimer = setTimeout(() => {
          retryCount = 0;
          console.log(`💓 Room ${roomId} connection is healthy, retry count reset.`);
        }, 10000);
      } catch (e) {
        console.error(`[Room ${roomId}] Failed to start:`, e);
        scheduleReconnect('Start failed', cookie);
      }
    };

    const stop = () => {
      isIntentionallyStopped = true;
      status = RoomClientStatus.Stopped;
      clearTimers();

      if (wsListener) {
        wsListener.stop();
        wsListener = null;
      }

      retryCount = 0;
      console.log(`🛑 Room ${roomId} client stopped`);
    };

    return {
      start,
      stop,
      get roomId() {
        return roomId;
      },
      get status() {
        return status;
      },
    };
  }
}
