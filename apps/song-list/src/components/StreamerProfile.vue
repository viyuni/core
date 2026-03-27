<script setup lang="ts">
import { toProxyUrl } from '@viyuni/shared';
import { useDebounceFn } from '@vueuse/core';
import { AnimatePresence, motion } from 'motion-v';
import { onBeforeUnmount, onMounted, ref } from 'vue';

interface StreamerInfo {
  avatar: string;
  name: string;
  description: string;
}

const props = defineProps<{
  streamer: StreamerInfo;
  totalSongs: number;
  matchedSongs: number;
}>();

// 滚动触发阈值：当头像距离顶部小于等于这个值时触发动画
const PIN_THRESHOLD = 0;

const profileAnchorRef = ref<HTMLElement | null>(null);
const isProfilePinned = ref(false);

let scrollHandler: (() => void) | null = null;

const updatePinnedState = () => {
  if (!profileAnchorRef.value) {
    isProfilePinned.value = false;
    return;
  }
  const rectTop = profileAnchorRef.value.getBoundingClientRect().top;
  isProfilePinned.value = rectTop <= PIN_THRESHOLD;
};

const debouncedUpdatePinnedState = useDebounceFn(updatePinnedState, 16);

onMounted(() => {
  scrollHandler = () => {
    debouncedUpdatePinnedState();
  };
  window.addEventListener('scroll', scrollHandler, { passive: true });
  updatePinnedState();
});

onBeforeUnmount(() => {
  if (scrollHandler) {
    window.removeEventListener('scroll', scrollHandler);
  }
});
</script>

<template>
  <AnimatePresence>
    <motion.div
      v-if="isProfilePinned"
      layout
      layout-id="streamer"
      class="fixed left-3 top-4 z-40 flex items-center gap-2 rounded-full border border-base-300/50 bg-base-100/60 px-2.5 py-1.5 shadow-sm backdrop-blur-md md:left-6 md:top-5"
      :initial="{ opacity: 0, scale: 0.92 }"
      :animate="{ opacity: 1, scale: 1 }"
      :exit="{ opacity: 0, scale: 0.92 }"
      :transition="{
        opacity: { duration: 0.15 },
        default: { type: 'spring', stiffness: 480, damping: 30 },
      }"
    >
      <img
        :src="toProxyUrl(props.streamer.avatar)"
        :alt="`${props.streamer.name} 头像`"
        class="h-8 w-8 rounded-full ring ring-base-300/30"
      />
      <span class="text-sm font-semibold">{{ props.streamer.name }}</span>
    </motion.div>
  </AnimatePresence>

  <section ref="profileAnchorRef" class="md:p-3">
    <div class="flex flex-col items-center text-center">
      <AnimatePresence mode="popLayout">
        <motion.div
          v-if="!isProfilePinned"
          layout
          layout-id="streamer"
          class="flex flex-col items-center"
          :transition="{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }"
        >
          <div class="avatar">
            <div
              class="w-24 rounded-full ring ring-base-300/30 ring-offset-2 ring-offset-base-100 md:w-28"
            >
              <img :src="toProxyUrl(props.streamer.avatar)" :alt="`${props.streamer.name} 头像`" />
            </div>
          </div>
          <h2 class="mt-4 text-xl font-semibold md:text-2xl">{{ props.streamer.name }}</h2>
        </motion.div>
      </AnimatePresence>

      <!-- 占位符：当头像飞走时保持高度，使用 layout 丝滑过渡 -->
      <motion.div
        v-show="isProfilePinned"
        layout
        class="flex flex-col items-center overflow-hidden"
        :style="{ opacity: isProfilePinned ? 0 : 1 }"
        :transition="{ type: 'spring', stiffness: 420, damping: 34 }"
      >
        <div class="avatar">
          <div
            class="w-24 rounded-full ring ring-base-300/60 ring-offset-2 ring-offset-base-100 md:w-28"
          >
            <img :src="toProxyUrl(props.streamer.avatar)" :alt="`${props.streamer.name} 头像`" />
          </div>
        </div>
        <h2 class="mt-4 text-xl font-semibold md:text-2xl">{{ props.streamer.name }}</h2>
      </motion.div>

      <div class="mt-3 space-y-1.5 rounded-xl bg-base-100/40 backdrop-blur-sm p-4 w-full">
        <p class="mx-auto max-w-2xl text-sm leading-6 text-base-content/90 md:text-base">
          {{ props.streamer.description }}
        </p>
        <p class="text-xs text-base-content/80 md:text-sm">
          歌曲总数 {{ props.totalSongs }} 首
          <span class="mx-1">|</span>
          当前匹配 {{ props.matchedSongs }} 首
        </p>
      </div>
    </div>
  </section>
</template>
