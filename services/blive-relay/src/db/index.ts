import type { ViyuniEvent } from '@viyuni/event-types';
import { and, count, eq, like, lte } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';

import { env } from '../config/env';
import * as schema from './schema';
import type {
  EventConfigInsert,
  EventConfigUpdate,
  OtherEventInsert,
  RoomInsert,
  RoomUpdate,
} from './schema';
export * as schema from './schema';

export const db = drizzle(env.DATABASE_URL, { schema });

export async function queryEvents({
  limit = 50,
  offset = 0,
  cmd,
  createdAt,
}: {
  limit?: number;
  offset?: number;
  cmd?: string | null;
  createdAt?: number | null;
}) {
  const filter = () =>
    and(
      cmd ? like(schema.events.cmd, `%${cmd}%`) : undefined,
      createdAt ? lte(schema.events.createdAt, new Date(createdAt)) : undefined,
    );

  const [result] = await db.select({ value: count() }).from(schema.events).where(filter());

  const data = await db.query.events.findMany({
    where: filter(),
    limit,
    offset,
    orderBy: (t, { desc }) => [desc(t.createdAt)],
  });

  return {
    total: result?.value ?? 0,
    limit,
    offset,
    data,
  };
}

export async function insertEvent(roomId: number, event: ViyuniEvent) {
  return db.insert(schema.events).values({
    cmd: event.cmd,
    roomId: String(roomId),
    data: event,
  });
}

export async function queryOtherEvents({
  limit = 50,
  offset = 0,
  cmd,
  createdAt,
}: {
  limit?: number;
  offset?: number;
  cmd?: string | null;
  createdAt?: number | null;
}) {
  const filter = () =>
    and(
      cmd ? like(schema.otherEvents.cmd, `%${cmd}%`) : undefined,
      createdAt ? lte(schema.otherEvents.createdAt, new Date(createdAt)) : undefined,
    );

  const [result] = await db.select({ value: count() }).from(schema.otherEvents).where(filter());

  const data = await db.query.otherEvents.findMany({
    where: filter(),
    limit,
    offset,
    orderBy: (t, { desc }) => [desc(t.createdAt)],
  });

  return {
    total: result?.value ?? 0,
    limit,
    offset,
    data,
  };
}

export async function insertOtherEvent(data: OtherEventInsert) {
  return db.insert(schema.otherEvents).values(data);
}

export async function queryRooms() {
  return db.query.rooms.findMany();
}

export async function createRoom(room: RoomInsert) {
  return db.insert(schema.rooms).values(room).returning();
}

export async function updateRoom(roomId: string, room: RoomUpdate) {
  return db.update(schema.rooms).set(room).where(eq(schema.rooms.id, roomId));
}

export async function removeRoom(roomId: string) {
  return db.delete(schema.rooms).where(eq(schema.rooms.id, roomId));
}

export async function insertEventConfig(event: EventConfigInsert) {
  return db.insert(schema.eventConfigs).values(event).returning();
}

export async function queryEventConfigs() {
  return db.query.eventConfigs.findMany();
}

export async function updateEventConfig(id: number, event: EventConfigUpdate) {
  return db.update(schema.eventConfigs).set(event).where(eq(schema.eventConfigs.id, id));
}

export async function removeEventConfig(id: number) {
  return db.delete(schema.eventConfigs).where(eq(schema.eventConfigs.id, id));
}
