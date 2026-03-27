<script setup lang="ts">
import { RefreshCw } from '@lucide/vue';
import type { Event } from '@viyuni/bevent-relay/types';

import EventTypeSelect from '@/components/EventTypeSelect.vue';

import EventList from '../components/EventList.vue';
import FilterControls from '../components/FilterControls.vue';
import PaginationControl from '../components/PaginationControl.vue';
import { useEvents } from '../composables/useEvents';

const {
  data: eventsData,
  range,
  refetch,
  nextPage,
  prevPage,
  isLoading,
  typeFilter,
  limit,
  offset,
} = useEvents();
</script>

<template>
  <div>
    <Teleport to="#header-actions">
      <div class="flex gap-2 w-full">
        <EventTypeSelect v-model="typeFilter" />

        <PaginationControl
          :range="range"
          :total="eventsData?.total ?? 0"
          :is-loading="isLoading"
          :limit="limit"
          :offset="offset"
          @update:limit="limit = $event"
          @update:offset="offset = $event"
          @prev-page="prevPage"
          @next-page="nextPage"
        />

        <button class="btn btn-sm btn-square" :disabled="isLoading" @click="() => refetch()">
          <RefreshCw :size="16" />
        </button>
      </div>
    </Teleport>

    <EventList :events="eventsData?.data ?? []" />
  </div>
</template>
