export * from './parser';

import { DANMU_MSG_PARSER } from './DANMU_MSG';
import { SEND_GIFT_PARSER } from './SEND_GIFT';
import { USER_TOAST_MSG_V2_PARSER } from './USER_TOAST_MSG_V2';

export const parsers = [DANMU_MSG_PARSER, SEND_GIFT_PARSER, USER_TOAST_MSG_V2_PARSER];
