import { nextTick, onBeforeUnmount, onMounted, shallowRef, type ShallowRef } from 'vue';

import { defaultValues } from '../constant';
import type { Creator, LiveChatScrollerProps, PatchTask, Updater } from '../types';

export function useLiveChatScroller<T extends Record<string, any>>(
  wrapperRef: ShallowRef<HTMLElement | null>,
  props: LiveChatScrollerProps<T>,
) {
  const { itemKey = defaultValues.itemKey, maxItems = defaultValues.maxItems } = props;

  // --- 状态维护 ---
  const rendererList = shallowRef<T[]>([]); // 视图渲染队列
  const buffer: T[] = []; // 数据缓冲队列
  const patchQueue: PatchTask<T>[] = []; // 增量更新补丁队列

  let isDestroyed = false;

  // --- 物理引擎状态 ---
  let renderLoopId: ReturnType<typeof requestAnimationFrame> | null = null;
  let processLoopId: ReturnType<typeof requestAnimationFrame> | null = null;
  let lastTime = 0;

  let visualOffset = 0; // 当前容器的 Y 轴物理偏移量 (px)
  let currentVelocity = 0; // 当前滚动速度，用于维持动画连贯性

  /**
   * 阻尼平滑时间（秒）
   * 控制动画回弹的耗时。设为 0.08s 以保证高频插入时的干脆利落，消除冗长的衰减拖尾。
   */
  const smoothTime = 0.08;

  const getItemKey = (item: any): string => String(item[itemKey]);

  /**
   * 处理增量更新补丁 (纯数据层运算)
   * 优先匹配并更新已渲染的节点，其次匹配缓冲队列，未命中则作为新节点推入缓冲。
   */
  function processPatchQueue(newRendererList: T[]) {
    let hasChanges = false;
    if (patchQueue.length === 0) return hasChanges;

    for (const [updater, creator] of patchQueue) {
      let hasHit = false;

      newRendererList.forEach((item, index) => {
        const newItem = updater(item);
        if (newItem && !Object.is(item, newItem)) {
          newRendererList[index] = { ...newItem };
          hasHit = true;
          hasChanges = true;
        }
      });

      if (!hasHit) {
        buffer.forEach((item, index) => {
          const newItem = updater(item);
          if (newItem && !Object.is(item, newItem)) {
            buffer[index] = { ...newItem };
            hasHit = true;
          }
        });
      }

      if (!hasHit && creator) buffer.push({ ...creator() });
    }

    patchQueue.length = 0;
    return hasChanges;
  }

  // ==========================================
  // 渲染线程：基于 SmoothDamp 算法的物理位移计算
  // ==========================================
  const renderPhysics = (time: number) => {
    if (isDestroyed) return;

    const dt = lastTime ? time - lastTime : 16.67;
    lastTime = time;

    const wrapper = wrapperRef.value;

    if (wrapper) {
      // 限制单帧最大步长为 50ms，防止页面从后台唤醒时产生过大的时间跳跃
      const dtSec = Math.min(dt / 1000, 0.05);

      // 临界停止条件：当偏移量大于 1px 或 速度绝对值大于 10 时进行平滑计算。
      // 避免趋近 0 时进行无意义的微小浮点运算（切断拖尾）。
      if (visualOffset > 1 || Math.abs(currentVelocity) > 10) {
        // 临界阻尼平滑算法 (SmoothDamp)
        const omega = 2.0 / smoothTime;
        const x = omega * dtSec;
        const exp = 1.0 / (1.0 + x + 0.48 * x * x + 0.235 * x * x * x);

        const change = visualOffset;
        const temp = (currentVelocity + omega * change) * dtSec;

        // 基于衰减系数更新速度与位置
        currentVelocity = (currentVelocity - omega * temp) * exp;
        visualOffset = (change + temp) * exp;

        wrapper.style.transform = `translate3d(0, ${visualOffset}px, 0)`;
      } else if (visualOffset !== 0 || currentVelocity !== 0) {
        // 达到精度阈值，强制归零并重置物理状态
        visualOffset = 0;
        currentVelocity = 0;
        wrapper.style.transform = `translate3d(0, 0, 0)`;
      }
    }

    renderLoopId = requestAnimationFrame(renderPhysics);
  };

  // ==========================================
  // 逻辑线程：数据合并、DOM 截断高度补偿与渲染拦截
  // ==========================================
  let isProcessingData = false;

  const processDataLoop = async () => {
    if (isDestroyed) return;

    // 节流与空闲检查
    if (isProcessingData || (buffer.length === 0 && patchQueue.length === 0)) {
      processLoopId = requestAnimationFrame(processDataLoop);
      return;
    }

    isProcessingData = true;
    const wrapper = wrapperRef.value;
    const oldHeight = wrapper ? wrapper.scrollHeight : 0;

    let newRendererList = [...rendererList.value];
    let hasChanges = processPatchQueue(newRendererList);

    if (buffer.length > 0) {
      newRendererList = newRendererList.concat(buffer);
      buffer.length = 0;
      hasChanges = true;
    }

    if (hasChanges) {
      // 计算队列溢出情况下的高度补偿，确保截断后动画偏移量精准
      let removedHeight = 0;
      const excess = newRendererList.length - maxItems;

      if (excess > 0 && wrapper) {
        const droppedCount = Math.min(rendererList.value.length, excess);

        if (droppedCount > 0) {
          const children = wrapper.children;
          if (children.length >= droppedCount) {
            const firstChild = children[0] as HTMLElement;
            const targetChild = children[droppedCount] as HTMLElement;

            // 优先使用 offsetTop 计算，以囊括外边距(margin)与间隙(gap)
            if (firstChild && targetChild) {
              removedHeight = targetChild.offsetTop - firstChild.offsetTop;
            } else {
              // 降级方案：逐节点累加 offsetHeight
              for (let i = 0; i < droppedCount; i++) {
                if (children[i]) removedHeight += (children[i] as HTMLElement).offsetHeight || 0;
              }
            }
          }
        }
        newRendererList = newRendererList.slice(-maxItems);
      }

      // 触发 Vue 响应式更新
      rendererList.value = newRendererList;

      // 等待 Vue 虚拟 DOM 对比及真实 DOM 挂载完成
      await nextTick();

      if (wrapper) {
        // 实际渲染高度差 = DOM 增量 + 被截断节点的高度
        const heightDiff = wrapper.scrollHeight - oldHeight + removedHeight;

        if (heightDiff > 0) {
          // 累加物理模型目标偏移量
          visualOffset += heightDiff;

          // 强制同步布局 (Forced Synchronous Layout) (FLIP 思想)
          // 立即应用 transform 并读取 offsetHeight 触发重排，拦截浏览器的异步绘制，避免高度突变引起的闪烁
          wrapper.style.transform = `translate3d(0, ${visualOffset}px, 0)`;

          // oxlint-disable-next-line no-unused-expressions
          wrapper.offsetHeight;
        }
      }
    }

    isProcessingData = false;
    processLoopId = requestAnimationFrame(processDataLoop);
  };

  // --- API 暴露 ---

  const pushData = (data: T | T[]) => {
    if (Array.isArray(data)) buffer.push(...data);
    else buffer.push(data);
  };

  const patchData = (updater: Updater<T>, creator: Creator<T>) =>
    patchQueue.push([updater, creator]);

  const clearAll = () => {
    buffer.length = 0;
    patchQueue.length = 0;
    rendererList.value = [];

    // 重置物理引擎与视图状态
    visualOffset = 0;
    currentVelocity = 0;
    lastTime = 0;

    if (wrapperRef.value) {
      wrapperRef.value.style.transform = `translate3d(0, 0, 0)`;
    }
  };

  onMounted(() => {
    renderLoopId = requestAnimationFrame(renderPhysics);
    processLoopId = requestAnimationFrame(processDataLoop);
  });

  onBeforeUnmount(() => {
    isDestroyed = true;
    if (renderLoopId) cancelAnimationFrame(renderLoopId);
    if (processLoopId) cancelAnimationFrame(processLoopId);
  });

  return {
    rendererList,
    pushData,
    patchData,
    clearAll,
    getItemKey,
  };
}
