import { createCookieSyncClient } from '@viyuni/cookie-sync-client';

import { env } from '../config';

let cachedCookie: string | null = null;
let activePromise: Promise<string> | null = null;

const cookieClient = createCookieSyncClient(env.LOGIN_SYNC_URL, env.LOGIN_SYNC_PASSWORD);

export async function fetchCookie(force = false): Promise<string> {
  if (cachedCookie !== null && !force) {
    return cachedCookie;
  }

  if (activePromise) return activePromise;

  activePromise = (async () => {
    try {
      const cookie = await cookieClient.getDecodedCookie();

      if (!cookie) {
        console.warn('⚠️ Cookie is invalid, using empty cookie instead.');
      }

      cachedCookie = cookie ?? '';

      return cachedCookie;
    } catch (err) {
      console.warn('⚠️ Fetching cookie failed, using empty cookie instead.', err);
      return cachedCookie ?? '';
    } finally {
      activePromise = null;
    }
  })();

  return activePromise;
}
