<script setup lang="ts">
import { Settings, Cable, Info, Home } from 'lucide-vue-next';
import { useRoute } from 'vue-router';

import Logo from './Logo.vue';

const route = useRoute();

defineEmits<{
  setting: [];
}>();
</script>

<template>
  <div class="p-3 border-b border-base-200 flex items-center justify-between gap-4">
    <div class="flex items-center gap-4">
      <Logo width="30" />

      <div class="tabs tabs-boxed">
        <RouterLink
          to="/events"
          class="tab gap-1 text-sm transition-all"
          :class="{ 'tab-active': route.name === 'events' }"
        >
          <Cable :size="16" />
          已解析事件
        </RouterLink>

        <RouterLink
          to="/other-events"
          class="tab gap-1 text-sm transition-all"
          :class="{ 'tab-active': route.name === 'otherEvents' }"
        >
          <Info :size="16" />
          未知/未实现
        </RouterLink>

        <RouterLink
          to="/rooms"
          class="tab gap-1 text-sm transition-all"
          :class="{ 'tab-active': route.name === 'rooms' }"
        >
          <Home :size="16" />
          房间管理
        </RouterLink>
      </div>
    </div>

    <!-- 页面操作按钮区域 -->
    <div class="flex gap-2">
      <div>
        <div id="header-actions" />
      </div>
      <button class="btn btn-sm btn-square" @click="$emit('setting')">
        <Settings :size="16" />
      </button>
    </div>
  </div>
</template>
