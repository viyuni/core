<script setup lang="ts" vapor>
import { useBeventClient } from '@viyuni/bevent-client/vue';
import { ViyuniEventType, type Gift, type Guard, type ViyuniEvent } from '@viyuni/event-types';
import { createLiveChatScroller, createLiveChatScrollerVapor } from '@viyuni/ui';
import { useTemplateRef } from 'vue';

import GiftLogger from './GiftLogger.vue';
import GuardLogger from './GuardLogger.vue';

const liveChat = useTemplateRef('liveChat');
const LiveChatScroller = createLiveChatScrollerVapor<ViyuniEvent>();


function handleGuardEvent(event: Guard) {
  liveChat.value?.push(event);
}


function handleGiftEvent(event: Gift) {
  console.log(event);


  liveChat.value?.patch(
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
  token: 'N44SSEHWXLKD9I1L',
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


defineExpose({
  handleGiftEvent,
  handleGuardEvent,
});
</script>

<template>
  <LiveChatScroller ref="liveChat" class="w-full">
    <template #item="{ data }">
      <div class="pb-2 items-center w-full">
        <GuardLogger v-if="data.type === ViyuniEventType.Guard" :data />
        <GiftLogger v-else-if="data.type === ViyuniEventType.Gift" :data />
      </div>
    </template>
  </LiveChatScroller>
</template>
