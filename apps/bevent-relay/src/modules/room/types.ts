import type { Room } from '../../db/schema';
import { RoomClientStatus } from '../listener/types';

/** 扩展的房间信息，包含客户端状态 */
export type RoomWithClient = Room & {
  /** 客户端状态 */
  clientStatus?: RoomClientStatus;
};
