import { type } from 'arktype';

import { ViyuniEventType } from './common';

/** 订阅请求 */
export interface SubscribeRequest {
  type: 'subscribe';
  roomId?: number;
  events: string[];
}

/** 取消订阅请求 */
export interface UnsubscribeRequest {
  type: 'unsubscribe';
  roomId?: number;
  events?: string[];
}

/** 心跳请求 */
export interface PingRequest {
  type: 'ping';
}

/** 客户端请求事件（与服务端推送事件 ServerPushEvent 对应） */
export type ClientRequestEvent = SubscribeRequest | UnsubscribeRequest | PingRequest;

/** 订阅请求的 schema */
export const subscribeRequestSchema = type({
  type: "'subscribe'",
  roomId: 'number?',
  events: type.enumerated(...Object.values(ViyuniEventType)).array(),
});

/** 取消订阅请求的 schema */
export const unsubscribeRequestSchema = type({
  type: "'unsubscribe'",
  roomId: 'number?',
  events: 'string[]?',
});

/** 心跳请求的 schema */
export const pingRequestSchema = type({
  type: "'ping'",
});

/** 客户端请求的联合 schema */
export const clientRequestSchema = subscribeRequestSchema
  .or(unsubscribeRequestSchema)
  .or(pingRequestSchema);
