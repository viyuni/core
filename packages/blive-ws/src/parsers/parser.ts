import type { Cmd } from '@viyuni/event-types';

export interface ParseResult {
  cmd: Cmd;
  id: string;
}

export interface EventParseOptions<
  EventCMD extends string,
  Result extends ParseResult,
  Message = unknown,
> {
  cmd: EventCMD;
  parser(cmd: EventCMD, message: Message, roomId: number, eventListenerUid: number): Result;
}

export function defineEventParser<
  EventCMD extends string,
  Result extends ParseResult,
  Message = unknown,
>(options: EventParseOptions<EventCMD, Result, Message>) {
  return options;
}
