<script setup lang="ts" vapor>
import { useDateFormat, useNow } from '@vueuse/core';
import { type } from 'arktype';

const ConfigSchema = type({ formatted: 'string?', fontSize: 'string.numeric.parse?' });


const res = ConfigSchema(Object.fromEntries(new URLSearchParams(window.location.search).entries()));
const formatted = useDateFormat(useNow(), 'HH:mm:ss');
</script>

<template>
  <div v-if="res instanceof type.errors">
    {{ res.summary }}
  </div>
  <div v-else :style="{ fontSize: `${res.fontSize}px` }">{{ formatted }}</div>
</template>

<style scoped></style>
