import { cors } from '@elysiajs/cors';
import { type } from 'arktype';
import { KeepLiveTCP } from 'bilibili-live-ws';
import { and, count, like, lte } from 'drizzle-orm';
import { Elysia } from 'elysia';

import { createAuthClient } from './auth';
import { getDanmuInfo } from './bili-api';
import { env } from './config/env';
import { db, schema } from './db';
import { parsers } from './parsers';

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
  .ws('/ws', {
    query: type({
      accessToken: 'string?',
    }),
    beforeHandle({ set, query }) {
      if (!env.ACCESS_TOKEN) return;

      const token = query.accessToken;
      if (!token || token !== env.ACCESS_TOKEN) {
        set.status = 401;
        return 'Unauthorized';
      }
    },
    open(ws) {
      ws.send({ message: 'Connected to Viyuni event server.' });
      ws.subscribe('msg');
    },
    message(ws, message) {
      ws.send(message);
    },
  })
  .listen(6300, (server) => {
    console.log(`🦊 Elysia is running at ${server?.hostname}:${server?.port}`);
  });

const { cookie, buvid, userInfo } = await createAuthClient(env);

const instance = new Map<number, KeepLiveTCP>();

for (const roomId of env.ROOMS) {
  const { randomServer, token } = await getDanmuInfo(roomId, cookie);

  const ws = new KeepLiveTCP(roomId, {
    host: randomServer?.host,
    port: randomServer?.port,
    key: token,
    uid: userInfo.mid,
    buvid: buvid ?? '',
  });

  ws.addListener('msg', async (msg) => {
    const cmd = msg?.cmd as string | undefined;

    if (!cmd) return;

    console.log(cmd);

    const parser = parsers.find((parser) => parser.cmd === cmd)?.parser;

    const parsed = (parser as any)?.(cmd, msg, roomId, userInfo.mid);

    await db.insert(schema.events).values({
      cmd: msg.cmd,
      roomId: String(roomId),
      data: msg,
      parsed,
    });

    if (parsed) app.server?.publish('msg', JSON.stringify(parsed));
  });

  ws.addListener('close', () => {
    console.log('close');
  });

  ws.addListener('error', (err) => {
    console.error(err);
  });

  instance.set(roomId, ws);
}

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
