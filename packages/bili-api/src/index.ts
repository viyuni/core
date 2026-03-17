import ky from 'ky';

export const biliApiClient = ky.create({
  prefixUrl: 'https://api.bilibili.com',
});

function fetchNavInfo() {}
