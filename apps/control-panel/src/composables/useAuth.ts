import { createSharedComposable, useLocalStorage } from '@vueuse/core';

export const useAuth = createSharedComposable(() => {
  const baseURL = useLocalStorage('baseURL', 'http://localhost:6300' as string | null);
  const token = useLocalStorage('token', null as string | null);

  function setAuth(newBaseURL: string, newToken?: string | null) {
    baseURL.value = newBaseURL;
    token.value = newToken;
  }

  return {
    baseURL,
    token,
    setAuth,
  };
});
