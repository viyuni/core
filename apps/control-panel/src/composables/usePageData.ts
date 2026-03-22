import { computed } from 'vue';
import { useRoute } from 'vue-router';

import { useEvents } from '../compositions/useEvents';
import { useOtherEvents } from '../compositions/useOtherEvents';

export function useEventsPageData() {
  const route = useRoute();

  const {
    data: eventsData,
    range: eventsRange,
    isLoading: eventsIsLoading,
    cmdFilter: eventsCmdFilter,
    limit: eventsLimit,
    offset: eventsOffset,
  } = useEvents();

  const {
    data: otherEventsData,
    range: otherEventsRange,
    isLoading: otherEventsIsLoading,
    cmdFilter: otherEventsCmdFilter,
    limit: otherEventsLimit,
    offset: otherEventsOffset,
  } = useOtherEvents();

  const total = computed(() => {
    const isEventsPage = route.name === 'events';
    return isEventsPage
      ? eventsData.value?.total ?? 0
      : otherEventsData.value?.total ?? 0;
  });

  const range = computed(() => {
    const isEventsPage = route.name === 'events';
    return isEventsPage ? eventsRange.value : otherEventsRange.value;
  });

  const isLoading = computed(() => {
    const isEventsPage = route.name === 'events';
    return isEventsPage ? eventsIsLoading.value : otherEventsIsLoading.value;
  });

  const cmdFilter = computed(() => {
    const isEventsPage = route.name === 'events';
    return isEventsPage ? eventsCmdFilter.value : otherEventsCmdFilter.value;
  });

  const limit = computed(() => {
    const isEventsPage = route.name === 'events';
    return isEventsPage ? eventsLimit.value : otherEventsLimit.value;
  });

  const offset = computed(() => {
    const isEventsPage = route.name === 'events';
    return isEventsPage ? eventsOffset.value : otherEventsOffset.value;
  });

  return {
    total,
    range,
    isLoading,
    cmdFilter,
    limit,
    offset,
  };
}
