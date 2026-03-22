import { type } from 'arktype';

export {
  eventInsertSchema,
  eventUpdateSchema,
  otherEventInsertSchema,
  otherEventUpdateSchema,
  roomInsertSchema,
  roomUpdateSchema,
  eventConfigInsertSchema,
  eventConfigUpdateSchema,
} from './db/schema';

export const eventQuerySchema = type({
  limit: 'string.numeric.parse?',
  offset: 'string.numeric.parse?',
  cmd: 'string?',
  createdAt: 'string.numeric.parse?',
}).pipe(type({ limit: 'number <= 500' }));
