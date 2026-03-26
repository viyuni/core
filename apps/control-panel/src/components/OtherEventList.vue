<script setup lang="ts">
import type { OtherEvent } from '@viyuni/bevent-relay/types';
import { ref } from 'vue';

import { formatJsonPreview } from '@/lib/utils';

import JsonModal from './JsonModal.vue';

defineProps<{
  events: OtherEvent[];
}>();

const selectedData = ref<OtherEvent['raw'] | null>(null);
const isModalOpen = ref(false);

const openModal = (data: OtherEvent['raw']) => {
  selectedData.value = data;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;

  setTimeout(() => {
    selectedData.value = null;
  }, 200);
};
</script>

<template>
  <div class="overflow-x-auto w-full">
    <table class="table table-zebra table-sm w-full table-pin-rows">
      <thead class="text-xs">
        <tr>
          <th class="w-20">ID</th>
          <th class="w-48">CMD</th>
          <th class="w-28">Status</th>
          <th class="w-48">Time</th>
          <th>Raw Data</th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="event in events"
          :key="event.id"
          class="hover cursor-pointer transition-colors"
          @click="openModal(event.raw)"
          title="点击查看完整数据"
        >
          <td class="text-base-content/70 font-mono text-xs">{{ event.id }}</td>

          <td class="font-medium max-w-48 truncate" :title="event.cmd">
            {{ event.cmd }}
          </td>

          <td>
            <span
              class="badge badge-warning badge-outline badge-sm"
              v-if="event.status === 'unknown'"
            >
              未知
            </span>
            <span
              class="badge badge-error badge-outline badge-sm"
              v-else-if="event.status === 'parsingFailed'"
            >
              解析失败
            </span>
            <span
              class="badge badge-sm badge-info badge-outline"
              v-else-if="event.status === 'unimplemented'"
            >
              未实现
            </span>
          </td>

          <td class="text-xs text-base-content/70">
            {{ event.createdAt.toLocaleString() }}
          </td>

          <td class="max-w-xs">
            <div class="truncate text-xs font-mono text-base-content/50">
              {{ formatJsonPreview(event.raw) }}
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <JsonModal :open="isModalOpen" :data="selectedData" @close="closeModal" />
  </div>
</template>
