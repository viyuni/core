import { bearer } from '@elysiajs/bearer';
import { cors } from '@elysiajs/cors';
import type { ViyuniEvent } from '@viyuni/event-types';
import { Elysia } from 'elysia';

import { env } from './config';
import { event } from './modules/event';
import { otherEvent } from './modules/other-event';
import { room } from './modules/room';
import { ws } from './modules/ws';

export const app = new Elysia()
  .use(cors())
  .use(bearer())
  .group(
    '/api',
    {
      beforeHandle({ bearer, status }) {
        if (env.ACCESS_TOKEN && env.ACCESS_TOKEN === bearer) {
          return;
        }

        return status('Unauthorized');
      },
    },
    (group) => group.use(room).use(event).use(otherEvent),
  )
  .use(ws);

export function publishEvent(channel: string, event: ViyuniEvent) {
  app.server?.publish(channel, JSON.stringify(event));
}
