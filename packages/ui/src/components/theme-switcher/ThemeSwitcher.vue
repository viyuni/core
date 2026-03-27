<script setup lang="ts">
import { Monitor, Sun, Moon } from '@lucide/vue';
import { computed } from 'vue';

import { useTheme, type ThemeMode } from '../../composables/useTheme';
import { cn } from '../../lib/utils';

const props = withDefaults(
  defineProps<{
    mode?: ThemeMode;
    class?: string;
  }>(),
  {
    class: '',
  },
);

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

// 非受控模式：没有传入 mode 时，内部管理主题
const internalTheme = props.mode === undefined ? useTheme() : null;

// 使用 computed 来响应式计算当前模式
const currentMode = computed(() => {
  if (props.mode !== undefined) return props.mode;
  return internalTheme?.themeMode.value ?? 'system';
});

const handleClick = (event: MouseEvent) => {
  emit('click', event);

  // 非受控模式：调用内部的主题切换
  if (internalTheme) {
    internalTheme.cycleThemeMode();
  }
};
</script>

<template>
  <button
    :class="cn('btn btn-ghost btn-sm btn-square', props.class)"
    :title="`${currentMode === 'system' ? '跟随系统' : currentMode === 'light' ? '浅色' : '深色'}`"
    aria-label="切换主题"
    @click="handleClick"
  >
    <Monitor v-if="currentMode === 'system'" :size="20" />
    <Sun v-else-if="currentMode === 'light'" :size="20" />
    <Moon v-else :size="20" />
  </button>
</template>
