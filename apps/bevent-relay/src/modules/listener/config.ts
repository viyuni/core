export const RECONNECT_CONFIG = {
  MAX_RETRIES: 10,
  INITIAL_DELAY: 1000, // 1秒
  MAX_DELAY: 30000, // 最大延迟30秒
} as const;
