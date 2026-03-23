<template>
  <div></div>
  <span class="badge badge-primary badge-xs"> 🚢{{ data.roomId }} </span>
  <span class="badge badge-info badge-xs">
    {{ data.uname }}
  </span>
  <span>
    {{ data.face }}
  </span>
</template>

<script setup lang="ts">
import type { Guard } from '@viyuni/event-types';

defineProps<{
  data: Guard;
}>();
</script>

<style scoped></style>
