import { clientRequestSchema, type SubscribeRequest, type ViyuniEvent } from '@viyuni/event-types';
import { Type, type } from 'arktype';
import { Elysia } from 'elysia';
import type { ElysiaWS } from 'elysia/ws';

import { env } from '../../config/env';
import { parseChannel } from '../../lib/utils';

const wsQuerySchema = type({
  accessToken: 'null | string?',
});

export const ws = new Elysia().ws('/ws', {
  query: wsQuerySchema,
  body: clientRequestSchema,
  response: type('unknown') as any as Type<ViyuniEvent, {}>,
  beforeHandle({ set, query }) {
    if (env.EVENT_ACCESS_TOKEN && env.EVENT_ACCESS_TOKEN !== query.accessToken) {
      set.status = 401;
      return 'Unauthorized' as unknown as ViyuniEvent;
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

function handleSubscribe(ws: ElysiaWS<unknown>, message: SubscribeRequest) {
  message.events.forEach((event) => {
    ws.subscribe(parseChannel(event, message.roomId));
  });
}
