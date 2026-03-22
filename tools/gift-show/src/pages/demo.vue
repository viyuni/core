<script lang="ts" setup>
import { useBeventClient } from '@viyuni/bevent-client/vue';
import type { ViyuniEvent } from '@viyuni/event-types';
import { ViyuniEventType } from '@viyuni/event-types';
import { createLiveChatScrollerVapor } from '@viyuni/ui';
import { useTemplateRef } from 'vue';

const liveChatScrollerRef = useTemplateRef('liveChatScrollerRef');
const LiveChatScroller = createLiveChatScrollerVapor<ViyuniEvent>();


useBeventClient({
  domain: 'localhost:3600',
  token: 'LVFXZF5Q99I9WSBP',
  // roomId: 23369901,
  events: Object.values(ViyuniEventType),
  onMessage({ data }) {
    if (data.type === ViyuniEventType.LikesUpdate) {
      liveChatScrollerRef.value?.patchData(
        (item) => {
          if (item.type === ViyuniEventType.LikesUpdate && item.roomId === data.roomId) {
            return {
              ...item,
              likes: data.likes,
            };
          }
        },
        () => data,
      );
    } else if (data.type === ViyuniEventType.Gift) {
      console.log(data);
      liveChatScrollerRef.value?.patchData(
        (item) => {
          if (
            item.type === ViyuniEventType.Gift &&
            item.roomId === data.roomId &&
            item.uid === data.uid &&
            item.giftId === data.giftId
          ) {
            return {
              ...data,
            };
          }
        },
        () => data,
      );
    } else if (data.type === ViyuniEventType.LikeClick) {
      liveChatScrollerRef.value?.patchData(
        (item) => {
          if (
            item.type === ViyuniEventType.LikeClick &&
            item.roomId === data.roomId &&
            item.uid === data.uid
          ) {
            console.log(item);

            return {
              ...item,
              count: (item.count ?? 0) + 1,
            };
          }
        },
        () => data,
      );
    } else {
      liveChatScrollerRef.value?.pushData(data);
    }
  },
});
</script>

<template>
  <LiveChatScroller item-key="id" ref="liveChatScrollerRef">
    <template #item="{ data }">
      <div v-if="data.type === ViyuniEventType.Message" class="flex gap-2 pb-2">
        <span class="badge badge-primary badge-xs">
          {{ data.roomId }}
        </span>
        <span class="badge badge-info badge-xs">
          {{ data.uname }}
        </span>
        {{ data.content }}
      </div>

      <div v-else-if="data.type === ViyuniEventType.LiveWarning" class="flex gap-2 pb-2">
        <span class="badge badge-primary badge-xs">
          {{ data.roomId }}
        </span>
        <span class="badge badge-warning badge-xs"> ⚠️{{ data.message }} </span>
      </div>
      <div v-else-if="data.type === ViyuniEventType.Guard" class="flex gap-2 pb-2">
        <span class="badge badge-primary badge-xs"> 🚢{{ data.roomId }} </span>
        <span class="badge badge-info badge-xs">
          {{ data.uname }}
        </span>
        <span>
          {{ data.guardType }}
        </span>
      </div>
      <div
        v-else-if="data.type === ViyuniEventType.Gift"
        class="flex gap-2 pb-2"
        :key="`${data.id}:${data.comboTotalCoin}`"
      >
        <span class="badge badge-primary badge-xs">
          {{ data.roomId }}
        </span>
        <span class="badge badge-info badge-xs">
          {{ data.uname }}
        </span>
        <span class="animate-pop-in">
          🎁{{ data.giftName }} x {{ Math.max(1, data.comboTotalCoin / data.price) }}
        </span>
      </div>
    </template>
  </LiveChatScroller>
</template>
