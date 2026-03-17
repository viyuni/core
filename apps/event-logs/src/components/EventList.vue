<script setup lang="ts">
import type { Event } from '@viyuni/bili-danmaku/types'

defineProps<{
  events: Event[]
}>()
</script>

<template>
  <div class="overflow-y-auto">
    <div
      v-for="event in events"
      :key="event.id"
      class="grid grid-cols-[100px_200px_100px_200px_1fr] gap-4 p-2 border-b border-base-200 last:border-b-0 px-5 py-4"
    >
      <div>{{ event.id }}</div>
      <div class="truncate" :title="event.cmd">{{ event.cmd }}</div>
      <div>{{ event.roomId }}</div>
      <div>{{ event.createdAt?.toLocaleString() }}</div>
      <div class="truncate">{{ event.data }}</div>
    </div>
  </div>
</template>
