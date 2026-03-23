import { useQuery } from '@pinia/colada';
import { ViyuniEventType } from '@viyuni/event-types';
import { computed, ref } from 'vue';

import { useApiClient } from './useApiClient';

export function useEvents() {
  const { client } = useApiClient();

  const limit = ref(50);
  const offset = ref(0);
  const typeFilter = ref<ViyuniEventType | null>(null);

  const range = computed(() => [offset.value, limit.value + offset.value] as const);
  const pageTotal = computed(() => Math.ceil((data.value?.total ?? 0) / limit.value));
  const offsetList = computed(() =>
    Array.from({ length: pageTotal.value }, (_, i) => [
      i * limit.value,
      i * limit.value + limit.value,
    ]),
  );

  const { data, isLoading, refetch } = useQuery({
    key: () => ['events', limit.value, offset.value, typeFilter.value],
    async query() {
      return client.value.api.events
        .get({
          query: {
            limit: limit.value,
            offset: offset.value,
            ...(typeFilter.value && { type: typeFilter.value }),
          },
        })
        .then((res) => res.data);
    },
  });

  function nextPage() {
    const dataLength = data.value?.data.length;

    if (!dataLength) return;
    if (dataLength < limit.value) return;

    offset.value += limit.value;
  }

  function prevPage() {
    if (offset.value <= 0) return;

    offset.value -= limit.value;
  }

  return {
    data,
    isLoading,
    offset,
    limit,
    range,
    offsetList,
    typeFilter,
    nextPage,
    prevPage,
    refetch,
  };
}
