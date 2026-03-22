<script setup lang="ts">
import { PiniaColadaDevtools } from '@pinia/colada-devtools';

import AppHeader from './components/AppHeader.vue';
import SettingsModal from './components/SettingsModal.vue';
import { useEventsPageData } from './composables/usePageData';

const pageData = useEventsPageData();
const isSettingsOpen = defineModel<boolean>('settingsOpen', { default: false });
</script>

<template>
  <div class="grid grid-rows-[auto_1fr] h-screen text-[14px]">
    <AppHeader
      :range="pageData.range.value"
      :total="pageData.total.value"
      :is-loading="pageData.isLoading.value"
      :cmd="pageData.cmdFilter.value"
      :limit="pageData.limit.value"
      :offset="pageData.offset.value"
      @setting="isSettingsOpen = true"
    />

    <div class="size-full overflow-auto">
      <RouterView />
    </div>

    <SettingsModal :is-open="isSettingsOpen" @close="isSettingsOpen = false" />
  </div>

  <PiniaColadaDevtools />
</template>
