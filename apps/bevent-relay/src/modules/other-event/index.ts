import { type } from 'arktype';
import { Elysia } from 'elysia';

import { OtherEventService } from './service';

const eventQuerySchema = type({
  limit: 'string.numeric.parse?',
  offset: 'string.numeric.parse?',
  cmd: 'string?',
  createdAt: 'string.numeric.parse?',
}).pipe(type({ limit: 'number <= 500' }));

export const otherEvent = new Elysia().get(
  '/events/other',
  async ({ query }) => {
    const { limit = 50, offset = 0, cmd, createdAt } = query;
    return OtherEventService.query({ limit, offset, cmd, createdAt });
  },
  { query: eventQuerySchema },
);

export { OtherEventService } from './service';
