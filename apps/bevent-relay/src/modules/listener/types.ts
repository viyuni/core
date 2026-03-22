import type { createListener } from '@viyuni/blive-ws';

export type RoomClient = ReturnType<typeof createListener>;

export const RoomClientStatus = {
  /** 空闲 - 初始状态，未启动 */
  Idle: 'idle',
  /** 连接中 - 正在建立连接 */
  Connecting: 'connecting',
  /** 已连接 - 连接成功，正常运行 */
  Connected: 'connected',
  /** 重连中 - 连接断开，正在重连 */
  Reconnecting: 'reconnecting',
  /** 已停止 - 主动停止，不再重连 */
  Stopped: 'stopped',
} as const;

export type RoomClientStatus = (typeof RoomClientStatus)[keyof typeof RoomClientStatus];

export type RoomClientInstance = {
  roomId: number;
  status: RoomClientStatus;
  start: (cookie?: string | null) => Promise<void>;
  stop: () => void;
};
