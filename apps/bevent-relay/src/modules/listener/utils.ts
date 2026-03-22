import { RECONNECT_CONFIG } from './config';

/** 计算指数退避延迟时间 */
export function calculateBackoffDelay(retryCount: number): number {
  return Math.min(
    RECONNECT_CONFIG.INITIAL_DELAY * Math.pow(2, retryCount),
    RECONNECT_CONFIG.MAX_DELAY,
  );
}
