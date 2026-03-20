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

export type * from './db/schema';

export type App = (typeof import('./server'))['app'];
