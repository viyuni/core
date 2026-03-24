<template>
  <div class="size-full overflow-hidden flex flex-col justify-end">
    <div ref="wrapperRef" class="w-full flex flex-col will-change-transform">
      <div v-for="item in rendererList" :key="getKey(item)">
        <slot name="item" :data="item"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" generic="T extends Record<string, any>" vapor>
import { useTemplateRef } from 'vue';

import { useLiveChatScroller } from './compositions/useLiveChatScroller';
import { defaultValues } from './constant';
import type { LiveChatScrollerProps, LiveChatScrollerSlots } from './types';

const props = withDefaults(defineProps<LiveChatScrollerProps<T>>(), defaultValues);


defineSlots<LiveChatScrollerSlots<T>>();


const wrapperRef = useTemplateRef('wrapperRef');


const { push, patch, clear, getKey, rendererList } = useLiveChatScroller<T>(wrapperRef, props);


defineExpose({ push, patch, clear });
</script>
