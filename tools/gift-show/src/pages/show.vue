<script setup lang="ts">
import { ViyuniEventType, type Gift, type Guard, type ViyuniEvent } from '@viyuni/event-types';
import { randomEvent, GUARDS, GIFTS } from '@viyuni/mock';
import { useValidatedQuery } from '@viyuni/shared';
import { createLiveChatScroller, createLiveChatScrollerVapor } from '@viyuni/ui';
import { type } from 'arktype';
import { useTemplateRef } from 'vue';

import { useBeventClient } from '../../../../packages/bevent-client/src/vue';
import SpeedControlPanel from '../components/SpeedControlPanel.vue';
import { useEventTimers } from '../composables/useEventTimers';

const { query, isValid, errors } = useValidatedQuery(
  type({
    minPrice: type('string.numeric.parse').default('0'),
    fontSize: type('string.numeric.parse').default('16'),
    scale: type('string.numeric.parse').default('1'),
  }),
);


const liveChat = useTemplateRef('liveChat');
const LiveChatScroller = createLiveChatScroller<ViyuniEvent>();


// 使用事件定时器 composable
const { updateGift1Speed, updateGift2Speed, updateGuardSpeed, pause, resume } = useEventTimers({
  onGift1Event: () => handleGiftEvent(randomEvent(GIFTS as any) as any),
  onGift2Event: () => handleGiftEvent(randomEvent(GIFTS as any) as any),
  onGuardEvent: () => handleGuardEvent(randomEvent(GUARDS as any) as any),
});


function handleGuardEvent(event: Guard) {
  liveChat.value?.pushData(event);
}


function handleGiftEvent(event: Gift) {
  liveChat.value?.patchData(
    (item) => {
      if (
        item.type === ViyuniEventType.Gift &&
        item.roomId === event.roomId &&
        item.uid === event.uid &&
        item.giftId === event.giftId
      ) {
        return {
          ...event,
          id: item.id,
        };
      }
    },
    () => event,
  );
}


useBeventClient({
  domain: 'localhost:3600',
  token: 'LVFXZF5Q99I9WSBP',
  // roomId: 23369901,
  events: [ViyuniEventType.Guard, ViyuniEventType.Gift],
  onMessage({ data }) {
    switch (data.type) {
      case ViyuniEventType.Guard:
        handleGuardEvent(data);
        break;
      case ViyuniEventType.Gift:
        handleGiftEvent(data);
        break;
    }
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
    <LiveChatScroller ref="liveChat" v-if="isValid">
      <template #item="{ data }">
        <div v-if="data.type === ViyuniEventType.Guard" class="flex gap-2 pb-2">
          <span class="badge badge-primary badge-xs"> 🚢{{ data.roomId }} </span>
          <span class="badge badge-info badge-xs">
            {{ data.uname }}
          </span>
          <span>
            {{ data.face }}
          </span>
        </div>
        <div v-else-if="data.type === ViyuniEventType.Gift" class="flex gap-1 pb-2 items-center">
          <div>
            <img
              :src="`${data.face}?t=${Date.now()}`"
              referrerpolicy="no-referrer"
              width="38"
              height="38"
              class="rounded-full"
            />
          </div>
          <div class="grid gap-1">
            <div class="text-[14px] font-bold">{{ data.uname }}</div>
            <div class="text-xs">{{ data.giftAction }}{{ data.giftName }}</div>
          </div>
          <div class="flex items-center">
            <img :src="`${data.giftIcon}`" referrerpolicy="no-referrer" height="42" width="42" />
            <div
              class="animate-pop-in text-xl font-black"
              :key="`${data.id}:${data.comboTotalCoin}`"
            >
              x{{ Math.max(1, data.comboTotalCoin / (data.blindGift?.giftTipPrice ?? data.price)) }}
            </div>
          </div>
        </div>
      </template>
    </LiveChatScroller>
    <div v-else>
      <p v-for="error in errors" class="text-xl font-bold">
        {{ error.message }}
      </p>
    </div>
  </div>
</template>
