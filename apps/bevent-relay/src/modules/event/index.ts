import { ViyuniEventType } from '@viyuni/event-types';
import { type } from 'arktype';
import { Elysia } from 'elysia';

import { EventService } from './service';

const eventQuerySchema = type({
  limit: 'string.numeric.parse?',
  offset: 'string.numeric.parse?',
  type: type.valueOf(ViyuniEventType).optional(),
  createdAt: 'string.numeric.parse?',
}).pipe(type({ limit: 'number <= 500' }));

export const event = new Elysia().get(
  '/events',
  async ({ query: { limit = 50, offset = 0, type, createdAt } }) => {
    return EventService.query({ limit, offset, type, createdAt });
  },
  {
    query: eventQuerySchema,
  },
);

export { EventService } from './service';
