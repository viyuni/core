import type { ViyuniEvent } from './index';

/** B站直播事件（从直播间转发） */
export interface BliveEvent {
  type: 'blive';
  timestamp: number;
  data: ViyuniEvent;
}

/** 订阅事件 */
export interface SubscribeEvent {
  type: 'subscribe';
  timestamp: number;
  data: {
    roomId: number;
    events: string[];
  };
}

/** 响应事件 */
export interface ResponseEvent {
  type: 'response';
  timestamp: number;
  data: Record<string, any>;
}

/** 系统通知事件 */
export interface NotificationEvent {
  type: 'notification';
  timestamp: number;
  message: string;
}

/** 所有服务端推送事件类型 */
export type ServerPushEvent = BliveEvent | SubscribeEvent | ResponseEvent | NotificationEvent;
