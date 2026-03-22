import type { DefineComponent } from '../../types';
import LiveChatScroller from './LiveChatScroller.vue';
import LiveChatScrollerVapor from './LiveChatScrollerVapor.vue';
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

export function createLiveChatScroller<T extends Record<string, any>>() {
  return LiveChatScroller as unknown as DefineComponent<
    LiveChatScrollerProps<T>,
    LiveChatScrollerSlots<T>,
    LiveChatScrollerEmits,
    LiveChatScrollerExpose<T>
  >;
}

export function createLiveChatScrollerVapor<T extends Record<string, any>>() {
  return LiveChatScrollerVapor as unknown as DefineComponent<
    LiveChatScrollerProps<T>,
    LiveChatScrollerSlots<T>,
    LiveChatScrollerEmits,
    LiveChatScrollerExpose<T>
  >;
}
