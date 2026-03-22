import { EventEmitter } from 'events';

export type RoomEvents = {
  'room:created': [roomId: number, enabled: boolean];
  'room:updated': [roomId: number, enabled: boolean];
  'room:deleted': [roomId: number];
  'room:start': [roomId: number];
  'room:stop': [roomId: number];
};

export const roomEvents = new EventEmitter<RoomEvents>();
