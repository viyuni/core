<template>
  <SkewCard :height="50" :skewWidth="40" :bgColor="'rgba(0,0,0,0.5)'">
    <div class="gift-body" :style="{ '--theme': color || '#FB7299' }">
      <div class="gift-status">
        <img :src="data.giftIcon" class="icon" />
        <div :key="data.comboTotalCoin" class="combo animate-pop">
          x{{ Math.max(1, data.comboTotalCoin / (data.blindGift?.giftTipPrice ?? data.price)) }}
        </div>
      </div>

      <div class="user-info">
        <div class="name">{{ data.uname }}</div>
        <div class="desc">
          {{ data.giftAction }} <span class="gift-n">{{ data.giftName }}</span>
        </div>
      </div>

      <div class="avatar-wrap">
        <img :src="toProxyUrl(data.face)" referrerpolicy="no-referrer" class="avatar" />
      </div>
    </div>
  </SkewCard>
</template>

<script setup lang="ts">
import SkewCard from './SkewCard.vue';
import { toProxyUrl } from '@viyuni/shared';

defineProps<{ data: any; color?: string }>();
</script>

<style scoped>
.gift-body {
  display: flex;
  align-items: center;
  width: 100%;
  gap: 12px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.user-info {
  flex: 1;
  min-width: 0;
}

.name {
  color: white;
  font-weight: bold;
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.desc {
  font-size: 12px;
  color: var(--theme);
}

.gift-n {
  color: #fff;
}

.gift-status {
  display: flex;
  align-items: center;
  gap: 8px;
}

.icon {
  height: 48px;
  filter: drop-shadow(0 0 4px var(--theme));
}

.combo {
  font-family: 'Arial Black', sans-serif;
  font-style: italic;
  font-weight: 900;
  font-size: 30px;
  color: var(--theme);
  paint-order: stroke fill;
  filter: drop-shadow(1px 1px 0px rgba(233, 193, 193, 0.4));
}

.animate-pop {
  animation: pop 0.3s cubic-bezier(0.17, 0.89, 0.32, 1.49);
}

@keyframes pop {
  0% {
    transform: scale(0.7);
  }
  70% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}
</style>
