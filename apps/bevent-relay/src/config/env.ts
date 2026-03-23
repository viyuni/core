import 'dotenv/config';
import arkenv from 'arkenv';

export const env = arkenv({
  DATABASE_URL: 'string',
  LOGIN_SYNC_URL: 'string',
  LOGIN_SYNC_PASSWORD: 'string',
  ACCESS_TOKEN: 'string >= 16?',
  EVENT_ACCESS_TOKEN: 'string >= 16?',
  ROOMS: 'string.numeric.parse[]?',
});
