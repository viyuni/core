import { cors } from '@elysiajs/cors';
import { type } from 'arktype';
import { KeepLiveTCP } from 'bilibili-live-ws';
import { and, count, desc, like, lte } from 'drizzle-orm';
import { Elysia } from 'elysia';

import { createAuthClient } from './auth';
import { getDanmuInfo } from './bili-api';
import { loadConfig } from './config';
import { db, schema } from './db';

const config = loadConfig();

const { cookie, buvid, userInfo } = await createAuthClient(config);

const instance = new Map<number, KeepLiveTCP>();
let messageCount = 0;

for (const roomId of config.roomIds) {
  const { randomServer, token } = await getDanmuInfo(roomId, cookie);

  const ws = new KeepLiveTCP(roomId, {
    host: randomServer?.host,
    port: randomServer?.port,
    key: token,
    uid: userInfo.mid,
    buvid: buvid ?? '',
  });

  ws.addListener('msg', async (msg) => {
    console.log(`Received message total: ${++messageCount}`);
    await db.insert(schema.events).values({
      cmd: msg.cmd,
      roomId: String(roomId),
      data: msg,
    });
  });

  ws.addListener('close', () => {
    console.log('close');
  });

  ws.addListener('error', (err) => {
    console.error(err);
  });

  instance.set(roomId, ws);
}

export const app = new Elysia()
  .use(cors())
  .get(
    '/events',
    async ({ query }) => {
      const { limit = 50, offset = 0, cmd, createdAt } = query;

      const [result] = await db
        .select({ value: count() })
        .from(schema.events)
        .where(
          and(
            cmd ? like(schema.events.cmd, `%${cmd}%`) : undefined,
            createdAt ? lte(schema.events.createdAt, new Date(createdAt)) : undefined,
          ),
        );

      const data = await db.query.events.findMany({
        where: (events, { like, and, lte }) =>
          and(
            cmd ? like(events.cmd, `%${cmd}%`) : undefined,
            createdAt ? lte(events.createdAt, new Date(createdAt)) : undefined,
          ),
        limit,
        offset,
        orderBy: (events, { desc }) => [desc(events.createdAt)],
      });

      return {
        total: result?.value ?? 0,
        limit,
        offset,
        data,
      };
    },
    {
      query: type({
        limit: 'string.numeric.parse?',
        offset: 'string.numeric.parse?',
        cmd: 'null | string?',
        createdAt: 'null | number?',
      }),
    },
  )
  .listen(6300, (server) => {
    console.log(`🦊 Elysia is running at ${server?.hostname}:${server?.port}`);
  });

function stopAll() {
  for (const ws of instance.values()) {
    ws.removeAllListeners();
    ws.close();
  }

  instance.clear();
  process.exit(1);
}

process.on('SIGINT', () => {
  stopAll();
});

if (process.stdin.isTTY) {
  process.stdin.setRawMode(true);
  process.stdin.resume();
  process.stdin.on('data', (data) => {
    // 检测 Ctrl+C (Hex: 03)
    if (data.toString() === '\u0003') {
      stopAll();
    }
  });
}

process.on('SIGTERM', () => {
  stopAll();
});
