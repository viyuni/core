<script setup lang="ts">
import { FluidCursor, LiveChatScrollerDemo } from '@viyuni/ui';
import Nav from './components/Nav.vue';
</script>

<template>
  <div class="grid grid-rows-[auto_1fr] w-full h-dvh overflow-hidden">
    <Nav />
    <div class="container mx-auto border-x border-base-300">
      <div class="size-full flex flex-col items-center justify-center select-none gap-2">
        <img
          src="https://assets.viyuni.top/viyuni.svg"
          class="animate-[spin_2s_linear_infinite]"
          alt="logo"
          width="38"
          height="38"
        />
        <h1 class="text-4xl font-bold">Coming soon</h1>
      </div>
    </div>

    <FluidCursor :splatRadius="0.3" :backColor="{ r: 0.1, g: 0, b: 0 }" class="z-[-1] opacity-20" />
  </div>
</template>

<style scoped></style>
