<template>
  <div class="size-full overflow-hidden flex flex-col justify-end">
    <div ref="wrapperRef" class="w-full flex flex-col">
      <div v-for="item in rendererList" :key="getItemKey(item)">
        <slot name="item" :data="item"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" generic="T extends { msgId: string | number }">
import { shallowRef, onMounted, onBeforeUnmount, nextTick, useTemplateRef } from 'vue';
import type { PatchTask, LiveChatScrollerProps, LiveChatScrollerSlots } from './types';

const props = withDefaults(defineProps<LiveChatScrollerProps<T>>(), {
  maxItems: 50,
  itemKey: 'id' as keyof T,
  maxDuration: 400,
  minDuration: 80,
});

defineSlots<LiveChatScrollerSlots<T>>();

const wrapperRef = useTemplateRef('wrapperRef');
const rendererList = shallowRef<T[]>([]); // 渲染队列
const buffer: T[] = []; // 缓冲队列
const patchQueue: PatchTask<T>[] = []; // 补丁队列

let loopTimer: ReturnType<typeof setTimeout> | null = null;
let isDestroyed = false; // 防止组件卸载后动画继续执行

const getItemKey = (item: any): string => String(item[props.itemKey]);

const flushLoop = async () => {
  if (isDestroyed) return;

  const wrapper = wrapperRef.value;

  // 如果缓冲池和补丁队列都为空，休眠 100ms 后再来轮询
  if ((buffer.length === 0 && patchQueue.length === 0) || !wrapper) {
    loopTimer = setTimeout(flushLoop, 100);
    return;
  }

  // 记录操作前前的高度
  const oldHeight = wrapper.scrollHeight;

  let newRendererList = rendererList.value;
  let hasChanges = false;

  // 优先处理 Patch 补丁队列
  if (patchQueue.length > 0) {
    // 给缓冲区里未渲染数据打补丁
    for (const [index, item] of buffer.entries()) {
      let newItem = item;

      for (const { condition, updater } of patchQueue) {
        if (condition(newItem)) newItem = { ...newItem, ...updater(newItem) } as T;
      }

      buffer[index] = newItem;
    }

    // 给已渲染列表打补丁
    const patchedRendererList: T[] = [];

    for (const item of newRendererList) {
      let newItem = item;
      for (const { condition, updater } of patchQueue) {
        if (condition(newItem)) {
          newItem = { ...newItem, ...updater(newItem) } as T;
        }
      }

      patchedRendererList.push(newItem);
    }

    newRendererList = patchedRendererList;

    hasChanges = true;
    patchQueue.length = 0; // 处理完毕，清空补丁队列
  }

  // 处理 Buffer 缓冲队列
  const batchSize = buffer.length;
  let dynamicDuration = props.maxDuration;
  let dynamicEasing = 'cubic-bezier(0.25, 0.8, 0.25, 1)';

  if (batchSize > 0) {
    // 动态计算速度, 根据当前积压的弹幕数量
    // 每积压 1 条，动画时间减少 30ms，但不低于极限速度 minDuration
    dynamicDuration = Math.max(props.minDuration, props.maxDuration - batchSize * 30);

    // 高速刷屏时使用匀速 linear 避免眼花，慢速时使用 ease-out 保证优雅
    dynamicEasing = dynamicDuration < 150 ? 'linear' : 'cubic-bezier(0.25, 0.8, 0.25, 1)';

    // 将缓冲池数据全部推入临时渲染队列
    const newItems = [...buffer];
    buffer.length = 0;
    newRendererList = [...newRendererList, ...newItems];
    hasChanges = true;
  }

  // 如果本次循环既没打补丁也没新消息，直接跳入下一帧
  if (!hasChanges) {
    loopTimer = setTimeout(flushLoop, 16);
    return;
  }

  // 触发 shallowRef 的响应式更新
  rendererList.value = newRendererList;

  // 等待 Vue 渲染完毕
  await nextTick();

  // 计算新旧高度差
  const heightDiff = wrapper.scrollHeight - oldHeight;

  if (heightDiff > 0) {
    // 硬件加速执行高度补偿滑动
    const animation = wrapper.animate(
      [
        { transform: `translateY(${heightDiff}px)` }, // 瞬间下移隐藏新高度
        { transform: 'translateY(0px)' }, // 平滑上推回原位
      ],
      {
        duration: dynamicDuration,
        easing: dynamicEasing,
      },
    );

    // 动画播放完毕后的清理工作
    animation.onfinish = () => {
      // 如果超载，从头部剔除旧数据 (保留最新的 maxItems 条)
      if (rendererList.value.length > props.maxItems) {
        rendererList.value = rendererList.value.slice(-props.maxItems);
      }
      // 动画无缝衔接下一帧
      loopTimer = setTimeout(flushLoop, 16);
    };
  } else {
    // 如果高度没变 (例如只是改了文字颜色)，直接做截断清理并进入下一帧
    if (rendererList.value.length > props.maxItems) {
      rendererList.value = rendererList.value.slice(-props.maxItems);
    }
    loopTimer = setTimeout(flushLoop, 16);
  }
};

const pushData = (data: T | T[]) => {
  if (Array.isArray(data)) {
    buffer.push(...data);
  } else {
    buffer.push(data);
  }
};

/**
 * 给渲染列表和缓存列表里的数据打补丁
 */
const patchData = (condition: (item: T) => boolean, updater: (item: T) => Partial<T>) => {
  patchQueue.push({ condition, updater });
};

const clearAll = () => {
  buffer.length = 0;
  rendererList.value = [];
  patchQueue.length = 0;
};

onMounted(() => flushLoop());

onBeforeUnmount(() => {
  isDestroyed = true;
  if (loopTimer) clearTimeout(loopTimer);
});

// 将新增的 patchData 暴露出去
defineExpose({ pushData, patchData, clearAll });
</script>
