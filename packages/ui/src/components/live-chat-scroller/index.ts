import type { DefineComponent } from '@/types';

import LiveChatScroller from './LiveChatScroller.vue';
export { default as LiveChatScrollerDemo } from './LiveChatScrollerDemo.vue';

import type {
  LiveChatScrollerEmits,
  LiveChatScrollerExpose,
  LiveChatScrollerProps,
  LiveChatScrollerSlots,
} from './types';

export { LiveChatScroller };

export type {
  LiveChatScrollerEmits,
  LiveChatScrollerExpose,
  LiveChatScrollerProps,
  LiveChatScrollerSlots,
};

export function createLiveChatScroller<T extends { msgId: string | number }>() {
  return LiveChatScroller as unknown as DefineComponent<
    LiveChatScrollerProps<T>,
    LiveChatScrollerSlots<T>,
    LiveChatScrollerEmits,
    LiveChatScrollerExpose<T>
  >;
}
