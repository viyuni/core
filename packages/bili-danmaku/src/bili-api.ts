import ky from 'ky';

import type { FetchBiliNavResp, FetchDanmuConfResp } from './types/bili-api';

export async function getDanmuInfo(roomId: number, cookie: string | null) {
  const res = await ky
    .get<FetchDanmuConfResp>(
      `https://api.live.bilibili.com/room/v1/Danmu/getConf?room_id=${roomId}`,
      {
        credentials: 'include',
        headers: {
          Cookie: cookie ?? '',
        },
      },
    )
    .json();

  if (res.code !== 0) throw new Error(res.message);

  const randomServer =
    res.data.server_list[Math.floor(Math.random() * res.data.server_list.length)];

  return {
    ...res.data,
    randomServer,
  };
}

export async function fetchNavInfo(cookie: string | null) {
  const res = await ky<FetchBiliNavResp>('https://api.bilibili.com/x/web-interface/nav', {
    credentials: 'include',
    headers: { Cookie: cookie ?? '' },
  }).json();

  if (res.code === 0) return res.data;

  throw new Error(res.message);
}
