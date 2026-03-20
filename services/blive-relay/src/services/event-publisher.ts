import type {
  BliveEvent,
  NotificationEvent,
  ResponseEvent,
  ViyuniEvent,
} from '@viyuni/event-types';

import { publishEvent as publish } from '../server';

/** 发布 B站直播事件 */
export function publishBliveEvent(data: ViyuniEvent) {
  const bliveEvent: BliveEvent = {
    type: 'blive',
    timestamp: Date.now(),
    data,
  };

  publish(`${data.type}:${data.roomId}`, bliveEvent);
  publish(data.type, bliveEvent);
}

/** 发布系统通知事件 */
export function publishNotification(message: string) {
  const notification: NotificationEvent = {
    type: 'notification',
    timestamp: Date.now(),
    message,
  };

  publish('notification', notification);
}

/** 发送响应 */
export function publishResponse(data: any) {
  const response: ResponseEvent = {
    type: 'response',
    timestamp: Date.now(),
    data,
  };

  publish('response', response);
}
