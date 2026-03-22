import { and, count, like, lte } from 'drizzle-orm';

import { db } from '../../db';
import * as schema from '../../db/schema';
import type { OtherEventInsert } from '../../db/schema';

export abstract class OtherEventService {
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

  static async insert(data: OtherEventInsert) {
    return db.insert(schema.otherEvents).values(data);
  }
}
