<script setup lang="ts">
import { ref } from 'vue';
import type { OtherEvent } from '@viyuni/blive-relay/types';
import JsonModal from './JsonModal.vue';
import { formatJsonPreview } from '@/lib/utils';

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
              class="badge badge-sm"
              :class="event.known ? 'badge-warning badge-outline' : 'badge-error badge-outline'"
            >
              {{ event.known ? '未实现' : '未知' }}
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

    <JsonModal :is-open="isModalOpen" :data="selectedData" @close="closeModal" />
  </div>
</template>
