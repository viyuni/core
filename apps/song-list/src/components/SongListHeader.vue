<script setup lang="ts">
import { BiliIcon, ThemeSwitcher } from '@viyuni/ui';

const props = defineProps<{
  title: string;
  liveRoomUrl: string;
}>();
</script>

<template>
  <div class="w-full border-b border-base-300/50 bg-base-100/40 backdrop-blur-md">
    <div
      class="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 md:px-8 md:py-4"
    >
      <h1 class="text-xl font-bold md:text-2xl">{{ props.title }}</h1>
      <div class="flex items-center gap-2">
        <ThemeSwitcher />
        <a
          :href="props.liveRoomUrl"
          target="_blank"
          rel="noreferrer"
          class="btn btn-ghost btn-sm btn-square"
          aria-label="打开直播间"
        >
          <BiliIcon width="18" height="18" />
        </a>
      </div>
    </div>
  </div>
</template>
