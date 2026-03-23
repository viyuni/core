import { defineHandler } from 'nitro';

export default defineHandler((event) => {
  const path = event.url.pathname;
  const match = path.match(/^\/(i\d\.hdslb\.com)/);

  if (!match) {
    return new Response('Not Found', {
      status: 404,
    });
  }

  const origin = event.url.origin;
  const isViyuni = origin.endsWith('.viyuni.top') || origin.endsWith('://viyuni.top');
  const isLocal = origin.includes('://localhost') || origin.includes('://127.0.0.1');

  if (!isViyuni && !isLocal) {
    return new Response('Access Denied', {
      status: 403,
    });
  }

  const url = 'https:/' + path;

  return fetch(url, {
    headers: {
      Referer: 'https://www.bilibili.com/',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    },
  }).then((res) => {
    return new Response(res.body, {
      headers: {
        'Access-Control-Allow-Origin': isLocal ? '*' : origin,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
      status: res.status,
      statusText: res.statusText,
    });
  });
});
