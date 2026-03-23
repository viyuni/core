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

  /**
   * 曲线强度：数值越大，提速越快
   */
  intensity?: number;
}

export interface LiveChatScrollerSlots<T extends Record<string, any>> {
  item(scope: { data: T }): VNode[];
}

export interface LiveChatScrollerEmits {}

export type Updater<T extends Record<string, any>> = (item: T) => T | undefined | null;
export type Creator<T extends Record<string, any>> = () => T;

export interface LiveChatScrollerExpose<T extends Record<string, any>> {
  push(data: T | T[]): void;
  /**
   * 给渲染列表或缓冲列表中的数据打补丁（更新或新增）
   * * @param updater 更新逻辑函数。
   * - 接收当前 item，返回修改后的 <新对象> ({ ...item })
   * - 如果当前数据未变化，请返回 <原对象引用>, undefined , null，此时不会触发位移动画。
   * * @param creator 可选。如果 updater 在当前所有数据中均未找到匹配项，则调用此函数创建并插入新数据, 如果是 null | undefined，则不创建新数据。
   * * @example
   * patchData(
   * (item) => item.id === 1 ? { ...item, text: '新内容' } : undefined,
   * () => ({ id: 1, text: '初始内容' })
   * );
   */
  patch: (updater: Updater<T>, creator?: Creator<T>) => void;
  clear: () => void;
}

export type PatchTask<T extends Record<string, any>> = [updater: Updater<T>, creator?: Creator<T>];
