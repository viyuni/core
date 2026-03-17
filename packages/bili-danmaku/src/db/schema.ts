import { index, pgTable, uniqueIndex } from 'drizzle-orm/pg-core';

export const events = pgTable(
  'events_table',
  (t) => ({
    id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
    cmd: t.text().notNull(),
    roomId: t.text('room_id').notNull(),
    data: t.jsonb(),
    createdAt: t
      .timestamp('created_at', {
        precision: 3,
        withTimezone: true,
      })
      .defaultNow(),
  }),
  (t) => [
    uniqueIndex('id_idx').on(t.id),
    index('cmd_idx').on(t.cmd),
    index('roomId_idx').on(t.roomId),
    index('createdAt_idx').on(t.createdAt),
    index('cmd_roomId_idx').on(t.cmd, t.roomId),
    index('cmd_roomId_createdAt_idx').on(t.cmd, t.roomId, t.createdAt),
  ],
);

export type Event = typeof events.$inferSelect;
