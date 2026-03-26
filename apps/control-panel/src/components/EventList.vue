<script setup lang="ts">
import type { Event } from '@viyuni/bevent-relay/types';
import { ref } from 'vue';

import { formatJsonPreview } from '@/lib/utils';

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
  <div class="overflow-x-auto w-full">
    <table class="table table-zebra table-sm w-full table-pin-rows">
      <thead>
        <tr class="text-xs">
          <th class="w-24">ID</th>
          <th class="w-48">Type</th>
          <th class="w-24">Room ID</th>
          <th class="w-48">Time</th>
          <th>Parsed Data</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="event in events" :key="event.id" class="hover">
          <td class="font-mono text-xs">{{ event.id }}</td>
          <td class="max-w-48 truncate" :title="event.type">
            <div class="badge badge-ghost badge-sm">{{ event.type }}</div>
          </td>
          <td class="font-mono text-xs">{{ event.roomId }}</td>
          <td class="text-xs text-base-content/70">
            {{ event.createdAt?.toLocaleString() }}
          </td>
          <td class="max-w-xs" @click="openModal(event.data)" title="点击查看完整 JSON">
            <div class="truncate text-xs font-mono text-base-content/50">
              {{ formatJsonPreview(event.data) }}
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <JsonModal :open="isModalOpen" :data="selectedEvent" @close="closeModal" />
  </div>
</template>
