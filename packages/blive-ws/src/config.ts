import { type } from 'arktype';

const EnvSchema = type({
  DATABASE_URL: 'string',
  ROOMS: 'string',
  LOGIN_SYNC_URL: 'string',
  LOGIN_SYNC_PASSWORD: 'string',
});

export function loadConfig() {
  const env = {
    DATABASE_URL: process.env.DATABASE_URL,
    ROOMS: process.env.ROOMS,
    LOGIN_SYNC_URL: process.env.LOGIN_SYNC_URL,
    LOGIN_SYNC_PASSWORD: process.env.LOGIN_SYNC_PASSWORD,
  };

  const result = EnvSchema(env);

  if (result instanceof type.errors) {
    throw new Error(result.summary);
  }

  return {
    ...result,
    roomIds: result.ROOMS.split(',')
      .map((s) => Number(s.trim()))
      .filter((n) => !isNaN(n)),
  };
}

export type Config = ReturnType<typeof loadConfig>;
