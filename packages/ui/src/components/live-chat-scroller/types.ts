import type { VNode } from 'vue';

export interface LiveChatScrollerProps<T extends Record<string, any>> {
  /**
   * 屏幕最多保留几条弹幕
   */
  maxItems?: number;

  /**
   * 数据唯一标识键名
   */
  itemKey?: keyof T;

  /**
   * 闲时最慢滚动速度 (ms)
   */
  maxDuration?: number;

  /**
   * 忙时最快滚动速度 (ms)
   */
  minDuration?: number;
}

export interface LiveChatScrollerSlots<T extends Record<string, any>> {
  item(scope: { data: T }): VNode[];
}

export interface LiveChatScrollerEmits {}

export interface LiveChatScrollerExpose<T> {
  pushData(data: T | T[]): void;
  patchData: (condition: (item: T) => boolean, updater: (item: T) => Partial<T>) => void;
  clearAll: () => void;
}

export type PatchTask<T> = {
  condition: (item: T) => boolean;
  updater: (item: T) => Partial<T>;
};
