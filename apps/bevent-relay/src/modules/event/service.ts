import type { ViyuniEvent } from '@viyuni/event-types';
import { and, count, like, lte } from 'drizzle-orm';

import { db } from '../../db';
import * as schema from '../../db/schema';

export abstract class EventService {
  static async query({
    limit = 50,
    offset = 0,
    cmd,
    createdAt,
  }: {
    limit?: number;
    offset?: number;
    cmd?: string | null;
    createdAt?: number | null;
  } = {}) {
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

  static async insert(roomId: number, event: ViyuniEvent) {
    return db.insert(schema.events).values({
      cmd: event.cmd,
      roomId: String(roomId),
      data: event,
    });
  }
}
