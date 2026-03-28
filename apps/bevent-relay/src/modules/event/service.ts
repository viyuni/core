import type { ViyuniEvent, ViyuniEventType } from '@viyuni/event-types';
import { and, count, eq, lte } from 'drizzle-orm';

import { db } from '../../db';
import * as schema from '../../db/schema';

export abstract class EventService {
  static async query({
    limit = 50,
    offset = 0,
    type,
    createdAt,
  }: {
    limit?: number;
    offset?: number;
    type?: ViyuniEventType | null;
    createdAt?: number | null;
  } = {}) {
    const filter = () =>
      and(
        type ? eq(schema.events.type, type) : undefined,
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

  static async insert(roomId: number, event: ViyuniEvent) {
    return db
      .insert(schema.events)
      .values({
        eventId: event.id,
        type: event.type,
        roomId: roomId,
        data: event,
      })
      .onConflictDoNothing();
  }
}
