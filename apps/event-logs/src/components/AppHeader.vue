<script setup lang="ts">
import Logo from './Logo.vue';
import FilterControls from './FilterControls.vue';
import PaginationControl from './PaginationControl.vue';
import { RefreshCw, Settings } from 'lucide-vue-next';

defineProps<{
  range: [number, number];
  total: number;
  isLoading: boolean;
  cmd?: string | null;
  limit: number;
  offset: number;
}>();

defineEmits<{
  refetch: [];
  prevPage: [];
  nextPage: [];
  setting: [];
  'update:cmd': [value: string];
  'update:limit': [value: number];
  'update:offset': [value: number];
}>();
</script>

<template>
  <div class="p-3 border-b border-base-200 flex items-center justify-between gap-4">
    <Logo width="30" />

    <div class="flex gap-2">
      <FilterControls
        v-bind="$props"
        @update:cmd="$emit('update:cmd', $event)"
        @update:limit="$emit('update:limit', $event)"
        @update:offset="$emit('update:offset', $event)"
      />

      <PaginationControl
        v-bind="$props"
        @prev-page="$emit('prevPage')"
        @next-page="$emit('nextPage')"
      />

      <button class="btn btn-sm btn-square" :disabled="isLoading" @click="$emit('refetch')">
        <RefreshCw :size="16" />
      </button>

      <button class="btn btn-sm btn-square" @click="$emit('setting')">
        <Settings :size="16" />
      </button>
    </div>
  </div>
</template>
