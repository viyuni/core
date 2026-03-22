<script setup lang="ts">
import type { Event } from '@viyuni/bevent-relay/types';
import { RefreshCw } from 'lucide-vue-next';

import EventList from '../components/EventList.vue';
import FilterControls from '../components/FilterControls.vue';
import PaginationControl from '../components/PaginationControl.vue';
import { useEvents } from '../compositions/useEvents';

const {
  data: eventsData,
  range,
  refetch,
  nextPage,
  prevPage,
  isLoading,
  cmdFilter,
  limit,
  offset,
} = useEvents();
</script>

<template>
  <div>
    <Teleport to="#header-actions">
      <FilterControls :cmd="cmdFilter" @update:cmd="cmdFilter = $event" />
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
    </Teleport>

    <EventList :events="eventsData?.data ?? []" />
  </div>
</template>
