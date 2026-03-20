import { treaty } from '@elysiajs/eden';
import type { App } from '@viyuni/blive-relay/types';
import { createSharedComposable } from '@vueuse/core';
import { computed } from 'vue';

import { useAuth } from './useAuth';

export const useApi = createSharedComposable(() => {
  const { baseURL, token } = useAuth();

  const api = computed(() => {
    return treaty<App>(baseURL.value ?? 'http://localhost:6300', {
      headers: {
        Authorization: token.value ? `Bearer ${token.value}` : undefined,
      },
    });
  });

  return {
    api,
  };
});
