<script setup lang="ts">
import type { OtherEvent } from '@viyuni/bevent-relay/types';
import { RefreshCw } from 'lucide-vue-next';

import FilterControls from '../components/FilterControls.vue';
import OtherEventList from '../components/OtherEventList.vue';
import PaginationControl from '../components/PaginationControl.vue';
import { useOtherEvents } from '../compositions/useOtherEvents';

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
    </Teleport>

    <OtherEventList :events="otherEventsData?.data ?? []" />
  </div>
</template>
