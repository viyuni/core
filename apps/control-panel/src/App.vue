<script setup lang="ts">
import { PiniaColadaDevtools } from '@pinia/colada-devtools';

import AppHeader from './components/AppHeader.vue';
import SettingsModal from './components/SettingsModal.vue';

const isSettingsOpen = defineModel<boolean>('settingsOpen', { default: false });
</script>

<template>
  <div class="grid grid-rows-[auto_1fr] h-screen text-[14px]">
    <AppHeader @setting="isSettingsOpen = true" />

    <div class="size-full overflow-auto">
      <RouterView />
    </div>

    <SettingsModal :is-open="isSettingsOpen" @close="isSettingsOpen = false" />
  </div>

  <PiniaColadaDevtools />
</template>
