<script setup lang="ts">
import { ViyuniEventType, type Gift, type Guard, type ViyuniEvent } from '@viyuni/event-types';
import { randomEvent, GUARDS, GIFTS } from '@viyuni/mock';
import { useValidatedQuery } from '@viyuni/shared';
import { createLiveChatScroller, createLiveChatScrollerVapor } from '@viyuni/ui';
import { type } from 'arktype';
import { useTemplateRef } from 'vue';

import Logger from '@/components/Logger.vue';

import { useBeventClient } from '../../../../packages/bevent-relay-client/src/vue';
import SpeedControlPanel from '../components/SpeedControlPanel.vue';
import { useEventTimers } from '../composables/useEventTimers';

const { query, isValid, errors } = useValidatedQuery(
  type({
    minPrice: type('string.numeric.parse').default('0'),
    fontSize: type('string.numeric.parse').default('16'),
    scale: type('string.numeric.parse').default('1'),
  }),
);

const logger = useTemplateRef('logger');

// 使用事件定时器 composable
const { updateGift1Speed, updateGift2Speed, updateGuardSpeed, pause, resume } = useEventTimers({
  onGift1Event: () => logger.value?.handleGiftEvent(randomEvent(GIFTS as any) as any),
  onGift2Event: () => logger.value?.handleGiftEvent(randomEvent(GIFTS as any) as any),
  onGuardEvent: () => {
    // logger.value?.handleGuardEvent(randomEvent(GUARDS as any) as any)
  },
});
</script>

<template>
  <div class="w-screen h-screen overflow-hidden select-none">
    <!-- 开发模式速度控制面板 -->
    <SpeedControlPanel
      @update:gift1Speed="updateGift1Speed"
      @update:gift2Speed="updateGift2Speed"
      @update:guardSpeed="updateGuardSpeed"
      @pause="pause"
      @resume="resume"
    />

    <Logger ref="logger"></Logger>
  </div>
</template>
