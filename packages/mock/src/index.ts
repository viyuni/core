import type { ViyuniEvent } from '@viyuni/event-types';

export * from './gift';
export * from './guard';

let globalId = 0;
let globalUid = 0;

export function randomEvent(events: ViyuniEvent[]) {
  const event = events[Math.floor(Math.random() * events.length)]!;

  return { ...event, id: globalId++, uid: globalUid++ };
}
