import { treaty } from '@elysiajs/eden';
import type { App } from '@viyuni/bevent-relay/types';
import { createSharedComposable } from '@vueuse/core';
import { computed } from 'vue';

import { useAuth } from './useAuth';

export const useApiClient = createSharedComposable(() => {
  const { baseURL, token } = useAuth();

  const client = computed(() => {
    return treaty<App>(baseURL.value ?? 'http://localhost:6300', {
      headers: {
        Authorization: token.value ? `Bearer ${token.value}` : undefined,
      },
    });
  });

  return {
    client,
  };
});
