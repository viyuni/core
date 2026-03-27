<script setup lang="ts">
import { RefreshCw } from '@lucide/vue';
import type { OtherEvent } from '@viyuni/bevent-relay/types';

import FilterControls from '../components/FilterControls.vue';
import OtherEventList from '../components/OtherEventList.vue';
import PaginationControl from '../components/PaginationControl.vue';
import { useOtherEvents } from '../composables/useOtherEvents';

const {
  data: otherEventsData,
  range,
  refetch,
  nextPage,
  prevPage,
  isLoading,
  cmdFilter,
  limit,
  offset,
} = useOtherEvents();
</script>

<template>
  <div>
    <Teleport to="#header-actions">
      <div class="flex gap-2">
        <FilterControls :cmd="cmdFilter" @update:cmd="cmdFilter = $event" />
        <PaginationControl
          :range="range"
          :total="otherEventsData?.total ?? 0"
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

    <OtherEventList :events="otherEventsData?.data ?? []" />
  </div>
</template>
