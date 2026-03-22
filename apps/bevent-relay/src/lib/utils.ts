import { type ViyuniEventType } from '@viyuni/event-types';

export function parseChannel(eventType: ViyuniEventType, roomId?: number) {
  return roomId ? `${eventType}:${roomId}` : eventType;
}
