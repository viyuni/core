import { type } from 'arktype';
import { Elysia } from 'elysia';

import { EventService } from './service';

const eventQuerySchema = type({
  limit: 'string.numeric.parse?',
  offset: 'string.numeric.parse?',
  cmd: 'string?',
  createdAt: 'string.numeric.parse?',
}).pipe(type({ limit: 'number <= 500' }));

export const event = new Elysia().get(
  '/events',
  async ({ query: { limit = 50, offset = 0, cmd, createdAt } }) => {
    return EventService.query({ limit, offset, cmd, createdAt });
  },
  {
    query: eventQuerySchema,
  },
);

export { EventService } from './service';
