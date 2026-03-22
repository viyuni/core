import { fetchRoomInfo } from '@viyuni/shared';
import { asc, eq } from 'drizzle-orm';
import { NotFoundError } from 'elysia';

import { env } from '../../config';
import { db } from '../../db';
import * as schema from '../../db/schema';
import type { RoomInsert, RoomUpdate } from '../../db/schema';
import { roomEvents } from '../../events/room-events';
import { ListenerManager, RoomClientStatus } from '../listener';
import type { RoomWithClient } from './types';

export abstract class RoomService {
  static async getAll(): Promise<RoomWithClient[]> {
    const clients = ListenerManager.getAllClients();
    const clientMap = new Map(clients.map((c) => [c.roomId, c.status]));

    const rooms = await db.query.rooms.findMany({
      orderBy: (rooms) => [asc(rooms.createdAt)],
    });

    return rooms.map((room) => ({
      ...room,
      clientStatus: clientMap.get(room.roomId) ?? RoomClientStatus.Stopped,
    }));
  }

  static async findById(roomId: number) {
    return db.query.rooms.findFirst({
      where: eq(schema.rooms.roomId, roomId),
    });
  }

  static async create(data: RoomInsert) {
    const roomInfo = await fetchRoomInfo(data.roomId);
    const [room] = await db
      .insert(schema.rooms)
      .values({
        ...data,
        roomId: roomInfo.room_id,
        uid: String(roomInfo.uid),
        uname: roomInfo.uname,
        face: roomInfo.face,
        shortRoomId: roomInfo.short_id,
      })
      .returning()
      .onConflictDoNothing({ target: schema.rooms.roomId });

    if (!room) return null;

    const enabled = data.enabled ?? true;
    roomEvents.emit('room:created', room.roomId, enabled);

    return room;
  }

  static async update(roomId: number, data: RoomUpdate) {
    const [room] = await db
      .update(schema.rooms)
      .set(data)
      .where(eq(schema.rooms.roomId, roomId))
      .returning();

    if (!room) return null;

    roomEvents.emit('room:updated', roomId, room.enabled);

    return room;
  }

  static async delete(roomId: number) {
    const [room] = await db.delete(schema.rooms).where(eq(schema.rooms.roomId, roomId)).returning();

    if (!room) return null;

    roomEvents.emit('room:deleted', roomId);
    return room;
  }

  static async exists(roomId: number): Promise<boolean> {
    const room = await this.findById(roomId);
    return !!room;
  }

  static async ensureExists(roomId: number) {
    const exists = await this.exists(roomId);
    if (!exists) {
      throw new NotFoundError('Room not found');
    }
  }

  static async start(roomId: number) {
    await this.ensureExists(roomId);
    roomEvents.emit('room:start', roomId);
  }

  static async stop(roomId: number) {
    await this.ensureExists(roomId);
    roomEvents.emit('room:stop', roomId);
  }

  static async refreshInfo(roomId: number) {
    await this.ensureExists(roomId);

    const roomInfo = await fetchRoomInfo(roomId);
    await db
      .update(schema.rooms)
      .set({
        uid: String(roomInfo.uid),
        uname: roomInfo.uname,
        face: roomInfo.face,
        roomId: roomInfo.room_id,
        shortRoomId: roomInfo.short_id,
      })
      .where(eq(schema.rooms.roomId, roomId));
  }

  static async initialize() {
    const envRoomIds = env.ROOMS ?? ([] as number[]);

    if (envRoomIds.length > 0) {
      await db
        .insert(schema.rooms)
        .values(envRoomIds.map((roomId) => ({ roomId })))
        .onConflictDoNothing();
    }

    const rooms = await db.query.rooms.findMany({
      where: eq(schema.rooms.enabled, true),
    });

    return rooms.map((r) => r.roomId);
  }
}
