<template>
  <div class="skew-container" :style="cssVars">
    <svg width="0" height="0" style="position: absolute">
      <defs>
        <clipPath :id="clipId">
          <path :d="`M 0 0 L ${skewWidth} ${height} H 5000 V 0 Z`" />
        </clipPath>
      </defs>
    </svg>

    <div class="skew-card" :style="{ clipPath: `url(#${clipId})` }">
      <div class="skew-content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  height?: number; // 容器高度 (px)
  skewWidth?: number; // 斜切的横向距离 (px)
  bgColor?: string; // 背景颜色
  blur?: number; // 毛玻璃模糊度 (px)
}

const props = withDefaults(defineProps<Props>(), {
  height: 60,
  skewWidth: 30,
  bgColor: 'rgba(0, 0, 0, 0.5)',
  blur: 10,
});

// 生成唯一 ID，防止页面有多个组件时 SVG ID 冲突
const clipId = `clip-skew-${Math.random().toString(36).slice(2, 9)}`;

const cssVars = computed(() => ({
  '--card-height': `${props.height}px`,
  '--card-bg': props.bgColor,
  '--card-blur': `${props.blur}px`,
  '--safe-padding': `${props.skewWidth + 10}px`, // 自动计算安全间距
}));
</script>

<style scoped>
.skew-container {
  width: 100%;
  /* 只有外层能做 drop-shadow，因为内层被 clip-path 裁了 */
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.2));
}

.skew-card {
  width: 100%;
  height: var(--card-height);
  background: var(--card-bg);
  backdrop-filter: blur(var(--card-blur));

  /* 右侧圆角固定为高度的一半 */
  border-top-right-radius: calc(var(--card-height) / 2);
  border-bottom-right-radius: calc(var(--card-height) / 2);

  display: flex;
  align-items: center;
}

.skew-content {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  /* 确保内容不被左侧斜边遮挡 */
  padding-left: var(--safe-padding);
}
</style>
