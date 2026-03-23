import { ParserEventStatus } from '@viyuni/blive-ws/types';
import { ViyuniEventType, type ViyuniEvent } from '@viyuni/event-types';
import { createInsertSchema, createUpdateSchema } from 'drizzle-arktype';
import type { InferSelectModel } from 'drizzle-orm';
import { index, pgTable, uniqueIndex, pgEnum } from 'drizzle-orm/pg-core';

export const rooms = pgTable(
  'rooms_table',
  (t) => ({
    id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
    name: t.text(),
    roomId: t.bigint('room_id', { mode: 'number' }).unique().notNull(),
    shortRoomId: t.bigint('short_room_id', { mode: 'number' }),
    uid: t.bigint('uid', { mode: 'number' }),
    uname: t.text(),
    face: t.text(),
    status: t.integer().default(0).notNull(),
    news: t.text(),
    medalName: t.text('medal_name'),
    enabled: t.boolean().default(true).notNull(),
    createdAt: t
      .timestamp('created_at', {
        precision: 3,
        withTimezone: true,
      })
      .notNull()
      .defaultNow(),
  }),
  (t) => [
    uniqueIndex('rooms_id_idx').on(t.id),
    index('rooms_room_id_idx').on(t.roomId),
    index('rooms_uid_idx').on(t.uid),
    index('rooms_created_at_idx').on(t.createdAt),
  ],
);

export const eventTypeEnum = pgEnum('event_type_enum', ViyuniEventType);

export const events = pgTable(
  'events_table',
  (t) => ({
    id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
    eventId: t.text('event_id').unique().notNull(),
    type: t.text().notNull(),
    roomId: t.bigint('room_id', { mode: 'number' }).notNull(),
    data: t.jsonb().$type<ViyuniEvent>(),
    createdAt: t
      .timestamp('created_at', {
        precision: 3,
        withTimezone: true,
      })
      .notNull()
      .defaultNow(),
  }),
  (t) => [
    uniqueIndex('events_id_idx').on(t.id),
    index('events_type_idx').on(t.type),
    index('events_room_id_idx').on(t.roomId),
    index('events_created_at_idx').on(t.createdAt),
    index('events_type_room_id_idx').on(t.type, t.roomId),
    index('events_type_room_id_created_at_idx').on(t.type, t.roomId, t.createdAt),
  ],
);

export const otherEventStatusEnum = pgEnum('other_event_status_enum', ParserEventStatus);

export const otherEvents = pgTable(
  'other_events_table',
  (t) => ({
    id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
    cmd: t.text().notNull(),
    roomId: t.bigint('room_id', { mode: 'number' }).notNull(),
    status: otherEventStatusEnum('status').notNull().default('unknown'),
    raw: t.jsonb(),
    extra: t.jsonb(),
    createdAt: t
      .timestamp('created_at', {
        precision: 3,
        withTimezone: true,
      })
      .notNull()
      .defaultNow(),
  }),
  (t) => [
    uniqueIndex('other_events_id_idx').on(t.id),
    index('other_events_cmd_idx').on(t.cmd),
    index('other_events_room_id_idx').on(t.roomId),
    index('other_events_cmd_room_id_idx').on(t.cmd, t.roomId),
    index('other_events_created_at_idx').on(t.createdAt),
  ],
);

export const eventConfigs = pgTable(
  'event_configs_table',
  (t) => ({
    id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
    cmd: t.text().unique().notNull(),
    enabled: t.boolean().notNull().default(true),
    createdAt: t
      .timestamp('created_at', {
        precision: 3,
        withTimezone: true,
      })
      .notNull()
      .defaultNow(),
  }),
  (t) => {
    return [
      uniqueIndex('event_configs_id_idx').on(t.id),
      index('event_configs_cmd_idx').on(t.cmd),
      index('event_configs_created_at_idx').on(t.createdAt),
    ];
  },
);

// Type & Schema

export const eventInsertSchema = createInsertSchema(events);
export const eventUpdateSchema = createUpdateSchema(events);
export type Event = InferSelectModel<typeof events>;
export type EventInsert = typeof eventInsertSchema.infer;
export type EventUpdate = typeof eventUpdateSchema.infer;

export const otherEventInsertSchema = createInsertSchema(otherEvents);
export const otherEventUpdateSchema = createUpdateSchema(otherEvents);
export type OtherEvent = InferSelectModel<typeof otherEvents>;
export type OtherEventInsert = typeof otherEventInsertSchema.infer;
export type OtherEventUpdate = typeof otherEventUpdateSchema.infer;

export const roomInsertSchema = createInsertSchema(rooms);
export const roomUpdateSchema = createUpdateSchema(rooms);
export type Room = InferSelectModel<typeof rooms>;
export type RoomInsert = typeof roomInsertSchema.infer;
export type RoomUpdate = typeof roomUpdateSchema.infer;

export const eventConfigInsertSchema = createInsertSchema(eventConfigs);
export const eventConfigUpdateSchema = createUpdateSchema(eventConfigs);
export type EventConfig = InferSelectModel<typeof eventConfigs>;
export type EventConfigInsert = typeof eventConfigInsertSchema.infer;
export type EventConfigUpdate = typeof eventConfigUpdateSchema.infer;
