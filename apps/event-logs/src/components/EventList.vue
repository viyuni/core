<script setup lang="ts">
import { ref } from 'vue';
import type { Event } from '@viyuni/blive-ws/types';
import JsonModal from './JsonModal.vue';

defineProps<{
  events: Event[];
}>();

const selectedEvent = ref<any | null>(null);
const isModalOpen = ref(false);

const openModal = (event: any) => {
  selectedEvent.value = event;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};
</script>

<template>
  <div class="overflow-y-auto">
    <div
      v-for="event in events"
      :key="event.id"
      class="grid grid-cols-[100px_200px_100px_200px_1fr_1fr] gap-4border-b border-base-200 last:border-b-0 cursor-pointer hover:bg-base-200/50 transition-colors"
    >
      <div class="px-5 py-4">{{ event.id }}</div>
      <div class="px-5 py-4 truncate" :title="event.cmd">{{ event.cmd }}</div>
      <div class="px-5 py-4">{{ event.roomId }}</div>
      <div class="px-5 py-4">{{ event.createdAt?.toLocaleString() }}</div>
      <div class="px-5 py-4 truncate text-xs" @click="openModal(event.data)">
        {{ event.data }}
      </div>
      <div class="px-5 py-4 truncate text-xs" @click="openModal(event.parsed)">
        {{ event.parsed }}
      </div>
    </div>

    <JsonModal :is-open="isModalOpen" :data="selectedEvent" @close="closeModal" />
  </div>
</template>
