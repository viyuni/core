<script setup lang="ts">
import { computed, ref } from 'vue';
import AppHeader from './components/AppHeader.vue';
import EventList from './components/EventList.vue';
import OtherEventList from './components/OtherEventList.vue';
import SettingsModal from './components/SettingsModal.vue';
import { useEvents } from './compositions/useEvents';
import { useOtherEvents } from './compositions/useOtherEvents';
import { useHighlight } from './compositions/useHighlight';
import type { Event, OtherEvent } from '@viyuni/blive-relay/types';

type TabType = 'events' | 'otherEvents';

const currentTab = ref<TabType>('events');

// 已解析事件
const {
  data: eventsData,
  range: eventsRange,
  refetch: eventsRefetch,
  nextPage: eventsNextPage,
  prevPage: eventsPrevPage,
  isLoading: eventsIsLoading,
  cmdFilter: eventsCmdFilter,
  limit: eventsLimit,
  offset: eventsOffset,
} = useEvents();

// 其他事件（未知/未实现）
const {
  data: otherEventsData,
  range: otherEventsRange,
  refetch: otherEventsRefetch,
  nextPage: otherEventsNextPage,
  prevPage: otherEventsPrevPage,
  isLoading: otherEventsIsLoading,
  cmdFilter: otherEventsCmdFilter,
  limit: otherEventsLimit,
  offset: otherEventsOffset,
} = useOtherEvents();

const isSettingsOpen = ref(false);

// 当前标签页的数据
const currentPageData = computed(() => {
  if (currentTab.value === 'events') {
    return {
      total: eventsData.value?.total ?? 0,
      range: eventsRange.value,
      isLoading: eventsIsLoading.value,
      cmdFilter: eventsCmdFilter.value,
      limit: eventsLimit.value,
      offset: eventsOffset.value,
    };
  } else {
    return {
      total: otherEventsData.value?.total ?? 0,
      range: otherEventsRange.value,
      isLoading: otherEventsIsLoading.value,
      cmdFilter: otherEventsCmdFilter.value,
      limit: otherEventsLimit.value,
      offset: otherEventsOffset.value,
    };
  }
});

const handleRefetch = () => {
  if (currentTab.value === 'events') {
    eventsRefetch();
  } else {
    otherEventsRefetch();
  }
};

const handleNextPage = () => {
  if (currentTab.value === 'events') {
    eventsNextPage();
  } else {
    otherEventsNextPage();
  }
};

const handlePrevPage = () => {
  if (currentTab.value === 'events') {
    eventsPrevPage();
  } else {
    otherEventsPrevPage();
  }
};

const handleUpdateCmd = (v: string | null) => {
  if (currentTab.value === 'events') {
    eventsCmdFilter.value = v;
  } else {
    otherEventsCmdFilter.value = v;
  }
};

const handleUpdateLimit = (v: number) => {
  if (currentTab.value === 'events') {
    eventsLimit.value = v;
  } else {
    otherEventsLimit.value = v;
  }
};

const handleUpdateOffset = (v: number) => {
  if (currentTab.value === 'events') {
    eventsOffset.value = v;
  } else {
    otherEventsOffset.value = v;
  }
};
</script>

<template>
  <div class="grid grid-rows-[auto_1fr] h-screen text-[14px]">
    <AppHeader
      :range="currentPageData.range"
      :total="currentPageData.total"
      :is-loading="currentPageData.isLoading"
      :cmd="currentPageData.cmdFilter"
      :limit="currentPageData.limit"
      :offset="currentPageData.offset"
      :current-tab="currentTab"
      @refetch="handleRefetch()"
      @prev-page="handlePrevPage()"
      @next-page="handleNextPage()"
      @setting="isSettingsOpen = true"
      @update:cmd="handleUpdateCmd"
      @update:limit="handleUpdateLimit"
      @update:offset="handleUpdateOffset"
      @update:current-tab="currentTab = $event"
    />

    <EventList v-if="currentTab === 'events'" :events="(eventsData?.data ?? []) as Event[]" />
    <OtherEventList
      v-else-if="currentTab === 'otherEvents'"
      :events="(otherEventsData?.data ?? []) as OtherEvent[]"
    />

    <SettingsModal :is-open="isSettingsOpen" @close="isSettingsOpen = false" />
  </div>
</template>
