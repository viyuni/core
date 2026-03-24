<script setup lang="ts">
import { ViyuniEventType } from '@viyuni/event-types';
import { Select } from '@viyuni/ui';

const value = defineModel<ViyuniEventType | null>('value');


const options = [
  {
    value: null,
    label: '全部',
  },
  ...Object.entries(ViyuniEventType).map(([key, value]) => {
    return {
      value: key,
      label: value,
    };
  }),
];
</script>

<template>
  <Select :options="options" v-model="value" class="select-sm w-40" />
</template>
