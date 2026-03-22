import { roomEvents } from '../../events/room-events';
import { fetchCookie } from '../../lib/cookie-provider';
import { RoomService } from '../room';
import { RoomClientFactory } from './client';
import type { RoomClientInstance } from './types';

export abstract class ListenerManager {
  private static roomClients = new Map<number, RoomClientInstance>();
  private static eventListenersSetup = false;

  static async initialize(roomIds: number[]): Promise<void> {
    // 事件监听只注册一次
    if (!this.eventListenersSetup) {
      this.setupEventListeners();
      this.eventListenersSetup = true;
    }

    // 启动所有房间
    const cookie = await fetchCookie();
    await Promise.allSettled(roomIds.map((id) => this.startRoom(id, cookie)));

    console.log(`✅ Started listening to ${roomIds.length} rooms`);
  }

  static async startRoom(roomId: number, cookie?: string | null): Promise<void> {
    if (!this.roomClients.has(roomId)) {
      this.roomClients.set(roomId, RoomClientFactory.create(roomId));
    }

    const client = this.roomClients.get(roomId)!;
    await client.start(cookie ?? null);
  }

  static stopRoom(roomId: number): void {
    const client = this.roomClients.get(roomId);
    if (client) {
      client.stop();
      this.roomClients.delete(roomId);
    }
  }

  static async restartRoom(roomId: number): Promise<void> {
    const client = this.roomClients.get(roomId);
    if (client) {
      client.stop();
      await client.start();
    }
  }

  static removeRoom(roomId: number): void {
    this.stopRoom(roomId);
    this.roomClients.delete(roomId);
  }

  static async startAll(): Promise<void> {
    const { fetchCookie } = await import('../../lib/cookie-provider');
    const cookie = await fetchCookie();
    await Promise.allSettled(
      Array.from(this.roomClients.keys()).map((roomId) => this.startRoom(roomId, cookie)),
    );
  }

  static stopAll(): void {
    for (const roomId of Array.from(this.roomClients.keys())) {
      this.stopRoom(roomId);
    }
  }

  static async restartAll(): Promise<void> {
    this.stopAll();
    await this.startAll();
  }

  static getRoomIds(): number[] {
    return Array.from(this.roomClients.keys());
  }

  static getRoomCount(): number {
    return this.roomClients.size;
  }

  static getClient(roomId: number): RoomClientInstance | undefined {
    return this.roomClients.get(roomId);
  }

  static getAllClients(): RoomClientInstance[] {
    return Array.from(this.roomClients.values());
  }

  private static setupEventListeners(): void {
    roomEvents.on('room:created', async (roomId, enabled) => {
      if (enabled) {
        await this.startRoom(roomId);
      }
    });

    roomEvents.on('room:updated', async (roomId, enabled) => {
      const room = await RoomService.findById(roomId);
      if (!room) return;

      const isListening = this.roomClients.has(roomId);

      if (enabled && !isListening) {
        await this.startRoom(roomId);
      } else if (!enabled && isListening) {
        this.stopRoom(roomId);
      }
    });

    roomEvents.on('room:deleted', (roomId) => {
      this.removeRoom(roomId);
    });

    roomEvents.on('room:start', async (roomId) => {
      await this.startRoom(roomId);
    });

    roomEvents.on('room:stop', (roomId) => {
      this.stopRoom(roomId);
    });
  }
}
