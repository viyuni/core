import { cors } from '@elysiajs/cors';
import { clientRequestSchema, type SubscribeRequest } from '@viyuni/event-types';
import { type } from 'arktype';
import { Elysia } from 'elysia';
import type { ServerWebSocket } from 'elysia/ws/bun';

import { env } from './config/env';
import { queryEvents, queryOtherEvents } from './db';

const eventQuerySchema = type({
  limit: 'string.numeric.parse?',
  offset: 'string.numeric.parse?',
  cmd: 'string?',
  createdAt: 'string.numeric.parse?',
});

export const app = new Elysia()
  .use(cors())
  .get(
    '/events',
    async ({ query }) => {
      const { limit = 50, offset = 0, cmd, createdAt } = query;

      return queryEvents({ limit, offset, cmd, createdAt });
    },
    {
      query: eventQuerySchema,
    },
  )
  .get(
    '/other-events',
    async ({ query }) => {
      const { limit = 50, offset = 0, cmd, createdAt } = query;
      return queryOtherEvents({ limit, offset, cmd, createdAt });
    },
    { query: eventQuerySchema },
  )
  .ws('/ws', {
    query: type({
      accessToken: 'null | string?',
    }),
    body: clientRequestSchema,
    beforeHandle({ set, query }) {
      if (env.ACCESS_TOKEN && env.ACCESS_TOKEN !== query.accessToken) {
        set.status = 401;
        return 'Unauthorized';
      }
    },
    open(ws) {
      console.log(`Client connected ${ws.id}`);
    },
    message(ws, message) {
      switch (message.type) {
        case 'subscribe':
          handleSubscribe(ws, message);
          break;
        case 'unsubscribe':
        case 'ping':
      }
    },
  });

function handleSubscribe(ws: ServerWebSocket<any>, message: SubscribeRequest) {
  message.events.forEach((event) => {
    ws.subscribe(message.roomId ? `${message.roomId}:${event}` : event);
  });
}

export function publishEvent(type: string, data: any) {
  app.server?.publish(type, JSON.stringify(data));
}
