import { nextTick, onBeforeUnmount, onMounted, shallowRef, type ShallowRef } from 'vue';

import { defaultValues } from '../constant';
import type { Creator, LiveChatScrollerProps, PatchTask, Updater } from '../types';

export function useLiveChatScroller<T extends Record<string, any>>(
  wrapperRef: ShallowRef<HTMLElement | null>,
  props: LiveChatScrollerProps<T>,
) {
  const {
    itemKey = defaultValues.itemKey,
    maxDuration = defaultValues.maxItems,
    minDuration = defaultValues.minDuration,
    maxItems = defaultValues.maxItems,
    intensity = defaultValues.intensity,
  } = props;

  const rendererList = shallowRef<T[]>([]); // 渲染队列
  const buffer: T[] = []; // 缓冲队列
  const patchQueue: PatchTask<T>[] = []; // 补丁队列

  let loopId: ReturnType<typeof requestAnimationFrame> | null = null;
  let smoothedDuration = maxDuration; // 平滑后的实时时长
  let currentEasing = 'cubic-bezier(0.25, 0.8, 0.25, 1)';
  let activeAnimation: Animation | null = null;
  let isDestroyed = false;
  let isAnimating = false; // 动画锁

  const getItemKey = (item: any): string => String(item[itemKey]);

  function processPatchQueue(newRendererList: T[]) {
    // 渲染对内是否有修改
    let hasRendererChanges = false;

    // 处理 Patch 补丁队列
    if (patchQueue.length > 0) {
      for (const [updater, creator] of patchQueue) {
        // 是否命中渲染队列或者缓冲队列中里的内容
        let hasHit = false;

        newRendererList.forEach((item, index) => {
          const newItem = updater(item);

          if (!newItem || Object.is(item, newItem)) return;

          hasHit = true;
          hasRendererChanges = true;
          newRendererList[index] = { ...newItem };
        });

        if (!hasHit) {
          buffer.forEach((item, index) => {
            const newItem = updater(item);

            if (!newItem || Object.is(item, newItem)) return;

            hasHit = true;
            buffer[index] = { ...newItem };
          });
        }

        if (!hasHit && creator) buffer.push({ ...creator() });
      }

      patchQueue.length = 0;
    }

    return hasRendererChanges;
  }

  const flushLoop = async () => {
    if (isDestroyed) return;

    const wrapper = wrapperRef.value;

    // 如果正在动画中，或者没有新数据，跳过本次逻辑，等待下一帧
    if (isAnimating || (buffer.length === 0 && patchQueue.length === 0) || !wrapper) {
      loopId = requestAnimationFrame(flushLoop);
      return;
    }

    const oldHeight = wrapper.scrollHeight;
    let newRendererList = [...rendererList.value];

    // 处理 Patch 补丁队列
    let hasChanges = processPatchQueue(newRendererList);

    // 处理 Buffer 缓冲队列 + 对数速度计算
    if (buffer.length > 0) {
      const batchSize = buffer.length;

      // 对数计算目标时长
      const targetDuration = Math.max(minDuration, maxDuration - Math.log1p(batchSize) * intensity);

      // 时长平滑滤波 (Lerp)：避免速度突变带来卡顿
      // 0.2 表示每帧向目标速度靠近 20%
      smoothedDuration = smoothedDuration + (targetDuration - smoothedDuration) * 0.2;

      // 动态缓动切换
      const isHighSpeed = smoothedDuration <= minDuration * 1.5;
      currentEasing = isHighSpeed ? 'linear' : 'cubic-bezier(0.25, 0.8, 0.25, 1)';

      const newItems = buffer.slice();
      buffer.length = 0;
      newRendererList = newRendererList.concat(newItems);
      hasChanges = true;
    }

    if (!hasChanges) {
      loopId = requestAnimationFrame(flushLoop);
      return;
    }

    // 预截断, 在赋值给响应式对象前截断，减少 Vue Diff 开销
    if (newRendererList.length > maxItems) {
      newRendererList = newRendererList.slice(-maxItems);
    }

    rendererList.value = newRendererList;

    // 等待 DOM 更新后执行高度补偿动画
    await nextTick();

    const heightDiff = wrapper.scrollHeight - oldHeight;

    if (heightDiff > 0) {
      isAnimating = true;

      if (activeAnimation && activeAnimation.playState === 'running') {
        activeAnimation.commitStyles();
        activeAnimation.cancel();
      }

      activeAnimation = wrapper.animate(
        [
          { transform: `translate3d(0, ${heightDiff}px, 0)` },
          { transform: 'translate3d(0, 0, 0)' },
        ],
        {
          duration: smoothedDuration,
          easing: currentEasing,
          fill: 'forwards',
        },
      );

      activeAnimation.onfinish = () => (isAnimating = false);
    }

    // 无论是否有动画，始终持续循环
    loopId = requestAnimationFrame(flushLoop);
  };

  const pushData = (data: T | T[]) => {
    if (Array.isArray(data)) buffer.push(...data);
    else buffer.push(data);
  };

  const patchData = (updater: Updater<T>, creator: Creator<T>) =>
    patchQueue.push([updater, creator]);

  const clearAll = () => {
    buffer.length = 0;
    rendererList.value = [];
    patchQueue.length = 0;
  };

  onMounted(() => flushLoop());

  onBeforeUnmount(() => {
    isDestroyed = true;
    if (loopId) cancelAnimationFrame(loopId);
  });

  return {
    rendererList,
    pushData,
    patchData,
    clearAll,
    getItemKey,
  };
}
