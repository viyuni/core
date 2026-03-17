import { createCookieSyncClient } from '@viyuni/cookie-sync-client';
import { CookieMap } from 'bun';

import { fetchNavInfo } from './bili-api';
import type { Config } from './config';

export async function createAuthClient(config: Config) {
  const client = createCookieSyncClient(config.LOGIN_SYNC_URL, config.LOGIN_SYNC_PASSWORD);
  const cookie = await client.getDecodedCookie();

  const cookieMap = new CookieMap(cookie ?? '');
  const buvid = cookieMap.get('buvid3') ?? null;

  const userInfo = await fetchNavInfo(cookie);

  return {
    cookie,
    buvid,
    userInfo,
  };
}

export type AuthContext = Awaited<ReturnType<typeof createAuthClient>>;
