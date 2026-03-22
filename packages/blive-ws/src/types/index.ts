import type { Cmd, ViyuniEvent } from '@viyuni/event-types';

/** B站事件处理状态 */
export const ParserEventStatus = {
  /** 未知的命令 */
  Unknown: 'unknown',
  /** 未实现的命令 */
  Unimplemented: 'unimplemented',
  /** 解析失败的命令 */
  ParsingFailed: 'parsingFailed',
} as const;

/** B站事件处理状态类型 */
export type ParserEventStatus = (typeof ParserEventStatus)[keyof typeof ParserEventStatus];

export interface ListenerConfig {
  roomId: number;
  cookie: string;
}

export type ListenerEvents = {
  event: [event: ViyuniEvent];
  close: [];
  error: [error: Error];
  [ParserEventStatus.Unknown]: [event: Record<string, unknown> | unknown[]];
  [ParserEventStatus.Unimplemented]: [cmd: Cmd, raw: Record<string, unknown>];
  [ParserEventStatus.ParsingFailed]: [cmd: Cmd, raw: Record<string, unknown>, error: unknown];
};
