import { treaty } from '@elysiajs/eden';
import { useQuery } from '@pinia/colada';
import type { App } from '@viyuni/bili-danmaku/types';
import { computed, ref } from 'vue';

import { useAuth } from './useAuth';
export function useEvents() {
  const { baseURL, token } = useAuth();

  const limit = ref(50);
  const offset = ref(0);
  const cmdFilter = ref<string | null>(null);

  const range = computed(() => [offset.value, limit.value + offset.value] as const);
  const pageTotal = computed(() => Math.ceil((data.value?.total ?? 0) / limit.value));
  const offsetList = computed(() =>
    Array.from({ length: pageTotal.value }, (_, i) => [
      i * limit.value,
      i * limit.value + limit.value,
    ]),
  );

  const client = computed(() => {
    return treaty<App>(baseURL.value ?? 'http://localhost:6300', {
      headers: {
        Authorization: token.value ? `Bearer ${token.value}` : undefined,
      },
    });
  });

  const { data, isLoading, refetch } = useQuery({
    key: () => ['events', limit.value, offset.value, cmdFilter.value],
    async query() {
      return client.value.events
        .get({
          query: {
            limit: limit.value,
            offset: offset.value,
            ...(cmdFilter.value && { cmd: cmdFilter.value }),
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
    cmdFilter,
    nextPage,
    prevPage,
    refetch,
  };
}
