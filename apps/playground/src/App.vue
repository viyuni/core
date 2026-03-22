<script setup lang="ts">
import { FluidCursor } from '@viyuni/ui';
const Components = import.meta.glob('./components/*.vue', {
  import: 'default',
  eager: true,
});
</script>

<template>
  <div class="h-screen flex justify-center items-center">
    <span class="text-rotate text-5xl duration-6000">
      <span class="justify-items-center w-full">
        <span class="font-bold italic px-2">咕咕嘎嘎😎</span>
        <span class="font-bold italic px-2">Viyuni Development Playground ▶︎▶︎</span>
      </span>
    </span>
  </div>
  <div class="fixed top-0 left-0 size-screen overflow-auto">
    <component v-for="(component, name) in Components" :is="component" :key="name"></component>
  </div>
  <FluidCursor class="z-[-1]" />
</template>
